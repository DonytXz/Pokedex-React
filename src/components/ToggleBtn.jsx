import React, { useState, useEffect } from "react";

const ToggleBtn = (props) => {
  const { setClickedBtn, clickedBtn } = props;

  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="chart-toggle"
        className="flex items-center cursor-pointer my-auto"
      >
        <span className="sr-only">Switch between bar chart and radar chart</span>
        <div className="relative">
          <input
            id="chart-toggle"
            type="checkbox"
            role="switch"
            aria-checked={clickedBtn}
            aria-label="Switch between bar chart and radar chart"
            className="sr-only peer"
            checked={clickedBtn}
            onChange={() => setClickedBtn(!clickedBtn)}
          />

          <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2"></div>

          <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleBtn;
