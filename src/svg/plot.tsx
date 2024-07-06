import { linspace } from "../util/util"


export function Plot() {
  return <g>
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
    {ticks.map(x => <path d={`M ${x} ${-tickHeight} L ${x} ${tickHeight}`} />)}
  </g>
}
function GridLines() {
  const marks = linspace(-200, 200, 21)
  return <g strokeWidth={.1} opacity={.2}>
    {marks.map(x => <path d={`M ${x} ${-200} L ${x} ${200}`} />)}
  </g>
}
