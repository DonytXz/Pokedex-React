import React from "react";
import ColumnsIcon from "../assets/icons/columns.svg";
import ListIcon from "../assets/icons/list.svg";

const Butons = (props) => {
  const { setIslist, isList } = props;

  const toggleLayout = () => {
    setIslist(!isList);
  };

  return (
    <button
      type="button"
      onClick={toggleLayout}
      aria-label={isList ? "Switch to list view" : "Switch to grid view"}
      aria-pressed={!isList}
      title={isList ? "Switch to list view" : "Switch to grid view"}
      className="hidden md:flex self-stretch px-5 bg-green-600 border-2 border-transparent rounded-lg mr-2 lg:mr-4 items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:outline-none"
    >
      <img
        className="w-6 h-6 block"
        src={isList ? ListIcon : ColumnsIcon}
        alt=""
        aria-hidden="true"
      />
    </button>
  );
};
export default Butons;
