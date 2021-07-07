import React, { useState, useEffect } from "react";
import Image from "./Image";
import { isGreater } from "../helpers/isGreater";
import { fetchPokemonData } from "../services/getPokemon";
import Types from "./Types";
import Description from "./Description";
import Stats from "./Stats";
import ToggleBtn from "./ToggleBtn";
ToggleBtn;
const modal = (props) => {
  const { setCloseModal, pokemon } = props;
  const [types, setTypes] = useState([]);
  const [clickedBtn, setClickedBtn] = useState(false);
  const [flag, setFlag] = useState();
  const [species, setSpecies] = useState();
  const getSpecies = async (query) => {
    const data = await fetchPokemonData(query);
    setSpecies(data);
  };
  //On clcick to show the graph
  const assignValue = () => {
    setFlag(true);
  };

  useEffect(() => {
    getSpecies(species);
    setTypes(pokemon.types);
  }, [pokemon]);
  useEffect(() => {
    if (flag) setCloseModal(flag);
  }, [flag]);
  useEffect(() => {
    setSpecies(pokemon.species);
  }, [pokemon.species]);

  useEffect(() => {
    if (species != undefined) getSpecies(species.url);
  }, [species]);

  return (
    <>
      {pokemon ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-10/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-8 h-3/4 flex flex-col bg-white relative border-2 border-white rounded-md opacity-100">
            <div
              onClick={assignValue}
              className="hover:bg-gray-200 absolute bg-white text-center leading-6 w-6 h-6 p-1 box-content -top-5 -right-5 border-2 rounded-sm"
            >
              <p className="align-middle text-gray-600 font-bold ">X</p>
            </div>
            <div className="w-full h-1/4  mb-2 flex flex-row">
              <div className="w-1/3 h-full flex items-center justify-center">
                <Image
                  className="w-full h-full m-auto"
                  path={pokemon.sprites}
                  alt={pokemon.name}
                />
              </div>
              <div className="w-1/3 h-full flex flex-col items-center justify-center">
                <p className="w-full font-sans text-left text-gray-600">
                  {isGreater(pokemon.id)}
                  {pokemon.id}
                </p>
                <h2 className="w-full font-sans  text-xl capitalize font-bold">
                  {pokemon.name}
                </h2>
                {types != undefined
                  ? types.map((type, index) => {
                      return <Types key={index} type={type.type} />;
                    })
                  : null}
              </div>

              <div className="w-1/3 h-full flex flex-col items-center justify-start">
                <p className="w-full font-sans text-left text-xl capitalize font-bold">
                  Height: <span className="font-normal">{pokemon.height}m</span>
                </p>
                <p className="w-full font-sans text-left text-xl capitalize font-bold">
                  Weight:{" "}
                  <span className="font-normal">{pokemon.weight}kg</span>
                </p>
              </div>
              <Description />
            </div>
            <div className="w-full h-1/4  mb-2">
              <Description species={species} />
            </div>
            <div className="w-full h-2/4">
              <Stats clickedBtn={clickedBtn} pokemon={pokemon} />
            </div>
            <div className="w-full h-1/4 flex flex-row items-center justify-center">
              <div className="mx-2">Chart View</div>
              <div className="mx-2">
                <ToggleBtn
                  clickedBtn={clickedBtn}
                  setClickedBtn={setClickedBtn}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loaging Data...</div>
      )}
    </>
  );
};

export default modal;
