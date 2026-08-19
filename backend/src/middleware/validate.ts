import type { Request, Response, NextFunction } from "express";
import { type ZodSchema } from "zod";
import { ValidationError } from "../errors/AppError.js";

export const validateBody =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      next(new ValidationError(message));
      return;
    }
    req.body = result.data;
    next();
  };

export const validateParams =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(", ");
      next(new ValidationError(message));
      return;
    }
    next();
  };
