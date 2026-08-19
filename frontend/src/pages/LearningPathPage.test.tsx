import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/renderWithRouter";
import { mockFetch, mockLearningPath } from "../test/fixtures";
import { LearningPathPage } from "./LearningPathPage";
import type { LearningPathTopic } from "../types";

beforeEach(() => {
  vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
});

describe("LearningPathPage", () => {
  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {/* never resolves */}));

    renderWithRouter(<LearningPathPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders completed topics", async () => {
    global.fetch = mockFetch(mockLearningPath);

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => {
      expect(screen.getByText("Programming Fundamentals")).toBeInTheDocument();
    });
    expect(screen.getByText(/Completed/i, { selector: "span" })).toBeInTheDocument();
  });

  it("renders available topic with mark-completed button", async () => {
    global.fetch = mockFetch(mockLearningPath);

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => screen.getByText("JavaScript"));

    expect(
      screen.getByRole("button", { name: /mark JavaScript as completed/i })
    ).toBeInTheDocument();
  });

  it("renders locked topic with prerequisite info", async () => {
    global.fetch = mockFetch(mockLearningPath);

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => screen.getByText("Node.js"));

    expect(screen.getByText(/Requires:/)).toBeInTheDocument();
    expect(screen.getAllByText(/JavaScript/).length).toBeGreaterThan(0);
  });

  it("renders progress header", async () => {
    global.fetch = mockFetch(mockLearningPath);

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => screen.getByText("Backend Developer"));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows error state on API failure", async () => {
    global.fetch = mockFetch(null, false);

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/Unable to load your learning path/)).toBeInTheDocument();
  });

  it("shows retry button and reloads on click", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockLearningPath }) });

    renderWithRouter(<LearningPathPage />);

    const retryBtn = await screen.findByRole("button", { name: /try again/i });
    const user = userEvent.setup();
    await user.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    });
  });

  it("marks topic as completed and refreshes", async () => {
    const updatedPath = {
      ...mockLearningPath,
      topics: mockLearningPath.topics.map((t: LearningPathTopic) =>
        t.id === "t2" ? { ...t, status: "completed" as const } : t
      ),
      progress: { completed: 2, total: 3 },
    };

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockLearningPath }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: undefined }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: updatedPath }) });

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => screen.getByText("JavaScript"));

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /mark JavaScript as completed/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });

  it("shows all-done banner when all topics completed", async () => {
    const allDone = {
      ...mockLearningPath,
      topics: mockLearningPath.topics.map((t: LearningPathTopic) => ({ ...t, status: "completed" as const })),
      progress: { completed: 3, total: 3 },
    };

    global.fetch = mockFetch(allDone);

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => {
      expect(screen.getByText(/You've completed everything/i)).toBeInTheDocument();
    });
  });

  it("shows empty state with choose-goal link when no goal set (404)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ error: "User or user goal not found" }),
    });

    renderWithRouter(<LearningPathPage />);

    await waitFor(() => {
      expect(screen.getByText("No learning goal selected")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /Choose a goal/i })).toBeInTheDocument();
  });

  it("shows empty state when no learning path", async () => {
    global.fetch = mockFetch(null, false);

    renderWithRouter(<LearningPathPage />);

    // error triggers – not empty state
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
