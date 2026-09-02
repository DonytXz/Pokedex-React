import Image from "./Image";
import React from "react";
import { isGreater } from "../helpers/isGreater";
import Types from "./Types";

const PokemonItem = (props) => {
  const { pokemon, page, setPage, setcloseMdoal, setClickedPokemon, isList } = props;

  //Set the clicket pokemon
  const assignValue = () => {
    setClickedPokemon(pokemon.name);
    if (typeof setcloseMdoal === "function") setcloseMdoal(false);
  };

  return (
    <>
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
          className="w-full bg-white capitalize p-4 border-6 border-white rounded-tl-2xl rounded-br-2xl cursor-pointer hover:shadow-lg transition-shadow flex flex-row items-center text-left focus-visible:ring-4 focus-visible:ring-green-600 focus-visible:outline-none"
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
              Height: <span className="font-normal">{pokemon.height}m</span>
            </p>
            <p className="font-sans text-left text-md capitalize font-bold text-gray-700">
              Weight: <span className="font-normal">{pokemon.weight}kg</span>
            </p>
          </div>
        </button>
      )}
    </>
  );
};

export default PokemonItem;
