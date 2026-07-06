"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

// simplex noise — Ashima Arts / Ian McEwan (MIT)
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;

  float t = u_time * 0.045;
  vec2 m = (u_mouse - 0.5) * 0.35;

  float n1 = fbm(p * 1.3 + vec2(t * 0.9, -t * 0.55) + m);
  float n2 = fbm(p * 2.1 - vec2(t * 0.5, t * 0.85) - m * 0.6);
  float n3 = fbm(p * 0.7 + vec2(-t * 0.3, t * 0.4));

  vec3 base = vec3(0.020, 0.020, 0.048);
  vec3 violet = vec3(0.34, 0.16, 0.75);
  vec3 cyan   = vec3(0.05, 0.45, 0.60);
  vec3 acid   = vec3(0.62, 0.92, 0.10);

  float bandV = smoothstep(0.08, 0.90, n1 * 0.5 + 0.5) * smoothstep(1.05, 0.20, uv.y + n3 * 0.3);
  float bandC = smoothstep(0.25, 0.92, n2 * 0.5 + 0.5) * smoothstep(-0.05, 0.80, uv.y + n1 * 0.2);
  float spark = pow(max(n1 * n2, 0.0), 2.2);

  vec3 col = base;
  col += violet * bandV * 1.05;
  col += cyan * bandC * 0.78;
  col += acid * spark * 0.95;

  // vignette
  float vig = smoothstep(1.35, 0.30, length(uv - vec2(0.5, 0.45)) * 1.55);
  col *= vig;

  // dither to kill banding
  float dith = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dith - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Full-viewport WebGL aurora. Raw WebGL — no three.js, ~2KB of shader.
 * Renders at DPR 1 / ~30fps (the content is low-frequency blur; anything
 * more is wasted battery), pauses offscreen, survives context loss.
 */
export default function AuroraCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposers: Array<() => void> = [];

    const setup = () => {
      // NOTE: never loseContext() in cleanup — under React StrictMode the
      // effect re-runs and getContext() returns the same (dead) context,
      // leaving the canvas permanently black.
      const gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
      if (!gl || gl.isContextLost()) return;

      const compile = (type: number, src: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error("[aurora] shader compile failed:", gl.getShaderInfoLog(s));
        }
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("[aurora] program link failed:", gl.getProgramInfoLog(prog));
        return;
      }
      gl.useProgram(prog);

      // fullscreen triangle
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "u_res");
      const uTime = gl.getUniformLocation(prog, "u_time");
      const uMouse = gl.getUniformLocation(prog, "u_mouse");

      const t0 = performance.now();
      const elapsed = () => 12 + (performance.now() - t0) / 1000;
      const mouse = [0.5, 0.5];
      let target = [0.5, 0.5];

      const draw = () => {
        gl.uniform1f(uTime, elapsed());
        gl.uniform2f(uMouse, mouse[0], mouse[1]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const resize = () => {
        // low-frequency blurry content — DPR 1 is indistinguishable and
        // cuts fragment work 2-4x on retina displays
        const w = Math.max(1, Math.floor(canvas.clientWidth));
        const h = Math.max(1, Math.floor(canvas.clientHeight));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
        gl.uniform2f(uRes, canvas.width, canvas.height);
        // setting canvas dimensions clears the drawing buffer — repaint
        // immediately so static (reduced-motion) users never see black
        draw();
      };

      const onMove = (e: PointerEvent) => {
        target = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
      };

      let visible = true;
      const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
      io.observe(canvas);

      let raf = 0;
      let last = 0;
      const render = (t: number) => {
        raf = requestAnimationFrame(render);
        if (!visible || document.hidden) return;
        if (t - last < 33) return; // ~30fps is plenty for slow-drifting clouds
        last = t;
        mouse[0] += (target[0] - mouse[0]) * 0.1;
        mouse[1] += (target[1] - mouse[1]) * 0.1;
        draw();
      };

      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("resize", resize);
      resize(); // sizes the buffer and paints the first frame
      if (!reduce) raf = requestAnimationFrame(render);

      disposers.push(() => {
        cancelAnimationFrame(raf);
        io.disconnect();
        removeEventListener("pointermove", onMove);
        removeEventListener("resize", resize);
      });
    };

    // iOS Safari evicts WebGL contexts under memory pressure — recover
    const onLost = (e: Event) => {
      e.preventDefault(); // required, or "restored" never fires
      disposers.forEach((d) => d());
      disposers = [];
    };
    const onRestored = () => setup();
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    setup();

    return () => {
      disposers.forEach((d) => d());
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
