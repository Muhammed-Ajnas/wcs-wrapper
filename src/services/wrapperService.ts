import { HttpError } from "#schemas/types.js";
import { WcsAttributeListSchema } from "#schemas/wcsSchemas.js";
import { ProductAttributesPayload } from "#schemas/wcsSchemas.js";
import { mapWcsToOrchestrator } from "#util/mapper.js";
import axios from "axios";
import { ZodError } from "zod";

export const WcsService = async (storeId: string, productId: string): Promise<ProductAttributesPayload> => {
  const base = process.env.WCS_BASE_URL ?? "https://localhost:8000";
  const url = `${base.replace(/\/$/, "")}/wcs/resources/stores/${storeId}/products/${productId}/attributes`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsedResult = WcsAttributeListSchema.safeParse(response.data);
    if (!parsedResult.success) {
      console.error("WCS response validation failed:", parsedResult.error);
      throw parsedResult.error;
    }

    return mapWcsToOrchestrator(parsedResult.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const upstreamBody: unknown = error.response.data as unknown;
        console.error("WCS responded with error:", status, upstreamBody);

        const e: HttpError = new Error(`WCS error: ${error.message}`);
        e.status = status;
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

    if (error instanceof ZodError) {
      console.error("Zod validation failed:", error);
      throw error;
    }

    console.error("Unexpected error in WCS service:", error);
    throw new Error("Unexpected error while fetching product attributes from WCS");
  }
};
