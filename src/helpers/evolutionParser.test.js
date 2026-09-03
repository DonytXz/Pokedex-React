import { describe, it, expect } from "vitest";
import {
  extractSpeciesId,
  getPokemonSpriteUrl,
  formatEvolutionTrigger,
  parseEvolutionChain,
} from "./evolutionParser";

describe("evolutionParser helper", () => {
  it("extracts numeric species ID from URL", () => {
    expect(extractSpeciesId("https://pokeapi.co/api/v2/pokemon-species/25/")).toBe(25);
    expect(extractSpeciesId("https://pokeapi.co/api/v2/pokemon-species/133/")).toBe(133);
    expect(extractSpeciesId("invalid-url")).toBe(null);
    expect(extractSpeciesId(null)).toBe(null);
  });

  it("builds official sprite URL", () => {
    expect(getPokemonSpriteUrl(1)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    );
    expect(getPokemonSpriteUrl(null)).toBe("");
  });

  it("formats various evolution triggers correctly", () => {
    expect(formatEvolutionTrigger([])).toBe(null);
    expect(formatEvolutionTrigger([{ min_level: 16 }])).toBe("Lv. 16");
    expect(
      formatEvolutionTrigger([{ item: { name: "thunder-stone" } }])
    ).toBe("thunder stone");
    expect(
      formatEvolutionTrigger([{ min_happiness: 220, time_of_day: "day" }])
    ).toBe("Friendship + Day");
    expect(
      formatEvolutionTrigger([{ trigger: { name: "trade" } }])
    ).toBe("Trade");
  });

  it("parses linear and branching evolution chains", () => {
    const mockBulbasaurChain = {
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
    };

    const parsed = parseEvolutionChain(mockBulbasaurChain);
    expect(parsed.name).toBe("bulbasaur");
    expect(parsed.id).toBe(1);
    expect(parsed.evolvesTo).toHaveLength(1);
    expect(parsed.evolvesTo[0].name).toBe("ivysaur");
    expect(parsed.evolvesTo[0].trigger).toBe("Lv. 16");
    expect(parsed.evolvesTo[0].evolvesTo[0].name).toBe("venusaur");
    expect(parsed.evolvesTo[0].evolvesTo[0].trigger).toBe("Lv. 32");
  });

  it("returns null for invalid chain data", () => {
    expect(parseEvolutionChain(null)).toBe(null);
    expect(parseEvolutionChain({})).toBe(null);
  });
});
