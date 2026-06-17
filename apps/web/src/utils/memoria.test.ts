import { describe, it, expect } from "vitest";
import { maskPlayerName, maskRating } from "@/utils/memoria";

describe("memoria utils", () => {
  it("modo classico mostra dados reais", () => {
    expect(maskPlayerName("classico", "Pelé")).toBe("Pelé");
    expect(maskRating("classico", 98)).toBe("98");
  });

  it("modo memoria mascara dados", () => {
    expect(maskPlayerName("memoria", "Cristiano Ronaldo")).toMatch(/^\w\. \?\?\?$/);
    expect(maskRating("memoria", 94)).toBe("??");
  });
});
