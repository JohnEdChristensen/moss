import { useWindowSize } from "usehooks-ts"
import { useTheme } from "../system/theme"
import { useState } from "react"

export function LogicAnd() {
  return <g>
    <path d={`M -5 5 L 5 5 `} />
  </g>
}

//TODO finish this!
function screenToCanvas(x: number, y: number, width: number, height: number) {
  return { x: width / 2 + x, y: height / 2 - y }
}
export function LogicCanvas() {
  const theme = useTheme()

  const { width, height } = useWindowSize()
  const { x: svgHeight, y: svgWidth } = { x: width / 2, y: height / 2 }
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 })


  return <svg
    style={{
      boxSizing: "border-box",
      padding: "2px",
    }}
    width={svgWidth}
    height={svgHeight}
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`${-svgWidth / 2} ${-svgHeight / 2} ${svgWidth} ${svgHeight}`}
    stroke="currentColor"
    fill="none"
    strokeWidth={3}
    onPointerOver={(_) => { }}//setMousePosition()}
  >
    <g transform="scale(1,-1)" >
      <path stroke={theme.colors.accent1} d="M 0 0 V 100" />
      <path stroke={theme.colors.accent2} d="M 0 0 H 100" />
      <circle
        strokeWidth={2}
        strokeDasharray={10}
        r={100}
        stroke={theme.colors.fg} />
      <circle stroke="none" fill={theme.colors.accent3} r="10" cx={mousePosition.x} cy={mousePosition.y} />
    </g>
  </ svg >
}

