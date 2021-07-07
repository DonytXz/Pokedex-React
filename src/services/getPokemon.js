export const fetchPokemon = async (pokemon) => {
  try {
    let baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    if (pokemon.length > 0) {
      const response = await fetch(baseUrl);
      const data = await response.json();
      return data;
    }
  } catch (err) {}
};fetchPokemons

export const fetchPokemons = async (limit = 25, offset = 0) => {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {}
};

export const fetchPokemonData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {}
};
