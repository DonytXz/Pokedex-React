import React from "react";
import { ALL_POKEMON_TYPES } from "../services/getPokemon";

export const GENERATIONS = [
  { id: "all", name: "All Generations", range: [1, 1025] },
  { id: "1", name: "Gen I (Kanto)", range: [1, 151] },
  { id: "2", name: "Gen II (Johto)", range: [152, 251] },
  { id: "3", name: "Gen III (Hoenn)", range: [252, 386] },
  { id: "4", name: "Gen IV (Sinnoh)", range: [387, 493] },
  { id: "5", name: "Gen V (Unova)", range: [494, 649] },
  { id: "6", name: "Gen VI (Kalos)", range: [650, 721] },
  { id: "7", name: "Gen VII (Alola)", range: [722, 809] },
  { id: "8", name: "Gen VIII (Galar)", range: [810, 905] },
  { id: "9", name: "Gen IX (Paldea)", range: [906, 1025] },
];

const Filters = ({
  selectedGen = "all",
  onSelectGen,
  selectedType = "all",
  onSelectType,
  isFavoritesOnly = false,
  onToggleFavorites,
  favoritesCount = 0,
  onResetFilters,
}) => {
  const isAnyFilterActive =
    selectedGen !== "all" || selectedType !== "all" || isFavoritesOnly;

  return (
    <div
      role="region"
      aria-label="Filter Pokémon"
      className="w-full flex flex-wrap items-center justify-between gap-2.5 py-2 px-1 text-sm"
    >
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Generation Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="gen-filter" className="font-semibold text-gray-700 text-xs">
            Region:
          </label>
          <select
            id="gen-filter"
            value={selectedGen}
            onChange={(e) => onSelectGen && onSelectGen(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 shadow-sm hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
          >
            {GENERATIONS.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.name}
              </option>
            ))}
          </select>
        </div>

        {/* Elemental Type Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="type-filter" className="font-semibold text-gray-700 text-xs">
            Type:
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => onSelectType && onSelectType(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize text-gray-800 shadow-sm hover:border-gray-400 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
          >
            <option value="all">All Types</option>
            {ALL_POKEMON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Favorites Filter Quick Toggle */}
        <button
          type="button"
          onClick={() => onToggleFavorites && onToggleFavorites()}
          aria-pressed={isFavoritesOnly}
          aria-label={
            isFavoritesOnly
              ? "Show all Pokémon"
              : `Show ${favoritesCount} favorite Pokémon`
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition duration-150 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
            isFavoritesOnly
              ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span aria-hidden="true">{isFavoritesOnly ? "❤️" : "🤍"}</span>
          <span>Favorites ({favoritesCount})</span>
        </button>

        {/* Reset Filters */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={() => onResetFilters && onResetFilters()}
            aria-label="Reset all filters"
            className="text-xs font-semibold text-gray-600 hover:text-red-600 px-2 py-1.5 underline decoration-dotted focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
          >
            Clear Filters ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
