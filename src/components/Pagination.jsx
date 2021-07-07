import React from "react";
import ArrowNext from "../assets/icons/arrow-next.svg";
import ArrowPrev from "../assets/icons/arrow-prev.svg";

const Pagination = (props) => {
  const {
    onLeftClick,
    onRightClick,
    firstPage,
    secondPage,
    underLatsPage,
    lastPage,
    page,
    searched,
    total,
  } = props;
  return (
    <>
      <div className="w-1/2 h-1/4 mx-auto flex flex-row justify-center py-6">
        <div className="flex h-12 font-medium rounded-md">
          <div
            onClick={onLeftClick}
            className="w-12 p-4 hover:bg-green-500 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  "
          >
            <img src={ArrowPrev} className="" alt="" />
          </div>
          <div
            onClick={firstPage}
            className="w-12 p-4 hover:bg-green-500 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  "
          >
            1
          </div>
          <div
            onClick={secondPage}
            className="w-12 p-4 hover:bg-green-500 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  "
          >
            2
          </div>
          <div className="w-12 p-4  md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  ">
            ...
          </div>
          <div
            onClick={underLatsPage}
            className="w-12 p-4 hover:bg-green-500 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  "
          >
            {total - 1}
          </div>
          <div
            onClick={lastPage}
            className="w-12 p-4 hover:bg-green-500 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  "
          >
            {total}
          </div>
          <div
            onClick={onRightClick}
            className="w-12 p-4 hover:bg-green-500 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-md  "
          >
            <img src={ArrowNext} className="" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagination;
