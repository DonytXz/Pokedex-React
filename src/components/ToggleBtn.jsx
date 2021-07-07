import React, { useState, useEffect } from "react";

const ToggleBtn = (props) => {
  const { setClickedBtn, clickedBtn } = props;
  const [flag, setFlag] = useState(false);
  // const assignValue = (flag) => {
  //   if(flag){
  //     setClickedBtn(true)
  //   }else{
  //     setClickedBtn(false)
  //   }
  // };
  // const clickedFunction = () => {
  //   assignValue(clickedBtn);
  // }
  console.log(clickedBtn);
  // const assignValue = () => {
  //   // if(clickedBtn !== undefined){
  //   // clickedBtn === false ? setClickedBtn(true) : setClickedBtn(false);

  //   // }

  //   switch (clickedBtn) {
  //     case false:
  //       setFlag(true);
  //       break;
  //     case true:
  //       setFlag(false);
  //       break;
  //     default:
  //     // code block
  //   }
  //   // if (clickedBtn === false) {
  //   //   setClickedBtn(false);
  //   // }else  if (clickedBtn === false) {
  //   //   setClickedBtn(true);
  //   // }
  // };
  
  // useEffect(() => {
  //   if (flag !== undefined) setClickedBtn(flag);
  // }, [flag]);
  // console.log(clickedBtn);
  
    const assignValue = () => {
      setClickedBtn(true)
    }
  return (
    <>
      <div
        onClick={assignValue}
        className="flex items-center justify-center w-full mb-12 "
      >
        <label
          htmlFor="toogleA"
          className="flex items-center cursor-pointer my-auto"
        >
          <div className="relative ">
            <input id="toogleA" type="checkbox" className="sr-only" />

            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>

            <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
          </div>

          <div className="ml-3 text-gray-700 font-medium"></div>
        </label>
      </div>
      {/* 
      <div className="flex items-center justify-center w-full mb-12">
        <label for="toggleB" className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" id="toggleB" className="sr-only" />

            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
          </div>

          <div className="ml-3 text-gray-700 font-medium"></div>
        </label>
      </div> */}
    </>
  );
};

export default ToggleBtn;
