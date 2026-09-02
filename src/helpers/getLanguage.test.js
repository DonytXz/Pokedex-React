import { describe, it, expect } from "vitest";
import { browserLang } from "./getLanguage";

describe("getLanguage helper", () => {
  it("exports browserLang as a 2-character language code string", () => {
    expect(typeof browserLang).toBe("string");
    expect(browserLang.length).toBeLessThanOrEqual(2);
  });
});
