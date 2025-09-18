import { WcsAttributeList, WcsAttributeListSchema } from "#schemas/wcsSchemas.js";
import { ProductAttributesPayload } from "#schemas/wcsSchemas.js";
import { mapWcsToOrchestrator } from "#util/mapper.js";
import axios from "axios";
import { ZodError } from "zod";

export const WcsService = async (storeId: string, productId: string): Promise<ProductAttributesPayload> => {
  const url = `http://localhost:8000/wcs/resources/stores/${storeId}/products/${productId}/attributes`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsed: WcsAttributeList = WcsAttributeListSchema.parse(response.data);

    return mapWcsToOrchestrator(parsed);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error while calling WCS:", error.message);
      throw error;
    }

    if (error instanceof ZodError) {
      console.error("Zod validation failed:", error);
      throw new Error(`Invalid WCS response format: ${error.message}`);
    }

    console.error("Unexpected error in WCS service:", error);
    throw new Error("Unexpected error while fetching product attributes from WCS");
  }
};
