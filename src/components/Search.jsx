import React, { useState } from "react";
import SearchImage from "../assets/icons/search.svg";

const search = (props) => {
  const { getPokemon, setSearched } = props;
  const [searchValue, setSearchValue] = useState("");

  const inputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchValue(query);
    setSearched(query.length > 0);
    getPokemon(query);
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
