// type Unit = string
// type Variable = Unit
// type Constant = Unit
//type Character = Variable | Constant


type l_system =
  {
    variables: Character[]
    , constants: Character[]
    , axiom: Axiom
    , rule: Rule
  }

// Algea

type Axiom = Character[]
type Character = "A" | "B"
type Rule = (n: Character[]) => Character[]

const algae: l_system =
{
  variables: ["A", "B"],
  constants: [],
  axiom: ["A"],
  rule: (n: Character[]) => {
    return n.map((c) => c == "A" ? ["A", "B"] : ["A"]).flat() as Character[]
  }

}

// // Algea
//
// type A = "A"
// type B = "B"
// type Axiom = Character[]
// type Character = A | B
// type Rule = (n: Character[]) => Character[]
//
// const algae: l_system =
// {
//   variables: ["A", "B"],
//   constants: [],
//   axiom: ["A"],
//   rule: (n: Character[]) => {
//     return n.map((c) => c == "A" ? ["A", "B"] : ["A"]).flat() as Character[]
//   }
//
// }

// Run

let val: Character[] = algae.axiom
console.log(val.join(""))

for (let i = 0; i < 5; i++) {
  val = algae.rule(val)
  console.log(val.join(""))
}

