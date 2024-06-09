import vs_source from './shaders/vertex.glsl'
import fs_source from './shaders/fragment.glsl'


type Frame = {
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  viewMatrixLocation: WebGLUniformLocation,
  uniforms: {
    viewMatrix: number[]
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

export function createFrame(positions: number[], colors: number[], viewMatrix: number[]): Frame {
  // Initialize WebGL
  const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const gl = canvas.getContext('webgl');

  if (!gl) {
    throw ('Unable to initialize WebGL. Your browser may not support it.');
  }

  gl.clearColor(253 / 255, 246 / 255, 227 / 255, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the output resolution and viewport
  // We can change the output resolution later on.
  // This is helpful, for example, when the user changes the size of the window.
  // const pixelRatio = 1//window.devicePixelRatio || 1;
  // canvas.width = pixelRatio * canvas.clientWidth;
  // canvas.height = pixelRatio * canvas.clientHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.lineWidth(1.0);	// we are not really drawing lines in this example, so this command is totally unnecessary.


  ///////////////////////////////////////////////////////////////////////
  // Initialize the vertex buffer objects
  // We can update the contents of the vertex buffer objects anytime.
  // We do NOT need to create them again.


  //create
  const position_buffer = gl.createBuffer();

  //bind (later options will apply to this buffer)
  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    position_buffer);

  //use
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW);

  //create
  const color_buffer = gl.createBuffer();

  //bind (later options will apply to this buffer)
  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    color_buffer);

  //use
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW);


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
  return { gl: gl, program: prog, viewMatrixLocation: viewMatrixLocation!, uniforms: uniforms, vbos: vbos, buffers: buffers }
  //draw(gl, 0)
}

export function draw(frame: Frame, userDraw: (frame: Frame, t: number) => Frame, t: number = 0) {
  const { gl, program, viewMatrixLocation } = frame
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  const { uniforms, vbos, buffers } = userDraw(frame, t)

  // //bind (later options will apply to this buffer)
  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    buffers.position);

  //use
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vbos.positions),
    gl.STATIC_DRAW);

  //bind (later options will apply to this buffer)
  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    buffers.color);

  //use
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vbos.colors),
    gl.STATIC_DRAW);
  // //
  // //
  // const p = gl.getAttribLocation(program, 'pos');
  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  // gl.vertexAttribPointer(p, 3, gl.FLOAT, false, 0, 0);
  //
  // const c = gl.getAttribLocation(program, 'clr');
  // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  // gl.vertexAttribPointer(c, 4, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.uniformMatrix4fv(viewMatrixLocation, false, uniforms.viewMatrix);

  gl.lineWidth(3)

  gl.drawArrays(gl.LINES, 0, vbos.positions.length / 3);
  requestAnimationFrame((t) => draw(frame, userDraw, t))
}



