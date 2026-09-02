import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import Logo from "../components/Logo";
import Search from "../components/Search";
import Butons from "../components/Butons";
import PokemonCard from "../components/PokemonCard";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import ToggleBtn from "../components/ToggleBtn";
import Stats from "../components/Stats";
import PokeballLoader from "../components/loaders/PokeballLoader";
import SkeletonCard from "../components/loaders/SkeletonCard";
import Home from "../pages/Home";

// Mock react-chartjs-2 components for tests
vi.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="bar-chart" aria-hidden="true" />,
  Radar: () => <div data-testid="radar-chart" aria-hidden="true" />,
}));

// Mock services for testing
vi.mock("../services/getPokemon", () => ({
  fetchAllPokemonNames: vi.fn().mockResolvedValue({
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    ],
  }),
  fetchPokemons: vi.fn().mockResolvedValue({
    count: 36,
    results: [
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    ],
  }),
  fetchPokemonData: vi.fn().mockImplementation(async (url) => {
    const isIvysaur = url && url.includes("/2/");
    return {
      id: isIvysaur ? 2 : 1,
      name: isIvysaur ? "ivysaur" : "bulbasaur",
      height: isIvysaur ? 10 : 7,
      weight: isIvysaur ? 130 : 69,
      sprites: { front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${isIvysaur ? 2 : 1}.png` },
      types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
      stats: [
        { base_stat: 45, stat: { name: "hp" } },
        { base_stat: 49, stat: { name: "attack" } },
      ],
      species: { url: `https://pokeapi.co/api/v2/pokemon-species/${isIvysaur ? 2 : 1}/` },
    };
  }),
  fetchPokemon: vi.fn().mockResolvedValue({
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    stats: [
      { base_stat: 45, stat: { name: "hp" } },
      { base_stat: 49, stat: { name: "attack" } },
    ],
    species: {
      flavor_text_entries: [
        { flavor_text: "A strange seed was planted on its back.", language: { name: "en" } },
      ],
    },
  }),
}));

const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  stats: [
    { base_stat: 45, stat: { name: "hp" } },
    { base_stat: 49, stat: { name: "attack" } },
  ],
  species: {
    flavor_text_entries: [
      { flavor_text: "A strange seed was planted on its back.", language: { name: "en" } },
    ],
  },
};

describe("Accessibility (a11y) & AXE Verification", () => {
  describe("Logo Component", () => {
    it("renders h1 landmark and passes AXE audit", async () => {
      const { container } = render(<Logo />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("Search Component", () => {
    it("has accessible label, search role, and passes AXE audit", async () => {
      const { container } = render(
        <Search getPokemon={vi.fn()} setSearched={vi.fn()} />
      );
      const searchInput = screen.getByRole("searchbox", {
        name: /search pokémon/i,
      });
      expect(searchInput).toBeInTheDocument();
      expect(screen.getByRole("search")).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("Butons Component (Layout Switcher)", () => {
    it("has accessible name, pressed state, and passes AXE audit", async () => {
      const setIsList = vi.fn();
      const { container, rerender } = render(
        <Butons isList={true} setIslist={setIsList} />
      );
      const button = screen.getByRole("button", { name: /switch to list view/i });
      expect(button).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();

      rerender(<Butons isList={false} setIslist={setIsList} />);
      expect(
        screen.getByRole("button", { name: /switch to grid view/i })
      ).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("PokemonCard Component", () => {
    it("renders as keyboard focusable button and passes AXE audit (Grid View)", async () => {
      const setCloseModal = vi.fn();
      const setClickedPokemon = vi.fn();

      const { container } = render(
        <PokemonCard
          pokemon={mockPokemon}
          isList={true}
          setcloseMdoal={setCloseModal}
          setClickedPokemon={setClickedPokemon}
        />
      );

      const cardButton = screen.getByRole("button", {
        name: /view details for bulbasaur/i,
      });
      expect(cardButton).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();

      fireEvent.click(cardButton);
      expect(setClickedPokemon).toHaveBeenCalledWith("bulbasaur");
      expect(setCloseModal).toHaveBeenCalledWith(false);
    });

    it("renders as keyboard focusable button and passes AXE audit (List View)", async () => {
      const { container } = render(
        <PokemonCard
          pokemon={mockPokemon}
          isList={false}
          setcloseMdoal={vi.fn()}
          setClickedPokemon={vi.fn()}
        />
      );

      expect(
        screen.getByRole("button", { name: /view details for bulbasaur/i })
      ).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("Pagination Component", () => {
    it("renders semantic navigation landmark and buttons with proper aria attributes", async () => {
      const onLeftClick = vi.fn();
      const onRightClick = vi.fn();

      const { container } = render(
        <Pagination
          page={0}
          total={5}
          onLeftClick={onLeftClick}
          onRightClick={onRightClick}
          firstPage={vi.fn()}
          secondPage={vi.fn()}
          underLatsPage={vi.fn()}
          lastPage={vi.fn()}
        />
      );

      expect(screen.getByRole("navigation", { name: /pagination/i })).toBeInTheDocument();

      const prevBtn = screen.getByRole("button", { name: /previous page/i });
      expect(prevBtn).toBeDisabled();

      const page1Btn = screen.getByRole("button", { name: /page 1/i });
      expect(page1Btn).toHaveAttribute("aria-current", "page");

      const nextBtn = screen.getByRole("button", { name: /next page/i });
      expect(nextBtn).not.toBeDisabled();

      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("ToggleBtn Component", () => {
    it("renders as accessible switch control and passes AXE audit", async () => {
      const setClickedBtn = vi.fn();
      const { container } = render(
        <ToggleBtn clickedBtn={false} setClickedBtn={setClickedBtn} />
      );

      const switchInput = screen.getByRole("switch", {
        name: /switch between bar chart and radar chart/i,
      });
      expect(switchInput).toBeInTheDocument();
      expect(switchInput).not.toBeChecked();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("Modal Component & Dialog Accessibility", () => {
    it("renders dialog landmark, accessible close button, and passes AXE audit", async () => {
      const setCloseModal = vi.fn();
      const { container } = render(
        <Modal pokemon={mockPokemon} setCloseModal={setCloseModal} />
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-pokemon-name");

      const closeButton = screen.getByRole("button", {
        name: /close pokémon details/i,
      });
      expect(closeButton).toBeInTheDocument();

      expect(await axe(container)).toHaveNoViolations();
    });

    it("closes when Escape key is pressed", () => {
      const setCloseModal = vi.fn();
      render(<Modal pokemon={mockPokemon} setCloseModal={setCloseModal} />);

      fireEvent.keyDown(window, { key: "Escape" });
      expect(setCloseModal).toHaveBeenCalledWith(true);
    });
  });

  describe("Loaders Accessibility", () => {
    it("PokeballLoader has status role, live region, and passes AXE audit", async () => {
      const { container } = render(<PokeballLoader />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });

    it("SkeletonCard has aria-hidden attribute", () => {
      const { container } = render(<SkeletonCard />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Home Page Landmark & a11y Structure", () => {
    it("includes skip navigation link, main landmark, and passes AXE audit", async () => {
      const { container } = render(<Home />);

      const skipLink = screen.getByRole("link", {
        name: /skip to main content/i,
      });
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute("href", "#main-content");

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
