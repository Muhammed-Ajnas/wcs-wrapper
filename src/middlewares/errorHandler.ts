import { NextFunction, Request, Response } from "express";

const errorHandler = (next: NextFunction, err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

export default errorHandler;
