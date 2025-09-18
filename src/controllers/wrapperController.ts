import { WcsService as wcs } from "#services/wrapperService.js";
import { Request, Response } from "express";

export const controller = (req: Request, res: Response) => {
  const { productId, storeId } = req.params;
  wcs();
  console.log(productId, storeId);
  res.json();
};
