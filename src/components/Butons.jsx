import React from "react";
import ColumnsIcon from "../assets/icons/columns.svg";
import ListIcon from "../assets/icons/list.svg";

const Butons = (props) => {
  const { setIslist, isList } = props;
  const assignValueBtnList = () => {
    setIslist(false);
    // console.log("is list");
  };
  const assignValueBtnGrid = () => {
    setIslist(true);
    // console.log("is grid");
  };
  return (
    <>
      <div className="w-1/4 grid grid-flow-col grid-cols-2 grid-rows-1 gap-x-2 lg:gap-x-4 mr-2 lg:mr-4">
        <button
          onClick={assignValueBtnGrid}
          className="w-full h-full p-2 bg-green-600 border-2  border-transparent rounded-lg"
        >
          <img className="m-auto" src={ColumnsIcon} alt="" srcSet="" />
        </button>
        <button
          onClick={assignValueBtnList}
          className="w-full h-full p-2 bg-green-600 border-2  border-transparent rounded-lg"
        >
          <img className="m-auto" src={ListIcon} alt="" srcSet="" />
        </button>
      </div>
    </>
  );
};
export default Butons;
