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

  it("prioritizes official artwork over default sprite and applies custom className", () => {
    const mockPath = {
      front_default: "https://example.com/front_default.png",
      other: {
        "official-artwork": {
          front_default: "https://example.com/official_artwork.png",
        },
      },
    };
    render(<Image path={mockPath} alt="Charizard" className="custom-img-class" />);

    const img = screen.getByRole("img", { name: "Charizard" });
    expect(img).toHaveAttribute("src", "https://example.com/official_artwork.png");
    expect(img).toHaveClass("custom-img-class");
  });
});
