import { useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

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

  const { labels, dataValues } = useMemo(() => {
    if (!stats || stats.length === 0) {
      return { labels: [], dataValues: [] };
    }
    const namesArr = [];
    const statsArr = [];
    stats.forEach((element) => {
      namesArr.push(element.stat.name);
      statsArr.push(element.base_stat);
    });
    return { labels: namesArr, dataValues: statsArr };
  }, [stats]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Base Stat",
          data: dataValues,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1.5,
        },
      ],
    }),
    [labels, dataValues]
  );

  return (
    <div className="w-full h-full relative">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;

