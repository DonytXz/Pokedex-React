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

  it("allows switching between Stats, Evolution Chain, and Type Matchups tabs", async () => {
    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={vi.fn()} />);
    });

    const statsTab = screen.getByRole("tab", { name: "Stats & About" });
    const evoTab = screen.getByRole("tab", { name: "Evolution Chain" });
    const matchupsTab = screen.getByRole("tab", { name: "Type Matchups" });

    expect(statsTab).toHaveAttribute("aria-selected", "true");

    act(() => {
      fireEvent.click(evoTab);
    });
    expect(evoTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Evolution Chain" })).toBeInTheDocument();

    act(() => {
      fireEvent.click(matchupsTab);
    });
    expect(matchupsTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Type Matchups" })).toBeInTheDocument();
  });

  it("toggles shiny sprite view when shiny button is clicked", async () => {
    await act(async () => {
      render(<Modal pokemon={mockPokemon} setCloseModal={vi.fn()} />);
    });

    const shinyBtn = screen.getByRole("button", { name: /switch to shiny form/i });
    expect(shinyBtn).toHaveAttribute("aria-pressed", "false");

    act(() => {
      fireEvent.click(shinyBtn);
    });
    expect(shinyBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Shiny Active")).toBeInTheDocument();
  });

  it("supports favorite and team actions inside modal", async () => {
    const onToggleFavoriteMock = vi.fn();
    const onToggleTeamMock = vi.fn();

    await act(async () => {
      render(
        <Modal
          pokemon={mockPokemon}
          setCloseModal={vi.fn()}
          isFavorite={false}
          onToggleFavorite={onToggleFavoriteMock}
          isInTeam={false}
          onToggleTeam={onToggleTeamMock}
        />
      );
    });

    const favBtn = screen.getByRole("button", { name: /add pikachu to favorites/i });
    act(() => {
      fireEvent.click(favBtn);
    });
    expect(onToggleFavoriteMock).toHaveBeenCalledWith(mockPokemon);

    const teamBtn = screen.getByRole("button", { name: /add pikachu to battle team/i });
    act(() => {
      fireEvent.click(teamBtn);
    });
    expect(onToggleTeamMock).toHaveBeenCalledWith(mockPokemon);
  });

  it("renders Previous and Next buttons with proper disabled states and calls callbacks on click", async () => {
    const onPrevMock = vi.fn();
    const onNextMock = vi.fn();

    await act(async () => {
      render(
        <Modal
          pokemon={mockPokemon}
          setCloseModal={vi.fn()}
          onPrevPokemon={onPrevMock}
          onNextPokemon={onNextMock}
          hasPrev={false}
          hasNext={true}
        />
      );
    });

    const prevBtn = screen.getByRole("button", { name: "Previous Pokémon" });
    const nextBtn = screen.getByRole("button", { name: "Next Pokémon" });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    act(() => {
      fireEvent.click(prevBtn);
    });
    expect(onPrevMock).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(nextBtn);
    });
    expect(onNextMock).toHaveBeenCalledTimes(1);
  });

  it("navigates with ArrowLeft and ArrowRight keyboard keys", async () => {
    const onPrevMock = vi.fn();
    const onNextMock = vi.fn();

    await act(async () => {
      render(
        <Modal
          pokemon={mockPokemon}
          setCloseModal={vi.fn()}
          onPrevPokemon={onPrevMock}
          onNextPokemon={onNextMock}
          hasPrev={true}
          hasNext={true}
        />
      );
    });

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowLeft" });
    });
    expect(onPrevMock).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowRight" });
    });
    expect(onNextMock).toHaveBeenCalledTimes(1);
  });

  it("does not navigate via keyboard arrows when hasPrev or hasNext is false", async () => {
    const onPrevMock = vi.fn();
    const onNextMock = vi.fn();

    await act(async () => {
      render(
        <Modal
          pokemon={mockPokemon}
          setCloseModal={vi.fn()}
          onPrevPokemon={onPrevMock}
          onNextPokemon={onNextMock}
          hasPrev={false}
          hasNext={false}
        />
      );
    });

    act(() => {
      fireEvent.keyDown(window, { key: "ArrowLeft" });
      fireEvent.keyDown(window, { key: "ArrowRight" });
    });
    expect(onPrevMock).not.toHaveBeenCalled();
    expect(onNextMock).not.toHaveBeenCalled();
  });

  it("navigates via touch swipe left (next) and swipe right (prev)", async () => {
    const onPrevMock = vi.fn();
    const onNextMock = vi.fn();

    await act(async () => {
      render(
        <Modal
          pokemon={mockPokemon}
          setCloseModal={vi.fn()}
          onPrevPokemon={onPrevMock}
          onNextPokemon={onNextMock}
          hasPrev={true}
          hasNext={true}
        />
      );
    });

    const dialog = screen.getByRole("dialog");

    // Swipe Left (start at 200, end at 100 -> diffX = -100) -> should call onNext
    fireEvent.touchStart(dialog, {
      touches: [{ clientX: 200, clientY: 150 }],
    });
    fireEvent.touchEnd(dialog, {
      changedTouches: [{ clientX: 100, clientY: 150 }],
    });
    expect(onNextMock).toHaveBeenCalledTimes(1);

    // Swipe Right (start at 100, end at 200 -> diffX = +100) -> should call onPrev
    fireEvent.touchStart(dialog, {
      touches: [{ clientX: 100, clientY: 150 }],
    });
    fireEvent.touchEnd(dialog, {
      changedTouches: [{ clientX: 200, clientY: 150 }],
    });
    expect(onPrevMock).toHaveBeenCalledTimes(1);

    // Vertical scroll gesture (start at 100, 100; end at 120, 250 -> diffY = 150, diffX = 20) -> should NOT navigate
    fireEvent.touchStart(dialog, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchEnd(dialog, {
      changedTouches: [{ clientX: 120, clientY: 250 }],
    });
    expect(onPrevMock).toHaveBeenCalledTimes(1);
    expect(onNextMock).toHaveBeenCalledTimes(1);

    // Small swipe below threshold of 50px (diffX = 30) -> should NOT navigate
    fireEvent.touchStart(dialog, {
      touches: [{ clientX: 100, clientY: 100 }],
    });
    fireEvent.touchEnd(dialog, {
      changedTouches: [{ clientX: 130, clientY: 100 }],
    });
    expect(onPrevMock).toHaveBeenCalledTimes(1);
    expect(onNextMock).toHaveBeenCalledTimes(1);
  });
});

