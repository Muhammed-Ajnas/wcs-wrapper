import * as z from "zod";

export const getProductAttributeValidationSchema = z.object({
  productId: z.coerce.bigint("Product Id needs to be a long value").positive("Product Id cannot be negative"),
  storeId: z.coerce.number("Store Id Id needs to be an integer value").int().positive("Store Id cannot be negative"),
});
