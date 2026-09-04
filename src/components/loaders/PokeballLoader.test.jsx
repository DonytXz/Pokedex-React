import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PokeballLoader from "./PokeballLoader";

describe("PokeballLoader Component", () => {
  it("renders with status role and loading message for accessibility", () => {
    render(<PokeballLoader />);

    const statusContainer = screen.getByRole("status");
    expect(statusContainer).toBeInTheDocument();
    expect(statusContainer).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("Loading Pokémon...")).toBeInTheDocument();
  });

  it("renders with custom text and small size", () => {
    render(<PokeballLoader text="Loading evolution chain..." size="sm" className="custom-test-class" />);

    const statusContainer = screen.getByRole("status");
    expect(statusContainer).toBeInTheDocument();
    expect(statusContainer).toHaveClass("custom-test-class");
    expect(screen.getByText("Loading evolution chain...")).toBeInTheDocument();
  });

  it("renders without text paragraph when text is empty", () => {
    render(<PokeballLoader text="" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Loading Pokémon...")).toBeNull();
  });
});
