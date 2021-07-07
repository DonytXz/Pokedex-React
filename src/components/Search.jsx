import React, { useState, useEffect } from "react";
import SearchImage from "../assets/icons/search.svg";

const search = (props) => {
  const { getPokemon } = props;
  const [search, setSearch] = useState("");
  //Lsiten fro changes
  const inputChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    //pas the input value to fetch this pokemon
    getPokemon(search.toLowerCase());
  }, [search]);

  return (
    <>
      <div className="w-1/2 mb-4 mx-auto relative p-2 bg-white flex flex-row items-center border-1 border-t-2 shadow_top rounded-md shadow">
        <div className="w-1/12 h-full">
          <img className="mx-auto my-auto" src={SearchImage} alt="" />
        </div>
        <div className="w-11/12 h-full">
          <input
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
