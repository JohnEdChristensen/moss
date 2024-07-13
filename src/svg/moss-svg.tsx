import { ReactNode, useCallback, useState } from "react"
import { useTheme } from "../system/theme"
import { useWindowSize } from "usehooks-ts"
import { CanvasInfoContext, createCanvasInfo } from "./useCanvasSize"
import _ from "lodash"


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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { width = screenWidth - 4,
    height = screenHeight - 36,
    fill = "none",
    stroke = theme.colors.fg,
    children
  } = props
  const canvasInfo = createCanvasInfo(width, height, mousePosition)

  const handleMouseMove = useCallback(
    _.throttle(
      (e) => {
        const x = e.screenX - 4
        const y = e.screenY - 36
        setMousePosition({
          x: (x - width / 2) * (canvasInfo.viewWidth / width),
          y: -1 * (y - height / 2) * (canvasInfo.viewHeight / height)
        })
      }
      , 16), [width, height]);

  return <CanvasInfoContext.Provider value={canvasInfo}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${-100} ${-100} ${200} ${200}`}
      width={width}
      height={height}

      fill={fill}
      stroke={stroke}
      onPointerMove={handleMouseMove}
    >
      <g transform="scale(1,-1)" >
        {children}
      </g>
    </svg >
  </CanvasInfoContext.Provider >
}
