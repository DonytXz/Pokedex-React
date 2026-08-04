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
    <>
      <div className="w-3/4 h-full mx-auto relative p-2 bg-white flex flex-row items-center border-1 border-t-2 shadow_top rounded-md shadow">
        <div className="w-1/12 h-full">
          <img className="mx-auto my-auto" src={SearchImage} alt="" />
        </div>
        <div className="w-11/12 h-full">
          <input
            value={searchValue}
            onChange={inputChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border-none"
            type="search"
            placeholder="Search by keywords"
          />
        </div>
      </div>
    </>
  );
};

export default search;
