import { createFrame, draw } from "./frame";

type Point3D = [number, number, number];

// const colors = [
//   1, 0, 0, 1,
//   0, 1, 0, 1,
//   0, 1, 0, 1,
//   0, 0, 1, 1,
//   0, 0, 1, 1,
//   1, 0, 1, 1,
//   1, 0, 0, 1,
//   0, 1, 0, 1,
//   0, 1, 0, 1,
//   0, 0, 1, 1,
//   0, 0, 1, 1,
//   1, 0, 1, 1
// ];
const matrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1];


const range = (start: number, end: number) => Array.from({ length: end - start }, (_, i) => i + start);

const linspace = (start: number, end: number, numPoints: number): number[] => {
  const segment = (end - start) / numPoints
  return range(0, numPoints).map(i => i * segment)
}

function generateCirclePoints(numPoints: number, radius = 1): Point3D[] {
  return linspace(0, 2 * Math.PI, numPoints).map(i => {
    const angle = i
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return [x, y, 0];
  });
}

function pointsToLineSegments(points: Point3D[]) {
  return points
    .map((p, i, a) => i < a.length - 1 ? [p, a[i + 1]] : [a[i], a[0]])
}


export function run() {
  const frame = createFrame([], [], matrix);

  draw(frame, (frame, t) => {
    t = t / 1000
    const nSides = 3 + (Math.round((1 + Math.cos(t)) * 15))

    const positions = pointsToLineSegments(
      generateCirclePoints(nSides, .5))

    const colors = positions.flat()
      .map((p) => [...p, 1])
      .map(p => [p[0] + .5, p[1] + .5, p[2] + .4, p[3]])


    const m = [
      -Math.sin(t), Math.cos(t), 0, 0,
      Math.cos(t), Math.sin(t), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]
    frame.uniforms.viewMatrix = m
    frame.vbos.positions = positions.flat().flat()
    frame.vbos.colors = colors.flat()


    return frame
  })

}
