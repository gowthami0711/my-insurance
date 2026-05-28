import { getPaginationRange } from "@/lib/pagination";

describe("getPaginationRange", () => {
  it("returns all pages when total is 7 or fewer", () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("shows leading pages when near the start", () => {
    expect(getPaginationRange(3, 20)).toEqual([1, 2, 3, 4, 5, "...", 20]);
  });

  it("shows trailing pages when near the end", () => {
    expect(getPaginationRange(18, 20)).toEqual([
      1,
      "...",
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it("shows a window around the current page in the middle", () => {
    expect(getPaginationRange(10, 20)).toEqual([
      1,
      "...",
      9,
      10,
      11,
      "...",
      20,
    ]);
  });
});
