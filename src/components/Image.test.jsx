import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Image from "./Image";

describe("Image Component", () => {
  it("renders Loading... text when path is undefined", () => {
    render(<Image path={undefined} alt="Pikachu" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders image with front_default src and alt attribute when path is provided", () => {
    const mockPath = {
      front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    };
    render(<Image path={mockPath} alt="Pikachu" />);

    const img = screen.getByRole("img", { name: "Pikachu" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", mockPath.front_default);
  });
});
