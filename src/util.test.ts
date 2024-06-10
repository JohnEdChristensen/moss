import { range, linspace } from "./util"

describe("array utils", () => {
  test("Should give expected range", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4])
    expect(range(9, 11)).toEqual([9, 10])
  })
  test("linspace works as expcted", () => {
    expect(linspace(0, 1, 3)).toEqual([0, 0.5, 1])
    expect(linspace(10, 15, 6)).toEqual([10, 11, 12, 13, 14, 15])
  })
})
