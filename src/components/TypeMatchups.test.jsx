import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TypeMatchups from "./TypeMatchups";
import * as pokemonService from "../services/getPokemon";

describe("TypeMatchups Component", () => {
  const mockFireTypeData = {
    name: "fire",
    damage_relations: {
      double_damage_from: [{ name: "water" }, { name: "ground" }, { name: "rock" }],
      half_damage_from: [{ name: "fire" }, { name: "grass" }, { name: "ice" }, { name: "bug" }, { name: "steel" }, { name: "fairy" }],
      no_damage_from: [],
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(pokemonService, "fetchTypeData").mockResolvedValue(mockFireTypeData);
  });

  it("renders weaknesses and resistances for given types", async () => {
    render(<TypeMatchups types={[{ type: { name: "fire" } }]} />);

    await waitFor(() => {
      expect(screen.getByText("water")).toBeInTheDocument();
      expect(screen.getByText("grass")).toBeInTheDocument();
    });

    expect(screen.getByText(/Weaknesses/i)).toBeInTheDocument();
    expect(screen.getByText(/Resistances/i)).toBeInTheDocument();
  });

  it("handles empty types gracefully", async () => {
    render(<TypeMatchups types={[]} />);
    await waitFor(() => {
      expect(screen.getByText("No type matchup data available.")).toBeInTheDocument();
    });
  });
});
