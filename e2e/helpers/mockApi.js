import {
  mockPokemonList,
  mockPokemonPage2,
  mockAllPokemonNames,
  mockPokemonDetails,
  mockSpeciesData,
} from "../fixtures/pokemonData.js";

/**
 * Intercepts and mocks PokéAPI requests for deterministic, fast E2E testing.
 * @param {import('@playwright/test').Page} page
 */
export async function setupPokeApiMocks(page) {
  await page.route("https://pokeapi.co/api/v2/**", async (route) => {
    const url = route.request().url();

    // 1. All Pokémon names list for search
    if (url.includes("limit=10000")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockAllPokemonNames),
      });
      return;
    }

    // 2. Paginated list
    if (url.includes("/api/v2/pokemon?")) {
      if (url.includes("offset=18")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockPokemonPage2),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockPokemonList),
        });
      }
      return;
    }

    // 3. Species endpoint
    const speciesMatch = url.match(/\/pokemon-species\/(\d+|\w+)/);
    if (speciesMatch) {
      const key = speciesMatch[1];
      const species = mockSpeciesData[key] || {
        flavor_text_entries: [
          {
            flavor_text: "A fascinating Pokémon found in diverse habitats.",
            language: { name: "en" },
          },
        ],
        genera: [{ genus: "Pokémon", language: { name: "en" } }],
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(species),
      });
      return;
    }

    // 4. Individual Pokémon detail endpoint by ID or Name
    const pokemonMatch = url.match(/\/pokemon\/(\d+|\w+)\/?$/);
    if (pokemonMatch) {
      const key = pokemonMatch[1];
      let pokemon = mockPokemonDetails[key];
      if (!pokemon) {
        // Look up by name
        pokemon = Object.values(mockPokemonDetails).find(
          (p) => p.name.toLowerCase() === key.toLowerCase()
        );
      }

      if (pokemon) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(pokemon),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ detail: "Not found." }),
        });
      }
      return;
    }

    // Fallback pass through
    await route.continue();
  });
}
