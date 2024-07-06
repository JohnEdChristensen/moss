import _ from "lodash"
import { range, linspace } from "./util"

equal(
  range(0, 5),
  [0, 1, 2, 3, 4]
)
equal(
  range(9, 11),
  [9, 10]
)

equal(
  linspace(0, 1, 3),
  [0, 0.5, 1]
)


function equal(a: object, b: object) {
  if (!_.isEqual(a, b)) {
    throw Error(`Objects don't match! ${a},!= ${b}`)
  }
}

