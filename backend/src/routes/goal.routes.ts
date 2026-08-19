import { Router } from "express";
import { getGoalsController } from "../controllers/goal.controller.js";

const router = Router();

router.get("/", getGoalsController);

export default router;