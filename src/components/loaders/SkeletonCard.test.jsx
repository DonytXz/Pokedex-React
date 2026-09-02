import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkeletonCard from "./SkeletonCard";

describe("SkeletonCard Component", () => {
  it("renders an aria-hidden placeholder card with pulse animation", () => {
    const { container } = render(<SkeletonCard />);
    const card = container.firstChild;

    expect(card).toHaveAttribute("aria-hidden", "true");
    expect(card).toHaveClass("animate-pulse");
  });
});
