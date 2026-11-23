"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import {
  CAMERA_HEIGHT,
  GRADIENT_WAVES_FRAGMENT,
  GRADIENT_WAVES_VERTEX,
  MAX_SWELLS,
} from "@/components/ui/gradientWavesShaders";

const SWELL_SECONDS = 3.2;
const SWELL_GAIN = 2.8;
const SWELL_WIDTH = 8;
const INTRO_SECONDS = 2.4;
const QUALITY = { low: 56, medium: 84, high: 120 } as const;

type RGB = [number, number, number];

export interface GradientWavesProps {
  horizonColor?: string;
  waveColor?: string;
  crestColor?: string;
  backgroundColor?: string;
  lightMode?: boolean;
  speed?: number;
  amplitude?: number;
  waveScale?: number;
  waveRatio?: number;
  swell?: number;
  turbulence?: number;
  tilt?: number;
  zoom?: number;
  height?: number;
  fogDepth?: number;
  relief?: number;
  lightAngle?: number;
  sheen?: number;
  brightness?: number;
  opacity?: number;
  grain?: number;
  quality?: keyof typeof QUALITY;
  intro?: boolean;
  mouseInteraction?: boolean;
  parallaxStrength?: number;
  mouseStrength?: number;
  swellOnClick?: boolean;
  paused?: boolean;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

let probe: CanvasRenderingContext2D | null = null;

function parseColor(value: string, fallback: RGB | null): RGB | null {
  if (value === "transparent") return null;
  if (typeof document === "undefined") return fallback;
  if (!probe) probe = document.createElement("canvas").getContext("2d");
  if (!probe) return fallback;
  probe.fillStyle = "#000000";
  probe.fillStyle = value;
  const text = probe.fillStyle;
  if (text.startsWith("#")) {
    const hex = parseInt(text.slice(1), 16);
    return [
      ((hex >> 16) & 255) / 255,
      ((hex >> 8) & 255) / 255,
      (hex & 255) / 255,
    ];
  }
  const match = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(
    text,
  );
  if (!match) return fallback;
  if (match[4] !== undefined && Number(match[4]) === 0) return null;
  return [
    Number(match[1]) / 255,
    Number(match[2]) / 255,
    Number(match[3]) / 255,
  ];
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function rayAt(
  point: [number, number],
  aspect: number,
  zoom: number,
  tilt: number,
  look: [number, number],
): [number, number, number] {
  const uvx = (point[0] - 0.5) * aspect;
  const uvy = point[1] - 0.5;
  const vfov = Math.PI / 2.3 / Math.max(zoom, 0.05);
  const length = Math.hypot(uvx, uvy);
  const turn = vfov * length;
  let dir: [number, number, number] = [0, -Math.sin(turn), -Math.cos(turn)];
  const nx = length > 1e-5 ? uvx / length : 1;
  const ny = length > 1e-5 ? uvy / length : 0;
  dir = [nx * dir[0] + ny * dir[1], -ny * dir[0] + nx * dir[1], dir[2]];
  const pitch = tilt + look[1];
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  dir = [cp * dir[0] - sp * dir[2], dir[1], sp * dir[0] + cp * dir[2]];
  const cy = Math.cos(look[0]);
  const sy = Math.sin(look[0]);
  dir = [cy * dir[0] - sy * dir[1], sy * dir[0] + cy * dir[1], dir[2]];
  return dir;
}

function groundAt(
  point: [number, number],
  aspect: number,
  zoom: number,
  tilt: number,
  height: number,
  look: [number, number],
): [number, number] | null {
  const dir = rayAt(point, aspect, zoom, tilt, look);
  if (dir[2] > -0.02) return null;
  const travel = (CAMERA_HEIGHT - height) / -dir[2];
  return [dir[0] * travel, dir[1] * travel];
}

const prefersReduced = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

export function GradientWaves({
  horizonColor = "#0EA5E9",
  waveColor = "#7DD3FC",
  crestColor = "#FFFFFF",
  backgroundColor = "transparent",
  lightMode = false,
  speed = 0.28,
  amplitude = 3.8,
  waveScale = 0.42,
  waveRatio = 1.35,
  swell = 52,
  turbulence = 11,
  tilt = 73,
  zoom = 1.18,
  height = 3.2,
  fogDepth = 22,
  relief = 1,
  lightAngle = 115,
  sheen = 0.55,
  brightness = 1.05,
  opacity = 0.72,
  grain = 0.08,
  quality = "medium",
  intro = true,
  mouseInteraction = true,
  parallaxStrength = 0.5,
  mouseStrength = 0.65,
  swellOnClick = true,
  paused = false,
  dpr = 2,
  className = "",
  style,
}: GradientWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizon = useMemo<RGB>(
    () => parseColor(horizonColor, [0.05, 0.65, 0.91]) ?? [0.05, 0.65, 0.91],
    [horizonColor],
  );
  const wave = useMemo<RGB>(
    () => parseColor(waveColor, [0.49, 0.83, 0.99]) ?? [0.49, 0.83, 0.99],
    [waveColor],
  );
  const crest = useMemo<RGB>(
    () => parseColor(crestColor, [1, 1, 1]) ?? [1, 1, 1],
    [crestColor],
  );
  const paper = useMemo<RGB | null>(
    () => parseColor(backgroundColor, null),
    [backgroundColor],
  );

  const settings = useMemo(
    () => ({
      horizon,
      wave,
      crest,
      paper,
      lightMode,
      speed,
      amplitude: Math.max(0, amplitude),
      waveScale: Math.max(0.01, waveScale),
      waveRatio: Math.max(0.01, waveRatio),
      swell,
      turbulence,
      tilt: (clamp(tilt, 10, 85) * Math.PI) / 180,
      zoom: Math.max(0.05, zoom),
      height,
      fogDepth: Math.max(0.5, fogDepth),
      relief: clamp(relief, 0, 1),
      lightAngle: (lightAngle * Math.PI) / 180,
      sheen: Math.max(0, sheen),
      brightness: Math.max(0, brightness),
      opacity: clamp(opacity, 0, 1),
      grain: Math.max(0, grain),
      steps: QUALITY[quality] ?? QUALITY.medium,
      intro,
      mouseInteraction,
      parallaxStrength: Math.max(0, parallaxStrength),
      mouseStrength: clamp(mouseStrength, 0, 1),
      swellOnClick,
      paused,
      dpr: Math.max(0.5, dpr),
    }),
    [
      horizon,
      wave,
      crest,
      paper,
      lightMode,
      speed,
      amplitude,
      waveScale,
      waveRatio,
      swell,
      turbulence,
      tilt,
      zoom,
      height,
      fogDepth,
      relief,
      lightAngle,
      sheen,
      brightness,
      opacity,
      grain,
      quality,
      intro,
      mouseInteraction,
      parallaxStrength,
      mouseStrength,
      swellOnClick,
      paused,
      dpr,
    ],
  );

  const settingsRef = useRef(settings);
  const wakeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  }, [settings]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 block h-full w-full";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) {
      canvas.remove();
      return undefined;
    }

    const vertex = compileShader(gl, gl.VERTEX_SHADER, GRADIENT_WAVES_VERTEX);
    const fragment = compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      GRADIENT_WAVES_FRAGMENT,
    );
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) {
      canvas.remove();
      return undefined;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      canvas.remove();
      return undefined;
    }

    const uniformNames = [
      "uResolution",
      "uTime",
      "uClock",
      "uAmplitude",
      "uWaveScale",
      "uWaveRatio",
      "uSwell",
      "uTurbulence",
      "uHeight",
      "uTilt",
      "uZoom",
      "uLook",
      "uFogDepth",
      "uBrightness",
      "uOpacity",
      "uGrain",
      "uHorizon",
      "uWave",
      "uCrest",
      "uBackground",
      "uOpaque",
      "uLight",
      "uSun",
      "uRelief",
      "uSheen",
      "uSteps",
      "uStride",
      "uIntro",
      "uSwells",
      "uSwellWidth",
    ];
    const u: Record<string, WebGLUniformLocation | null> = {};
    for (const name of uniformNames) {
      u[name] = gl.getUniformLocation(program, name);
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const swellData = new Float32Array(MAX_SWELLS * 3);
    const state = {
      width: 1,
      height: 1,
      cssWidth: 0,
      cssHeight: 0,
      time: 0,
      clock: 0,
      last: 0,
      raf: 0,
      visible: false,
      introAt: -1,
      pointer: [0.5, 0.5] as [number, number],
      inside: false,
      look: [0, 0] as [number, number],
      steer: [0, 0] as [number, number],
      swells: [] as { x: number; y: number; at: number }[],
      quiet: 0,
      seen: null as typeof settings | null,
    };

    const fit = () => {
      const s = settingsRef.current;
      const ratio = Math.min(window.devicePixelRatio || 1, s.dpr);
      const width = Math.max(1, Math.round(state.cssWidth * ratio));
      const height = Math.max(1, Math.round(state.cssHeight * ratio));
      if (width === state.width && height === state.height) return;
      state.quiet = 0;
      state.width = width;
      state.height = height;
      canvas.width = width;
      canvas.height = height;
    };

    const introProgress = (s: typeof settings, reduced: boolean) => {
      if (!s.intro || reduced || state.introAt < 0) return 1;
      return clamp((state.clock - state.introAt) / INTRO_SECONDS, 0, 1);
    };

    const render = (reduced: boolean) => {
      const s = settingsRef.current;
      gl.viewport(0, 0, state.width, state.height);
      gl.uniform2f(u.uResolution, state.width, state.height);
      gl.uniform1f(u.uTime, state.time);
      gl.uniform1f(u.uClock, state.clock);
      gl.uniform1f(u.uAmplitude, s.amplitude);
      gl.uniform1f(u.uWaveScale, s.waveScale);
      gl.uniform1f(u.uWaveRatio, s.waveRatio);
      gl.uniform1f(u.uSwell, s.swell);
      gl.uniform1f(u.uTurbulence, s.turbulence);
      gl.uniform1f(u.uHeight, s.height);
      gl.uniform1f(u.uTilt, s.tilt);
      gl.uniform1f(u.uZoom, s.zoom);
      gl.uniform2f(u.uLook, state.look[0], state.look[1]);
      gl.uniform1f(u.uFogDepth, s.fogDepth);
      gl.uniform1f(u.uBrightness, s.brightness);
      gl.uniform1f(u.uOpacity, s.opacity);
      gl.uniform1f(u.uGrain, s.grain);
      gl.uniform3fv(u.uHorizon, s.horizon);
      gl.uniform3fv(u.uWave, s.wave);
      gl.uniform3fv(u.uCrest, s.crest);
      const paperColor = s.paper ?? [0, 0, 0];
      gl.uniform3f(u.uBackground, paperColor[0], paperColor[1], paperColor[2]);
      gl.uniform1f(u.uOpaque, s.paper ? 1 : 0);
      gl.uniform1f(u.uLight, s.lightMode ? 1 : 0);
      const elevation = 0.52;
      const angle = s.lightAngle + state.steer[0] * s.mouseStrength * 2;
      const altitude = elevation - state.steer[1] * s.mouseStrength * 0.7;
      gl.uniform3f(
        u.uSun,
        Math.cos(altitude) * Math.cos(angle),
        Math.cos(altitude) * Math.sin(angle),
        Math.sin(altitude),
      );
      gl.uniform1f(u.uRelief, s.relief);
      gl.uniform1f(u.uSheen, s.sheen);
      gl.uniform1f(u.uSteps, s.steps);
      const slope =
        s.amplitude *
        ((s.waveScale / 7) * (1 + Math.abs(s.swell) / 20) +
          ((s.waveScale * s.waveRatio) / 3) * (1 + Math.abs(s.turbulence) / 23));
      const progress = introProgress(s, reduced);
      const shown = Math.min(1, progress / 0.22);
      const crestPos =
        160 * Math.pow(3 / 160, easeInOut(Math.max(0, (progress - 0.1) / 0.9)));
      const settle = clamp((progress - 0.75) / 0.25, 0, 1);
      gl.uniform3f(
        u.uIntro,
        shown * shown * (3 - 2 * shown),
        crestPos,
        1 - settle * settle * (3 - 2 * settle),
      );

      swellData.fill(0);
      let swellPeak = 0;
      state.swells.forEach((sw, index) => {
        const age = state.clock - sw.at;
        const life = age / SWELL_SECONDS;
        const envelope = (1 - Math.exp(-age / 0.25)) * Math.pow(1 - life, 1.6);
        const lift = s.amplitude * SWELL_GAIN * envelope;
        swellData.set([sw.x - age * 12, sw.y, lift], index * 3);
        swellPeak = Math.max(swellPeak, lift);
      });
      gl.uniform3fv(u.uSwells, swellData);
      gl.uniform1f(u.uSwellWidth, SWELL_WIDTH);
      gl.uniform1f(
        u.uStride,
        0.9 / Math.max(1, (slope + (swellPeak * 0.86) / SWELL_WIDTH) / 1.5),
      );
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const tick = (now: number) => {
      state.raf = 0;
      if (!state.visible || document.hidden) return;
      const s = settingsRef.current;
      const dt = state.last ? Math.min((now - state.last) / 1000, 0.1) : 0;
      state.last = now;
      const reduced = prefersReduced();
      state.clock += dt;
      if (state.introAt < 0) state.introAt = state.clock;
      if (!s.paused && !reduced) state.time += dt * s.speed;

      const steering = s.mouseInteraction && state.inside && !reduced;
      const target: [number, number] = steering ? state.pointer : [0.5, 0.5];
      const ease = 1 - Math.exp(-dt / 0.45);
      const goalX = (target[0] - 0.5) * s.parallaxStrength * 0.35;
      const goalY = (target[1] - 0.5) * s.parallaxStrength * 0.18;
      state.look[0] += (goalX - state.look[0]) * ease;
      state.look[1] += (goalY - state.look[1]) * ease;
      const moving =
        Math.abs(goalX - state.look[0]) + Math.abs(goalY - state.look[1]) >
        0.0002;

      const steerEase = 1 - Math.exp(-dt / 0.6);
      const steerX = steering ? state.pointer[0] - 0.5 : 0;
      const steerY = steering ? 0.5 - state.pointer[1] : 0;
      state.steer[0] += (steerX - state.steer[0]) * steerEase;
      state.steer[1] += (steerY - state.steer[1]) * steerEase;
      const turning =
        Math.abs(steerX - state.steer[0]) + Math.abs(steerY - state.steer[1]) >
        0.0005;
      state.swells = state.swells.filter(
        (sw) => state.clock - sw.at < SWELL_SECONDS,
      );

      const still = s.paused || reduced;
      const transient =
        moving ||
        turning ||
        state.swells.length > 0 ||
        introProgress(s, reduced) < 1;
      if (state.seen !== s || transient || !still) state.quiet = 0;
      else state.quiet += 1;
      state.seen = s;
      if (state.quiet > 3) return;

      state.raf = requestAnimationFrame(tick);
      fit();
      render(reduced);
    };

    const wake = () => {
      if (state.raf || !state.visible || document.hidden) return;
      state.last = 0;
      state.raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const measure = () => {
      state.cssWidth = container.clientWidth;
      state.cssHeight = container.clientHeight;
      state.quiet = 0;
      wake();
    };

    const local = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) / Math.max(rect.width, 1),
        y: (event.clientY - rect.top) / Math.max(rect.height, 1),
        inside:
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom,
      };
    };

    const onMove = (event: PointerEvent) => {
      const point = local(event);
      const was = state.inside;
      state.inside = point.inside;
      if (point.inside) state.pointer = [point.x, point.y];
      if ((point.inside || was) && settingsRef.current.mouseInteraction) wake();
    };

    const onLeave = () => {
      state.inside = false;
      wake();
    };

    const onDown = (event: PointerEvent) => {
      const s = settingsRef.current;
      if (!s.swellOnClick || event.button !== 0 || prefersReduced()) return;
      if (
        event.target instanceof Element &&
        event.target.closest(
          'a, button, input, textarea, select, label, [role="button"]',
        )
      )
        return;
      const point = local(event);
      if (!point.inside) return;
      const ground = groundAt(
        [point.x, point.y],
        state.width / Math.max(state.height, 1),
        s.zoom,
        s.tilt,
        s.height,
        state.look,
      );
      if (!ground) return;
      state.swells.push({ x: ground[0], y: ground[1], at: state.clock });
      if (state.swells.length > MAX_SWELLS) state.swells.shift();
      wake();
    };

    const visibility = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      wake();
    });
    visibility.observe(container);
    const sizes = new ResizeObserver(measure);
    sizes.observe(container);
    measure();
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeave);
    state.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(state.raf);
      wakeRef.current = null;
      document.removeEventListener("visibilitychange", wake);
      visibility.disconnect();
      sizes.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={style}
    />
  );
}
