import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Types from "./Types";

describe("Types Component", () => {
  it("renders type badge when valid type object is passed", () => {
    render(<Types type={{ name: "electric" }} />);

    const badge = screen.getByText("electric");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-700");
  });

  it("returns null when type is undefined or lacks a name", () => {
    const { container: container1 } = render(<Types type={undefined} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<Types type={{}} />);
    expect(container2.firstChild).toBeNull();
  });
});
