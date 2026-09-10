export const extractStatMetrics = (stats) => {
  if (!stats || stats.length === 0) {
    return { labels: [], dataValues: [] };
  }
  const labels = [];
  const dataValues = [];
  for (const element of stats) {
    labels.push(element.stat?.name || "");
    dataValues.push(element.base_stat ?? 0);
  }
  return { labels, dataValues };
};

export const createChartData = (labels, dataValues, datasetOverrides = {}) => ({
  labels,
  datasets: [
    {
      label: "Base Stat",
      data: dataValues,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1.5,
      ...datasetOverrides,
    },
  ],
});
