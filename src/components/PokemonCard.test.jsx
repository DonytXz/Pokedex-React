import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PokemonCard from "./PokemonCard";

describe("PokemonCard Component", () => {
  const mockPokemon = {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: {
      front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    },
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  };

  it("renders in grid mode with pokemon name and padded number", () => {
    const setCloseModalMock = vi.fn();
    const setClickedPokemonMock = vi.fn();

    render(
      <PokemonCard
        pokemon={mockPokemon}
        isList={true}
        setcloseMdoal={setCloseModalMock}
        setClickedPokemon={setClickedPokemonMock}
      />
    );

    const button = screen.getByRole("button", {
      name: "View details for bulbasaur, number #001",
    });
    expect(button).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
  });

  it("renders in list mode with types, height, and weight", () => {
    const setCloseModalMock = vi.fn();
    const setClickedPokemonMock = vi.fn();

    render(
      <PokemonCard
        pokemon={mockPokemon}
        isList={false}
        setcloseMdoal={setCloseModalMock}
        setClickedPokemon={setClickedPokemonMock}
      />
    );

    expect(screen.getByRole("heading", { name: "bulbasaur" })).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
    expect(screen.getByText("7m")).toBeInTheDocument();
    expect(screen.getByText("69kg")).toBeInTheDocument();
  });

  it("invokes setClickedPokemon and setcloseMdoal when clicked", () => {
    const setCloseModalMock = vi.fn();
    const setClickedPokemonMock = vi.fn();

    render(
      <PokemonCard
        pokemon={mockPokemon}
        isList={true}
        setcloseMdoal={setCloseModalMock}
        setClickedPokemon={setClickedPokemonMock}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(setClickedPokemonMock).toHaveBeenCalledWith("bulbasaur");
    expect(setCloseModalMock).toHaveBeenCalledWith(false);
  });

  it("handles when setcloseMdoal prop is not provided", () => {
    const setClickedPokemonMock = vi.fn();

    render(
      <PokemonCard
        pokemon={mockPokemon}
        isList={true}
        setClickedPokemon={setClickedPokemonMock}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(setClickedPokemonMock).toHaveBeenCalledWith("bulbasaur");
  });
});
