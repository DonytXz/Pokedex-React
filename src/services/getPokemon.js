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
    return [];
  }
};
