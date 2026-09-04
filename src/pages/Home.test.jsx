import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./Home";
import * as pokemonService from "../services/getPokemon";

vi.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Radar: () => <div data-testid="radar-chart" />,
}));

describe("Home Page Component", () => {
  const mockPokemonList = {
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
      { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
    ],
  };

  const mockBulbasaur = {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    types: [{ type: { name: "grass" } }],
    stats: [{ base_stat: 45, stat: { name: "hp" } }],
    species: {
      url: "https://pokeapi.co/api/v2/pokemon-species/1/",
      flavor_text_entries: [{ flavor_text: "A strange seed...", language: { name: "en" } }],
    },
  };

  const mockCharmander = {
    id: 4,
    name: "charmander",
    height: 6,
    weight: 85,
    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
    types: [{ type: { name: "fire" } }],
    stats: [{ base_stat: 39, stat: { name: "hp" } }],
    species: {
      url: "https://pokeapi.co/api/v2/pokemon-species/4/",
      flavor_text_entries: [{ flavor_text: "Prefers hot things...", language: { name: "en" } }],
    },
  };

  const mockSquirtle = {
    id: 7,
    name: "squirtle",
    height: 5,
    weight: 90,
    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
    types: [{ type: { name: "water" } }],
    stats: [{ base_stat: 44, stat: { name: "hp" } }],
    species: {
      url: "https://pokeapi.co/api/v2/pokemon-species/7/",
      flavor_text_entries: [{ flavor_text: "Shoots water...", language: { name: "en" } }],
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(pokemonService, "fetchAllPokemonNames").mockResolvedValue(mockPokemonList);
    vi.spyOn(pokemonService, "fetchPokemons").mockResolvedValue({
      count: 3,
      results: mockPokemonList.results,
    });
    vi.spyOn(pokemonService, "fetchPokemonData").mockImplementation(async (url) => {
      if (url && url.includes("/4/")) return mockCharmander;
      if (url && url.includes("/7/")) return mockSquirtle;
      return mockBulbasaur;
    });
    vi.spyOn(pokemonService, "fetchPokemon").mockImplementation(async (name) => {
      if (name === "charmander") return mockCharmander;
      if (name === "squirtle") return mockSquirtle;
      return mockBulbasaur;
    });
  });

  it("loads all pokemon names on mount and renders initial pokemon cards", async () => {
    render(<Home />);

    expect(pokemonService.fetchAllPokemonNames).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "squirtle" })).toBeInTheDocument();
    });
  });

  it("filters pokemon when searching by name with live status announcement", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("searchbox");
    const searchForm = screen.getByRole("search");

    fireEvent.change(searchInput, { target: { value: "charmander" } });
    fireEvent.submit(searchForm);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "bulbasaur" })).toBeNull();
    });

    expect(screen.getByText(/Found 1 Pokémon matching search/i)).toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });
  });

  it("filters pokemon when searching by ID substring", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "4" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "bulbasaur" })).toBeNull();
    });
  });

  it("handles search error gracefully", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    vi.spyOn(pokemonService, "fetchPokemonData").mockRejectedValueOnce(new Error("Network failure"));

    const searchInput = screen.getByRole("searchbox");
    const searchForm = screen.getByRole("search");

    fireEvent.change(searchInput, { target: { value: "charmander" } });
    fireEvent.submit(searchForm);

    await waitFor(() => {
      expect(screen.getByText("Error searching Pokémon.")).toBeInTheDocument();
    });
  });

  it("opens modal on pokemon card selection, locks body scroll, and restores on close", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const card = screen.getByRole("button", { name: /view details for bulbasaur/i });
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    expect(document.body.style.overflow).toBe("hidden");

    // Close via close button
    const closeBtn = screen.getByRole("button", { name: /close pokémon details/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("closes modal when clicking the backdrop overlay", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const card = screen.getByRole("button", { name: /view details for bulbasaur/i });
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const backdrop = document.querySelector(".bg-black.bg-opacity-50");
    expect(backdrop).toBeInTheDocument();

    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("toggles layout between grid and list view", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const toggleLayoutBtn = screen.getByRole("button", { name: /switch to list view/i });
    fireEvent.click(toggleLayoutBtn);

    expect(
      screen.getByRole("button", { name: /switch to grid view/i })
    ).toBeInTheDocument();
  });

  it("opens and closes the battle team builder dialog", async () => {
    render(<Home />);

    const teamBtn = screen.getByRole("button", { name: /open battle team/i });
    expect(teamBtn).toBeInTheDocument();

    fireEvent.click(teamBtn);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /battle team builder/i })).toBeInTheDocument();
    });

    const closeTeamBtn = screen.getByRole("button", { name: /close team builder/i });
    fireEvent.click(closeTeamBtn);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /battle team builder/i })).toBeNull();
    });
  });

  it("filters pokemon by generation region", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const genSelect = screen.getByLabelText(/region:/i);
    fireEvent.change(genSelect, { target: { value: "1" } });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });
  });

  it("filters pokemon by elemental type", async () => {
    vi.spyOn(pokemonService, "fetchTypePokemons").mockResolvedValue([
      { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    ]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const typeSelect = screen.getByLabelText(/type:/i);
    fireEvent.change(typeSelect, { target: { value: "fire" } });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "bulbasaur" })).toBeNull();
    });
  });

  it("toggles favorite state on pokemon card and filters by favorites", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const favBtn = screen.getByRole("button", { name: /add bulbasaur to favorites/i });
    fireEvent.click(favBtn);

    const favFilterBtn = screen.getByRole("button", { name: /show 1 favorite pokémon/i });
    expect(favFilterBtn).toBeInTheDocument();

    // Toggle favorites filter
    fireEvent.click(favFilterBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    // Reset filters
    const clearBtn = screen.getByRole("button", { name: /reset all filters/i });
    fireEvent.click(clearBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
    });
  });

  it("toggles pokemon in battle team and manages team inside dialog", async () => {
    window.alert = vi.fn();
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const addTeamBtn = screen.getByRole("button", { name: /add bulbasaur to battle team/i });
    fireEvent.click(addTeamBtn);

    const teamLauncher = screen.getByRole("button", { name: /open battle team \(1 of 6 members\)/i });
    expect(teamLauncher).toBeInTheDocument();

    // Open Team Builder dialog
    fireEvent.click(teamLauncher);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /battle team builder/i })).toBeInTheDocument();
    });

    // Remove member inside dialog
    const removeMemberBtn = screen.getByRole("button", { name: /remove bulbasaur from team/i });
    fireEvent.click(removeMemberBtn);

    expect(screen.getByText(/0 \/ 6 Members/i)).toBeInTheDocument();
  });

  it("navigates through pokemon in modal using next and previous buttons", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    // Click Bulbasaur card to open modal
    const bulbasaurCard = screen.getByRole("button", { name: /view details for bulbasaur/i });
    fireEvent.click(bulbasaurCard);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    // Bulbasaur is first on page 0, so Prev should be disabled
    const prevBtn = screen.getByRole("button", { name: "Previous Pokémon" });
    const nextBtn = screen.getByRole("button", { name: "Next Pokémon" });
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    // Click Next -> should navigate to charmander
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
    });

    // Now prev is enabled
    expect(screen.getByRole("button", { name: "Previous Pokémon" })).not.toBeDisabled();

    // Click Prev -> should navigate back to bulbasaur
    fireEvent.click(screen.getByRole("button", { name: "Previous Pokémon" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });
  });

  it("navigates across page boundaries from last pokemon on page to first on next page and inverse", async () => {
    // Mock 2 pages: Page 0 has [bulbasaur, charmander], Page 1 has [squirtle]
    vi.spyOn(pokemonService, "fetchPokemons").mockImplementation(async (limit, offset) => {
      if (offset >= 18) {
        return {
          count: 36,
          results: [{ name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" }],
        };
      }
      return {
        count: 36,
        results: [
          { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
        ],
      };
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "charmander" })).toBeInTheDocument();
    });

    // Open Charmander (last pokemon on Page 0)
    const charmanderCard = screen.getByRole("button", { name: /view details for charmander/i });
    fireEvent.click(charmanderCard);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByRole("heading", { name: "charmander" })).toBeInTheDocument();
    });

    // Charmander has a next page available, so next should be enabled
    const nextBtn = screen.getByRole("button", { name: "Next Pokémon" });
    expect(nextBtn).not.toBeDisabled();

    // Click Next from last pokemon on page 0 -> should advance to page 1 and open squirtle
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "squirtle" })).toBeInTheDocument();
    });

    // Squirtle is on page 1 (index 0). Prev should be enabled because previous page exists!
    const prevBtn = screen.getByRole("button", { name: "Previous Pokémon" });
    expect(prevBtn).not.toBeDisabled();

    // Click Prev from first pokemon on page 1 -> should go back to page 0 and open charmander
    fireEvent.click(prevBtn);

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");
      expect(within(dialog).getByRole("heading", { name: "charmander" })).toBeInTheDocument();
    });
  });
});
