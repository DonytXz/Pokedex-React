import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Modal from "./Modal";
import * as pokemonService from "../services/getPokemon";

vi.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="bar-chart" />,
  Radar: () => <div data-testid="radar-chart" />,
}));

describe("Modal Component", () => {
  const mockPokemon = {
    id: 25,
    name: "pikachu",
    height: 4,
    weight: 60,
    sprites: {
      front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    },
    types: [{ type: { name: "electric" } }],
    stats: [{ base_stat: 35, stat: { name: "hp" } }],
    species: {
      url: "https://pokeapi.co/api/v2/pokemon-species/25/",
      flavor_text_entries: [
        { flavor_text: "When several of these Pokémon gather...", language: { name: "en" } },
      ],
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(pokemonService, "fetchPokemonData").mockResolvedValue({
      flavor_text_entries: [
        { flavor_text: "When several of these Pokémon gather...", language: { name: "en" } },
      ],
    });
  });

  it("renders loader when pokemon is null or undefined", () => {
    render(<Modal pokemon={null} setCloseModal={vi.fn()} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders pokemon details, stats, and types when pokemon is provided", async () => {
    vi.spyOn(pokemonService, "fetchPokemonData").mockResolvedValue({
      flavor_text_entries: [
        { flavor_text: "Electric mouse pokemon.", language: { name: "en" } },
      ],
    });

    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={vi.fn()} />);
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "pikachu" })).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
    expect(screen.getByText("0.4m")).toBeInTheDocument();
    expect(screen.getByText("6.0kg")).toBeInTheDocument();
  });

  it("fetches species data and handles fetch errors gracefully", async () => {
    vi.spyOn(pokemonService, "fetchPokemonData").mockRejectedValue(new Error("Species not found"));

    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={vi.fn()} />);
    });

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("calls setCloseModal(true) when close button is clicked", async () => {
    const setCloseModalMock = vi.fn();
    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={setCloseModalMock} />);
    });

    const closeBtn = screen.getByRole("button", { name: "Close Pokémon details" });
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(setCloseModalMock).toHaveBeenCalledWith(true);
  });

  it("closes modal on Escape key press", async () => {
    const setCloseModalMock = vi.fn();
    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={setCloseModalMock} />);
    });

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(setCloseModalMock).toHaveBeenCalledWith(true);
  });

  it("traps focus within the modal on Tab and Shift+Tab key presses", async () => {
    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={vi.fn()} />);
    });

    const closeBtn = screen.getByRole("button", { name: "Close Pokémon details" });
    const switchInput = screen.getByRole("switch");

    // Close button should initially have focus
    expect(document.activeElement).toBe(closeBtn);

    // Shift+Tab on first focusable element loops to last focusable element
    act(() => {
      fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    });
    expect(document.activeElement).toBe(switchInput);

    // Tab on last focusable element loops to first focusable element
    act(() => {
      fireEvent.keyDown(window, { key: "Tab", shiftKey: false });
    });
    expect(document.activeElement).toBe(closeBtn);
  });

  it("allows toggling between Bar chart and Radar chart view", async () => {
    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={vi.fn()} />);
    });

    expect(screen.getByText("Chart View")).toBeInTheDocument();
    const switchInput = screen.getByRole("switch");

    act(() => {
      fireEvent.click(switchInput);
    });
    expect(screen.getByText("Radar View")).toBeInTheDocument();
  });
});

