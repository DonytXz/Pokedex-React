/**
 * Extracts numeric species ID from a PokéAPI species URL.
 * e.g., "https://pokeapi.co/api/v2/pokemon-species/25/" -> 25
 */
export const extractSpeciesId = (url) => {
  if (!url) return null;
  const match = url.match(/\/pokemon-species\/(\d+)\/?/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Generates an official sprite URL from a Pokémon ID.
 */
export const getPokemonSpriteUrl = (id) => {
  if (!id) return "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

/**
 * Formats evolution trigger details into a concise, human-readable label.
 */
export const formatEvolutionTrigger = (details = []) => {
  if (!details || details.length === 0) return null;
  const d = details[0];

  const parts = [];

  if (d.min_level) {
    parts.push(`Lv. ${d.min_level}`);
  }
  if (d.item?.name) {
    parts.push(d.item.name.replace(/-/g, " "));
  }
  if (d.min_happiness) {
    parts.push(`Friendship`);
  }
  if (d.held_item?.name) {
    parts.push(`Hold ${d.held_item.name.replace(/-/g, " ")}`);
  }
  if (d.known_move?.name) {
    parts.push(`Learn ${d.known_move.name.replace(/-/g, " ")}`);
  }
  if (d.time_of_day) {
    parts.push(d.time_of_day === "day" ? "Day" : "Night");
  }
  if (d.trigger?.name === "trade") {
    parts.push("Trade");
  }

  if (parts.length > 0) {
    return parts.join(" + ");
  }

  if (d.trigger?.name) {
    return d.trigger.name.replace(/-/g, " ");
  }

  return "Evolution";
};

/**
 * Recursively parses a PokéAPI evolution chain node into a clean tree structure.
 */
export const parseEvolutionChain = (chainNode) => {
  if (!chainNode || !chainNode.species) return null;

  const id = extractSpeciesId(chainNode.species.url);
  const name = chainNode.species.name;
  const sprite = getPokemonSpriteUrl(id);
  const trigger = formatEvolutionTrigger(chainNode.evolution_details);

  const evolvesTo = Array.isArray(chainNode.evolves_to)
    ? chainNode.evolves_to.map(parseEvolutionChain).filter(Boolean)
    : [];

  return {
    id,
    name,
    sprite,
    trigger,
    evolvesTo,
  };
};
