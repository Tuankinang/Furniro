import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu đầu vào không hợp lệ!",
          errors: error.issues.map((e) => ({
            field: e.path[1],
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};
