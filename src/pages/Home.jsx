import React, { useState, useEffect, useRef } from "react";
import Grid from "../components/Grid";
import Logo from "../components/Logo";
import Search from "../components/Search";
import { fetchPokemon, fetchAllPokemonNames, fetchPokemonData } from "../services/getPokemon";
import Modal from "../components/Modal";
import Butons from "../components/Butons";
import PokePattern from "../assets/img/pokepattern.jpg";

const Home = () => {
  const [pokemon, setPokemon] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [sharedPageVal, setSharedPageVal] = useState();
  const [closeModal, setCloseModal] = useState(true);
  const [pokemonModalVal, setPokemonModalVal] = useState();
  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isList, setIslist] = useState(true);
  const [allPokemonList, setAllPokemonList] = useState([]);
  const [searchStatus, setSearchStatus] = useState("");
  const abortControllerRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    const loadAllPokemon = async () => {
      const data = await fetchAllPokemonNames();
      if (data && data.results) {
        setAllPokemonList(data.results);
      }
    };
    loadAllPokemon();
  }, []);

  const searchPokemon = async (query) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query) {
      setSearched(false);
      setPokemon([]);
      setSearchLoading(false);
      setSearchStatus("");
      return;
    }

    setSearched(true);
    setSearchLoading(true);
    setSearchStatus("Searching Pokémon...");

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const matches = allPokemonList.filter((p) => {
        const idMatch = p.url.match(/\/pokemon\/(\d+)\//);
        const id = idMatch ? idMatch[1] : null;
        return p.name.includes(query) || (id && id.includes(query));
      });

      const limitedMatches = matches.slice(0, 18);
      const promises = limitedMatches.map((p) =>
        fetchPokemonData(p.url, signal)
      );
      const results = await Promise.all(promises);

      const filtered = results.filter(Boolean);
      setPokemon(filtered);
      setSearchStatus(
        filtered.length > 0
          ? `Found ${filtered.length} Pokémon matching search.`
          : "No Pokémon found matching search."
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        setPokemon([]);
        setSearchStatus("Error searching Pokémon.");
      }
    } finally {
      if (!signal.aborted) {
        setSearchLoading(false);
      }
    }
  };

  const loadPokemonDetails = async (query) => {
    if (!query) return;

    setPokemonDetails(null);
    const data = await fetchPokemon(query);
    setPokemonDetails(data || null);
  };

  const handleOpenModal = (val) => {
    lastActiveElementRef.current = document.activeElement;
    setPokemonModalVal(val);
    setCloseModal(false);
  };

  const handleCloseModal = (isClosed) => {
    setCloseModal(isClosed);
    if (isClosed && lastActiveElementRef.current) {
      setTimeout(() => {
        lastActiveElementRef.current?.focus();
      }, 50);
    }
  };

  useEffect(() => {
    if (!pokemonModalVal) return;
    loadPokemonDetails(pokemonModalVal);
  }, [pokemonModalVal]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (!closeModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [closeModal]);

  return (
    <>
      {/* Skip to Main Content Link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-green-700 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white font-bold"
      >
        Skip to main content
      </a>

      {/* Screen Reader Live Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {searchStatus}
      </div>

      {!closeModal && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
            onClick={() => handleCloseModal(true)}
          />
          <div className="relative w-full h-full pointer-events-none">
            <Modal
              setCloseModal={handleCloseModal}
              pokemon={pokemonDetails}
              closeMdoal={closeModal}
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
        aria-hidden={!closeModal ? "true" : undefined}
      >
        <div className="w-full h-full relative">
          <Logo />

          <div className="w-3/4 flex flex-row mx-auto mb-4 items-stretch">
            <Butons isList={isList} setIslist={setIslist} />
            <Search setSearched={setSearched} getPokemon={searchPokemon} />
          </div>

          <main id="main-content" tabIndex="-1" className="w-full focus:outline-none">
            <Grid
              isList={isList}
              setSharedPageVal={setSharedPageVal}
              setPokemonModalVal={handleOpenModal}
              searched={searched}
              searchLoading={searchLoading}
              setcloseMdoal={handleCloseModal}
              pokemon={pokemon}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
