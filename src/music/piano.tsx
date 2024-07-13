import { useState } from "react";
import { Point, PolyLine, Rect } from "../geo/geo";
import { useTheme } from "../system/theme";
import { linspace, range } from "../util/util";
import { useCounter } from "usehooks-ts";

type Key = {
  position: Point,
  width: number,
  height: number,
  frequency: number,
  octave: number,
  name: string,
}
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const sharps = ["C#", "D#", "F#", "G#", "A#"]
const sharpOffsets = [1, 3, 7, 9, 11]
const waves: OscillatorType[] = ["sine", "triangle", "sawtooth", "square"]
const waveIcons = {
  "sine": <PolyLine points={linspace(-1.5, 1.5, 10).map(x => ({ x: x, y: Math.sin(x * 2) }))} />,
  "triangle": <g strokeLinejoin="round"><PolyLine points={[
    { x: -1.5, y: -1 },
    { x: -0.5, y: 1 },
    { x: .5, y: -1 },
    { x: 1.5, y: 1 },
  ]} /></g>,
  "sawtooth": <PolyLine points={[
    { x: -1.5, y: -1 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1.5, y: 1 },
    { x: 1.5, y: -1 },
  ]} />,
  "square": <PolyLine points={[
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ]} />
}

const audioCtx = new AudioContext()

const gainNode = audioCtx.createGain()
let oscillator = audioCtx.createOscillator()
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
// set options for the oscillator
gainNode.gain.value = 4

console.log("setup audio")
const playNote = (freq: number) => {
  if (gainNode && audioCtx) {

    oscillator = audioCtx.createOscillator()
    oscillator.connect(gainNode);
    oscillator.type = "sine"

    oscillator.detune.value = 100; // value in cents
    oscillator.frequency.value = freq

    oscillator.onended = function() {
      console.log("Your tone has now stopped playing!");
    };
    oscillator.start(audioCtx.currentTime);
    //newOscillator.stop(audioCtx.currentTime + 1)
    console.log("playing freq ", freq)
  }
}


const endNode = () => {
  if (gainNode && oscillator && audioCtx) {
    console.log("stopping note")
    oscillator.stop(audioCtx.currentTime)
  }
}

export function Piano() {
  const { colors } = useTheme()
  const pianoLength = 160
  const pianoHeight = 30
  const numKeys = 36
  const keyWidth = pianoLength / 21
  const xs = linspace(-80, 80, 22)
  const frequency = range(0, numKeys).map(i => Math.pow(2, i / 12) * 440)

  // const [audioCtx, setAudioCtx] = useState<AudioContext | null>()
  // const [oscillator, setOscillator] = useState<OscillatorNode | null>()
  // const [gainNode, setGainNode] = useState<GainNode | null>()
  const waveIndexCounter = useCounter()
  const currentWave = waves[waveIndexCounter.count]

  // useEffect(() => {
  //
  // }, [])
  // connect oscillator to gain node to speakers

  // const playNote = useCallback((freq: number) => {
  //   if (gainNode && audioCtx) {
  //
  //     const newOscillator = audioCtx.createOscillator()
  //     newOscillator.connect(gainNode);
  //     newOscillator.type = currentWave
  //
  //     newOscillator.detune.value = 100; // value in cents
  //     newOscillator.frequency.value = freq
  //
  //     newOscillator.onended = function() {
  //       console.log("Your tone has now stopped playing!");
  //     };
  //     newOscillator.start(audioCtx.currentTime);
  //     //newOscillator.stop(audioCtx.currentTime + 1)
  //     setOscillator(newOscillator)
  //     console.log("playing freq ", freq)
  //   }
  // }, [waveIndexCounter, gainNode, audioCtx])
  //
  // const endNode = useCallback(() => {
  //   if (gainNode && oscillator && audioCtx) {
  //     console.log("stopping note")
  //     oscillator.stop(audioCtx.currentTime)
  //     setOscillator(oscillator)
  //   }
  // }, [gainNode, oscillator, audioCtx])


  const notes = frequency.map((f, i) => ({
    frequency: f,
    name: noteNames[i % noteNames.length],
    octave: Math.floor(i / 12)
  })
  )
  const naturalKeys = notes.filter(n => !sharps.includes(n.name))
  const sharpKeys = notes.filter(n => sharps.includes(n.name))

  const keys = naturalKeys.map((k, i) => ({
    ...k,
    position: { x: xs[i], y: 0 },
    width: keyWidth,
    height: pianoHeight
  })).concat(
    sharpKeys.map((k) => ({
      ...k,
      position: {
        x: xs[0] +
          (((k.octave) * 14) +
            sharpOffsets[sharps.indexOf(k.name)]) * (keyWidth / 2), y: 0
      },
      width: keyWidth,
      height: pianoHeight
    }))
  )

  return <g >
    <g fill={colors.bgHover} stroke={colors.neutral} strokeOpacity=".2" strokeWidth={.5}>
      <Rect width={170} height={pianoHeight * 1.25} y={5} attr={{ rx: 1 }} />
    </g>
    {keys.map(key =>
      <g key={key.frequency}
        onPointerDown={() => playNote(key.frequency)}
        onPointerUp={() => endNode()}
        onPointerLeave={() => endNode()}
      >
        <KeyEl {...key} />
      </g>
    )}
    <g id="wave-selector"
      onPointerDown={() => waveIndexCounter.setCount((waveIndexCounter.count + 1) % waves.length)}
      transform={` translate(-80,38)`} strokeWidth={.3} >
      <g>
        <g transform="rotate(-45)
        translate(-12,0)">
          <PolyLine points={[{ x: 2, y: 0 }, { x: 9, y: 0 }]} />
          <g transform="rotate(45) ">
            {waveIcons["sine"]}
          </g>
        </g>
        <g transform="rotate(-22.5)
        translate(-12,0)">
          <PolyLine points={[{ x: 2, y: 0 }, { x: 9, y: 0 }]} />
          <g transform="rotate(22.5) ">
            {waveIcons["triangle"]}
          </g>
        </g>
        <g transform="rotate(0)
        translate(-12,0) ">
          <PolyLine points={[{ x: 2, y: 0 }, { x: 9, y: 0 }]} />
          {waveIcons["sawtooth"]}
        </g>
        <g transform="rotate(22.5)
          translate(-12,0)">
          <PolyLine points={[{ x: 2, y: 0 }, { x: 9, y: 0 }]} />
          <g transform="rotate(-22.5)">
            {waveIcons["square"]}
          </g>
        </g>
        <g transform={`rotate(${-45 + 22.5 * (waveIndexCounter.count)}) `}>
          <circle r={2} fill={colors.fgSelected} stroke="none" />
          <circle cx={-1} r={.75} stroke="none" fill={colors.neutral} />
        </g>
      </g>
    </g >
  </g >
}


function KeyEl({ position: p, width, height, name }: Key) {
  const { colors } = useTheme()
  const [isHover, setHover] = useState(false)
  const [isClick, setClick] = useState(false)
  const isSharp = sharps.includes(name)

  const keyColor = isSharp ? colors.neutral : colors.fg
  return <g
    fill={keyColor}
    stroke="none"
    strokeWidth={0}
    strokeLinejoin="round"
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => {
      setHover(false)
      setClick(false)
    }}
    onPointerDown={() => setClick(true)}
    onPointerUp={() => setClick(false)}
  >
    <Rect
      width={width - (isSharp ? 1 : .5)}
      height={isSharp ? height * .6 : height}
      x={p.x}
      y={isSharp ? height * .5 : 0}

      attr={{
        rx: "1.5",
        style: {
          filter:
            `brightness(${isClick ? .95 : isHover ? 1.05 : 1})`
        }
      }}
    />
  </g>

}
// <Rect
//   width={width - (isSharp ? 1 : .5)}
//   height={isSharp ? height * .75 : height}
//   x={p.x}
//   y={isSharp ? height * .5 : 0}
//
//   attr={{
//     rx: "1.5",
//     fill: isClick
//       ? "#00000022"
//       : isHover
//         ? "#ffffff11"
//         : "none"
//
//   }}
// />
