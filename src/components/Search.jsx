import React, { useState, useRef, useEffect } from "react";
import SearchImage from "../assets/icons/search.svg";

const search = (props) => {
  const { getPokemon, setSearched } = props;
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
      className="flex-1 h-full relative px-3 py-1 bg-white flex flex-row items-center border border-gray-200 border-t-2 shadow_top rounded-md shadow focus-within:ring-2 focus-within:ring-green-600 transition-all"
    >
      <label htmlFor="pokemon-search" className="sr-only">
        Search Pokémon by name or ID
      </label>
      {isFocused && (
        <div
          data-testid="search-magnifier"
          className="flex items-center justify-center pl-1 pr-2 shrink-0"
          onMouseDown={(e) => e.preventDefault()}
        >
          <img className="w-4 h-4 block" src={SearchImage} alt="" aria-hidden="true" />
        </div>
      )}
      <div className="flex-1 h-full flex items-center">
        <input
          id="pokemon-search"
          value={searchValue}
          onChange={inputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-2 py-1 border-none focus:outline-none bg-transparent text-sm md:text-base text-gray-800 placeholder-gray-400"
          type="search"
          aria-label="Search Pokémon by name or ID"
          placeholder="Search by keywords"
        />
      </div>
    </form>
  );
};

export default search;
