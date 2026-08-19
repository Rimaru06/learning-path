import { Router } from "express";
import { z } from "zod";
import {
  getLearningPathController,
  setUserGoalController,
} from "../controllers/learning-path.controller.js";
import {
  markTopicKnownController,
  unmarkTopicKnownController,
} from "../controllers/topic.controller.js";
import { validateBody, validateParams } from "../middleware/validate.js";

const router = Router();

const userParams = z.object({ userId: z.string().min(1, "userId is required") });
const topicParams = z.object({
  userId: z.string().min(1, "userId is required"),
  topicId: z.string().min(1, "topicId is required"),
});
const setGoalBody = z.object({
  goalId: z.string().min(1, "goalId is required"),
});

router.get(
  "/:userId/learning-path",
  validateParams(userParams),
  getLearningPathController
);

router.post(
  "/:userId/goals",
  validateParams(userParams),
  validateBody(setGoalBody),
  setUserGoalController
);

router.post(
  "/:userId/topics/:topicId/known",
  validateParams(topicParams),
  markTopicKnownController
);

router.delete(
  "/:userId/topics/:topicId/known",
  validateParams(topicParams),
  unmarkTopicKnownController
);

export default router;