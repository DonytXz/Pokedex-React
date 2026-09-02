import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Butons from "./Butons";

describe("Butons Component", () => {
  it("renders with list view label and aria attributes when isList is true", () => {
    const setIsListMock = vi.fn();
    render(<Butons isList={true} setIslist={setIsListMock} />);

    const button = screen.getByRole("button", { name: "Switch to list view" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders with grid view label and aria attributes when isList is false", () => {
    const setIsListMock = vi.fn();
    render(<Butons isList={false} setIslist={setIsListMock} />);

    const button = screen.getByRole("button", { name: "Switch to grid view" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls setIslist with the inverted boolean when clicked", () => {
    const setIsListMock = vi.fn();
    const { rerender } = render(<Butons isList={true} setIslist={setIsListMock} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setIsListMock).toHaveBeenCalledWith(false);

    rerender(<Butons isList={false} setIslist={setIsListMock} />);
    fireEvent.click(button);
    expect(setIsListMock).toHaveBeenCalledWith(true);
  });
});
