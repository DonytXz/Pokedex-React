import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchPokemon,
  fetchPokemons,
  fetchAllPokemonNames,
  fetchPokemonData,
} from "./getPokemon";

describe("getPokemon service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchPokemon", () => {
    it("fetches a single pokemon by name successfully", async () => {
      const mockData = { id: 1, name: "bulbasaur" };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await fetchPokemon("bulbasaur");
      expect(global.fetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/bulbasaur"
      );
      expect(result).toEqual(mockData);
    });

    it("returns undefined when pokemon parameter is empty", async () => {
      global.fetch = vi.fn();
      const result = await fetchPokemon("");
      expect(global.fetch).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("handles fetch failure gracefully and returns undefined", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
      const result = await fetchPokemon("unknown-pokemon");
      expect(result).toBeUndefined();
    });
  });

  describe("fetchPokemons", () => {
    it("fetches a list of pokemons with default limit and offset", async () => {
      const mockData = { count: 100, results: [{ name: "bulbasaur" }] };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await fetchPokemons();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0"
      );
      expect(result).toEqual(mockData);
    });

    it("fetches a list of pokemons with custom limit and offset", async () => {
      const mockData = { count: 100, results: [{ name: "charmander" }] };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await fetchPokemons(18, 36);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon?limit=18&offset=36"
      );
      expect(result).toEqual(mockData);
    });

    it("handles fetch failure gracefully and returns undefined", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
      const result = await fetchPokemons(18, 0);
      expect(result).toBeUndefined();
    });
  });

  describe("fetchAllPokemonNames", () => {
    it("fetches all pokemon names successfully", async () => {
      const mockData = {
        count: 1302,
        results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
      };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      const result = await fetchAllPokemonNames();
      expect(global.fetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon?limit=10000"
      );
      expect(result).toEqual(mockData);
    });

    it("handles fetch failure gracefully and returns undefined", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
      const result = await fetchAllPokemonNames();
      expect(result).toBeUndefined();
    });
  });

  describe("fetchPokemonData", () => {
    it("fetches pokemon data from url with signal successfully", async () => {
      const mockData = { id: 25, name: "pikachu" };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      const controller = new AbortController();
      const result = await fetchPokemonData(
        "https://pokeapi.co/api/v2/pokemon/25/",
        controller.signal
      );
      expect(global.fetch).toHaveBeenCalledWith(
        "https://pokeapi.co/api/v2/pokemon/25/",
        { signal: controller.signal }
      );
      expect(result).toEqual(mockData);
    });

    it("logs and throws when fetch is aborted with AbortError", async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      global.fetch = vi.fn().mockRejectedValue(abortError);
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await expect(
        fetchPokemonData("https://pokeapi.co/api/v2/pokemon/1/")
      ).rejects.toThrow("The operation was aborted");

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Request aborted:",
        "https://pokeapi.co/api/v2/pokemon/1/"
      );
    });

    it("logs and re-throws when fetch fails with general error", async () => {
      const networkError = new Error("Server unavailable");
      global.fetch = vi.fn().mockRejectedValue(networkError);
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        fetchPokemonData("https://pokeapi.co/api/v2/pokemon/1/")
      ).rejects.toThrow("Server unavailable");

      expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
    });
  });
});
