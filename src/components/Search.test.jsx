import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Search from "./Search";

describe("Search Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates input value and debounces search execution by 500ms", () => {
    const getPokemonMock = vi.fn();
    const setSearchedMock = vi.fn();

    render(<Search getPokemon={getPokemonMock} setSearched={setSearchedMock} />);
    const input = screen.getByRole("searchbox", { name: /search pokémon/i });

    fireEvent.change(input, { target: { value: "Pikachu" } });
    expect(input.value).toBe("pikachu");
    expect(getPokemonMock).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(setSearchedMock).toHaveBeenCalledWith(true);
    expect(getPokemonMock).toHaveBeenCalledWith("pikachu");
  });

  it("triggers search immediately when input is cleared to empty string", () => {
    const getPokemonMock = vi.fn();
    const setSearchedMock = vi.fn();

    render(<Search getPokemon={getPokemonMock} setSearched={setSearchedMock} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "pikachu" } });
    fireEvent.change(input, { target: { value: "" } });

    expect(setSearchedMock).toHaveBeenCalledWith(false);
    expect(getPokemonMock).toHaveBeenCalledWith("");
  });

  it("triggers search immediately upon pressing Enter key", () => {
    const getPokemonMock = vi.fn();
    const setSearchedMock = vi.fn();

    render(<Search getPokemon={getPokemonMock} setSearched={setSearchedMock} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "Charizard" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(setSearchedMock).toHaveBeenCalledWith(true);
    expect(getPokemonMock).toHaveBeenCalledWith("charizard");
  });

  it("triggers search upon form submission", () => {
    const getPokemonMock = vi.fn();
    const setSearchedMock = vi.fn();

    render(<Search getPokemon={getPokemonMock} setSearched={setSearchedMock} />);
    const input = screen.getByRole("searchbox");
    const form = screen.getByRole("search");

    fireEvent.change(input, { target: { value: "Mew" } });
    fireEvent.submit(form);

    expect(setSearchedMock).toHaveBeenCalledWith(true);
    expect(getPokemonMock).toHaveBeenCalledWith("mew");
  });

  it("cleans up debounce timer on component unmount", () => {
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { unmount } = render(<Search getPokemon={vi.fn()} setSearched={vi.fn()} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "Squirtle" } });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
