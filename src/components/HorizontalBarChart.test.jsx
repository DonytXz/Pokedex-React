import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HorizontalBarChart from "./HorizontalBarChart";

let capturedBarProps = null;
vi.mock("react-chartjs-2", () => ({
  Bar: (props) => {
    capturedBarProps = props;
    return <div data-testid="mock-bar" />;
  },
}));

describe("HorizontalBarChart Component", () => {
  const mockStats = [
    { base_stat: 35, stat: { name: "hp" } },
    { base_stat: 55, stat: { name: "attack" } },
    { base_stat: 40, stat: { name: "defense" } },
  ];

  it("renders Bar chart with stat labels and numeric values", () => {
    render(<HorizontalBarChart stats={mockStats} />);

    expect(screen.getByTestId("mock-bar")).toBeInTheDocument();
    expect(capturedBarProps.data.labels).toEqual(["hp", "attack", "defense"]);
    expect(capturedBarProps.data.datasets[0].data).toEqual([35, 55, 40]);
  });

  it("handles undefined or empty stats array", () => {
    render(<HorizontalBarChart stats={[]} />);
    expect(screen.getByTestId("mock-bar")).toBeInTheDocument();
  });

  it("attaches resize listener and removes it on unmount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<HorizontalBarChart stats={mockStats} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    act(() => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      window.dispatchEvent(new Event("resize"));
    });

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});
