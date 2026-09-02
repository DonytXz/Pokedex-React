import { describe, expect, it } from "vitest";
import { isGreater } from "./isGreater";

describe("isGreater helper", () => {
  it.each([
    [1, "#00"],
    [9, "#00"],
    [10, "#0"],
    [25, "#0"],
    [99, "#0"],
    [100, "#"],
    [151, "#"],
    [1025, "#"],
  ])("formats the prefix for Pokédex number %i as %s", (number, prefix) => {
    expect(isGreater(number)).toBe(prefix);
  });
});
