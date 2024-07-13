import vs_source from './shaders/vertex.glsl'
import fs_source from './shaders/fragment.glsl'
import { Color } from '../util/util'
import { mat4 } from 'gl-matrix'
import _ from 'lodash'
export type Frame = {
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  canvas: HTMLCanvasElement
  viewMatrixLocation: WebGLUniformLocation,
  uniforms: {
    viewMatrix: mat4
  }
  vbos: {
    positions: number[]
    colors: number[]
  }
  buffers: {
    position: WebGLBuffer
    color: WebGLBuffer
  }
}


export function createFrame(positions: number[],
  colors: number[],
  viewMatrix: mat4,
  backgroundColor: Color = [253 / 255, 246 / 255, 227 / 255, 1.0]
): Frame {
  // Initialize WebGL
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl');

  if (!gl) {
    throw ('Unable to initialize WebGL. Your browser may not support it.');
  }


  gl.clearColor(...backgroundColor)
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the output resolution and viewport
  // We can change the output resolution later on.
  // This is helpful, for example, when the user changes the size of the window.
  // const pixelRatio = 1//window.devicePixelRatio || 1;
  // canvas.width = pixelRatio * canvas.clientWidth;
  // canvas.height = pixelRatio * canvas.clientHeight;
  updateViewport(gl, canvas)

  gl.lineWidth(1.0);	// we are not really drawing lines in this example, so this command is totally unnecessary.


  ///////////////////////////////////////////////////////////////////////
  // Initialize the vertex buffer objects
  // We can update the contents of the vertex buffer objects anytime.
  // We do NOT need to create them again.

  //create
  const position_buffer = gl.createBuffer()!;
  setBufferData(gl, position_buffer, positions)
  //create
  const color_buffer = gl.createBuffer()!;
  setBufferData(gl, color_buffer, colors)

  ///////////////////////////////////////////////////////////////////////
  // Compile the vertex and fragment shaders into a program
  // We can modify the shader source code and recompile later,
  // though typically a WebGL application would compile its shaders only once.
  // An application can have multiple shader programs and bind a different
  // shader program for rendering different objects in a scene.


  const vs = gl.createShader(gl.VERTEX_SHADER)!;

  gl.shaderSource(vs, vs_source);
  gl.compileShader(vs);

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vs));
    gl.deleteShader(vs);
  }


  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, fs_source);
  gl.compileShader(fs);

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fs));
    gl.deleteShader(fs);
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    alert(gl.getProgramInfoLog(prog));
  }


  ///////////////////////////////////////////////////////////////////////
  // Update shader uniform variables
  // Before we render, we must set the values of the uniform variables.
  // The uniform variables can be updated as frequently as needed.

  const viewMatrixLocation = gl.getUniformLocation(prog, 'trans');


  gl.useProgram(prog);
  gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);


  ///////////////////////////////////////////////////////////////////////
  // Set the vertex buffers used for rendering
  // Before we render, we must specify which vertex attributes are used
  // and which vertex buffer objects contain their data.
  // Note that different objects can use different sets of attributes
  // stored in different vertex buffer objects.

  const p = gl.getAttribLocation(prog, 'pos');
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(p);

  const c = gl.getAttribLocation(prog, 'clr');
  gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
  gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(c);

  const uniforms = {
    viewMatrix: viewMatrix
  }
  const vbos = {
    positions: positions!,
    colors: colors!
  }
  const buffers = {
    position: position_buffer!,
    color: color_buffer!,

  }
  ///////////////////////////////////////////////////////////////////////
  // Render the scene
  // Now that everything is ready, we can render the scene.
  // Rendering begins with clearing the image.
  // Every time the scene changes, we must render again.
  return {
    gl: gl,
    program: prog,
    canvas: canvas,
    viewMatrixLocation: viewMatrixLocation!,
    uniforms: uniforms,
    vbos: vbos,
    buffers: buffers
  }
}


let needsUpdate = true

export function draw(oldFrame: Frame, userDraw: (frame: Frame, t: number) => Frame, t: number = 0) {
  const { gl, program, canvas, viewMatrixLocation } = oldFrame

  needsUpdate = needsUpdate || updateViewport(gl, canvas)

  const nextFrame = userDraw(oldFrame, t)

  // if (_.isEqual(nextFrame, oldFrame)) {
  if (!needsUpdate) {
    requestAnimationFrame((t) => draw(nextFrame, userDraw, t / 1000))
    return
  }
  needsUpdate = false

  const { buffers, vbos, uniforms } = nextFrame



  const widthRatio = canvas.width / canvas.height
  // const heightRatio = 1 / widthRatio

  //scale view to aspect ratio
  const projection = mat4.create()

  // The smaller dimension should be 1 to -1, the larger should be scaled by how much larger it is
  // const right = widthRatio < 1 ? 1 : widthRatio
  // const left = -right
  // const top = heightRatio < 1 ? 1 : heightRatio
  // const bottom = -top

  //mat4.ortho(projection, left, right, bottom, top, 0, 1000)
  mat4.perspective(projection, Math.PI / 16, widthRatio, 0, 1000)
  //mat4.identity(projection)


  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);



  const finalViewMatrix = mat4.create()
  mat4.multiply(finalViewMatrix, projection, uniforms.viewMatrix)

  gl.useProgram(program); // double check user didn't change programs


  //
  setBufferData(gl, buffers.position, vbos.positions)
  setBufferData(gl, buffers.color, vbos.colors)

  gl.uniformMatrix4fv(viewMatrixLocation, false, finalViewMatrix)//uniforms.viewMatrix);

  gl.lineWidth(1)

  gl.drawArrays(gl.LINES, 0, vbos.positions.length / 3);
  requestAnimationFrame((t) => draw(nextFrame, userDraw, t / 1000))
}


const setBufferData = (gl: WebGLRenderingContext, buffer: WebGLBuffer, data: number[]) => {
  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    buffer);

  //use
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(data),
    gl.STATIC_DRAW);
}

const updateViewport = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
  if (canvas.width != canvas.clientWidth ||
    canvas.height != canvas.clientHeight) {
    console.log("updating webgl canvas dim")
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    gl.viewport(0, 0, canvas.width, canvas.height);
    return true
  }
  return false
}



import { useEffect } from "react"

export function Frame() {
  useEffect(() => {

  })
  return (
    <>
      <canvas id="glCanvas" > </canvas>
    </>
  )
}
