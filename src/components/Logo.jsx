import React from "react";
import PokemonLogo from "../assets/img/logo-pokemon.png";

const Logo = () => {
  return (
    <>
      <div className="w-full  p-10 flex flex-col">
        <img
          className="mx-auto mb-4"
          src={PokemonLogo}
          alt="Pokemon Logo"
        />
      </div>
    </>
  );
};

export default Logo;
