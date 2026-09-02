import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Grid from "./Grid";
import * as pokemonService from "../services/getPokemon";

describe("Grid Component", () => {
  const mockPokemonsPage1 = {
    count: 36,
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    ],
  };

  const mockBulbasaurData = {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    types: [{ type: { name: "grass" } }],
  };

  const mockIvysaurData = {
    id: 2,
    name: "ivysaur",
    height: 10,
    weight: 130,
    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png" },
    types: [{ type: { name: "grass" } }],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and renders pokemon cards with pagination on initial mount", async () => {
    vi.spyOn(pokemonService, "fetchPokemons").mockResolvedValue(mockPokemonsPage1);
    vi.spyOn(pokemonService, "fetchPokemonData").mockImplementation(async (url) => {
      return url.includes("/2/") ? mockIvysaurData : mockBulbasaurData;
    });

    const setSharedPageValMock = vi.fn();
    const setPokemonModalValMock = vi.fn();

    render(
      <Grid
        pokemon={[]}
        setcloseMdoal={vi.fn()}
        searched={false}
        searchLoading={false}
        setPokemonModalVal={setPokemonModalValMock}
        setSharedPageVal={setSharedPageValMock}
        isList={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "ivysaur" })).toBeInTheDocument();
    });

    expect(setSharedPageValMock).toHaveBeenCalledWith(0);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("handles pagination navigation functions (next, previous, first, second, underLast, last page)", async () => {
    vi.spyOn(pokemonService, "fetchPokemons").mockResolvedValue({
      count: 180, // 10 pages
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
    });
    vi.spyOn(pokemonService, "fetchPokemonData").mockResolvedValue(mockBulbasaurData);

    const setSharedPageValMock = vi.fn();

    render(
      <Grid
        pokemon={[]}
        setcloseMdoal={vi.fn()}
        searched={false}
        searchLoading={false}
        setPokemonModalVal={vi.fn()}
        setSharedPageVal={setSharedPageValMock}
        isList={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    // Click Next Page
    const nextBtn = screen.getByRole("button", { name: "Next page" });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(setSharedPageValMock).toHaveBeenCalledWith(1);
    });

    // Click Page 1 (firstPage)
    const page1Btn = screen.getByRole("button", { name: "Page 1" });
    fireEvent.click(page1Btn);
    await waitFor(() => {
      expect(setSharedPageValMock).toHaveBeenCalledWith(0);
    });

    // Click Page 2 (secondPage)
    const page2Btn = screen.getByRole("button", { name: "Page 2" });
    fireEvent.click(page2Btn);
    await waitFor(() => {
      expect(setSharedPageValMock).toHaveBeenCalledWith(1);
    });

    // Click Previous Page
    const prevBtn = screen.getByRole("button", { name: "Previous page" });
    fireEvent.click(prevBtn);
    await waitFor(() => {
      expect(setSharedPageValMock).toHaveBeenCalledWith(0);
    });

    // Click UnderLast Page (Page 9)
    const underLastBtn = screen.getByRole("button", { name: "Page 9" });
    fireEvent.click(underLastBtn);
    await waitFor(() => {
      expect(setSharedPageValMock).toHaveBeenCalledWith(9);
    });

    // Click Last Page (Page 10)
    const lastPageBtn = screen.getByRole("button", { name: "Page 10" });
    fireEvent.click(lastPageBtn);
    await waitFor(() => {
      expect(setSharedPageValMock).toHaveBeenCalledWith(10);
    });
  });

  it("renders search results when searched is true and search matches exist", () => {
    render(
      <Grid
        pokemon={[mockBulbasaurData]}
        setcloseMdoal={vi.fn()}
        searched={true}
        searchLoading={false}
        setPokemonModalVal={vi.fn()}
        setSharedPageVal={vi.fn()}
        isList={true}
      />
    );

    expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
  });

  it("renders No Pokémon found message when search returns no results", () => {
    render(
      <Grid
        pokemon={[]}
        setcloseMdoal={vi.fn()}
        searched={true}
        searchLoading={false}
        setPokemonModalVal={vi.fn()}
        setSharedPageVal={vi.fn()}
        isList={true}
      />
    );

    expect(screen.getByText("No Pokémon found.")).toBeInTheDocument();
  });

  it("renders skeleton cards during search loading", () => {
    const { container } = render(
      <Grid
        pokemon={[]}
        setcloseMdoal={vi.fn()}
        searched={true}
        searchLoading={true}
        setPokemonModalVal={vi.fn()}
        setSharedPageVal={vi.fn()}
        isList={true}
      />
    );

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(18);
  });

  it("handles fetch failure gracefully and renders empty state", async () => {
    vi.spyOn(pokemonService, "fetchPokemons").mockRejectedValue(new Error("API Error"));

    render(
      <Grid
        pokemon={[]}
        setcloseMdoal={vi.fn()}
        searched={false}
        searchLoading={false}
        setPokemonModalVal={vi.fn()}
        setSharedPageVal={vi.fn()}
        isList={true}
      />
    );

    await waitFor(() => {
      expect(screen.queryByRole("status")).toBeNull();
    });
  });

  it("triggers setPokemonModalVal when a pokemon card is clicked", async () => {
    vi.spyOn(pokemonService, "fetchPokemons").mockResolvedValue({
      count: 1,
      results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
    });
    vi.spyOn(pokemonService, "fetchPokemonData").mockResolvedValue(mockBulbasaurData);

    const setPokemonModalValMock = vi.fn();

    render(
      <Grid
        pokemon={[]}
        setcloseMdoal={vi.fn()}
        searched={false}
        searchLoading={false}
        setPokemonModalVal={setPokemonModalValMock}
        setSharedPageVal={vi.fn()}
        isList={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    });

    const card = screen.getByRole("button", { name: /view details for bulbasaur/i });
    fireEvent.click(card);

    expect(setPokemonModalValMock).toHaveBeenCalledWith("bulbasaur");
  });
});
