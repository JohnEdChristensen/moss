import { useEffect, useState } from "react"

export const Asteroids = () => {

  return <g>
    <Ship />
  </g>
}

function Ship() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [count, setCount] = useState(0)
  console.log(position)

  // const move = useCallback(({ x: dx, y: dy }: { x: number, y: number }) => {
  //   console.log(count)
  //   console.log(dx, dy, position)
  //   setPosition({ x: position.x + dx, y: 5 })
  //   setCount(count + 1)
  // }, [count])

  const handleKeyDown = (e: any) => {
    console.log(e)
    console.log(position)
    if (e.key == "w") {
      console.log("w!")
      console.log(position)
      setPosition({ x: position.x + 1, y: position.y + 1 })
      // move({ x: 0, y: 1 })
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [position]);

  return <g transform={`translate(${position.x} ,${position.y})`} >
    <path d="M 0 0 L -5, -10 L 0 10  L 5 -10 z" />
  </g>
}

