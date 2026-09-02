import React from "react";
import { render, screen, act } from "@testing-library/react";
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
  });

  it("handles undefined or empty stats gracefully", () => {
    render(<Chart stats={[]} />);
    expect(screen.getByTestId("mock-radar")).toBeInTheDocument();
  });

  it("updates window dimensions on resize and cleans up listener on unmount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Chart stats={mockStats} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    act(() => {
      window.innerWidth = 1024;
      window.innerHeight = 768;
      window.dispatchEvent(new Event("resize"));
    });

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
