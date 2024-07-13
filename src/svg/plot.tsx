import { useTheme } from "../system/theme"
import { linspace } from "../util/util"


export function Plot() {
  const theme = useTheme()
  return <g stroke={theme.colors.fg}>
    <Axis />
    <GridLines />
    <g transform="rotate(90)">
      <Axis />
      <GridLines />
    </g>
  </g>
}

function Axis() {
  const ticks = linspace(-200, 200, 21)
  const tickHeight = 1
  return <g strokeWidth={.1}>
    <path d={`M -200 0 L 200 0`} />
    {ticks.map((x, i) => <path key={i} d={`M ${x} ${-tickHeight} L ${x} ${tickHeight}`} />)}
  </g>
}
function GridLines() {
  const marks = linspace(-200, 200, 21)
  return <g strokeWidth={.1} opacity={.2}>
    {marks.map((x, i) => <path key={i} d={`M ${x} ${-200} L ${x} ${200}`} />)}
  </g>
}
