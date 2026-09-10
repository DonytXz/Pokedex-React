import { useMemo } from "react";
import { Radar } from "react-chartjs-2";
import { extractStatMetrics, createChartData } from "../helpers/chartData";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    r: {
      angleLines: {
        display: false,
      },
      suggestedMin: 0,
      suggestedMax: 150,
      ticks: {
        font: {
          size: 9,
        },
        stepSize: 50,
      },
      pointLabels: {
        font: {
          size: 11,
        },
      },
    },
  },
};

const Chart = (props) => {
  const { stats } = props;

  const { labels, dataValues } = useMemo(() => extractStatMetrics(stats), [stats]);

  const data = useMemo(
    () =>
      createChartData(labels, dataValues, {
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      }),
    [labels, dataValues]
  );

  return (
    <div className="w-full h-full relative">
      <Radar data={data} options={options} />
    </div>
  );
};

export default Chart;

