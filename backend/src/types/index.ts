export interface Goal {
  id: string;
  name: string;
  description: string;
}

export interface Topic {
  id: string;
  name: string;
}

export type TopicStatus = "completed" | "available" | "locked";

export interface LearningPathTopic {
  id: string;
  name: string;
  status: TopicStatus;
  prerequisites: Array<{ id: string; name: string; completed: boolean }>;
}

export interface LearningPath {
  goal: Goal;
  topics: LearningPathTopic[];
  progress: { completed: number; total: number };
}

export interface GoalTopic {
  id: string;
  name: string;
  prerequisites: Array<{ id: string; name: string }>;
}
