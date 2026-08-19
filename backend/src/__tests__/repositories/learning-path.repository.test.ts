import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockRun, mockClose } = vi.hoisted(() => ({
  mockRun: vi.fn(),
  mockClose: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../config/database.js", () => ({
  driver: {
    session: vi.fn().mockReturnValue({ run: mockRun, close: mockClose }),
  },
  connectToDatabase: vi.fn(),
}));

import {
  getUserGoal,
  getUserKnownTopics,
  getGoalTopics,
  markTopicKnown,
  unmarkTopicKnown,
  setUserGoal,
} from "../../repositories/learning-path.repository.js";

const makeRecord = (fields: Record<string, unknown>) => ({
  get: (k: string) => fields[k],
});

const makeNodeRecord = (key: string, props: Record<string, unknown>) =>
  makeRecord({ [key]: { properties: props } });

describe("getUserGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("returns goal when found", async () => {
    mockRun.mockResolvedValue({
      records: [makeNodeRecord("g", { id: "g1", name: "Backend Developer", description: "desc" })],
    });

    const result = await getUserGoal("u1");

    expect(result).toEqual({ id: "g1", name: "Backend Developer", description: "desc" });
  });

  it("returns null when user has no goal", async () => {
    mockRun.mockResolvedValue({ records: [] });

    const result = await getUserGoal("u999");

    expect(result).toBeNull();
  });

  it("closes session on error", async () => {
    mockRun.mockRejectedValue(new Error("DB error"));

    await expect(getUserGoal("u1")).rejects.toThrow("DB error");
    expect(mockClose).toHaveBeenCalled();
  });
});

describe("getUserKnownTopics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("returns known topics for user", async () => {
    mockRun.mockResolvedValue({
      records: [
        makeNodeRecord("t", { id: "t1", name: "JavaScript" }),
        makeNodeRecord("t", { id: "t2", name: "Node.js" }),
      ],
    });

    const result = await getUserKnownTopics("u1");

    expect(result).toEqual([
      { id: "t1", name: "JavaScript" },
      { id: "t2", name: "Node.js" },
    ]);
  });

  it("returns empty array when user knows no topics", async () => {
    mockRun.mockResolvedValue({ records: [] });

    const result = await getUserKnownTopics("u1");

    expect(result).toEqual([]);
  });
});

describe("getGoalTopics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("returns topics with their prerequisites", async () => {
    mockRun.mockResolvedValue({
      records: [
        makeRecord({
          topicId: "t2",
          topicName: "JavaScript",
          directPrerequisites: [{ id: "t1", name: "Programming Fundamentals" }],
        }),
      ],
    });

    const result = await getGoalTopics("g1");

    expect(result).toEqual([
      {
        id: "t2",
        name: "JavaScript",
        prerequisites: [{ id: "t1", name: "Programming Fundamentals" }],
      },
    ]);
  });

  it("returns empty array when goal has no topics", async () => {
    mockRun.mockResolvedValue({ records: [] });

    const result = await getGoalTopics("g999");

    expect(result).toEqual([]);
  });
});

describe("markTopicKnown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("resolves when user and topic exist", async () => {
    mockRun.mockResolvedValue({
      records: [makeNodeRecord("u", { id: "u1" })],
    });

    await expect(markTopicKnown("u1", "t1")).resolves.toBeUndefined();
  });

  it("throws when user or topic not found", async () => {
    mockRun.mockResolvedValue({ records: [] });

    await expect(markTopicKnown("u999", "t1")).rejects.toThrow(
      "User or topic not found"
    );
  });
});

describe("unmarkTopicKnown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("runs delete query and resolves", async () => {
    mockRun.mockResolvedValue({ records: [] });

    await expect(unmarkTopicKnown("u1", "t1")).resolves.toBeUndefined();
    expect(mockRun).toHaveBeenCalled();
  });
});

describe("setUserGoal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("returns goal when user and goal exist", async () => {
    mockRun.mockResolvedValue({
      records: [makeNodeRecord("g", { id: "g1", name: "Backend Developer", description: "desc" })],
    });

    const result = await setUserGoal("u1", "g1");

    expect(result).toEqual({ id: "g1", name: "Backend Developer", description: "desc" });
  });

  it("returns null when user or goal not found", async () => {
    mockRun.mockResolvedValue({ records: [] });

    const result = await setUserGoal("u999", "g1");

    expect(result).toBeNull();
  });
});
