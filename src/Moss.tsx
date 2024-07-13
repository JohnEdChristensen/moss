import { useTheme, VSeperator } from "./system/theme"
import { MenuItem, TitleBar } from "./system/TitleBar"
import { SvgEditor } from "./svg/svg-editor"

import "./style.css"
import { useState } from "react"
import { LogicCanvas } from "./svg/logic-gates"
import { L_System } from "./l-system/render"
import { Geo } from "./geo/geo"
import { MossSvg } from "./svg/moss-svg"
import { Piano } from "./music/piano"
import { Asteroids } from "./asteroid/asteroidGame"

const modes = [
  "Asteroids",
  "Keys",
  "Geo",
  "L-Systems",
  "SVG",
  "Logic-gates"
] as const

export type Mode = typeof modes[number]

export function App() {
  const theme = useTheme()
  const [mode, setMode] = useState<Mode>(modes[0])

  return <div style={{
    color: theme.colors.fg,
    backgroundColor: theme.colors.bg,
    border: theme.styleConstants.border,
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  }}>
    <TitleBar>
      {modes.map(m =>
        <MenuItem
          key={m}
          onClick={() => setMode(m)}
          selected={m == mode}
        >
          {m}
        </MenuItem>
      )
      }
    </TitleBar>
    <VSeperator />
    <MainContent mode={mode} />
  </div>
}

function MainContent({ mode = "SVG" }: { mode: Mode }) {
  if (mode == "SVG") {
    return <SvgEditor />
  }
  if (mode == "L-Systems") {
    return <L_System />
  }
  if (mode == "Geo") {
    return <MossSvg>
      <Geo />
    </MossSvg>
  }
  if (mode == "Logic-gates") {
    return <LogicCanvas />
  }
  if (mode == "Keys") {
    return <MossSvg>
      <Piano />
    </MossSvg>
  }
  if (mode == "Asteroids") {
    return <MossSvg>
      <Asteroids />
    </MossSvg>
  }
}
