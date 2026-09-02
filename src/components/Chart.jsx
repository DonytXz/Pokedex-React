import React, { useState, useEffect } from "react";
import "chart.js/auto";
import { Radar } from "react-chartjs-2";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.raw}`,
      },
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      suggestedMin: 0,
      suggestedMax: 150,
      ticks: {
        stepSize: 30,
        display: false,
      },
      pointLabels: {
        font: {
          size: 11,
        },
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
  },
};

const Chart = (props) => {
  const { stats } = props;

  const [pokemonStats, setPokemonStats] = useState([]);
  const [names, setNames] = useState([]);

  const data = {
    labels: names,
    datasets: [
      {
        label: "Base Stat",
        data: pokemonStats,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1.5,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  useEffect(() => {
    if (stats && stats.length > 0) {
      const namesArr = [];
      const statsArr = [];
      stats.forEach((element) => {
        namesArr.push(element.stat.name);
        statsArr.push(element.base_stat);
      });
      setPokemonStats(statsArr);
      setNames(namesArr);
    }
  }, [stats]);

  return (
    <div className="w-full h-full relative">
      <Radar data={data} options={options} />
    </div>
  );
};

export default Chart;

