import { mat4 } from "gl-matrix";
import { createFrame, draw } from "../web-gl/frame";
import { Character, ActionMap, Action, systems, evaluateRules } from "./model";
import { Color, Point3D, range } from "../util/util";
import { MossSvg } from "../svg/moss-svg";
import { useTheme } from "../system/theme";


export function L_System() {
  const theme = useTheme()

  const btree = systems["plant"]
  const sequence = evaluateRules(btree, 5)
  const lines = buildSegmentsSVG(sequence, btree.actions).elements


  return <MossSvg>
    <g stroke={theme.colors.accent1} strokeWidth={.2} transform={scaleToBoundsSVG(lines)}>
      {lines.map(l => <path d={`M ${l.start[0]} ${l.start[1]} 
                                L ${l.end[0]} ${l.end[1]}`
      } />)}
    </g>
  </MossSvg >
}


type Context = {
  angle: number,
  position: Point3D,
  color: Color
}

type Line = {
  start: Point3D,
  end: Point3D
}

type SVGState = {
  elements: Line[],
  context: Context
  contextStack: Context[]
}

type WebGLState = {
  points: Point3D[],
  colors: Color[],
  context: Context
  contextStack: Context[]
}


function buildSegmentsSVG<T extends Character>(sequence: T[], actions: ActionMap<T>): SVGState {
  const actionSequence = sequence.map((s) => actions.get(s)!)
  return stateReduceSVG(actionSequence, { elements: [], context: { angle: 0, color: [.5, .8, .5, 1], position: [0, 0, 0] }, contextStack: [] })
}

function stateReduceSVG(actionArray: Action[], initialState: SVGState) {
  let state = initialState
  actionArray.forEach((a: Action) => state = processActionSVG(state, a))
  return state
}

function processActionSVG(state: SVGState, action?: Action,): SVGState {
  const { context, contextStack, elements } = state
  const { angle, position } = context
  if (action === undefined) {
    return state
  }
  switch (action?.type) {
    case ("forward"): {
      const d = 1
      const dp = [Math.sin(Math.PI * angle / 180) * d, Math.cos(Math.PI * angle / 180) * d]
      const p = [position[0] + dp[0], position[1] + dp[1], position[2]] as Point3D
      const nContext = { ...context, position: p }
      return { ...state, elements: elements.concat({ start: context.position, end: p }), context: nContext }
    }
    case ("rotate"): {
      const nContext = { ...context, angle: angle + ((action.degrees + (Math.random() - .5) * 20) * ((Math.random()) > .05 ? 1 : -1)) }
      return { ...state, context: nContext }
    }
    case ("color"): {
      const nContext = { ...context, color: action.color }
      return { ...state, context: nContext }
    }
    case ("push"): {
      const nState = { ...state, contextStack: contextStack.concat(context) }
      return processActionSVG(nState, action.action)
    }
    case ("pop"): {
      //console.log(state)
      const nState = { ...state, context: contextStack[contextStack.length - 1], contextStack: contextStack.slice(0, -1) }
      return processActionSVG(nState, action.action)
    }
  }
}


function buildSegments<T extends Character>(sequence: T[], actions: ActionMap<T>): WebGLState {
  const actionSequence = sequence.map((s) => actions.get(s)!)
  return stateReduce(actionSequence, { points: [], colors: [], context: { angle: 0, color: [.5, .8, .5, 1], position: [0, 0, 0] }, contextStack: [] })
}

function stateReduce(actionArray: Action[], initialState: WebGLState) {
  let state = initialState
  actionArray.forEach((a: Action) => state = processActionWebGL(state, a))
  return state
}

function processActionWebGL(state: WebGLState, action?: Action,): WebGLState {
  const { context, contextStack, colors, points } = state
  const { angle, color, position } = context
  if (action === undefined) {
    return state
  }
  switch (action?.type) {
    case ("forward"): {
      const d = .10
      const dp = [Math.sin(Math.PI * angle / 180) * d, Math.cos(Math.PI * angle / 180) * d]
      const p = [position[0] + dp[0], position[1] + dp[1], position[2]] as Point3D
      const nContext = { ...context, position: p }
      return { ...state, points: points.concat([position], [p]), colors: colors.concat(color, color), context: nContext }
    }
    case ("rotate"): {
      const nContext = { ...context, angle: angle + ((action.degrees + (Math.random() - .5) * 20) * ((Math.random()) > .05 ? 1 : -1)) }
      return { ...state, context: nContext }
    }
    case ("color"): {
      const nContext = { ...context, color: action.color }
      return { ...state, context: nContext }
    }
    case ("push"): {
      const nState = { ...state, contextStack: contextStack.concat(context) }
      return processActionWebGL(nState, action.action)
    }
    case ("pop"): {
      //console.log(state)
      const nState = { ...state, context: contextStack[contextStack.length - 1], contextStack: contextStack.slice(0, -1) }
      return processActionWebGL(nState, action.action)
    }
  }
}



export function webgl_run() {

  const btree = systems["plant"]
  const sequence = evaluateRules(btree, 5)

  const { points, colors } = range(0, 10)
    .map(_ => ({
      xDisplaceNoise: (Math.random() - .5) * 2,
      zDisplaceNoise: (Math.random() * 10 + 1)
    }))
    .map(({ xDisplaceNoise, zDisplaceNoise }): WebGLState =>
      shiftAll(
        buildSegments(sequence, btree.actions),
        [xDisplaceNoise * zDisplaceNoise * 2, 0, - zDisplaceNoise]
      ))
    .reduce(
      (accState, nextState) => ({
        ...accState,
        points: accState.points.concat(nextState.points),
        colors: accState.colors.concat(nextState.colors)
      }))

  const viewMatrix = scaleToBounds(points)

  const frame = createFrame(points.flat().flat(), colors.flat(), viewMatrix);
  console.log("init", frame.vbos.positions)
  draw(frame, (frame, _t) => {
    return frame

    // return {
    //   ...frame, uniforms: { viewMatrix: viewMatrix },
    //   vbos: {
    //     positions: points.flat().flat(),
    //     colors: colors.flat()
    //   }
    // }
  })
}

const shift = (p: Point3D, dp: Point3D): Point3D => {
  return p.map((n, i) => n + dp[i]) as Point3D
}
const shiftAll = <Obj extends { points: Point3D[] }>(obj: Obj, dp: Point3D): Obj => {
  return {
    ...obj,
    points: obj.points.map(p => shift(p, dp))
  }
}

const scaleToBounds = (points: Point3D[], marginPercent: number = 0) => {
  const xs = points.map(p => p[0])
  const ys = points.map(p => p[1])

  const r = Math.max(...xs)
  const l = Math.min(...xs)
  const t = Math.max(...ys)
  const b = Math.min(...ys)
  const worldWidth = r - l
  const worldHeight = t - b
  const dx = (r + l) / 2 //avg lr
  const dy = (t + b) / 2 // avg rb

  const scaleFactor = (Math.max(worldWidth, worldHeight)) * (1 + marginPercent)

  const scaleMatrix = mat4.create()
  mat4.scale(scaleMatrix, scaleMatrix, [1 / scaleFactor, 1 / scaleFactor, 1])

  const transformMatrix = mat4.create()
  mat4.translate(transformMatrix, scaleMatrix, [-dx, -dy, 0])
  return transformMatrix
}

const scaleToBoundsSVG = (lines: Line[], marginPercent: number = .1) => {

  const xs = lines.map(l => l.start[0])
  const ys = lines.map(l => l.end[1])

  const r = Math.max(...xs)
  const l = Math.min(...xs)
  const t = Math.max(...ys)
  const b = Math.min(...ys)
  const worldWidth = r - l
  const worldHeight = t - b
  const dx = (r + l) / 2 //avg lr
  const dy = (t + b) / 2 // avg rb

  const scaleFactor = (Math.max(worldWidth, worldHeight)) * (1 - marginPercent) / 30

  const scaleMatrix = mat4.create()
  mat4.scale(scaleMatrix, scaleMatrix, [1 / scaleFactor, 1 / scaleFactor, 1])

  const transformMatrix = mat4.create()
  mat4.translate(transformMatrix, scaleMatrix, [-dx, -dy, 0])
  return `scale(${scaleFactor} ${scaleFactor})
          translate(${-dx} ${-dy})`
}

