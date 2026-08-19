import { getGoals } from "../repositories/goal.repository.js";

export const getGoalsService = async () => {
  return await getGoals();
};