import { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import { fetchPokemons, fetchPokemonData } from "../services/getPokemon";
import PokeballLoader from "./loaders/PokeballLoader";
import SkeletonCard from "./loaders/SkeletonCard";

const Grid = (props) => {
  const {
    pokemon,
    setcloseMdoal,
    searched,
    searchLoading,
    setPokemonModalVal,
    setSharedPageVal,
    isList,
    favorites = [],
    onToggleFavorite,
    team = [],
    onToggleTeam,
    onPokemonsLoaded,
    page: propPage,
    setPage: propSetPage,
  } = props;
  const [pokemons, setPokemons] = useState([]);
  const [clickedPokemon, setClickedPokemon] = useState();
  const [internalPage, setInternalPage] = useState(0);
  const page = propPage !== undefined ? propPage : internalPage;
  const setPage = propSetPage || setInternalPage;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Pagination handlers
  const previusPage = () => setPage(Math.max(page - 1, 0));
  const nextPage = () => setPage(Math.min(page + 1, total - 1));
  const firstPage = () => setPage(Math.min(0, total));
  const secondPage = () => setPage(Math.min(1, total - 1));
  const underLatsPage = () => setPage(Math.min(total - 1));
  const lastPage = () => setPage(Math.min(total));

  // Call the service to get all pokemons
  const getPokemons = async () => {
    try {
      setLoading(true);
      const data = await fetchPokemons(18, 18 * page);
      const promises = data.results.map(async (p) => fetchPokemonData(p.url));
      const results = await Promise.all(promises);
      setPokemons(results);
      const totalPages = Math.floor(data.count / 18);
      setTotal(totalPages);
      if (typeof onPokemonsLoaded === "function") {
        onPokemonsLoaded(results, totalPages);
      }
    } catch (err) {
      console.error("Failed to load pokemons:", err);
      setPokemons([]);
      if (typeof onPokemonsLoaded === "function") {
        onPokemonsLoaded([], 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clickedPokemon) {
      setPokemonModalVal(clickedPokemon);
    }
  }, [clickedPokemon, setPokemonModalVal]);

  useEffect(() => {
    if (!searched) {
      getPokemons();
      setSharedPageVal(page);
    }
  }, [page, searched, setSharedPageVal]);

  const hasSearchResult = searched && Array.isArray(pokemon) && pokemon.length > 0;
  const isInitialLoad = loading && !searched && pokemons.length === 0;
  const showSkeleton = (searched && searchLoading) || (loading && pokemons.length > 0 && !searched);

  const isFav = (p) =>
    favorites.some((fav) =>
      typeof fav === "string"
        ? fav.toLowerCase() === p?.name?.toLowerCase()
        : fav?.id === p?.id || fav?.name === p?.name
    );

  const inTeam = (p) =>
    team.some((t) => t?.id === p?.id || t?.name === p?.name);

  const renderGridContent = () => {
    if (isInitialLoad) {
      return (
        <div className="col-span-full w-full">
          <PokeballLoader />
        </div>
      );
    }

    if (showSkeleton) {
      return Array.from({ length: 18 }).map((_, index) => (
        <SkeletonCard key={index} />
      ));
    }

    if (searched) {
      if (!hasSearchResult) {
        return (
          <div
            role="status"
            aria-live="polite"
            className="col-span-full w-full text-center py-10 text-gray-700 text-lg font-medium"
          >
            No Pokémon found.
          </div>
        );
      }

      return pokemon.map((pokemonItem, index) => (
        <PokemonCard
          isList={isList}
          setcloseMdoal={setcloseMdoal}
          setClickedPokemon={setClickedPokemon}
          key={pokemonItem.name || index}
          pokemon={pokemonItem}
          isFavorite={isFav(pokemonItem)}
          onToggleFavorite={onToggleFavorite}
          isInTeam={inTeam(pokemonItem)}
          onToggleTeam={onToggleTeam}
        />
      ));
    }

    if (pokemons.length > 0) {
      return pokemons.map((pokemonItem, index) => (
        <PokemonCard
          isList={isList}
          setcloseMdoal={setcloseMdoal}
          key={pokemonItem.name || index}
          pokemon={pokemonItem}
          setClickedPokemon={setClickedPokemon}
          isFavorite={isFav(pokemonItem)}
          onToggleFavorite={onToggleFavorite}
          isInTeam={inTeam(pokemonItem)}
          onToggleTeam={onToggleTeam}
        />
      ));
    }

    return null;
  };

  return (
    <section
      aria-label="Pokémon collection"
      aria-busy={loading || searchLoading}
      className="w-full h-full flex flex-col"
    >
      <div
        className={`w-3/4 h-3/4 grid justify-items-center mx-auto mb-4 ${
          isList
            ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 lg:gap-6"
            : "grid-flow-row gap-y-4"
        }`}
      >
        {renderGridContent()}
      </div>
      <div>
        {!searched && !loading ? (
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
        ) : null}
      </div>
    </section>
  );
};

export default Grid;
