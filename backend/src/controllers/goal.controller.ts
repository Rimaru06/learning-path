import type { Request, Response, NextFunction } from "express";
import { getGoalsService } from "../services/goal.service.js";

export const getGoalsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const goals = await getGoalsService();
    res.status(200).json({ data: goals });
  } catch (error) {
    next(error);
  }
};