import { createContext, useContext } from "react";
import { Point } from "../geo/geo";

export interface CanvasInfo {
  canvasWidth: number,
  canvasHeight: number,
  viewWidth: number
  viewHeight: number
  mousePosition: Point
}

export const createCanvasInfo = (canvasWidth: number, canvasHeight: number, mousePosition: Point): CanvasInfo => {
  const [viewWidth, viewHeight] = canvasWidth < canvasHeight
    ? [200, 200 * canvasHeight / canvasWidth]
    : [200 * canvasWidth / canvasHeight, 200]

  return {
    canvasWidth,
    canvasHeight,
    viewWidth,
    viewHeight,
    mousePosition
  }
}


export const CanvasInfoContext = createContext<CanvasInfo | null>(null)

export function useCanvasInfo() {
  const canvasInfo = useContext(CanvasInfoContext)
  if (!canvasInfo) {
    throw Error("Must be used inside CanvasInfo Provider")
  }
  return canvasInfo
}

