import * as z from "zod";

export const loginRequestSchema = z.object({
  logonId: z.string().min(1),
  logonPassword: z.string().min(1),
});

export const storeParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});

export type LoginCred = z.infer<typeof loginRequestSchema>;
