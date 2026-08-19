import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../test/renderWithRouter";
import { mockFetch, mockGoals } from "../test/fixtures";
import { GoalsPage } from "./GoalsPage";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => vi.fn() };
});

beforeEach(() => {
  vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
});

describe("GoalsPage", () => {
  it("shows loading state initially", () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {/* never resolves */}));

    renderWithRouter(<GoalsPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders goals after loading", async () => {
    global.fetch = mockFetch(mockGoals);

    renderWithRouter(<GoalsPage />);

    await waitFor(() => {
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    });
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("shows empty state when no goals returned", async () => {
    global.fetch = mockFetch([]);

    renderWithRouter(<GoalsPage />);

    await waitFor(() => {
      expect(screen.getByText("No goals available")).toBeInTheDocument();
    });
  });

  it("shows error state on API failure", async () => {
    global.fetch = mockFetch(null, false);

    renderWithRouter(<GoalsPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByText(/Unable to load goals/)).toBeInTheDocument();
  });

  it("shows retry button in error state", async () => {
    global.fetch = mockFetch(null, false);

    renderWithRouter(<GoalsPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });
  });

  it("calls setGoal and navigates on goal select", async () => {
    // First call: list goals, Second call: set goal
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockGoals }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: mockGoals[0] }) });

    renderWithRouter(<GoalsPage />);

    await waitFor(() => screen.getByText("Backend Developer"));

    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /select Backend Developer/i })[0]!);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
