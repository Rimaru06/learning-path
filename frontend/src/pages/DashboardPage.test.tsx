import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter";
import { mockFetch, mockLearningPath } from "../test/fixtures";
import { DashboardPage } from "./DashboardPage";
import type { LearningPathTopic } from "../types";

beforeEach(() => {
  vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
});

describe("DashboardPage", () => {
  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {/* never resolves */}));

    renderWithRouter(<DashboardPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows progress and next-to-learn when user has a goal", async () => {
    global.fetch = mockFetch(mockLearningPath);

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/1/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Backend Developer/)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View full learning path/i })).toBeInTheDocument();
  });

  it("shows choose-a-goal prompt when user has no goal", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ error: "Not found" }),
    });

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /Choose a goal/i })).toBeInTheDocument();
    });
  });

  it("shows all done message when all topics completed", async () => {
    const allDone = {
      ...mockLearningPath,
      topics: mockLearningPath.topics.map((t: LearningPathTopic) => ({ ...t, status: "completed" as const })),
      progress: { completed: 3, total: 3 },
    };
    global.fetch = mockFetch(allDone);

    renderWithRouter(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Goal complete!/i)).toBeInTheDocument();
    });
  });
});
