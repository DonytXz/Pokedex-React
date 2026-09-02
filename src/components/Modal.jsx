import React, { useState, useEffect, useRef } from "react";
import Image from "./Image";
import { isGreater } from "../helpers/isGreater";
import { fetchPokemonData } from "../services/getPokemon";
import Types from "./Types";
import Description from "./Description";
import Stats from "./Stats";
import ToggleBtn from "./ToggleBtn";
import PokeballLoader from "./loaders/PokeballLoader";

const Modal = (props) => {
  const { setCloseModal, pokemon } = props;
  const [types, setTypes] = useState([]);
  const [clickedBtn, setClickedBtn] = useState(false);
  const [species, setSpecies] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const getSpecies = async (query) => {
    if (!query) return;
    try {
      const data = await fetchPokemonData(query);
      setSpeciesData(data);
    } catch (err) {
      // swallow for now — component should not crash on fetch error
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
    }
  }, [pokemon]);

  useEffect(() => {
    if (species && species.url) {
      getSpecies(species.url);
    }
  }, [species]);

  // Focus management and focus trap
  useEffect(() => {
    // Focus the close button when modal opens
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

  return (
    <>
      {pokemon ? (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-pokemon-name"
            className="w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-6 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col bg-white relative border-2 border-gray-100 shadow-2xl rounded-xl opacity-100 pointer-events-auto"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Close Pokémon details"
              className="hover:bg-gray-200 absolute bg-white text-center leading-6 w-8 h-8 p-1 box-content top-3 right-3 md:-top-3 md:-right-3 border-2 border-gray-300 rounded-full focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:outline-none flex items-center justify-center shadow-md cursor-pointer"
            >
              <span aria-hidden="true" className="text-gray-700 font-bold text-base leading-none">
                ✕
              </span>
            </button>
            <div className="w-full mb-4 flex flex-row items-center">
              <div className="w-1/3 flex items-center justify-center">
                <Image
                  className="w-full h-full m-auto"
                  path={pokemon.sprites}
                  alt={pokemon.name}
                />
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center">
                <p className="w-full font-sans text-left text-gray-600">
                  {isGreater(pokemon.id)}
                  {pokemon.id}
                </p>
                <h2
                  id="modal-pokemon-name"
                  className="w-full font-sans text-xl capitalize font-bold text-gray-900"
                >
                  {pokemon.name}
                </h2>
                {types && types.length
                  ? types.map((type, index) => {
                      return <Types key={index} type={type.type} />;
                    })
                  : null}
              </div>

              <div className="w-1/3 flex flex-col items-center justify-start">
                <p className="w-full font-sans text-left text-base md:text-lg capitalize font-bold text-gray-800">
                  Height: <span className="font-normal">{pokemon.height}m</span>
                </p>
                <p className="w-full font-sans text-left text-base md:text-lg capitalize font-bold text-gray-800">
                  Weight: <span className="font-normal">{pokemon.weight}kg</span>
                </p>
              </div>
            </div>
            <div className="w-full mb-4 text-gray-700">
              <Description species={speciesData || species} />
            </div>
            <div className="w-full min-h-[220px] mb-4">
              <Stats clickedBtn={clickedBtn} pokemon={pokemon} />
            </div>
            <div className="w-full flex flex-row items-center justify-center text-sm font-medium text-gray-700">
              <span className="mx-2">{!clickedBtn ? "Chart View" : "Radar View"}</span>
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
        <PokeballLoader />
      )}
    </>
  );
};

export default Modal;

