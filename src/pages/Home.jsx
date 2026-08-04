import React, { useState, useEffect } from "react";
import Grid from "../components/Grid";
import Logo from "../components/Logo";
import Search from "../components/Search";
import { fetchPokemon } from "../services/getPokemon";
import Modal from "../components/Modal";
import Butons from "../components/Butons";
import PokePattern from "../assets/img/pokepattern.jpg";

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [sharedPageVal, setSharedPageVal] = useState();
  const [closeMdoal, setCloseModal] = useState(true);
  const [pokemonModalVal, setPokemonModalVal] = useState();
  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isList, setIslist] = useState(true);
  const [isGrid, setIsGrid] = useState(false);

  const searchPokemon = async (query) => {
    if (!query) {
      setSearched(false);
      setPokemon([]);
      setSearchLoading(false);
      return;
    }

    setSearched(true);
    setSearchLoading(true);
    const data = await fetchPokemon(query);
    setPokemon(data || null);
    setSearchLoading(false);
  };

  const loadPokemonDetails = async (query) => {
    if (!query) return;

    setPokemonDetails(null);
    const data = await fetchPokemon(query);
    setPokemonDetails(data || null);
  };

  useEffect(() => {
    if (!pokemonModalVal) return;
    loadPokemonDetails(pokemonModalVal);
  }, [pokemonModalVal]);
  return (
    <>
      {!closeMdoal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            aria-hidden="true"
          />
          <div className="relative w-full h-full">
            <Modal
              setCloseModal={setCloseModal}
              pokemon={pokemonDetails}
              closeMdoal={closeMdoal}
            />
          </div>
        </div>
      )}

      <div
        className="w-full min-h-screen overflow-auto"
        style={{
          backgroundColor: "#f8f8f8",
          backgroundImage: `url(${PokePattern})`,
          backgroundRepeat: "repeat",
        }}
      >
        <div className={`w-full h-full relative`}>
          <Logo />

          <div className="w-3/4 flex flex-row mx-auto mb-4">
            <Butons
              isList={isList}
              setIslist={setIslist}
              setIsGrid={setIsGrid}
            />
            <Search setSearched={setSearched} getPokemon={searchPokemon} />
          </div>

          <Grid
           isList={isList}
           // isGrid={isGrid}
           setSharedPageVal={setSharedPageVal}
           setPokemonModalVal={setPokemonModalVal}
           searched={searched}
           searchLoading={searchLoading}
           setcloseMdoal={setCloseModal}
           pokemon={pokemon}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
