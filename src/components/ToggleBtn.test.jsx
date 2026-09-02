import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ToggleBtn from "./ToggleBtn";

describe("ToggleBtn Component", () => {
  it("renders switch control reflecting clickedBtn state", () => {
    const setClickedBtnMock = vi.fn();
    const { rerender } = render(
      <ToggleBtn clickedBtn={false} setClickedBtn={setClickedBtnMock} />
    );

    const switchInput = screen.getByRole("switch", {
      name: "Switch between bar chart and radar chart",
    });
    expect(switchInput).not.toBeChecked();

    rerender(<ToggleBtn clickedBtn={true} setClickedBtn={setClickedBtnMock} />);
    expect(switchInput).toBeChecked();
  });

  it("calls setClickedBtn with toggled boolean on change", () => {
    const setClickedBtnMock = vi.fn();
    render(<ToggleBtn clickedBtn={false} setClickedBtn={setClickedBtnMock} />);

    const switchInput = screen.getByRole("switch");
    fireEvent.click(switchInput);

    expect(setClickedBtnMock).toHaveBeenCalledWith(true);
  });
});
