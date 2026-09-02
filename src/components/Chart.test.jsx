import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Chart from "./Chart";

let capturedRadarProps = null;
vi.mock("react-chartjs-2", () => ({
  Radar: (props) => {
    capturedRadarProps = props;
    return <div data-testid="mock-radar" />;
  },
}));

describe("Chart Component (Radar Chart)", () => {
  const mockStats = [
    { base_stat: 45, stat: { name: "hp" } },
    { base_stat: 49, stat: { name: "attack" } },
    { base_stat: 49, stat: { name: "defense" } },
    { base_stat: 65, stat: { name: "special-attack" } },
    { base_stat: 65, stat: { name: "special-defense" } },
    { base_stat: 45, stat: { name: "speed" } },
  ];

  it("renders Radar chart with transformed labels and stat values", () => {
    render(<Chart stats={mockStats} />);

    expect(screen.getByTestId("mock-radar")).toBeInTheDocument();
    expect(capturedRadarProps.data.labels).toEqual([
      "hp",
      "attack",
      "defense",
      "special-attack",
      "special-defense",
      "speed",
    ]);
    expect(capturedRadarProps.data.datasets[0].data).toEqual([45, 49, 49, 65, 65, 45]);
    expect(capturedRadarProps.options.responsive).toBe(true);
    expect(capturedRadarProps.options.maintainAspectRatio).toBe(false);
  });

  it("handles undefined or empty stats gracefully", () => {
    render(<Chart stats={[]} />);
    expect(screen.getByTestId("mock-radar")).toBeInTheDocument();
  });

  it("handles null stats gracefully without crashing", () => {
    render(<Chart stats={null} />);
    expect(screen.getByTestId("mock-radar")).toBeInTheDocument();
  });
});

