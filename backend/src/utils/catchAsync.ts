import { Request, Response, NextFunction, RequestHandler } from "express";

export const catchAsync = (
  fn: (req: any, res: Response, next: NextFunction) => any,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
