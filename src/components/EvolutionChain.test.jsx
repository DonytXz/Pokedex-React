import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EvolutionChain from "./EvolutionChain";
import * as pokemonService from "../services/getPokemon";

describe("EvolutionChain Component", () => {
  const mockSpeciesData = {
    evolution_chain: {
      url: "https://pokeapi.co/api/v2/evolution-chain/1/",
    },
  };

  const mockChainData = {
    id: 1,
    chain: {
      species: { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon-species/1/" },
      evolution_details: [],
      evolves_to: [
        {
          species: { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon-species/2/" },
          evolution_details: [{ min_level: 16 }],
          evolves_to: [
            {
              species: { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon-species/3/" },
              evolution_details: [{ min_level: 32 }],
              evolves_to: [],
            },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(pokemonService, "fetchPokemonData").mockResolvedValue(mockSpeciesData);
    vi.spyOn(pokemonService, "fetchEvolutionChain").mockResolvedValue(mockChainData);
  });

  it("renders evolution chain nodes with triggers", async () => {
    render(
      <EvolutionChain
        speciesUrl="https://pokeapi.co/api/v2/pokemon-species/1/"
        currentPokemonName="ivysaur"
        onSelectPokemon={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("ivysaur")).toBeInTheDocument();
      expect(screen.getByText("venusaur")).toBeInTheDocument();
    });

    expect(screen.getByText("Lv. 16")).toBeInTheDocument();
    expect(screen.getByText("Lv. 32")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("calls onSelectPokemon when an evolution stage is clicked", async () => {
    const onSelectMock = vi.fn();
    render(
      <EvolutionChain
        speciesUrl="https://pokeapi.co/api/v2/pokemon-species/1/"
        currentPokemonName="bulbasaur"
        onSelectPokemon={onSelectMock}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("venusaur")).toBeInTheDocument();
    });

    const venusaurBtn = screen.getByRole("button", { name: /view venusaur details/i });
    fireEvent.click(venusaurBtn);

    expect(onSelectMock).toHaveBeenCalledWith("venusaur");
  });

  it("displays fallback message when evolution chain is unavailable", async () => {
    vi.spyOn(pokemonService, "fetchPokemonData").mockRejectedValue(new Error("Not found"));
    render(
      <EvolutionChain
        speciesUrl="https://pokeapi.co/api/v2/pokemon-species/999/"
        currentPokemonName="missingno"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Evolution chain unavailable for this Pokémon.")).toBeInTheDocument();
    });
  });
});
