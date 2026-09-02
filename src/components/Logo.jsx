import React from "react";
import PokemonLogo from "../assets/img/logo-pokemon.png";

const Logo = () => {
  return (
    <header className="w-full p-6 md:p-10 flex flex-col items-center">
      <h1 className="flex flex-col items-center">
        <span className="sr-only">Pokédex</span>
        <img
          className="mx-auto mb-4"
          src={PokemonLogo}
          alt="Pokémon"
        />
      </h1>
    </header>
  );
};

export default Logo;

