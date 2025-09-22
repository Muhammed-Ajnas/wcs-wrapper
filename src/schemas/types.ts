export interface HttpError extends Error {
  status?: number;
  upstream?: unknown;
}

export interface TokenCacheEntry {
  wcToken: string;
  wcTrustedToken: string;
}
