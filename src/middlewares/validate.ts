import { NextFunction, Request, Response } from "express";
import z from "zod";

type Source = "body" | "params" | "query";

export const validateData = (schema: z.ZodType, source: Source = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json(z.flattenError(result.error));
    }

    req[source] = result.data;
    next();
  };
};
