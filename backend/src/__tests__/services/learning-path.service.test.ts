import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../errors/AppError.js";

vi.mock("../../repositories/learning-path.repository.js", () => ({
  getUserGoal: vi.fn(),
  getUserKnownTopics: vi.fn(),
  getGoalTopics: vi.fn(),
  markTopicKnown: vi.fn(),
  unmarkTopicKnown: vi.fn(),
  setUserGoal: vi.fn(),
}));

import {
  getLearningPath,
  markTopicKnownService,
  unmarkTopicKnownService,
  setUserGoalService,
} from "../../services/learning-path.service.js";
import * as repo from "../../repositories/learning-path.repository.js";

const mockGoal = { id: "g1", name: "Backend Developer", description: "desc" };

describe("getLearningPath", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("throws NotFoundError when user has no goal", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(null);

    await expect(getLearningPath("u999")).rejects.toBeInstanceOf(NotFoundError);
  });

  it("marks topic completed when user knows it", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(mockGoal);
    vi.mocked(repo.getUserKnownTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals" },
    ]);
    vi.mocked(repo.getGoalTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals", prerequisites: [] },
    ]);

    const result = await getLearningPath("u1");

    expect(result.topics[0]!.status).toBe("completed");
  });

  it("marks topic available when it has no prerequisites and is not known", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(mockGoal);
    vi.mocked(repo.getUserKnownTopics).mockResolvedValue([]);
    vi.mocked(repo.getGoalTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals", prerequisites: [] },
    ]);

    const result = await getLearningPath("u1");

    expect(result.topics[0]!.status).toBe("available");
  });

  it("marks topic available when all prerequisites are completed", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(mockGoal);
    vi.mocked(repo.getUserKnownTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals" },
    ]);
    vi.mocked(repo.getGoalTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals", prerequisites: [] },
      {
        id: "t2",
        name: "JavaScript",
        prerequisites: [{ id: "t1", name: "Programming Fundamentals" }],
      },
    ]);

    const result = await getLearningPath("u1");
    const t2 = result.topics.find((t) => t.id === "t2")!;

    expect(t2.status).toBe("available");
  });

  it("marks topic locked when a prerequisite is not completed", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(mockGoal);
    vi.mocked(repo.getUserKnownTopics).mockResolvedValue([]);
    vi.mocked(repo.getGoalTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals", prerequisites: [] },
      {
        id: "t2",
        name: "JavaScript",
        prerequisites: [{ id: "t1", name: "Programming Fundamentals" }],
      },
    ]);

    const result = await getLearningPath("u1");
    const t2 = result.topics.find((t) => t.id === "t2")!;

    expect(t2.status).toBe("locked");
  });

  it("computes progress correctly", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(mockGoal);
    vi.mocked(repo.getUserKnownTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals" },
    ]);
    vi.mocked(repo.getGoalTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals", prerequisites: [] },
      {
        id: "t2",
        name: "JavaScript",
        prerequisites: [{ id: "t1", name: "Programming Fundamentals" }],
      },
      {
        id: "t3",
        name: "Node.js",
        prerequisites: [{ id: "t2", name: "JavaScript" }],
      },
    ]);

    const result = await getLearningPath("u1");

    expect(result.progress).toEqual({ completed: 1, total: 3 });
  });

  it("includes prerequisite completion status on each topic", async () => {
    vi.mocked(repo.getUserGoal).mockResolvedValue(mockGoal);
    vi.mocked(repo.getUserKnownTopics).mockResolvedValue([
      { id: "t1", name: "Programming Fundamentals" },
    ]);
    vi.mocked(repo.getGoalTopics).mockResolvedValue([
      {
        id: "t2",
        name: "JavaScript",
        prerequisites: [{ id: "t1", name: "Programming Fundamentals" }],
      },
    ]);

    const result = await getLearningPath("u1");

    expect(result.topics[0]!.prerequisites[0]).toEqual({
      id: "t1",
      name: "Programming Fundamentals",
      completed: true,
    });
  });
});

describe("markTopicKnownService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls repository and resolves", async () => {
    vi.mocked(repo.markTopicKnown).mockResolvedValue(undefined);

    await expect(markTopicKnownService("u1", "t1")).resolves.toBeUndefined();
    expect(repo.markTopicKnown).toHaveBeenCalledWith("u1", "t1");
  });

  it("throws NotFoundError when user or topic not found", async () => {
    vi.mocked(repo.markTopicKnown).mockRejectedValue(
      new Error("User or topic not found")
    );

    await expect(markTopicKnownService("u999", "t1")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it("re-throws unexpected errors", async () => {
    vi.mocked(repo.markTopicKnown).mockRejectedValue(new Error("DB failure"));

    await expect(markTopicKnownService("u1", "t1")).rejects.toThrow(
      "DB failure"
    );
  });
});

describe("unmarkTopicKnownService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls repository and resolves", async () => {
    vi.mocked(repo.unmarkTopicKnown).mockResolvedValue(undefined);

    await expect(unmarkTopicKnownService("u1", "t1")).resolves.toBeUndefined();
    expect(repo.unmarkTopicKnown).toHaveBeenCalledWith("u1", "t1");
  });
});

describe("setUserGoalService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns the goal on success", async () => {
    vi.mocked(repo.setUserGoal).mockResolvedValue(mockGoal);

    const result = await setUserGoalService("u1", "g1");

    expect(result).toEqual(mockGoal);
  });

  it("throws NotFoundError when user or goal not found", async () => {
    vi.mocked(repo.setUserGoal).mockResolvedValue(null);

    await expect(setUserGoalService("u999", "g1")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});
