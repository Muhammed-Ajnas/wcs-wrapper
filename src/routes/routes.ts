import { cartController } from "#controllers/cartController.js";
import { wcsController } from "#controllers/wrapperController.js";
import { validateRequestData } from "#middlewares/validate.js";
import { loginRequestSchema, storeParamSchema } from "#schemas/cartSchema.js";
import { getProductAttributeValidationSchema } from "#schemas/validationSchema.js";
import { Router } from "express";

export const router = Router();

router.get("/v1/wcs/store/:storeId/product/:productId/attributes", validateRequestData(getProductAttributeValidationSchema, "params"), wcsController);

router.post(
  "/v1/wcs/store/:storeId/cart",
  validateRequestData(storeParamSchema, "params"),
  validateRequestData(loginRequestSchema, "body"),
  cartController,
);
