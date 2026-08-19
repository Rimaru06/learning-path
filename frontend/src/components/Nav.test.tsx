import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "../test/renderWithRouter";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders all navigation links", () => {
    renderWithRouter(<Nav />);

    expect(screen.getAllByRole("link", { name: "Dashboard" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Goals" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Learning Path" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "My Topics" }).length).toBeGreaterThan(0);
  });

  it("has a navigation landmark", () => {
    renderWithRouter(<Nav />);

    expect(screen.getByRole("navigation", { name: /Main navigation/i })).toBeInTheDocument();
  });

  it("renders the user selector with all demo users", () => {
    renderWithRouter(<Nav />);

    const select = screen.getByRole("combobox", { name: /switch demo user/i });
    expect(select).toBeInTheDocument();
    expect(screen.getByText(/User 1/)).toBeInTheDocument();
    expect(screen.getByText(/User 2/)).toBeInTheDocument();
    expect(screen.getByText(/User 3/)).toBeInTheDocument();
  });
});
