import { ApiResponse } from "#models/apiResponse.js";
import { Response } from "express";

export const sendResponse = <T>(res: Response, statusCode: number, payload: ApiResponse<T>) => {
  return res.status(statusCode).json(payload);
};
