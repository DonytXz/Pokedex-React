import React, { useState, useEffect } from "react";
import Grid from "../components/Grid";
import Logo from "../components/Logo";
import Search from "../components/Search";
import { fetchPokemon } from "../services/getPokemon";
import Modal from "../components/Modal";

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [sharedPageVal, setSharedPageVal] = useState();
  const [closeMdoal, setCloseModal] = useState(true);
  const [pokemonModalVal, setPokemonModalVal] = useState();
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  const getPokemon = async (query) => {
    const data = await fetchPokemon(query);
    if (pokemonModalVal) {
      setPokemonDetails(data);
    } else {
      setPokemon(data);
    }
    // console.log({ data });
    setLoading(false);
  };
  useEffect(() => {
    getPokemon(pokemonModalVal);
  }, [pokemonModalVal, closeMdoal, searched, sharedPageVal]);
  return (
    <>
      {!closeMdoal && (
        <div className="absolute w-full h-full z-50">
          <Modal
            loading={loading}
            setCloseModal={setCloseModal}
            pokemon={pokemonDetails}
            closeMdoal={closeMdoal}
          />
        </div>
      )}

      <div
        className={`w-full  oververflow-auto ${
          closeMdoal ? "" : "absolute bg-green-600 opacity-40"
        } `}
      >
        <div className={`w-full h-full relative`}>
          <Logo />
          {/* <Search setSearched={setSearched} getPokemon={getPokemon} /> */}
          <Search setSearched={setSearched} getPokemon={getPokemon} />
          {loading ? (
            <div className="flex w-screen h-full">
              <p className="w-1/2 text-4xl font-bold">Loadding pokemons...</p>
            </div>
          ) : (
            <Grid
              setSharedPageVal={setSharedPageVal}
              setPokemonModalVal={setPokemonModalVal}
              searched={searched}
              setcloseMdoal={setCloseModal}
              pokemon={pokemon}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;