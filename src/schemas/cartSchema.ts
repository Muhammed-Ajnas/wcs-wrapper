import * as z from "zod";

export const loginRequestSchema = z.object({
  password: z.string().min(1),
  username: z.string().min(1),
});

export const storeParamSchema = z.object({
  storeId: z.coerce.number().int().positive(),
});

export type LoginCred = z.infer<typeof loginRequestSchema>;
