import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Types from "./Types";

describe("Types Component", () => {
  it("renders type badge with authentic colors when valid type object is passed", () => {
    render(<Types type={{ name: "electric" }} />);

    const badge = screen.getByText("electric");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ backgroundColor: "rgb(248, 208, 48)" });
  });

  it("renders with fallback color for unknown type", () => {
    render(<Types type={{ name: "cosmic" }} />);

    const badge = screen.getByText("cosmic");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ backgroundColor: "rgb(104, 160, 144)" });
  });

  it("returns null when type is undefined or lacks a name", () => {
    const { container: container1 } = render(<Types type={undefined} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<Types type={{}} />);
    expect(container2.firstChild).toBeNull();
  });
});
