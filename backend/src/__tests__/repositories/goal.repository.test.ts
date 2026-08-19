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

import { getGoals } from "../../repositories/goal.repository.js";

// Helpers to simulate neo4j record structure
const makeRecord = (key: string, props: Record<string, unknown>) => ({
  get: (k: string) => (k === key ? { properties: props } : undefined),
});

describe("getGoals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClose.mockResolvedValue(undefined);
  });

  it("returns mapped goals from the database", async () => {
    mockRun.mockResolvedValue({
      records: [
        makeRecord("g", { id: "g1", name: "Backend Developer", description: "Learn backend" }),
      ],
    });

    const result = await getGoals();

    expect(result).toEqual([
      { id: "g1", name: "Backend Developer", description: "Learn backend" },
    ]);
  });

  it("returns empty array when no goals exist", async () => {
    mockRun.mockResolvedValue({ records: [] });

    const result = await getGoals();

    expect(result).toEqual([]);
  });

  it("closes the session even on error", async () => {
    mockRun.mockRejectedValue(new Error("DB error"));

    await expect(getGoals()).rejects.toThrow("DB error");
    expect(mockClose).toHaveBeenCalled();
  });
});
