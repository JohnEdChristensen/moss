import { ReactNode } from "react"
import { useTheme } from "../system/theme"
import { useWindowSize } from "usehooks-ts"
import { Plot } from "./plot"




interface MossSVGProps {
  children?: ReactNode,
  width?: number,
  height?: number,
  fill?: string,
  stroke?: string
}



export function MossSvg(props: MossSVGProps = {}) {
  const theme = useTheme()
  const { width: screenWidth, height: screenHeight } = useWindowSize()


  const { width = screenWidth - 4,
    height = screenHeight - 36,
    fill = "none",
    stroke = theme.colors.fg,
    children
  } = props
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={`${-100} ${-100} ${200} ${200}`}
    width={width}
    height={height}

    fill={fill}
    stroke={stroke}
  >
    <g transform="scale(1,-1)" >
      <Plot />
      {children}
    </g>
  </svg >
}
//<rect x={-width / 2} y={-height / 2} fill={theme.colors.fg} fillOpacity={.5} width={width} height={height} stroke={theme.colors.accent1} strokeWidth={10} />

