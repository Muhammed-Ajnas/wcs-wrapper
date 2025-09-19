export type HttpError = Error & { status?: number; upstream?: unknown };
