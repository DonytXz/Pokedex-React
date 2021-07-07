import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
import HorizontalBarChart from "./HorizontalBarChart";
import Chart from "./Chart";

// import Statt from "./Statt";
const stat = (props) => {
  const { pokemon, clickedBtn } = props;
  const [stats, setStats] = useState([]);
  // console.log(clickedBtn);
  useEffect(() => {
    // console.log(pokemon.stats);
    // if (pokemon != undefined) setStats(pokemon.stats);
    setStats(pokemon.stats);
  }, [pokemon.stats]);
  // console.log(stats);
  return (
    <>
      <div className="w-full h-full">
        {!clickedBtn ? (
          <HorizontalBarChart stats={stats} />
        ) : (
          <Chart stats={stats} />
        )}
      </div>
    </>
  );
};

export default stat;
