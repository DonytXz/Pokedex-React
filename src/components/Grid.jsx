import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { fetchPokemons, fetchPokemonData } from "../services/getPokemon";

const Grid = (props) => {
  const {
    pokemon,
    setcloseMdoal,
    searched,
    setPokemonModalVal,
    setSharedPageVal,
  } = props;
  const [pokemons, setPokemons] = useState([]);
  const [clickedPokemon, setClickedPokemon] = useState();
  const [hidden, setHidden] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const previusPage = () => {
    // setHidden(false);
    const previusPage = Math.max(page - 1, 0);
    SetPage(previusPage);
  };
  const nextPage = () => {
    // setHidden(false);
    const nextPage = Math.min(page + 1, total - 1);
    setPage(nextPage);
  };
  const firstPage = () => {
    // setHidden(false);
    const firstPage = Math.min(0, total);
    setPage(firstPage);
  };
  const secondPage = () => {
    // setHidden(false);
    const secondPage = Math.min(1, total - 1);
    setPage(secondPage);
  };
  const underLatsPage = () => {
    // setHidden(false);
    const underLatsPage = Math.min(total - 1);
    setPage(underLatsPage);
  };
  const lastPage = () => {
    // setHidden(false);
    const LatsPage = Math.min(total);
    setPage(LatsPage);
  };
  const getPokemons = async () => {
    try {
      setLoading(true);
      const data = await fetchPokemons(18, 18 * page);
      const promises = data.results.map(async (pokemon) => {
        return await fetchPokemonData(pokemon.url);
      });
      const results = await Promise.all(promises);
      setPokemons(results);
      setTotal(Math.floor(data.count / 18));
      setLoading(false);
    } catch (err) {}
  };


  useEffect(() => {
    setcloseMdoal(hidden);
  }, [pokemon, hidden, clickedPokemon]) 
  useEffect(() => {
    getPokemons();
    setPokemonModalVal(clickedPokemon);
    setSharedPageVal(page);
  }, [pokemon, page, hidden, clickedPokemon]);
  // useEffect(() => {
  //   getPokemons();
  //   setcloseMdoal(hidden);
  //   setPokemonModalVal(clickedPokemon);
  //   setSharedPageVal(page);
  // }, [pokemon, page, hidden, clickedPokemon]);
  return (
    <>
      {/* <div className="w-full h-full">
        <Modal hidden={hidden} />
      </div> */}
      <div className="w-full h-full flex flex-col ">
        <div className="w-3/4 h-3/4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-6 justify-items-center mx-auto mb-4">
          {!pokemon ? (
            !loading ? (
              pokemons.map((pokemon, index) => {
                return (
                  <PokemonCard
                    setHidden={setHidden}
                    key={index}
                    page={page}
                    setPage={setPage}
                    pokemon={pokemon}
                    setClickedPokemon={setClickedPokemon}
                  />
                  // </div>
                );
              })
            ) : (
              <></>
            )
          ) : (
            <PokemonCard
              setClickedPokemon={setClickedPokemon}
              setHidden={setHidden}
              pokemon={pokemon}
            />
          )}
        </div>
        <div>
          {loading ? (
            <></>
          ) : (
            <Pagination
              searched={searched}
              onLeftClick={previusPage}
              onRightClick={nextPage}
              firstPage={firstPage}
              secondPage={secondPage}
              underLatsPage={underLatsPage}
              lastPage={lastPage}
              page={page}
              total={total}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Grid;