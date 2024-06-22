import { Color } from "../util"

export type Character<C extends string = any> = C
type Rules<T extends Character> = Map<T, T[]>
export type ActionMap<T extends Character> = Map<T, Action>

export type Action =
  | { type: "rotate", degrees: number }
  | { type: "forward", distance: number }
  | { type: "color", color: Color }
  | { type: "push", action?: Action }
  | { type: "pop", action?: Action }

type l_system<T extends Character> =
  {
    name: string
    , axiom: T[]
    , rules: Rules<T>
    , actions: ActionMap<T>
  }

export function evaluateRules<T extends Character>
  (l_system: l_system<T>, depth: number, n: T[] = []): T[] {
  const next_iter = depth == 0 ? l_system.axiom :
    evaluateRules(l_system, depth - 1, n)
      .map((c) => {
        const expanded = l_system.rules.get(c)
        return expanded === undefined ? [c] : expanded
      })
      .flat()
  return next_iter
}

const algae: l_system<"A" | "B"> =
{
  name: "Algea",
  axiom: ["A"],
  rules: new Map([
    ["A", ["A", "B"]],
    ["B", ["A"]]
  ]),
  actions: new Map([])
}

const binaryTree: l_system<"0" | "1" | "[" | "]"> =
{
  name: "BinaryTree",
  axiom: ["0"],
  rules: new Map([
    ["1", ["1", "1"]],
    ["0", ["1", "[", "0", "]", "0"]],
  ]),
  actions: new Map([
    ["0", { type: "forward", distance: 10 }],
    ["1", { type: "forward", distance: 10 }],
    ["[", { type: "push", action: { type: "rotate", degrees: 45 } }],
    ["]", { type: "pop", action: { type: "rotate", degrees: -45 } }]
  ])
}
const dragon: l_system<"F" | "G" | "+" | "-"> =
{
  name: "Dragon",
  axiom: ["F"],
  rules: new Map([
    ["F", ["F", "+", "G"]],
    ["G", ["F", "-", "G"]],
  ]),
  actions: new Map([
    ["F", { type: "forward", distance: 10 }],
    ["G", { type: "forward", distance: 10 }],
    ["+", { type: "rotate", degrees: 90 }],
    ["-", { type: "rotate", degrees: -90 }]
  ])
}
const plant: l_system<"X" | "F" | "+" | "-" | "[" | "]"> =
{
  name: "Plant",
  axiom: ["X"],
  rules: new Map([
    ["X", ["F", "+", "[", "[", "X", "]", "-", "X", "]", "-", "F", "[", "-", "F", "X", "]", "+", "X"]],
    ["F", ["F", "F"]],
  ]),
  actions: new Map([
    ["F", { type: "forward", distance: 10 }],
    ["+", { type: "rotate", degrees: 25 }],
    ["-", { type: "rotate", degrees: -25 }],
    ["[", { type: "push" }],
    ["]", { type: "pop", }]
  ])
}

export const systems = { algae: algae, binaryTree: binaryTree, dragon: dragon, plant: plant }
//evaluateRules(algae, 5)
//evaluateRules(binaryTree, 3)
