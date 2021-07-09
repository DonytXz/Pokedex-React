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
    isList,
    // isGrid
  } = props;
  const [pokemons, setPokemons] = useState([]);
  const [clickedPokemon, setClickedPokemon] = useState();
  const [hidden, setHidden] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  //Handle the previusPage click
  const previusPage = () => {
    const previusPage = Math.max(page - 1, 0);
    setPage(previusPage);
  };
  //Handle the nextPage click
  const nextPage = () => {
    const nextPage = Math.min(page + 1, total - 1);
    setPage(nextPage);
  };
  //Handle the firstPage click
  const firstPage = () => {
    const firstPage = Math.min(0, total);
    setPage(firstPage);
  };
  //Handle the secondPage click
  const secondPage = () => {
    const secondPage = Math.min(1, total - 1);
    setPage(secondPage);
  };
  //Handle the underLatsPage click
  const underLatsPage = () => {
    const underLatsPage = Math.min(total - 1);
    setPage(underLatsPage);
  };
  //Handle the lastPage click
  const lastPage = () => {
    const LatsPage = Math.min(total);
    setPage(LatsPage);
  };

  //Call the service to get all pokemons
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
  }, [pokemon, hidden, clickedPokemon]);
  useEffect(() => {
    getPokemons();
    setPokemonModalVal(clickedPokemon);
    setSharedPageVal(page);
  }, [pokemon, page, hidden, clickedPokemon]);

  return (
    <>
      <div className="w-full h-full flex flex-col ">
        <div className={`w-3/4 h-3/4 grid justify-items-center mx-auto mb-4 ${isList ? " grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-6" : "grid-flow-row gap-y-4"}`}>
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
