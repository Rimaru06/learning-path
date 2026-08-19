import { type ReactElement } from "react";
import { render, type RenderResult } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { UserProvider } from "../context/UserContext";

export function renderWithRouter(
  ui: ReactElement,
  { initialPath = "/" } = {}
): RenderResult {
  return render(
    <UserProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );
}
