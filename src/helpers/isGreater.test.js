import { describe, expect, it } from "vitest";
import { isGreater } from "./isGreater";

describe("isGreater", () => {
  it.each([
    [1, "#00"],
    [25, "#0"],
    [100, "#"],
  ])("formats the prefix for Pokédex number %i", (number, prefix) => {
    expect(isGreater(number)).toBe(prefix);
  });
});
