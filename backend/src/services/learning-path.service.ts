import { NotFoundError } from "../errors/AppError.js";
import {
  getUserGoal,
  getUserKnownTopics,
  getGoalTopics,
  markTopicKnown,
  unmarkTopicKnown,
  setUserGoal,
} from "../repositories/learning-path.repository.js";
import type { LearningPath, LearningPathTopic, TopicStatus, Goal } from "../types/index.js";

export const getLearningPath = async (userId: string): Promise<LearningPath> => {
  const goal = await getUserGoal(userId);
  if (!goal) {
    throw new NotFoundError("User or user goal not found");
  }

  const [knownTopics, allTopics] = await Promise.all([
    getUserKnownTopics(userId),
    getGoalTopics(goal.id),
  ]);

  const knownSet = new Set(knownTopics.map((t) => t.id));

  const topics: LearningPathTopic[] = allTopics.map((topic) => {
    const isCompleted = knownSet.has(topic.id);
    const prerequisites = topic.prerequisites.map((p) => ({
      id: p.id,
      name: p.name,
      completed: knownSet.has(p.id),
    }));

    let status: TopicStatus;
    if (isCompleted) {
      status = "completed";
    } else if (prerequisites.every((p) => p.completed)) {
      status = "available";
    } else {
      status = "locked";
    }

    return { id: topic.id, name: topic.name, status, prerequisites };
  });

  const completed = topics.filter((t) => t.status === "completed").length;

  return {
    goal,
    topics,
    progress: { completed, total: topics.length },
  };
};

export const markTopicKnownService = async (
  userId: string,
  topicId: string
): Promise<void> => {
  try {
    await markTopicKnown(userId, topicId);
  } catch (err) {
    if (err instanceof Error && err.message === "User or topic not found") {
      throw new NotFoundError("User or topic not found");
    }
    throw err;
  }
};

export const unmarkTopicKnownService = async (
  userId: string,
  topicId: string
): Promise<void> => {
  await unmarkTopicKnown(userId, topicId);
};

export const setUserGoalService = async (
  userId: string,
  goalId: string
): Promise<Goal> => {
  const goal = await setUserGoal(userId, goalId);
  if (!goal) {
    throw new NotFoundError("User or goal not found");
  }
  return goal;
};