import React, { useState, useRef, useEffect } from "react";
import SearchImage from "../assets/icons/search.svg";

const search = (props) => {
  const { getPokemon, setSearched } = props;
  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const triggerSearch = (query) => {
    setSearched(query.length > 0);
    getPokemon(query);
  };

  const inputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchValue(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length === 0) {
      triggerSearch(query);
      return;
    }

    debounceRef.current = setTimeout(() => {
      triggerSearch(query);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      triggerSearch(searchValue);
    }
  };

  return (
    <form
      role="search"
      aria-label="Pokémon search"
      onSubmit={(e) => {
        e.preventDefault();
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        triggerSearch(searchValue);
      }}
      className="flex-1 h-full relative p-2 bg-white flex flex-row items-center border-1 border-t-2 shadow_top rounded-md shadow focus-within:ring-2 focus-within:ring-green-600"
    >
      <label htmlFor="pokemon-search" className="sr-only">
        Search Pokémon by name or ID
      </label>
      <div className="w-1/12 h-full flex items-center justify-center">
        <img className="mx-auto my-auto" src={SearchImage} alt="" aria-hidden="true" />
      </div>
      <div className="w-11/12 h-full">
        <input
          id="pokemon-search"
          value={searchValue}
          onChange={inputChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border-none focus:outline-none"
          type="search"
          aria-label="Search Pokémon by name or ID"
          placeholder="Search by keywords"
        />
      </div>
    </form>
  );
};

export default search;
