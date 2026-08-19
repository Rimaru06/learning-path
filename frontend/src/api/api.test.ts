import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockFetch, mockGoals, mockLearningPath } from "../test/fixtures";
import { goalApi } from "./goalApi";
import { learningPathApi } from "./learningPathApi";
import { userApi } from "./userApi";

describe("goalApi", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
  });

  it("lists goals", async () => {
    global.fetch = mockFetch(mockGoals);

    const result = await goalApi.list();

    expect(result).toEqual(mockGoals);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/goals",
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it("throws ApiRequestError on non-ok response", async () => {
    global.fetch = mockFetch(null, false);

    await expect(goalApi.list()).rejects.toThrow("Error occurred");
  });
});

describe("learningPathApi", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
  });

  it("fetches learning path for user", async () => {
    global.fetch = mockFetch(mockLearningPath);

    const result = await learningPathApi.get("u1");

    expect(result).toEqual(mockLearningPath);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/users/u1/learning-path",
      expect.any(Object)
    );
  });

  it("throws on API error", async () => {
    global.fetch = mockFetch(null, false);

    await expect(learningPathApi.get("u1")).rejects.toThrow();
  });
});

describe("userApi", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
  });

  it("sets user goal", async () => {
    global.fetch = mockFetch(mockGoals[0]);

    const result = await userApi.setGoal("u1", "g1");

    expect(result).toEqual(mockGoals[0]);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/users/u1/goals",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ goalId: "g1" }) })
    );
  });

  it("marks topic known", async () => {
    global.fetch = mockFetch(undefined);

    await expect(userApi.markTopicKnown("u1", "t1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/users/u1/topics/t1/known",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("unmarks topic known", async () => {
    global.fetch = mockFetch(undefined);

    await expect(userApi.unmarkTopicKnown("u1", "t1")).resolves.toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/users/u1/topics/t1/known",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("throws ApiRequestError on failure", async () => {
    global.fetch = mockFetch(null, false);

    await expect(userApi.markTopicKnown("u1", "t1")).rejects.toThrow();
  });
});
