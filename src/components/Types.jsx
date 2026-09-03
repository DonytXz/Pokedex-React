import React from "react";

export const TYPE_COLORS = {
  normal: { bg: "#A8A878", text: "#111827" },
  fire: { bg: "#F08030", text: "#111827" },
  water: { bg: "#6890F0", text: "#111827" },
  grass: { bg: "#78C850", text: "#111827" },
  electric: { bg: "#F8D030", text: "#111827" },
  ice: { bg: "#98D8D8", text: "#111827" },
  fighting: { bg: "#C03028", text: "#ffffff" },
  poison: { bg: "#A040A0", text: "#ffffff" },
  ground: { bg: "#E0C068", text: "#111827" },
  flying: { bg: "#A890F0", text: "#111827" },
  psychic: { bg: "#F85888", text: "#111827" },
  bug: { bg: "#A8B820", text: "#111827" },
  rock: { bg: "#B8A038", text: "#111827" },
  ghost: { bg: "#705898", text: "#ffffff" },
  dragon: { bg: "#7038F8", text: "#ffffff" },
  dark: { bg: "#705848", text: "#ffffff" },
  steel: { bg: "#B8B8D0", text: "#111827" },
  fairy: { bg: "#EE99AC", text: "#111827" },
};

const Types = (props) => {
  const { type } = props;
  if (!type?.name) return null;

  const typeName = type.name.toLowerCase();
  const theme = TYPE_COLORS[typeName] || { bg: "#68A090", text: "#111827" };

  return (
    <span
      style={{ backgroundColor: theme.bg, color: theme.text }}
      className="self-start inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm"
    >
      {type.name}
    </span>
  );
};

export default Types;
