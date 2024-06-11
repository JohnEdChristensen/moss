type Character<C extends string = any> = C
type Axiom = Character[]
type Rules<T extends Character> = Map<T, T[]>
type Actions<T extends Character> = Map<T, Action>
type Action =
  | { type: "rotate", degrees: number }
  | { type: "forward", distance: number }
  | { type: "color", color: [number, number, number] }
  | { type: "push", action: Action }
  | { type: "pop", action: Action }

type l_system<T extends Character> =
  {
    name: string
    , axiom: T[]
    , rules: Rules<T>
    , actions?: Actions<T>
  }

function evaluateRules<T extends Character>
  (l_system: l_system<T>, depth: number, n: T[] = []): T[] {
  const next_iter = depth == 0 ? l_system.axiom :
    evaluateRules(l_system, depth - 1, n)
      .map((c) => {
        const expanded = l_system.rules.get(c)
        return expanded === undefined ? [c] : expanded
      })
      .flat()
  console.log(next_iter.join(""))
  return next_iter
}

const algae: l_system<"A" | "B"> =
{
  name: "Algea",
  axiom: ["A"],
  rules: new Map([
    ["A", ["A", "B"]],
    ["B", ["A"]]
  ])
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

const systems = [algae, binaryTree]
evaluateRules(algae, 5)
evaluateRules(binaryTree, 3)
