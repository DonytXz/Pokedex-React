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

  it("handles species with no matching language entry gracefully", () => {
    const speciesWithDifferentLang = {
      flavor_text_entries: [
        { flavor_text: "Japanese text", language: { name: "ja" } },
      ],
    };
    render(<Description species={speciesWithDifferentLang} />);
    // If browser is en/es, it won't crash and won't match ja
  });
});
