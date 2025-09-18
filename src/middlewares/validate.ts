import { sendResponse } from "#util/sendResponse.js";
import { NextFunction, Request, Response } from "express";
import z from "zod";

type Source = "body" | "params" | "query";

export const validateRequestData = (schema: z.ZodType, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return sendResponse(res, 400, { data: z.flattenError(result.error), message: "Validation failure", status: "error" });
    }
    req[source] = result.data;
    next();
  };
};
