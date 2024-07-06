import { ReactNode, useRef, useState } from "react";
import { VSeperator, useTheme } from "../system/theme";
import { range } from "lodash";
import { useHover } from "usehooks-ts";
// import { Editor } from "./components/editor";
// import ReactDomServer from "react-dom/server"
import { linspace } from "../util/util";
import { Editor } from "./editor";
import * as ReactDomServer from 'react-dom/server';
import { Plot } from "./plot";

export const cross = () => {
  return <g transform="rotate(45)">
    <path
      d="M 0 -10 
         L 0 10 
         M -10 0
         L 10 0
         "/>
  </g>
}
export const box = () => {
  //box corners should be at endpoints of cross
  const r = 7 //Math.round(Math.cos(Math.PI / 4) * 10) 
  return <g>
    <rect x={-r} y={-r} width={2 * r} height={2 * r} />
  </g>
}
export const minus = () => {
  // same width as box
  const r = 7
  return <g>
    <path d={`M ${-r} 0 L ${r} 0`} />
  </g>
}

export const sun = () => {
  return <g transform="">
    {range(0, 360, 30).map((a) => {
      return (<g key={a} transform={`rotate(${a + 15})`}>
        <path d="M0 7L0 10" />
        <circle r={5} />
      </g>)
    })}
  </g>
}
export const sound = (points = [8, -8, 8, -8, 8, -8, 8]) => {
  console.log("points: ", points)
  const n = points.length
  const xs = linspace(-100, 100, n)
  const ys = points

  const path = "M -32 0 L ".concat(
    xs.map((p, i) =>
      [p, ys[i]].join(" ")
    )
      .join(" L "))

  console.log(path)

  return <g>
    <path strokeWidth={.1} stroke-linejoin="round" d={path} />
  </g>
}

export const Sin = () => {
  const xs = linspace(-10, 10, 400)
  const ys = xs.map(x => Math.sin(x) * 10)
  return sound(ys)
}
export const tan = () => {
  const xs = linspace(-10, 10, 400)
  const ys = xs.map(x => Math.tan(x))
  return sound(ys)
}
export const plot = () => {
  return <Plot />
}
export const compose = () => {
  return <g>
    <Sin />
    <Plot />
  </g>
}

export const svgGenerators = {
  cross: cross,
  box: box,
  minus: minus,
  sun: sun,
  sound: sound,
  sin: Sin,
  tan: tan,
  plot: plot,
  compose: compose,
}


export function SvgEditor() {
  const [currentSvg, setCurrentSvg] = useState(svgGenerators.cross())
  const theme = useTheme()
  console.log(currentSvg)

  // const image = `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="-16 -16 32 32">${currentSvg}</svg>`
  // const base64data = btoa(unescape(encodeURIComponent(image)));

  // return <img src={`data:image/svg+xml;base64,${base64data}`} alt="" />

  return <>
    <SvgIcon path={currentSvg} size="100%" color={theme.colors.accent1} worldSize={32} />

    <VSeperator />
    <Editor
      code={ReactDomServer.renderToString(currentSvg).replaceAll(">", ">\n")}
      onChange={(v) => { console.log(v) }}
    />

    <VSeperator />
    <SvgDrawer setCurrentSvg={setCurrentSvg} />
  </>
}
export function SvgDrawer(props: { setCurrentSvg: any }) {
  const { setCurrentSvg } = props
  return <>
    <div style={{
      lineHeight: 0,
      display: "flex"
    }}
    >
      {Object.entries(svgGenerators).map(([title, svg]) => {
        console.log("title: ", title)
        return <SvgIconPreview
          onClick={() => setCurrentSvg(svg())}
          key={title} size="32" path={svg()} />
      }
      )}
    </div>
  </>
}

function SvgIconPreview({ onClick, ...props }: any) {
  const ref = useRef(null)
  const hover = useHover(ref)
  const theme = useTheme()
  return <div ref={ref} onClick={onClick} style={{ backgroundColor: hover ? theme.colors.bgHover : "" }}>
    < SvgIcon  {...props} />
  </div>
}

export function SvgIcon(props: { path: ReactNode; size?: string; worldSize?: number; color?: string; }) {
  const theme = useTheme()
  const { path, size = "34", color = theme.colors.fg, worldSize = 32 } = props
  const viewBoxOffset = -worldSize / 2
  return <svg
    style={{
      boxSizing: "border-box",
      padding: "2px",
    }}
    width={size}
    height={size}
    color={color}
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`${viewBoxOffset} ${viewBoxOffset} ${worldSize} ${worldSize}`}
    stroke="currentColor"
    fill="none"
    strokeWidth={1}
  >
    <g transform="scale(1,-1)" >
      {path}
    </g>
  </svg>
}

