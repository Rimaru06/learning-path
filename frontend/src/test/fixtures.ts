import { vi } from "vitest";
import type { Goal, LearningPath } from "../types";

export const mockGoals: Goal[] = [
  { id: "g1", name: "Backend Developer", description: "Learn backend skills" },
  { id: "g2", name: "Frontend Developer", description: "Learn frontend skills" },
];

export const mockLearningPath: LearningPath = {
  goal: { id: "g1", name: "Backend Developer", description: "Learn backend" },
  topics: [
    {
      id: "t1",
      name: "Programming Fundamentals",
      status: "completed",
      prerequisites: [],
    },
    {
      id: "t2",
      name: "JavaScript",
      status: "available",
      prerequisites: [{ id: "t1", name: "Programming Fundamentals", completed: true }],
    },
    {
      id: "t3",
      name: "Node.js",
      status: "locked",
      prerequisites: [{ id: "t2", name: "JavaScript", completed: false }],
    },
  ],
  progress: { completed: 1, total: 3 },
};

export function mockFetch(data: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? "OK" : "Bad Request",
    json: async () => (ok ? { data } : { error: "Error occurred" }),
  });
}
