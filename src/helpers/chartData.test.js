import { describe, it, expect } from "vitest";
import { extractStatMetrics, createChartData } from "./chartData";

describe("chartData helpers", () => {
  it("returns empty arrays when stats is null, undefined, or empty", () => {
    expect(extractStatMetrics(null)).toEqual({ labels: [], dataValues: [] });
    expect(extractStatMetrics(undefined)).toEqual({ labels: [], dataValues: [] });
    expect(extractStatMetrics([])).toEqual({ labels: [], dataValues: [] });
  });

  it("extracts labels and values properly from stats array", () => {
    const mockStats = [
      { stat: { name: "hp" }, base_stat: 45 },
      { stat: { name: "attack" }, base_stat: 49 },
      { stat: { name: "defense" }, base_stat: 49 },
    ];
    expect(extractStatMetrics(mockStats)).toEqual({
      labels: ["hp", "attack", "defense"],
      dataValues: [45, 49, 49],
    });
  });

  it("handles missing nested properties gracefully", () => {
    const mockStats = [{ stat: null, base_stat: null }];
    expect(extractStatMetrics(mockStats)).toEqual({
      labels: [""],
      dataValues: [0],
    });
  });

  it("creates standard chart data and applies overrides", () => {
    const result = createChartData(["hp"], [45], { pointBackgroundColor: "#fff" });
    expect(result.labels).toEqual(["hp"]);
    expect(result.datasets[0].data).toEqual([45]);
    expect(result.datasets[0].pointBackgroundColor).toEqual("#fff");
  });
});
