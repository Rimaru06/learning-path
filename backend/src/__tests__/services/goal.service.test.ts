import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../repositories/goal.repository.js", () => ({
  getGoals: vi.fn(),
}));

import { getGoalsService } from "../../services/goal.service.js";
import * as goalRepo from "../../repositories/goal.repository.js";

describe("getGoalsService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns goals from repository", async () => {
    const mockGoals = [
      { id: "g1", name: "Backend Developer", description: "desc" },
    ];
    vi.mocked(goalRepo.getGoals).mockResolvedValue(mockGoals);

    const result = await getGoalsService();

    expect(result).toEqual(mockGoals);
    expect(goalRepo.getGoals).toHaveBeenCalledOnce();
  });

  it("returns empty array when no goals exist", async () => {
    vi.mocked(goalRepo.getGoals).mockResolvedValue([]);

    const result = await getGoalsService();

    expect(result).toEqual([]);
  });

  it("propagates errors from repository", async () => {
    vi.mocked(goalRepo.getGoals).mockRejectedValue(new Error("DB error"));

    await expect(getGoalsService()).rejects.toThrow("DB error");
  });
});
