import { wcsController } from "#controllers/wrapperController.js";
import { validateRequestData } from "#middlewares/validate.js";
import { getProductAttributeValidationSchema } from "#schemas/validationSchema.js";
import { Router } from "express";

export const router = Router();

router.get("/v1/wcs/store/:storeId/product/:productId/attributes", validateRequestData(getProductAttributeValidationSchema, "params"), wcsController);
