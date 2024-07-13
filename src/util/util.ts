export type Point3D = [number, number, number];
export type Color = [number, number, number, number];

/** integer array from start to end-1 with steps of 1
 * ```js
 * range(0,5) // [0,1,2,3,4]
 * ```*/
export const range = (start: number, end: number) => Array.from({ length: end - start }, (_, i) => i + start);

/** generate n points evenly spaced between start and end: [start,end]
 * ```
 * linspace(0,1,5) // [0,0.25,0.5,0.75,1]
 * ```
 * */
export const linspace = (start: number, end: number, numPoints: number): number[] => {
  const segment = (end - start) / (numPoints - 1)
  return range(0, numPoints).map(i => start + i * segment)
}

export function generateCirclePoints(numPoints: number, radius = 1): Point3D[] {
  return linspace(0, 2 * Math.PI, numPoints).map(i => {
    const angle = i
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return [x, y, 0];
  });
}

export function pointsToLineSegments(points: Point3D[]) {
  return points
    .map((p, i, a) => i < a.length - 1 ? [p, a[i + 1]] : [a[i], a[0]])
}

export function fold<Acc, V>(reducer: (acc: Acc, v: V) => Acc, init: Acc, data: V[]) {
  let acc = init
  data.forEach((v) => { acc = reducer(acc, v) })

}


export const zip = <T, K>(a: T[], b: K[]): [T, K][] => a.map((e, i) => [e, b[i]])
