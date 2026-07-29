import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("../pages/Home", () => ({
  default: () => <h1>Pokédex home</h1>,
}));

describe("App", () => {
  it("renders the home route", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Pokédex home" }),
    ).toBeInTheDocument();
  });
});
