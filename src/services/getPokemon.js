const memoryCache = new Map();

const getFromStorage = (key) => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  } catch {
    return null;
  }
  return null;
};

const saveToStorage = (key, data) => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    }
  } catch {
    // Ignore storage quota or security errors
  }
};

export const clearCache = () => {
  memoryCache.clear();
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.clear();
    }
  } catch {}
};

export const fetchPokemon = async (pokemon) => {
  try {
    if (!pokemon || pokemon.length === 0) return;

    const cacheKey = `pokeapi:pokemon:${pokemon.toLowerCase()}`;
    const cached = memoryCache.get(cacheKey) || getFromStorage(cacheKey);
    if (cached) {
      memoryCache.set(cacheKey, cached);
      return cached;
    }

    const baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    const response = await fetch(baseUrl);
    const data = await response.json();

    if (data) {
      memoryCache.set(cacheKey, data);
      saveToStorage(cacheKey, data);
    }
    return data;
  } catch (err) {}
};

export const fetchPokemons = async (limit = 25, offset = 0) => {
  try {
    const cacheKey = `pokeapi:list:${limit}:${offset}`;
    const cached = memoryCache.get(cacheKey) || getFromStorage(cacheKey);
    if (cached) {
      memoryCache.set(cacheKey, cached);
      return cached;
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      memoryCache.set(cacheKey, data);
      saveToStorage(cacheKey, data);
    }
    return data;
  } catch (err) {}
};

export const fetchAllPokemonNames = async () => {
  try {
    const cacheKey = "pokeapi:all_names";
    const cached = memoryCache.get(cacheKey) || getFromStorage(cacheKey);
    if (cached) {
      memoryCache.set(cacheKey, cached);
      return cached;
    }

    const url = `https://pokeapi.co/api/v2/pokemon?limit=10000`;
    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      memoryCache.set(cacheKey, data);
      saveToStorage(cacheKey, data);
    }
    return data;
  } catch (err) {}
};

export const fetchPokemonData = async (url, signal) => {
  const cacheKey = `pokeapi:data:${url}`;
  const cached = memoryCache.get(cacheKey) || getFromStorage(cacheKey);
  if (cached) {
    memoryCache.set(cacheKey, cached);
    return cached;
  }

  try {
    const response = await fetch(url, { signal });
    const data = await response.json();

    if (data) {
      memoryCache.set(cacheKey, data);
      saveToStorage(cacheKey, data);
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request aborted:", url);
    } else {
      console.error(err);
    }
    throw err;
  }
};

export const calculateBaseStatTotal = (pokemon) => {
  if (!pokemon || !Array.isArray(pokemon.stats)) return 0;
  return pokemon.stats.reduce((total, s) => total + (s.base_stat || 0), 0);
};

export const fetchMostPowerfulPokemons = async (pokemonList = [], limit = 10) => {
  try {
    if (!Array.isArray(pokemonList) || pokemonList.length === 0) {
      return [];
    }

    const promises = pokemonList.map(async (item) => {
      const target = typeof item === "string" ? item : item?.name || item?.url;
      if (!target) return null;
      if (typeof target === "string" && target.startsWith("http")) {
        return fetchPokemonData(target);
      }
      return fetchPokemon(target);
    });

    const results = await Promise.all(promises);
    const validPokemons = results.filter(Boolean);

    const sorted = validPokemons
      .map((p) => ({
        ...p,
        totalStats: calculateBaseStatTotal(p),
      }))
      .sort((a, b) => b.totalStats - a.totalStats);

    return limit ? sorted.slice(0, limit) : sorted;
  } catch (err) {
    console.error(err);
  }
};

export const fetchEvolutionChain = async (url) => {
  if (!url) return null;
  return fetchPokemonData(url);
};

export const fetchTypeData = async (typeName) => {
  if (!typeName) return null;
  const normalized = typeName.toLowerCase();
  const url = `https://pokeapi.co/api/v2/type/${normalized}`;
  return fetchPokemonData(url);
};

export const fetchTypePokemons = async (typeName) => {
  try {
    const data = await fetchTypeData(typeName);
    if (!data || !Array.isArray(data.pokemon)) return [];
    return data.pokemon.map((item) => item.pokemon);
  } catch (err) {
    console.error(`Error fetching Pokémon for type ${typeName}:`, err);
    return [];
  }
};

export const ALL_POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export const calculateTypeMatchups = (pokemonTypes = [], typeDataList = []) => {
  const multipliers = {};
  ALL_POKEMON_TYPES.forEach((t) => {
    multipliers[t] = 1.0;
  });

  typeDataList.forEach((td) => {
    if (!td || !td.damage_relations) return;
    const { double_damage_from, half_damage_from, no_damage_from } = td.damage_relations;

    double_damage_from?.forEach((t) => {
      if (multipliers[t.name] !== undefined) {
        multipliers[t.name] *= 2.0;
      }
    });

    half_damage_from?.forEach((t) => {
      if (multipliers[t.name] !== undefined) {
        multipliers[t.name] *= 0.5;
      }
    });

    no_damage_from?.forEach((t) => {
      if (multipliers[t.name] !== undefined) {
        multipliers[t.name] *= 0.0;
      }
    });
  });

  const weaknesses4x = [];
  const weaknesses2x = [];
  const resistances05x = [];
  const resistances025x = [];
  const immunities0x = [];
  const normal1x = [];

  ALL_POKEMON_TYPES.forEach((typeName) => {
    const m = multipliers[typeName];
    if (m === 4) weaknesses4x.push(typeName);
    else if (m === 2) weaknesses2x.push(typeName);
    else if (m === 0.5) resistances05x.push(typeName);
    else if (m === 0.25) resistances025x.push(typeName);
    else if (m === 0) immunities0x.push(typeName);
    else if (m === 1) normal1x.push(typeName);
  });

  return {
    multipliers,
    weaknesses4x,
    weaknesses2x,
    resistances05x,
    resistances025x,
    immunities0x,
    normal1x,
  };
};
