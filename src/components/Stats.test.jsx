import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Stats from "./Stats";

vi.mock("./HorizontalBarChart", () => ({
  default: () => <div data-testid="mock-horizontal-bar-chart" />,
}));

vi.mock("./Chart", () => ({
  default: () => <div data-testid="mock-radar-chart" />,
}));

describe("Stats Component", () => {
  const mockPokemon = {
    stats: [
      { base_stat: 45, stat: { name: "hp" } },
      { base_stat: 49, stat: { name: "special-attack" } },
    ],
  };

  it("renders screen-reader accessible stats description list with formatted stat names", () => {
    render(<Stats pokemon={mockPokemon} clickedBtn={false} />);

    expect(screen.getByRole("heading", { level: 3, name: "Base Statistics" })).toBeInTheDocument();
    expect(screen.getByText("hp")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("special attack")).toBeInTheDocument();
    expect(screen.getByText("49")).toBeInTheDocument();
  });

  it("renders HorizontalBarChart when clickedBtn is false", () => {
    render(<Stats pokemon={mockPokemon} clickedBtn={false} />);
    expect(screen.getByTestId("mock-horizontal-bar-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-radar-chart")).toBeNull();
  });

  it("renders Radar Chart when clickedBtn is true", () => {
    render(<Stats pokemon={mockPokemon} clickedBtn={true} />);
    expect(screen.getByTestId("mock-radar-chart")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-horizontal-bar-chart")).toBeNull();
  });

  it("handles null or undefined pokemon gracefully", () => {
    render(<Stats pokemon={null} clickedBtn={false} />);
    expect(screen.getByRole("heading", { level: 3, name: "Base Statistics" })).toBeInTheDocument();
  });
});
