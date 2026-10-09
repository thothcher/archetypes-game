// A tiny WebGL renderer for the vessel shader: one full-screen triangle, no 3D library.
// - compiles off the main thread when KHR_parallel_shader_compile is available
// - draws only while visible, and lowers its resolution if frames get slow
// - honours prefers-reduced-motion and survives WebGL context loss

import { fragment, vertex } from "./fluidShader";

export interface DragState {
  active: boolean;
  rot: number;
  vel: number;
}

export interface Targets {
  bounds: [number, number, number];
  self: number;
  soul: [number, number, number];
  fem: number;
}

const IDLE_SPIN = 0.18;
const PULSE_INDEX = { shadow: 0, soul: 1, self: 2, persona: 3 } as const;
const COLORS = {
  uC0: [0.2, 0.08, 0.38],
  uC2: [1.0, 0.78, 0.3],
  uC3: [0.78, 0.82, 0.9],
} as const;

export class VesselRenderer {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private last = 0;
  private visible = false;
  private ready = false;
  private disposed = false;

  // animated state
  private time = 0;
  private bounds: [number, number, number];
  private self: number;
  private soul: [number, number, number];
  private fem: number;
  private slosh = 0;
  private spin = 0;
  private pulse = [0, 0, 0, 0];

  // adaptive resolution
  private scale = 1;
  private frameAvg = 1 / 60;
  private slowFor = 0;
  private readonly maxDpr: number;
  private readonly reduced: boolean;
  private ro: ResizeObserver;

  constructor(
    private canvas: HTMLCanvasElement,
    private drag: DragState,
    private target: Targets,
    private events: { onReady: () => void; onFail: () => void }
  ) {
    this.bounds = [...target.bounds];
    this.self = target.self;
    this.soul = [...target.soul];
    this.fem = target.fem;
    const coarse = matchMedia("(pointer: coarse)").matches;
    this.maxDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    canvas.addEventListener("webglcontextlost", this.onLost);
    canvas.addEventListener("webglcontextrestored", this.onRestored);
    this.init();
  }

  setTargets(t: Targets) {
    this.target = t;
  }

  kick(keys: (keyof typeof PULSE_INDEX)[]) {
    this.slosh = 1;
    keys.forEach((k) => (this.pulse[PULSE_INDEX[k]] = 1));
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v && this.ready && !this.raf) this.loop();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.onLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onRestored);
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
  }

  // ———————————————————————————————— setup

  private init() {
    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return this.events.onFail();
    this.gl = gl;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, vertex);
    const fs = sh(gl.FRAGMENT_SHADER, fragment);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    this.program = prog;

    // Don't ask for the link status until the driver says it's done: asking early blocks the main thread.
    const parallel = gl.getExtension("KHR_parallel_shader_compile");
    const t0 = performance.now();
    const poll = () => {
      if (this.disposed) return;
      if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
        requestAnimationFrame(poll);
        return;
      }
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Vessel shader failed:", gl.getProgramInfoLog(prog) || gl.getShaderInfoLog(fs));
        return this.events.onFail();
      }
      (window as unknown as { __vasCompileMs?: number }).__vasCompileMs = Math.round(performance.now() - t0);
      this.setupProgram(gl, prog);
    };
    // let the page paint first
    requestAnimationFrame(() => requestAnimationFrame(poll));
  }

  private setupProgram(gl: WebGLRenderingContext, prog: WebGLProgram) {
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    for (const n of ["uTime", "uRes", "uRot", "uBounds", "uC0", "uC1", "uC2", "uC3", "uFem", "uSlosh", "uSpin", "uPulse", "uSelf", "uFocal", "uCamY"])
      this.loc[n] = gl.getUniformLocation(prog, n);
    gl.uniform3fv(this.loc.uC0, COLORS.uC0);
    gl.uniform3fv(this.loc.uC2, COLORS.uC2);
    gl.uniform3fv(this.loc.uC3, COLORS.uC3);
    gl.uniform1f(this.loc.uFocal, 1.22);
    gl.uniform1f(this.loc.uCamY, 0.86);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    this.ready = true;
    this.resize();
    this.events.onReady();
    if (this.visible) this.loop();
  }

  private resize() {
    const gl = this.gl;
    if (!gl) return;
    const dpr = this.maxDpr * this.scale;
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    if (this.ready) gl.uniform2f(this.loc.uRes, w, h);
  }

  // ———————————————————————————————— frame loop

  private loop = () => {
    if (!this.visible || this.disposed || !this.ready) {
      this.raf = 0;
      this.last = 0;
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const raw = this.last ? (now - this.last) / 1000 : 1 / 60;
    this.last = now;
    const d = Math.min(raw, 0.05);
    this.adapt(raw);
    this.step(d);
    this.draw();
  };

  /** Lower the internal resolution while frames stay slow (down to half). */
  private adapt(raw: number) {
    this.frameAvg += (raw - this.frameAvg) * 0.1;
    this.slowFor = this.frameAvg > 1 / 40 ? this.slowFor + raw : 0;
    if (this.slowFor > 1 && this.scale > 0.5) {
      this.scale = Math.max(0.5, this.scale * 0.8);
      this.slowFor = 0;
      this.resize();
    }
  }

  private step(d: number) {
    const t = this.target;
    this.time += d * (this.reduced ? 0.35 : 1);
    const k = 1 - Math.exp(-d * 2.2);
    for (let i = 0; i < 3; i++) {
      this.bounds[i] += (t.bounds[i] - this.bounds[i]) * k;
      this.soul[i] += (t.soul[i] - this.soul[i]) * k;
    }
    this.self += (t.self - this.self) * k;
    this.fem += (t.fem - this.fem) * (1 - Math.exp(-d * 1.6));
    this.slosh *= Math.exp(-d * 0.9);
    for (let i = 0; i < 4; i++) this.pulse[i] *= Math.exp(-d * 1.6);

    const st = this.drag;
    const idle = this.reduced ? 0 : IDLE_SPIN;
    if (!st.active) st.vel += (idle - st.vel) * (1 - Math.exp(-d * 1.5));
    st.rot += st.vel * d;
    // the liquid lags behind the glass: it follows spin with some inertia
    this.spin += (st.vel - idle - this.spin) * (1 - Math.exp(-d * 3));
  }

  private draw() {
    const gl = this.gl!;
    const l = this.loc;
    gl.uniform1f(l.uTime, this.time);
    gl.uniform1f(l.uRot, this.drag.rot);
    gl.uniform3fv(l.uBounds, this.bounds);
    gl.uniform3fv(l.uC1, this.soul);
    gl.uniform1f(l.uFem, this.fem);
    gl.uniform1f(l.uSelf, this.self);
    gl.uniform1f(l.uSlosh, this.slosh);
    gl.uniform1f(l.uSpin, this.spin);
    gl.uniform4fv(l.uPulse, this.pulse);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // ———————————————————————————————— context loss

  private onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.ready = false;
  };

  private onRestored = () => {
    this.loc = {};
    this.init();
  };
}
