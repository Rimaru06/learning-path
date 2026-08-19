import type { Request, Response, NextFunction } from "express";
import {
  markTopicKnownService,
  unmarkTopicKnownService,
} from "../services/learning-path.service.js";

export const markTopicKnownController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = String(req.params['userId']);
    const topicId = String(req.params['topicId']);
    await markTopicKnownService(userId, topicId);
    res.status(200).json({ message: "Topic marked as known" });
  } catch (error) {
    next(error);
  }
};

export const unmarkTopicKnownController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = String(req.params['userId']);
    const topicId = String(req.params['topicId']);
    await unmarkTopicKnownService(userId, topicId);
    res.status(200).json({ message: "Topic unmarked as known" });
  } catch (error) {
    next(error);
  }
};
