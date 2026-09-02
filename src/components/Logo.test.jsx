import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "./Logo";

describe("Logo Component", () => {
  it("renders header banner landmark, level 1 heading, and logo image", () => {
    render(<Logo />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Pokédex")).toHaveClass("sr-only");

    const img = screen.getByRole("img", { name: "Pokémon" });
    expect(img).toBeInTheDocument();
  });
});
