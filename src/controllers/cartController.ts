import { LoginCred } from "#schemas/cartSchema.js";
import { getCartForUser } from "#services/cartService.js";
import { sendResponse } from "#util/sendResponse.js";
import { Request, Response } from "express";

export const cartController = async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const credentials: LoginCred = req.body as LoginCred;

  try {
    const cart = await getCartForUser(storeId, credentials);
    return sendResponse(res, 200, {
      data: cart,
      message: "Successfully fetched cart details for the user.",
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
