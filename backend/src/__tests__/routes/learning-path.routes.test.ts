import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { NotFoundError } from "../../errors/AppError.js";

vi.mock("../../services/learning-path.service.js", () => ({
  getLearningPath: vi.fn(),
  markTopicKnownService: vi.fn(),
  unmarkTopicKnownService: vi.fn(),
  setUserGoalService: vi.fn(),
}));

vi.mock("../../config/database.js", () => ({
  driver: {},
  connectToDatabase: vi.fn(),
}));

import app from "../../app.js";
import * as lpService from "../../services/learning-path.service.js";

const mockGoal = { id: "g1", name: "Backend Developer", description: "desc" };
const mockLearningPath = {
  goal: mockGoal,
  topics: [
    { id: "t1", name: "Programming Fundamentals", status: "available" as const, prerequisites: [] },
    { id: "t2", name: "JavaScript", status: "locked" as const, prerequisites: [{ id: "t1", name: "Programming Fundamentals", completed: false }] },
  ],
  progress: { completed: 0, total: 2 },
};

describe("GET /api/users/:userId/learning-path", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 with learning path data", async () => {
    vi.mocked(lpService.getLearningPath).mockResolvedValue(mockLearningPath);

    const res = await request(app).get("/api/users/u1/learning-path");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockLearningPath);
  });

  it("returns 404 when user or goal not found", async () => {
    vi.mocked(lpService.getLearningPath).mockRejectedValue(
      new NotFoundError("User or user goal not found")
    );

    const res = await request(app).get("/api/users/u999/learning-path");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User or user goal not found");
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(lpService.getLearningPath).mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/api/users/u1/learning-path");

    expect(res.status).toBe(500);
  });
});

describe("POST /api/users/:userId/goals", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 with the assigned goal", async () => {
    vi.mocked(lpService.setUserGoalService).mockResolvedValue(mockGoal);

    const res = await request(app)
      .post("/api/users/u1/goals")
      .send({ goalId: "g1" });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockGoal);
  });

  it("returns 400 when goalId is missing", async () => {
    const res = await request(app)
      .post("/api/users/u1/goals")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 404 when user or goal not found", async () => {
    vi.mocked(lpService.setUserGoalService).mockRejectedValue(
      new NotFoundError("User or goal not found")
    );

    const res = await request(app)
      .post("/api/users/u1/goals")
      .send({ goalId: "invalid" });

    expect(res.status).toBe(404);
  });
});

describe("POST /api/users/:userId/topics/:topicId/known", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 on success", async () => {
    vi.mocked(lpService.markTopicKnownService).mockResolvedValue(undefined);

    const res = await request(app).post("/api/users/u1/topics/t1/known");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Topic marked as known");
  });

  it("returns 404 when user or topic not found", async () => {
    vi.mocked(lpService.markTopicKnownService).mockRejectedValue(
      new NotFoundError("User or topic not found")
    );

    const res = await request(app).post("/api/users/u999/topics/t1/known");

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/users/:userId/topics/:topicId/known", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns 200 on success", async () => {
    vi.mocked(lpService.unmarkTopicKnownService).mockResolvedValue(undefined);

    const res = await request(app).delete("/api/users/u1/topics/t1/known");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Topic unmarked as known");
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(lpService.unmarkTopicKnownService).mockRejectedValue(
      new Error("DB error")
    );

    const res = await request(app).delete("/api/users/u1/topics/t1/known");

    expect(res.status).toBe(500);
  });
});
