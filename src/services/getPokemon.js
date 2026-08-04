export const fetchPokemon = async (pokemon) => {
  try {
    let baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    if (pokemon.length > 0) {
      const response = await fetch(baseUrl);
      const data = await response.json();
      return data;
    }
  } catch (err) {}
};

export const fetchPokemons = async (limit = 25, offset = 0) => {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {}
};

export const fetchAllPokemonNames = async () => {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=10000`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {}
};

export const fetchPokemonData = async (url, signal) => {
  try {
    const response = await fetch(url, { signal });
    const data = await response.json();
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Request aborted:', url);
    } else {
      console.error(err);
    }
    throw err;
  }
};
