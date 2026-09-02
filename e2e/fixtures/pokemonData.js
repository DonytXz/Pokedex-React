export const mockPokemonList = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=18&limit=18",
  previous: null,
  results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
    { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
    { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
    { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
    { name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/" },
    { name: "caterpie", url: "https://pokeapi.co/api/v2/pokemon/10/" },
    { name: "metapod", url: "https://pokeapi.co/api/v2/pokemon/11/" },
    { name: "butterfree", url: "https://pokeapi.co/api/v2/pokemon/12/" },
    { name: "weedle", url: "https://pokeapi.co/api/v2/pokemon/13/" },
    { name: "kakuna", url: "https://pokeapi.co/api/v2/pokemon/14/" },
    { name: "beedrill", url: "https://pokeapi.co/api/v2/pokemon/15/" },
    { name: "pidgey", url: "https://pokeapi.co/api/v2/pokemon/16/" },
    { name: "pidgeotto", url: "https://pokeapi.co/api/v2/pokemon/17/" },
    { name: "pidgeot", url: "https://pokeapi.co/api/v2/pokemon/18/" },
  ],
};

export const mockPokemonPage2 = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=36&limit=18",
  previous: "https://pokeapi.co/api/v2/pokemon?offset=0&limit=18",
  results: [
    { name: "rattata", url: "https://pokeapi.co/api/v2/pokemon/19/" },
    { name: "raticate", url: "https://pokeapi.co/api/v2/pokemon/20/" },
    { name: "spearow", url: "https://pokeapi.co/api/v2/pokemon/21/" },
    { name: "fearow", url: "https://pokeapi.co/api/v2/pokemon/22/" },
    { name: "ekans", url: "https://pokeapi.co/api/v2/pokemon/23/" },
    { name: "arbok", url: "https://pokeapi.co/api/v2/pokemon/24/" },
    { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
    { name: "raichu", url: "https://pokeapi.co/api/v2/pokemon/26/" },
    { name: "sandshrew", url: "https://pokeapi.co/api/v2/pokemon/27/" },
    { name: "sandslash", url: "https://pokeapi.co/api/v2/pokemon/28/" },
    { name: "nidoran-f", url: "https://pokeapi.co/api/v2/pokemon/29/" },
    { name: "nidorina", url: "https://pokeapi.co/api/v2/pokemon/30/" },
    { name: "nidoqueen", url: "https://pokeapi.co/api/v2/pokemon/31/" },
    { name: "nidoran-m", url: "https://pokeapi.co/api/v2/pokemon/32/" },
    { name: "nidorino", url: "https://pokeapi.co/api/v2/pokemon/33/" },
    { name: "nidoking", url: "https://pokeapi.co/api/v2/pokemon/34/" },
    { name: "clefairy", url: "https://pokeapi.co/api/v2/pokemon/35/" },
    { name: "clefable", url: "https://pokeapi.co/api/v2/pokemon/36/" },
  ],
};

export const mockAllPokemonNames = {
  count: 1302,
  results: [
    ...mockPokemonList.results,
    ...mockPokemonPage2.results,
    { name: "mewtwo", url: "https://pokeapi.co/api/v2/pokemon/150/" },
    { name: "mew", url: "https://pokeapi.co/api/v2/pokemon/151/" },
  ],
};

const createMockPokemon = (id, name, types = ["grass", "poison"], height = 7, weight = 69) => ({
  id,
  name,
  height,
  weight,
  sprites: {
    other: {
      "official-artwork": {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      },
    },
    front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  },
  types: types.map((t) => ({ type: { name: t } })),
  stats: [
    { base_stat: 45, stat: { name: "hp" } },
    { base_stat: 49, stat: { name: "attack" } },
    { base_stat: 49, stat: { name: "defense" } },
    { base_stat: 65, stat: { name: "special-attack" } },
    { base_stat: 65, stat: { name: "special-defense" } },
    { base_stat: 45, stat: { name: "speed" } },
  ],
  species: {
    name,
    url: `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
  },
});

export const mockPokemonDetails = {
  1: createMockPokemon(1, "bulbasaur", ["grass", "poison"], 7, 69),
  2: createMockPokemon(2, "ivysaur", ["grass", "poison"], 10, 130),
  3: createMockPokemon(3, "venusaur", ["grass", "poison"], 20, 1000),
  4: createMockPokemon(4, "charmander", ["fire"], 6, 85),
  5: createMockPokemon(5, "charmeleon", ["fire"], 11, 190),
  6: createMockPokemon(6, "charizard", ["fire", "flying"], 17, 905),
  7: createMockPokemon(7, "squirtle", ["water"], 5, 90),
  8: createMockPokemon(8, "wartortle", ["water"], 10, 225),
  9: createMockPokemon(9, "blastoise", ["water"], 16, 855),
  10: createMockPokemon(10, "caterpie", ["bug"], 3, 29),
  11: createMockPokemon(11, "metapod", ["bug"], 7, 99),
  12: createMockPokemon(12, "butterfree", ["bug", "flying"], 11, 320),
  13: createMockPokemon(13, "weedle", ["bug", "poison"], 3, 32),
  14: createMockPokemon(14, "kakuna", ["bug", "poison"], 6, 100),
  15: createMockPokemon(15, "beedrill", ["bug", "poison"], 10, 295),
  16: createMockPokemon(16, "pidgey", ["normal", "flying"], 3, 18),
  17: createMockPokemon(17, "pidgeotto", ["normal", "flying"], 11, 300),
  18: createMockPokemon(18, "pidgeot", ["normal", "flying"], 15, 395),
  19: createMockPokemon(19, "rattata", ["normal"], 3, 35),
  20: createMockPokemon(20, "raticate", ["normal"], 7, 185),
  21: createMockPokemon(21, "spearow", ["normal", "flying"], 3, 20),
  22: createMockPokemon(22, "fearow", ["normal", "flying"], 12, 380),
  23: createMockPokemon(23, "ekans", ["poison"], 20, 69),
  24: createMockPokemon(24, "arbok", ["poison"], 35, 650),
  25: createMockPokemon(25, "pikachu", ["electric"], 4, 60),
  26: createMockPokemon(26, "raichu", ["electric"], 8, 300),
  27: createMockPokemon(27, "sandshrew", ["ground"], 6, 120),
  28: createMockPokemon(28, "sandslash", ["ground"], 10, 295),
  29: createMockPokemon(29, "nidoran-f", ["poison"], 4, 70),
  30: createMockPokemon(30, "nidorina", ["poison"], 8, 200),
  31: createMockPokemon(31, "nidoqueen", ["poison", "ground"], 13, 600),
  32: createMockPokemon(32, "nidoran-m", ["poison"], 5, 90),
  33: createMockPokemon(33, "nidorino", ["poison"], 9, 195),
  34: createMockPokemon(34, "nidoking", ["poison", "ground"], 14, 620),
  35: createMockPokemon(35, "clefairy", ["fairy"], 6, 75),
  36: createMockPokemon(36, "clefable", ["fairy"], 13, 400),
  150: createMockPokemon(150, "mewtwo", ["psychic"], 20, 1220),
  151: createMockPokemon(151, "mew", ["psychic"], 4, 40),
};

export const mockSpeciesData = {
  1: {
    flavor_text_entries: [
      {
        flavor_text: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
        language: { name: "en" },
      },
    ],
    genera: [{ genus: "Seed Pokémon", language: { name: "en" } }],
  },
  4: {
    flavor_text_entries: [
      {
        flavor_text: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
        language: { name: "en" },
      },
    ],
    genera: [{ genus: "Lizard Pokémon", language: { name: "en" } }],
  },
  25: {
    flavor_text_entries: [
      {
        flavor_text: "When several of these Pokémon gather, their electricity could build and cause lightning storms.",
        language: { name: "en" },
      },
    ],
    genera: [{ genus: "Mouse Pokémon", language: { name: "en" } }],
  },
};
