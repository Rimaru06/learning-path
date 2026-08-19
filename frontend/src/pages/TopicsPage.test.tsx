import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/renderWithRouter";
import { mockFetch, mockLearningPath } from "../test/fixtures";
import { TopicsPage } from "./TopicsPage";
import type { LearningPathTopic } from "../types";

beforeEach(() => {
  vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
});

describe("TopicsPage", () => {
  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {/* never resolves */}));

    renderWithRouter(<TopicsPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders completed topics", async () => {
    global.fetch = mockFetch(mockLearningPath);

    renderWithRouter(<TopicsPage />);

    await waitFor(() => {
      expect(screen.getByText("Programming Fundamentals")).toBeInTheDocument();
    });
  });

  it("shows empty state when no completed topics", async () => {
    const noCompleted = {
      ...mockLearningPath,
      topics: mockLearningPath.topics.map((t: LearningPathTopic) => ({ ...t, status: "available" as const })),
    };
    global.fetch = mockFetch(noCompleted);

    renderWithRouter(<TopicsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No completed topics yet/)).toBeInTheDocument();
    });
  });

  it("shows error state on failure", async () => {
    global.fetch = mockFetch(null, false);

    renderWithRouter(<TopicsPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("removes topic on unmark click", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockLearningPath }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: undefined }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockLearningPath }) });

    renderWithRouter(<TopicsPage />);

    await waitFor(() => screen.getByText("Programming Fundamentals"));

    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /remove Programming Fundamentals/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});
