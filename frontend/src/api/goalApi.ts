import { apiFetch } from "./client";
import type { Goal } from "../types";

export const goalApi = {
  list: (): Promise<Goal[]> => apiFetch<Goal[]>("/goals"),
};
