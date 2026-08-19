import { apiFetch } from "./client";
import type { Goal } from "../types";

export const userApi = {
  setGoal: (userId: string, goalId: string): Promise<Goal> =>
    apiFetch<Goal>(`/users/${userId}/goals`, {
      method: "POST",
      body: JSON.stringify({ goalId }),
    }),

  markTopicKnown: (userId: string, topicId: string): Promise<void> =>
    apiFetch<void>(`/users/${userId}/topics/${topicId}/known`, {
      method: "POST",
    }),

  unmarkTopicKnown: (userId: string, topicId: string): Promise<void> =>
    apiFetch<void>(`/users/${userId}/topics/${topicId}/known`, {
      method: "DELETE",
    }),
};
