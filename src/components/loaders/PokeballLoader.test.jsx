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
});
