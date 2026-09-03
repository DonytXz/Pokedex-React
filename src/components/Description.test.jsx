import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Description from "./Description";
import * as getLanguageModule from "../helpers/getLanguage";

describe("Description Component", () => {
  const mockSpecies = {
    flavor_text_entries: [
      { flavor_text: "A strange seed was planted on its back.", language: { name: "en" } },
      { flavor_text: "Una semilla rara fue plantada en su espalda.", language: { name: "es" } },
    ],
  };

  it("renders the flavor text for the current browser language", () => {
    render(<Description species={mockSpecies} />);
    // Under default en/es browser language
    expect(
      screen.getByText(/A strange seed was planted on its back\.|Una semilla rara fue plantada en su espalda\./)
    ).toBeInTheDocument();
  });

  it("handles missing language or undefined species gracefully", () => {
    const { container } = render(<Description species={undefined} />);
    expect(container.textContent).toBe("");
  });

  it("handles species with no matching language entry gracefully by using fallback", () => {
    const speciesWithDifferentLang = {
      flavor_text_entries: [
        { flavor_text: "Japanese text", language: { name: "ja" } },
      ],
    };
    render(<Description species={speciesWithDifferentLang} />);
    expect(screen.getByText("Japanese text")).toBeInTheDocument();
  });

  it("sanitizes form feed and newline characters in flavor text", () => {
    const speciesWithMessyText = {
      flavor_text_entries: [
        { flavor_text: "Spits fire that\nis hot enough to\nmelt boulders.\fKnown to cause\nforest fires.", language: { name: "en" } },
      ],
    };
    render(<Description species={speciesWithMessyText} />);
    expect(
      screen.getByText("Spits fire that is hot enough to melt boulders. Known to cause forest fires.")
    ).toBeInTheDocument();
  });
});
