import React, { useState, useEffect, useRef } from "react";
import Image from "./Image";
import { isGreater } from "../helpers/isGreater";
import { fetchPokemonData, calculateBaseStatTotal } from "../services/getPokemon";
import Types from "./Types";
import Description from "./Description";
import Stats from "./Stats";
import ToggleBtn from "./ToggleBtn";
import PokeballLoader from "./loaders/PokeballLoader";
import AudioCry from "./AudioCry";
import EvolutionChain from "./EvolutionChain";
import TypeMatchups from "./TypeMatchups";

const Modal = (props) => {
  const {
    setCloseModal,
    pokemon,
    onSelectPokemon,
    isFavorite,
    onToggleFavorite,
    isInTeam,
    onToggleTeam,
  } = props;
  const [types, setTypes] = useState([]);
  const [clickedBtn, setClickedBtn] = useState(false);
  const [species, setSpecies] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [isShiny, setIsShiny] = useState(false);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const getSpecies = async (query) => {
    if (!query) return;
    try {
      const data = await fetchPokemonData(query);
      setSpeciesData(data);
    } catch (err) {
      setSpeciesData(null);
    }
  };

  const handleClose = () => {
    if (typeof setCloseModal === "function") setCloseModal(true);
  };

  useEffect(() => {
    if (pokemon) {
      setTypes(pokemon.types || []);
      setSpecies(pokemon.species);
      setIsShiny(false);
    }
  }, [pokemon]);

  useEffect(() => {
    if (species && species.url) {
      getSpecies(species.url);
    }
  }, [species]);

  // Focus management and focus trap
  useEffect(() => {
    if (pokemon && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pokemon]);

  const bst = calculateBaseStatTotal(pokemon);
  const cryUrl = pokemon?.cries?.latest || pokemon?.cries?.legacy;

  return (
    <>
      {pokemon ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-pokemon-name"
            className="w-11/12 md:w-3/4 lg:w-3/5 xl:w-1/2 p-6 md:p-8 max-h-[92vh] overflow-y-auto overflow-x-hidden flex flex-col bg-white relative border-2 border-gray-100 shadow-2xl rounded-2xl opacity-100 pointer-events-auto"
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close Pokémon details"
              className="hover:bg-gray-200 absolute bg-white text-center leading-6 w-8 h-8 p-1 box-content top-4 right-4 border-2 border-gray-300 rounded-full focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none flex items-center justify-center shadow-md cursor-pointer z-10"
            >
              <span aria-hidden="true" className="text-gray-700 font-bold text-base leading-none">
                ✕
              </span>
            </button>

            {/* Top Identity Header */}
            <div className="w-full mb-4 flex flex-col sm:flex-row items-center gap-4">
              {/* Sprite + Shiny Toggle */}
              <div className="w-full sm:w-1/3 flex flex-col items-center justify-center">
                <div className="w-32 h-32 relative flex items-center justify-center">
                  <Image
                    className="w-full h-full object-contain m-auto"
                    path={pokemon.sprites}
                    alt={pokemon.name}
                    shiny={isShiny}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsShiny(!isShiny)}
                  aria-pressed={isShiny}
                  aria-label={isShiny ? "Switch to standard form" : "Switch to shiny form"}
                  className={`mt-1 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border transition duration-150 focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:outline-none ${
                    isShiny
                      ? "bg-yellow-400 text-yellow-950 border-yellow-500 shadow-sm"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  <span aria-hidden="true">✨</span>
                  <span>{isShiny ? "Shiny Active" : "View Shiny"}</span>
                </button>
              </div>

              {/* Name, Number, Types, Cry, Favorite, Team */}
              <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start justify-center">
                <p className="font-sans text-gray-500 font-semibold text-sm">
                  {isGreater(pokemon.id)}
                  {pokemon.id}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="modal-pokemon-name"
                    className="font-sans text-2xl capitalize font-extrabold text-gray-900"
                  >
                    {pokemon.name}
                  </h2>
                  <AudioCry cryUrl={cryUrl} pokemonName={pokemon.name} />
                </div>

                <div className="flex flex-wrap gap-1 mt-1.5">
                  {types && types.length
                    ? types.map((type, index) => {
                        return <Types key={index} type={type.type || type} />;
                      })
                    : null}
                </div>

                {/* Team & Favorite Actions */}
                <div className="flex items-center gap-2 mt-3">
                  {onToggleFavorite && (
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(pokemon)}
                      aria-pressed={isFavorite}
                      aria-label={
                        isFavorite
                          ? `Remove ${pokemon.name} from favorites`
                          : `Add ${pokemon.name} to favorites`
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition duration-150 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none ${
                        isFavorite
                          ? "bg-red-50 text-red-700 border-red-300"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span aria-hidden="true">{isFavorite ? "❤️" : "🤍"}</span>
                      <span>Favorite</span>
                    </button>
                  )}

                  {onToggleTeam && (
                    <button
                      type="button"
                      onClick={() => onToggleTeam(pokemon)}
                      aria-pressed={isInTeam}
                      aria-label={
                        isInTeam
                          ? `Remove ${pokemon.name} from battle team`
                          : `Add ${pokemon.name} to battle team`
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition duration-150 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none ${
                        isInTeam
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span aria-hidden="true">{isInTeam ? "✓" : "+"}</span>
                      <span>{isInTeam ? "In Team" : "Add to Team"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Physical Traits & BST */}
              <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start justify-center bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                <p className="w-full font-sans text-gray-800 font-bold">
                  Height:{" "}
                  <span className="font-normal">
                    {pokemon.height != null ? `${(pokemon.height / 10).toFixed(1)}m` : "--"}
                  </span>
                </p>
                <p className="w-full font-sans text-gray-800 font-bold mt-1">
                  Weight:{" "}
                  <span className="font-normal">
                    {pokemon.weight != null ? `${(pokemon.weight / 10).toFixed(1)}kg` : "--"}
                  </span>
                </p>
                <p className="w-full font-sans text-gray-800 font-bold mt-1">
                  Base Stat Total:{" "}
                  <span className="font-extrabold text-green-700">{bst}</span>
                </p>
              </div>
            </div>

            {/* Segmented / Tab Navigation */}
            <div
              role="tablist"
              aria-label="Pokémon details sections"
              className="w-full flex items-center border-b border-gray-200 mb-4"
            >
              <button
                role="tab"
                id="tab-stats"
                aria-controls="panel-stats"
                aria-selected={activeTab === "stats"}
                onClick={() => setActiveTab("stats")}
                className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                  activeTab === "stats"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Stats & About
              </button>
              <button
                role="tab"
                id="tab-evolution"
                aria-controls="panel-evolution"
                aria-selected={activeTab === "evolution"}
                onClick={() => setActiveTab("evolution")}
                className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                  activeTab === "evolution"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Evolution Chain
              </button>
              <button
                role="tab"
                id="tab-matchups"
                aria-controls="panel-matchups"
                aria-selected={activeTab === "matchups"}
                onClick={() => setActiveTab("matchups")}
                className={`py-2 px-4 text-xs sm:text-sm font-bold border-b-2 transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
                  activeTab === "matchups"
                    ? "border-green-600 text-green-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                Type Matchups
              </button>
            </div>

            {/* Tab Panels */}
            {/* Panel 1: Stats & About */}
            {activeTab === "stats" && (
              <div
                role="tabpanel"
                id="panel-stats"
                aria-labelledby="tab-stats"
                tabIndex={0}
                className="w-full flex flex-col focus:outline-none"
              >
                <div className="w-full mb-4 text-gray-700">
                  <Description species={speciesData || species} />
                </div>
                <div className="w-full h-60 sm:h-64 mb-4 relative">
                  <Stats clickedBtn={clickedBtn} pokemon={pokemon} />
                </div>
                <div className="w-full flex flex-row items-center justify-center text-sm font-medium text-gray-700 mt-2">
                  <span className="mx-2">{!clickedBtn ? "Chart View" : "Radar View"}</span>
                  <div className="mx-2">
                    <ToggleBtn
                      clickedBtn={clickedBtn}
                      setClickedBtn={setClickedBtn}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Panel 2: Evolution Chain */}
            {activeTab === "evolution" && (
              <div
                role="tabpanel"
                id="panel-evolution"
                aria-labelledby="tab-evolution"
                tabIndex={0}
                className="w-full flex flex-col focus:outline-none py-2"
              >
                <EvolutionChain
                  speciesUrl={species?.url}
                  currentPokemonName={pokemon.name}
                  onSelectPokemon={onSelectPokemon}
                />
              </div>
            )}

            {/* Panel 3: Defensive Type Matchups */}
            {activeTab === "matchups" && (
              <div
                role="tabpanel"
                id="panel-matchups"
                aria-labelledby="tab-matchups"
                tabIndex={0}
                className="w-full flex flex-col focus:outline-none py-2"
              >
                <TypeMatchups types={types} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <PokeballLoader />
      )}
    </>
  );
};

export default Modal;
