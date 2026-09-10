import { useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { extractStatMetrics, createChartData } from "../helpers/chartData";

const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 1.5,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.raw}`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      suggestedMax: 160,
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 11,
        },
      },
    },
  },
};

const HorizontalBarChart = (props) => {
  const { stats } = props;

  const { labels, dataValues } = useMemo(() => extractStatMetrics(stats), [stats]);

  const data = useMemo(
    () => createChartData(labels, dataValues),
    [labels, dataValues]
  );

  return (
    <div className="w-full h-full relative">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;

