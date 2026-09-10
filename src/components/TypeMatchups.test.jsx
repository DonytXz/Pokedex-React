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

  it("renders 4x weaknesses, 0.25x resistances, and 0x immunities for dual types", async () => {
    const bugData = {
      name: "bug",
      damage_relations: {
        double_damage_from: [{ name: "fire" }, { name: "rock" }],
        half_damage_from: [{ name: "grass" }, { name: "fighting" }],
        no_damage_from: [],
      },
    };
    const flyingData = {
      name: "flying",
      damage_relations: {
        double_damage_from: [{ name: "electric" }, { name: "rock" }],
        half_damage_from: [{ name: "grass" }, { name: "fighting" }],
        no_damage_from: [{ name: "ground" }],
      },
    };

    vi.spyOn(pokemonService, "fetchTypeData").mockImplementation(async (type) => {
      return type === "bug" ? bugData : flyingData;
    });

    render(
      <TypeMatchups
        types={[{ type: { name: "bug" } }, { type: { name: "flying" } }]}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/4×/)).toBeInTheDocument();
      expect(screen.getAllByText(/¼×/).length).toBeGreaterThan(0);
      expect(screen.getByText(/0×/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Immunities/i)).toBeInTheDocument();
  });

  it("handles fetchTypeData error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(pokemonService, "fetchTypeData").mockRejectedValue(new Error("Network failure"));

    render(<TypeMatchups types={[{ type: { name: "fire" } }]} />);

    await waitFor(() => {
      expect(screen.getByText("No type matchup data available.")).toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalled();
  });
});
