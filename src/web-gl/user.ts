import { mat4 } from "gl-matrix";
import { createFrame, draw } from "./frame";
import { Point3D, linspace, pointsToLineSegments } from "../util/util";



function generateCirclePoints(numPoints: number, radius = 1): Point3D[] {
  return linspace(0, 2 * Math.PI, numPoints + 1).map(i => {
    const angle = i
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return [x, y, 0];
  });
}
//const nSides = 3 + (Math.round((1 + Math.cos(t)) * 15))
const nSides = 5
const positions = pointsToLineSegments(
  generateCirclePoints(nSides, .5))

const colors = positions.flat()
  .map((p) => [...p, 1])
  .map(p => [p[0] + .5, p[1] + .5, p[2] + .4, p[3]])


export function run() {
  const frame = createFrame([], [], mat4.create());

  draw(frame, (frame, t) => {
    const viewMatrix = mat4.create()
    mat4.rotateZ(viewMatrix, mat4.create(), t / 4)

    return {
      ...frame, uniforms: { viewMatrix: viewMatrix },
      vbos: {
        positions: positions.flat().flat(),
        colors: colors.flat()
      }
    }
  })
}
