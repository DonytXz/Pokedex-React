import React from "react";
import ColumnsIcon from "../assets/icons/columns.svg";
import ListIcon from "../assets/icons/list.svg";

const Butons = (props) => {
  const { setIslist, isList } = props;

  const toggleLayout = () => {
    setIslist(!isList);
  };

  return (
    <>
      <button
        onClick={toggleLayout}
        aria-label={isList ? "Switch to list view" : "Switch to grid view"}
        title={isList ? "Switch to list view" : "Switch to grid view"}
        className="self-stretch px-5 bg-green-600 border-2 border-transparent rounded-lg mr-2 lg:mr-4 flex items-center justify-center shrink-0"
      >
        <img
          className="w-6 h-6 block"
          src={isList ? ListIcon : ColumnsIcon}
          alt={isList ? "List view" : "Grid view"}
        />
      </button>
    </>
  );
};
export default Butons;
