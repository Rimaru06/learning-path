import type { Request, Response, NextFunction } from "express";
import {
  getLearningPath,
  setUserGoalService,
} from "../services/learning-path.service.js";

export const getLearningPathController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = String(req.params['userId']);
    const result = await getLearningPath(userId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const setUserGoalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = String(req.params['userId']);
    const { goalId } = req.body as { goalId: string };
    const goal = await setUserGoalService(userId, goalId);
    res.status(200).json({ data: goal });
  } catch (error) {
    next(error);
  }
};
