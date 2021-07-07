import React, { useState, useEffect } from "react";
import HorizontalBarChart from "./HorizontalBarChart";
import Chart from "./Chart";

const stat = (props) => {
  const { pokemon, clickedBtn } = props;
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setStats(pokemon.stats);
  }, [pokemon.stats]);

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
