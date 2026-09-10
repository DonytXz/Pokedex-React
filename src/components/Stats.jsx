import HorizontalBarChart from "./HorizontalBarChart";
import Chart from "./Chart";

const Stats = (props) => {
  const { pokemon, clickedBtn } = props;
  const stats = pokemon?.stats || [];

  return (
    <div className="w-full h-full">
      {/* Screen reader accessible stats breakdown */}
      <div className="sr-only">
        <h3>Base Statistics</h3>
        <dl>
          {stats.map((s, idx) => (
            <div key={idx}>
              <dt>{s.stat.name.replace("-", " ")}</dt>
              <dd>{s.base_stat}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden="true" className="w-full h-full">
        {!clickedBtn ? (
          <HorizontalBarChart stats={stats} />
        ) : (
          <Chart stats={stats} />
        )}
      </div>
    </div>
  );
};

export default Stats;
