import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchPokemon,
  fetchPokemons,
  fetchAllPokemonNames,
  fetchPokemonData,
  calculateBaseStatTotal,
  fetchMostPowerfulPokemons,
  clearCache,
} from "./getPokemon";

describe("getPokemon service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearCache();
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

  describe("calculateBaseStatTotal", () => {
    it("sums up base stats correctly", () => {
      const pokemon = {
        stats: [
          { base_stat: 100 },
          { base_stat: 120 },
          { base_stat: 90 },
          { base_stat: 150 },
          { base_stat: 90 },
          { base_stat: 130 },
        ],
      };
      expect(calculateBaseStatTotal(pokemon)).toBe(680);
    });

    it("returns 0 for null, undefined or invalid stats", () => {
      expect(calculateBaseStatTotal(null)).toBe(0);
      expect(calculateBaseStatTotal({})).toBe(0);
      expect(calculateBaseStatTotal({ stats: null })).toBe(0);
    });
  });

  describe("fetchMostPowerfulPokemons", () => {
    it("sorts pokemon list by total base stats descending and limits output", async () => {
      const mewtwoData = {
        id: 150,
        name: "mewtwo",
        stats: [
          { base_stat: 106 },
          { base_stat: 110 },
          { base_stat: 90 },
          { base_stat: 154 },
          { base_stat: 90 },
          { base_stat: 130 },
        ], // 680
      };

      const pikachuData = {
        id: 25,
        name: "pikachu",
        stats: [
          { base_stat: 35 },
          { base_stat: 55 },
          { base_stat: 40 },
          { base_stat: 50 },
          { base_stat: 50 },
          { base_stat: 90 },
        ], // 320
      };

      const rayquazaData = {
        id: 384,
        name: "rayquaza",
        stats: [
          { base_stat: 105 },
          { base_stat: 150 },
          { base_stat: 90 },
          { base_stat: 150 },
          { base_stat: 90 },
          { base_stat: 95 },
        ], // 680
      };

      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes("mewtwo")) {
          return Promise.resolve({ json: () => Promise.resolve(mewtwoData) });
        }
        if (url.includes("pikachu")) {
          return Promise.resolve({ json: () => Promise.resolve(pikachuData) });
        }
        if (url.includes("rayquaza") || url.includes("384")) {
          return Promise.resolve({ json: () => Promise.resolve(rayquazaData) });
        }
        return Promise.resolve({ json: () => Promise.resolve(null) });
      });

      const result = await fetchMostPowerfulPokemons(
        [
          "pikachu",
          { name: "mewtwo" },
          { url: "https://pokeapi.co/api/v2/pokemon/384/" },
          null,
        ],
        2
      );

      expect(result).toHaveLength(2);
      expect(result[0].totalStats).toBe(680);
      expect(result[1].totalStats).toBe(680);
    });

    it("returns empty array when pokemonList is empty or invalid", async () => {
      expect(await fetchMostPowerfulPokemons([])).toEqual([]);
      expect(await fetchMostPowerfulPokemons(null)).toEqual([]);
    });

    it("handles fetch errors gracefully and returns empty array", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network failure"));
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await fetchMostPowerfulPokemons(["mewtwo"]);
      expect(result).toEqual([]);
    });
  });

  describe("caching behavior", () => {
    it("returns cached data on subsequent fetchPokemon calls without calling fetch again", async () => {
      const mockData = { id: 25, name: "pikachu" };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      const firstResult = await fetchPokemon("pikachu");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(firstResult).toEqual(mockData);

      const secondResult = await fetchPokemon("pikachu");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(secondResult).toEqual(mockData);
    });

    it("returns cached data on subsequent fetchPokemons calls", async () => {
      const mockData = { count: 10, results: [{ name: "pikachu" }] };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchPokemons(18, 0);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const cached = await fetchPokemons(18, 0);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(cached).toEqual(mockData);
    });

    it("returns cached data on subsequent fetchPokemonData calls", async () => {
      const mockData = { id: 1, name: "bulbasaur" };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchPokemonData("https://pokeapi.co/api/v2/pokemon/1/");
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const cached = await fetchPokemonData("https://pokeapi.co/api/v2/pokemon/1/");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(cached).toEqual(mockData);
    });

    it("re-fetches after clearCache is called", async () => {
      const mockData = { id: 7, name: "squirtle" };
      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockData),
      });

      await fetchPokemon("squirtle");
      expect(global.fetch).toHaveBeenCalledTimes(1);

      clearCache();

      await fetchPokemon("squirtle");
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });
});
