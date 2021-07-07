import React, { useState, useEffect } from "react";
import { Radar } from "react-chartjs-2";

const Chart = (props) => {
  const { stats } = props;

  const [pokemonStats, setPokemonStats] = useState([]);
  const [names, setNames] = useState([]);
  let namesArr = [];
  let statsArr = [];
  const { innerWidth: width, innerHeight: height } = window;
  // console.warn(width,height);

  const data = {
    labels: names,
    datasets: [
      {
        label: "# of Votes",
        data: pokemonStats,
        backgroundColor: "rgba(75, 192, 192, 0.2)",

        borderColor: "rgba(75, 192, 192, 1)",

        borderWidth: 1,
      },
    ],
  };
  const options = {
    type: "radar",
    data: data,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };
  function getWindowDimensions() {
    return {
      width,
      height,
    };
  }
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  const getNames = () => {
    stats.forEach((element, index, arr) => {
      // console.log(element)
      namesArr.push(element.stat.name);
      statsArr.push(element.base_stat);
    });
    setPokemonStats(statsArr);
    setNames(namesArr);
  };

  useEffect(() => {
    if (stats != undefined && stats.length > 0) getNames();
  }, [stats]);

  return (
    <>
      <div className="w-full h-full">
        2
        <Radar
          data={data}
          options={options}
          width={windowDimensions.width}
          height={windowDimensions.height}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </>
  );
};

export default Chart;
