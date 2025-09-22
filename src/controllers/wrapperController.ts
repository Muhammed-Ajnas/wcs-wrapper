import { WcsService as wcs } from "#services/wrapperService.js";
import { sendResponse } from "#util/sendResponse.js";
import { Request, Response } from "express";

export const wcsController = async (req: Request, res: Response) => {
  const { productId, storeId } = req.params;

  try {
    const result = await wcs(storeId, productId);
    return sendResponse(res, 200, {
      data: result,
      message: "Successfully fetched the product attributes.",
      status: "success",
    });
  } catch (error) {
    console.error("Service failed:", error);
    return sendResponse(res, 500, {
      data: undefined,
      message: "WCS service failed",
      status: "error",
    });
  }
};
