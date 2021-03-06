import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

const options = {
  indexAxis: "y",
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const HorizontalBarChart = (props) => {
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
  //Get the current view dimensions
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
        <Bar
          data={data}
          options={options}
          //Set the current dimentons to the grap
          width={windowDimensions.width}
          height={windowDimensions.height}
          // options={{ maintainAspectRatio: false }}
        />
      </div>
    </>
  );
};

export default HorizontalBarChart;
