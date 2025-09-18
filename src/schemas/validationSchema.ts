import * as z from "zod";

export const getProductAttributeValidationSchema = z.object({
  productId: z.coerce.bigint().positive(),
  storeId: z.coerce.number().int().positive(),
});
