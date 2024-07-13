import { useTheme } from "../system/theme"
import { useCanvasInfo } from "../svg/useCanvasSize"
import { Plot } from "../svg/plot"
import { SVGAttributes } from "react"

export const PI = Math.PI


export function Geo() {
  const theme = useTheme()

  const boxWidth = 40
  const boxHeight = 80

  const corners =
    [
      { x: -boxWidth / 2, y: -boxHeight / 2 },
      { x: boxWidth / 2, y: -boxHeight / 2 },
      { x: boxWidth / 2, y: boxHeight / 2 },
      { x: -boxWidth / 2, y: boxHeight / 2 },
    ]
  const walls: Segment[] = [
    { start: corners[0], end: corners[1] },
    { start: corners[1], end: corners[2] },
    { start: corners[2], end: corners[3] },
    { start: corners[3], end: corners[0] },
  ]
  walls


  return <g stroke={theme.colors.accent1} strokeWidth={1}>
    <Plot />
    <PolyLine points={corners} closed={true} />
    <Dynamic />
  </g>
}
export function Dynamic() {
  const { mousePosition } = useCanvasInfo()
  const theme = useTheme()
  const ray: Ray = rayFromPoints(mousePosition, { x: 0, y: 0 })
  return <g><RaySvg ray={ray} />
    <circle cx={mousePosition.x} cy={mousePosition.y} fill={theme.colors.accent2} r={4} stroke="none" />

  </g>
}


export function Rect(props: { fill?: string, x?: number, y?: number, width?: number, height?: number, attr?: React.SVGProps<SVGRectElement> }) {
  const { width = 100, height = 100, fill } = props
  const { x = -width / 2, y = -height / 2 } = props
  return <rect x={x}
    y={y}
    width={width}
    height={height}
    fill={fill}

    {...props.attr}
  />
}

export type Point = {
  x: number,
  y: number
}

export type Segment = {
  start: Point,
  end: Point
}

export type Ray = {
  angle: number,
  position: Point
}

export const angleOfLine = (start: Point, end: Point) => {
  return Math.atan2(end.y - start.y, end.x - start.x)
}
export const rayFromPoints = (anchor: Point, point: Point) => {
  return {
    angle: angleOfLine(anchor, point),
    position: anchor
  }

}

export function RaySvg(props: { ray: Ray }) {
  const { ray } = props
  const { viewWidth, viewHeight } = useCanvasInfo()
  // visible portion of ray should never be longer than sum of screen dim
  const rayLength = viewWidth + viewHeight
  const x = Math.cos(ray.angle) * rayLength + ray.position.x
  const y = Math.sin(ray.angle) * rayLength + ray.position.y
  return <PolyLine points={[ray.position, { x, y }]} />
}

export function PolyLine(props: { points: Point[], closed?: boolean }) {
  const { points, closed } = props
  return <path d={points.map(
    (p, i) =>
      `${i == 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")
    .concat(closed ? "Z" : "")
  } />
}
