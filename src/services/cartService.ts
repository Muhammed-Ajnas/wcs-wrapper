import { LoginCred } from "#schemas/cartSchema.js";
import { HttpError } from "#schemas/types.js";
import { TokenCacheEntry } from "#schemas/types.js";
import axios from "axios";

const tokenCache = new Map<string, TokenCacheEntry>();

const cacheKey = (storeId: string, username: string) => `${storeId}:${username}`;

const getTokens = async (storeId: string, creds: LoginCred): Promise<TokenCacheEntry> => {
  const key = cacheKey(storeId, creds.logonId);
  const tokenCacheEntry = tokenCache.get(key);
  if (tokenCacheEntry != undefined) {
    return tokenCacheEntry;
  }
  return loginIdentity(storeId, creds);
};

const loginIdentity = async (storeId: string, creds: LoginCred): Promise<TokenCacheEntry> => {
  const base = process.env.WCS_BASE_URL ?? "https://localhost:8000";
  const url = `${base.replace(/\/$/, "")}/wcs/resources/store/${storeId}/loginidentity`;

  try {
    const resp = await axios.post(url, creds, { headers: { "Content-Type": "application/json" } });
    const upstreamBody = resp.data as Record<string, unknown>;
    const wcToken = upstreamBody.WCToken as string;
    const wcTrustedToken = upstreamBody.WCTrustedToken as string;

    if (!wcToken && !wcTrustedToken) {
      const e: HttpError = new Error("loginidentity did not return WCToken");
      e.status = 502;
      throw e;
    }

    const entry: TokenCacheEntry = { wcToken, wcTrustedToken };
    tokenCache.set(cacheKey(storeId, creds.logonId), entry);
    return entry;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const statusCode = error.response.status;
        const upstreamBody: unknown = error.response.data as unknown;
        console.error("WCS responded with error:", statusCode, upstreamBody);
        const e: HttpError = new Error(`WCS loginidentity error: ${error.message}`);
        e.status = statusCode;
        e.upstream = upstreamBody;
        throw e;
      }
      if (error.request) {
        console.error("No response from WCS (network issue):", error.message);
        const e: HttpError = new Error("Bad Gateway - no response from WCS");
        e.status = 502;
        throw e;
      }
      console.error("Axios error while calling WCS:", error.message);
      const e: HttpError = new Error(error.message);
      e.status = 500;
      throw e;
    }
    console.error("Unexpected error in WCS service:", error);
    throw new Error("Unexpected error while authenticating with WCS");
  }
};

export const getCartForUser = async (storeId: string, creds: LoginCred, retried?: boolean): Promise<unknown> => {
  const base = process.env.WCS_BASE_URL ?? "https://localhost:8000";
  const url = `${base.replace(/\/$/, "")}/wcs/resources/store/${storeId}/cart/@self`;
  const retriedOnce = retried ?? false;
  try {
    const tokens = await getTokens(storeId, creds);

    const resp = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        WCToken: tokens.wcToken,
        WCTrustedToken: tokens.wcTrustedToken,
      },
    });

    return resp.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const statusCode = error.response.status;
        const upstreamBody: unknown = error.response.data as unknown;
        console.error("WCS responded with error:", statusCode, upstreamBody);

        if ((statusCode === 401 || statusCode === 403) && !retriedOnce) {
          console.error("Authentication error, retrying login and fetching cart");
          tokenCache.delete(cacheKey(storeId, creds.logonId));
          return getCartForUser(storeId, creds, true);
        }

        const e: HttpError = new Error(`WCS cart error: ${error.message}`);
        e.status = statusCode;
        e.upstream = upstreamBody;
        throw e;
      }
      if (error.request) {
        console.error("No response from WCS (network issue):", error.message);
        const e: HttpError = new Error("Bad Gateway - no response from WCS");
        e.status = 502;
        throw e;
      }
      console.error("Axios error while calling WCS:", error.message);
      const e: HttpError = new Error(error.message);
      e.status = 500;
      throw e;
    }
    if (error instanceof Error && "status" in error) {
      console.error("Re-throwing HttpError from WCS service:", error);
      throw error;
    }
    console.error("Unexpected error in WCS service:", error);
    throw new Error("Unexpected error while fetching cart from WCS");
  }
};
