import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../services/goal.service.js", () => ({
  getGoalsService: vi.fn(),
}));

// database module must be mocked before app is imported
vi.mock("../../config/database.js", () => ({
  driver: {},
  connectToDatabase: vi.fn(),
}));

import app from "../../app.js";
import * as goalService from "../../services/goal.service.js";

const mockGoals = [
  { id: "g1", name: "Backend Developer", description: "desc" },
];

describe("GET /api/goals", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 with goals list", async () => {
    vi.mocked(goalService.getGoalsService).mockResolvedValue(mockGoals);

    const res = await request(app).get("/api/goals");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockGoals);
  });

  it("returns 200 with empty array when no goals", async () => {
    vi.mocked(goalService.getGoalsService).mockResolvedValue([]);

    const res = await request(app).get("/api/goals");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("returns 500 on unexpected service error", async () => {
    vi.mocked(goalService.getGoalsService).mockRejectedValue(
      new Error("DB error")
    );

    const res = await request(app).get("/api/goals");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});
