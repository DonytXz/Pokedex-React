import Image from "./Image";
import React from "react";
import { isGreater } from "../helpers/isGreater";
import Types from "./Types";

const PokemonItem = (props) => {
  const {
    pokemon,
    page,
    setPage,
    setcloseMdoal,
    setClickedPokemon,
    isList,
    isFavorite,
    onToggleFavorite,
    isInTeam,
    onToggleTeam,
  } = props;

  //Set the clicket pokemon
  const assignValue = () => {
    setClickedPokemon(pokemon.name);
    if (typeof setcloseMdoal === "function") setcloseMdoal(false);
  };

  return (
    <div className="relative w-full h-full group">
      {isList ? (
        // Grid View
        <button
          type="button"
          onClick={assignValue}
          aria-label={`View details for ${pokemon.name}, number ${isGreater(pokemon.id)}${pokemon.id}`}
          className="w-full h-full bg-white capitalize p-4 border-6 border-white rounded-tl-2xl rounded-br-2xl cursor-pointer hover:shadow-lg transition-shadow text-left focus-visible:ring-4 focus-visible:ring-green-600 focus-visible:outline-none"
        >
          <div className="w-full h-2/3 p-2 mb-2 md:mb-4">
            <Image path={pokemon.sprites} alt="" />
          </div>
          <div className="w-full h-1/3">
            <h2 className="font-sans text-center text-xl truncate font-bold">
              {pokemon.name}
            </h2>
            <p className="font-sans text-center text-gray-600">
              {isGreater(pokemon.id)}
              {pokemon.id}
            </p>
          </div>
        </button>
      ) : (
        // List View
        <button
          type="button"
          onClick={assignValue}
          aria-label={`View details for ${pokemon.name}, number ${isGreater(pokemon.id)}${pokemon.id}`}
          className="w-full bg-white capitalize p-4 border-6 border-white rounded-tl-2xl rounded-br-2xl cursor-pointer hover:shadow-lg transition-shadow flex flex-row items-center text-left focus-visible:ring-4 focus-visible:ring-green-600 focus-visible:outline-none pr-20"
        >
          <div className="w-1/4 h-24 p-2 flex-shrink-0">
            <Image path={pokemon.sprites} alt="" className="h-full object-contain mx-auto" />
          </div>
          <div className="w-1/3 flex flex-col justify-center px-4 border-r-2 border-gray-100">
            <p className="font-sans text-left text-gray-500 font-semibold">
              {isGreater(pokemon.id)}
              {pokemon.id}
            </p>
            <h2 className="font-sans text-left text-2xl font-bold truncate">
              {pokemon.name}
            </h2>
          </div>
          <div className="w-1/4 flex flex-col justify-center px-4 border-r-2 border-gray-100 items-start">
            <p className="text-sm text-gray-500 mb-1">Types:</p>
            <div className="flex flex-row flex-wrap gap-1">
              {pokemon.types && pokemon.types.map((t, i) => (
                <Types key={i} type={t.type} />
              ))}
            </div>
          </div>
          <div className="w-1/4 flex flex-col justify-center pl-4">
            <p className="font-sans text-left text-md capitalize font-bold text-gray-700">
              Height: <span className="font-normal">{pokemon.height != null ? `${(pokemon.height / 10).toFixed(1)}m` : "--"}</span>
            </p>
            <p className="font-sans text-left text-md capitalize font-bold text-gray-700">
              Weight: <span className="font-normal">{pokemon.weight != null ? `${(pokemon.weight / 10).toFixed(1)}kg` : "--"}</span>
            </p>
          </div>
        </button>
      )}

      {/* Quick Action Overlay (Favorite & Team) */}
      {(onToggleTeam || onToggleFavorite) && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {onToggleTeam && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleTeam(pokemon);
              }}
              aria-label={
                isInTeam
                  ? `Remove ${pokemon.name} from battle team`
                  : `Add ${pokemon.name} to battle team`
              }
              aria-pressed={isInTeam}
              title={isInTeam ? "Remove from team" : "Add to team"}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
                isInTeam
                  ? "bg-green-600 text-white"
                  : "bg-white/90 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200"
              }`}
            >
              {isInTeam ? "✓" : "+"}
            </button>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(pokemon);
              }}
              aria-label={
                isFavorite
                  ? `Remove ${pokemon.name} from favorites`
                  : `Add ${pokemon.name} to favorites`
              }
              aria-pressed={isFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center text-xs shadow-sm transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none"
            >
              <span aria-hidden="true">{isFavorite ? "❤️" : "🤍"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonItem;
