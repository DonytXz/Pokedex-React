import Image from "./Image";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import { isGreater } from "../helpers/isGreater";

const PokemonItem = (props) => {
  const { pokemon, page, setPage, setHidden, setClickedPokemon } = props;
  const [flag, setFlag] = useState(true);

  //Set the clicket pokemon
  const assignValue = () => {
    setClickedPokemon(pokemon.name);
    setFlag(false);
  };

  useEffect(() => {
    if (!flag) setHidden(flag);
  }, [flag]);

  return (
    <>
      <div
        onClick={assignValue}
        className="w-full h-full bg-white capitalize p-4 border-6 border-white rounded-tl-2xl rounded-br-2xl"
      >
        <div className="w-full h-2/3  p-2 mb-2 md:mb-4">
          <Image path={pokemon.sprites} alt={pokemon.name} />
        </div>
        <div className="w-full h-1/3>">
          <h2 className="font-sans text-center text-xl truncate font-bold">
            {pokemon.name}
          </h2>
          <p className="font-sans text-center text-gray-600">
            {isGreater(pokemon.id)}
            {pokemon.id}
          </p>
        </div>
      </div>
    </>
  );
};

export default PokemonItem;
