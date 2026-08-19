import { apiFetch } from "./client";
import type { LearningPath } from "../types";

export const learningPathApi = {
  get: (userId: string): Promise<LearningPath> =>
    apiFetch<LearningPath>(`/users/${userId}/learning-path`),
};
