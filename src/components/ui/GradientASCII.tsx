"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import {
  GRADIENT_ASCII_BLUR,
  GRADIENT_ASCII_COMPOSITE,
  GRADIENT_ASCII_FIELD,
  GRADIENT_ASCII_HALO,
  GRADIENT_ASCII_VERTEX,
} from "@/components/ui/gradientAsciiShaders";

const MAX_COLORS = 8;
const MAX_CLICKS = 4;
const MAX_TRAIL = 24;
const CLICK_LIFE = 1.2;
const TRAIL_LIFE = 0.28;
const TRAIL_STEP = 0.015;
const INTRO_SECONDS = 2.4;
const ATLAS_CELL_W = 60;
const ATLAS_CELL_H = 100;
const ATLAS_COLUMNS = 16;
const FONT_SCALE = 0.78;
const DEFAULT_COLORS = ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"];
const DEFAULT_CHARACTERS = " =+xX0S8#@";
const DEFAULT_FONT =
  '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const SHAPES = { horizon: 0, pinch: 1, rise: 2, eclipse: 3 } as const;
const CLICK_EFFECTS = { none: 0, wave: 1, burst: 2 } as const;

export type GradientAsciiShape = keyof typeof SHAPES;
export type GradientAsciiClickEffect = keyof typeof CLICK_EFFECTS;

export interface GradientASCIIProps extends HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  shape?: GradientAsciiShape;
  characters?: string;
  cellSize?: number;
  density?: number;
  glyphOpacity?: number;
  glow?: number;
  depthOfField?: number;
  flicker?: number;
  softness?: number;
  scale?: number;
  flow?: number;
  speed?: number;
  gradientOpacity?: number;
  grain?: number;
  variation?: number;
  mouseInteraction?: boolean;
  scrambleRadius?: number;
  clickEffect?: GradientAsciiClickEffect;
  intro?: boolean;
  lightMode?: boolean;
  fontFamily?: string;
  dpr?: number;
  /** Defer intro reveal and WebGL loop until the container scrolls into view */
  startWhenInView?: boolean;
  viewThreshold?: number;
  /** Gate playback until parent signals ready (e.g. after hero/wordmark reveal) */
  active?: boolean;
}

interface ProgramBundle {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface RenderTarget {
  textures: (WebGLTexture | null)[];
  framebuffer: WebGLFramebuffer | null;
  width: number;
  height: number;
}

interface GlyphAtlas {
  texture: WebGLTexture | null;
  count: number;
  grid: [number, number];
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  strength: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

const toLab = ([r, g, b]: [number, number, number]): [number, number, number] => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const compile = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

const link = (
  gl: WebGL2RenderingContext,
  fragmentSource: string,
): ProgramBundle | null => {
  const vertex = compile(gl, gl.VERTEX_SHADER, GRADIENT_ASCII_VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return { program, uniforms: {} };
};

const resolve = (gl: WebGL2RenderingContext, item: ProgramBundle): boolean => {
  if (!gl.getProgramParameter(item.program, gl.LINK_STATUS)) return false;
  const count = gl.getProgramParameter(
    item.program,
    gl.ACTIVE_UNIFORMS,
  ) as number;
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(item.program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, "");
    item.uniforms[name] = gl.getUniformLocation(item.program, name);
  }
  return true;
};

const createTarget = (
  gl: WebGL2RenderingContext,
  count: number,
): RenderTarget => {
  const textures = Array.from({ length: count }, () => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  });
  return { textures, framebuffer: gl.createFramebuffer(), width: 0, height: 0 };
};

const sizeTarget = (
  gl: WebGL2RenderingContext,
  target: RenderTarget,
  width: number,
  height: number,
) => {
  if (target.width === width && target.height === height) return;
  target.width = width;
  target.height = height;
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
  target.textures.forEach((texture, i) => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA8,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0 + i,
      gl.TEXTURE_2D,
      texture,
      0,
    );
  });
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

const buildAtlas = (
  gl: WebGL2RenderingContext,
  characters: string,
  fontFamily: string,
): GlyphAtlas => {
  const list = [
    ...new Set([...characters].filter((char) => char !== "\n" && char !== "\r")),
  ];
  if (!list.length) list.push(" ");
  const font = `300 ${Math.round(ATLAS_CELL_H * FONT_SCALE)}px ${fontFamily}`;
  const columns = Math.min(ATLAS_COLUMNS, list.length);
  const rows = Math.ceil(list.length / columns);
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_CELL_W * columns;
  canvas.height = ATLAS_CELL_H * rows;
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff";
    list.forEach((char, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      context.fillText(
        char,
        column * ATLAS_CELL_W + ATLAS_CELL_W / 2,
        row * ATLAS_CELL_H + ATLAS_CELL_H / 2 + 3,
      );
    });
  }
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return { texture, count: list.length, grid: [columns, rows] };
};

export function GradientASCII({
  colors = DEFAULT_COLORS,
  shape = "horizon",
  characters = DEFAULT_CHARACTERS,
  cellSize = 18,
  density = 0.8,
  glyphOpacity = 0.85,
  glow = 0.2,
  depthOfField = 0,
  flicker = 0.2,
  softness = 0.5,
  scale = 1,
  flow = 0.5,
  speed = 1,
  gradientOpacity = 0.9,
  grain = 0.08,
  variation = 0,
  mouseInteraction = true,
  scrambleRadius = 0.1,
  clickEffect = "wave",
  intro = true,
  lightMode = false,
  fontFamily = DEFAULT_FONT,
  dpr,
  startWhenInView = true,
  viewThreshold = 0.45,
  active = true,
  className = "",
  style,
  ...rest
}: GradientASCIIProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const activeRef = useRef(active);
  const activateRef = useRef<(() => void) | null>(null);

  const palette = (
    Array.isArray(colors) && colors.length ? colors : DEFAULT_COLORS
  ).slice(0, MAX_COLORS);

  const settings = {
    colors: palette.length > 1 ? palette : [palette[0], palette[0]],
    shape: SHAPES[shape] ?? 0,
    characters: characters || DEFAULT_CHARACTERS,
    cellSize: clamp(cellSize, 6, 64),
    density: clamp(density, 0, 1),
    glyphOpacity: clamp(glyphOpacity, 0, 1),
    glow: clamp(glow, 0, 2),
    depthOfField: clamp(depthOfField, 0, 1),
    flicker: clamp(flicker, 0, 1),
    softness: clamp(softness, 0, 1),
    scale: clamp(scale, 0.4, 2.5),
    flow: clamp(flow, 0, 2),
    speed: Math.max(0, speed),
    gradientOpacity: clamp(gradientOpacity, 0, 1),
    grain: clamp(grain, 0, 0.4),
    variation: Math.max(0, variation),
    mouseInteraction,
    scrambleRadius: clamp(scrambleRadius, 0.02, 0.4),
    clickEffect: CLICK_EFFECTS[clickEffect] ?? 1,
    intro,
    lightMode,
    fontFamily: fontFamily || DEFAULT_FONT,
    dpr,
  };

  const settingsRef = useRef(settings);
  const colorsKey = settings.colors.join(",");
  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    colorsKey,
    settings.shape,
    settings.characters,
    settings.cellSize,
    settings.density,
    settings.glyphOpacity,
    settings.glow,
    settings.depthOfField,
    settings.flicker,
    settings.softness,
    settings.scale,
    settings.flow,
    settings.speed,
    settings.gradientOpacity,
    settings.grain,
    settings.variation,
    settings.mouseInteraction,
    settings.scrambleRadius,
    settings.clickEffect,
    settings.intro,
    settings.lightMode,
    settings.fontFamily,
    settings.dpr,
  ]);

  useEffect(() => {
    activeRef.current = active;
    if (active) activateRef.current?.();
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!container || !canvas || !gl) return undefined;

    const parallel = gl.getExtension("KHR_parallel_shader_compile") as {
      COMPLETION_STATUS_KHR: number;
    } | null;
    const field = link(gl, GRADIENT_ASCII_FIELD);
    const halo = link(gl, GRADIENT_ASCII_HALO);
    const blur = link(gl, GRADIENT_ASCII_BLUR);
    const composite = link(gl, GRADIENT_ASCII_COMPOSITE);
    if (!field || !halo || !blur || !composite) return undefined;

    const programs = [field, halo, blur, composite];
    if (!parallel && !programs.every((item) => resolve(gl, item))) {
      programs.forEach((item) => gl.deleteProgram(item.program));
      return undefined;
    }

    const vao = gl.createVertexArray();
    const fieldTarget = createTarget(gl, 2);
    const haloA = createTarget(gl, 1);
    const haloB = createTarget(gl, 1);

    const probe = document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: true });
    const colorCache = new Map<string, [number, number, number]>();
    const parse = (value: string): [number, number, number] => {
      const cached = colorCache.get(value);
      if (cached) return cached;
      let rgb: [number, number, number] = [0, 0, 0];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = "#000000";
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colorCache.set(value, rgb);
      return rgb;
    };

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const view = { width: 1, height: 1, ratio: 1 };
    const ramp = new Float32Array(MAX_COLORS * 3);
    const clickData = new Float32Array(MAX_CLICKS * 4);
    const clicks: TrailPoint[] = [];
    const trailData = new Float32Array(MAX_TRAIL * 4);
    const trail: TrailPoint[] = [];
    const pointer = { x: 0, y: 0, inside: false };

    let atlas: GlyphAtlas | null = null;
    let atlasKey = "";
    let paletteKey = "";
    let time = 0;
    let glyphTime = 0;
    let introClock = settingsRef.current.intro && !reduce ? 0 : 1;
    let frameSeed = 0;
    let grainClock = 0;
    let raf = 0;
    let last = 0;
    let started = !startWhenInView;
    let visible = !startWhenInView;
    let disposed = false;
    let ready = !parallel;
    const cursor = { x: 0, y: 0, active: 0 };

    const linked = () =>
      !parallel ||
      programs.every((item) =>
        Boolean(
          gl.getProgramParameter(item.program, parallel.COMPLETION_STATUS_KHR),
        ),
      );

    const release = () => {
      if (gl.isContextLost()) return;
      if (!ready && !linked()) {
        requestAnimationFrame(release);
        return;
      }
      programs.forEach((item) => gl.deleteProgram(item.program));
    };

    const syncAtlas = () => {
      const s = settingsRef.current;
      const key = `${s.fontFamily}|${s.characters}`;
      if (key === atlasKey && atlas) return;
      atlasKey = key;
      if (atlas) gl.deleteTexture(atlas.texture);
      atlas = buildAtlas(gl, s.characters, s.fontFamily);
      document.fonts?.load?.(`300 64px ${s.fontFamily}`, s.characters).then(
        () => {
          if (disposed || atlasKey !== key) return;
          if (atlas) gl.deleteTexture(atlas.texture);
          atlas = buildAtlas(gl, s.characters, s.fontFamily);
          if (started && visible) draw();
        },
        () => { },
      );
    };

    const syncPalette = () => {
      const s = settingsRef.current;
      const key = s.colors.join(",");
      if (key === paletteKey) return;
      paletteKey = key;
      s.colors.forEach((color, i) => ramp.set(toLab(parse(color)), i * 3));
    };

    const bindGlyphs = (
      program: ProgramBundle,
      width: number,
      height: number,
    ) => {
      if (!atlas) return;
      const s = settingsRef.current;
      const u = program.uniforms;
      const cellH = s.cellSize * view.ratio;
      const cellW = cellH * (ATLAS_CELL_W / ATLAS_CELL_H);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fieldTarget.textures[0]);
      gl.uniform1i(u.uField, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fieldTarget.textures[1]);
      gl.uniform1i(u.uAux, 1);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, atlas.texture);
      gl.uniform1i(u.uAtlas, 2);
      gl.uniform2f(u.uResolution, width, height);
      gl.uniform2f(u.uCell, cellW, cellH);
      gl.uniform2f(
        u.uOffset,
        (width - Math.ceil(width / cellW) * cellW) / 2,
        (height - Math.ceil(height / cellH) * cellH) / 2,
      );
      gl.uniform2f(u.uAtlasGrid, atlas.grid[0], atlas.grid[1]);
      gl.uniform1f(u.uCount, atlas.count);
      gl.uniform1f(u.uDensity, s.density);
      gl.uniform1f(u.uOpacity, s.glyphOpacity);
      gl.uniform1f(u.uFlicker, reduce ? 0 : s.flicker);
      gl.uniform1f(u.uDepth, s.depthOfField);
      gl.uniform1f(u.uGlyphTime, glyphTime);
      gl.uniform1f(u.uSeedValue, s.variation);
      gl.uniform1f(u.uLight, s.lightMode ? 1 : 0);
    };

    const draw = () => {
      if (!ready || !started) return;
      const s = settingsRef.current;
      const aspect = view.width / view.height;
      syncAtlas();
      syncPalette();
      gl.bindVertexArray(vao);
      gl.disable(gl.BLEND);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fieldTarget.framebuffer);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      gl.viewport(0, 0, fieldTarget.width, fieldTarget.height);
      gl.useProgram(field.program);
      const fu = field.uniforms;
      gl.uniform1f(fu.uAspect, aspect);
      gl.uniform1f(fu.uTime, time);
      gl.uniform1i(fu.uShape, s.shape);
      gl.uniform3fv(fu.uRamp, ramp);
      gl.uniform1i(fu.uCount, s.colors.length);
      gl.uniform1f(fu.uScale, s.scale);
      gl.uniform1f(fu.uSoftness, s.softness);
      gl.uniform1f(fu.uFlow, s.flow);
      gl.uniform2f(fu.uSeed, s.variation * 3.17, s.variation * 1.91);
      gl.uniform4fv(fu.uTrail, trailData);
      gl.uniform1i(fu.uTrailCount, trail.length);
      gl.uniform1f(fu.uRadius, s.scrambleRadius);
      gl.uniform4fv(fu.uClicks, clickData);
      gl.uniform1i(fu.uClickEffect, s.clickEffect);
      gl.uniform3f(fu.uCursor, cursor.x, cursor.y, cursor.active);
      gl.uniform1f(fu.uIntro, introClock);
      gl.uniform1f(fu.uFrame, frameSeed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const glowing = s.glow > 0.001;
      if (glowing) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, haloA.framebuffer);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
        gl.viewport(0, 0, haloA.width, haloA.height);
        gl.useProgram(halo.program);
        bindGlyphs(halo, canvas.width, canvas.height);
        gl.uniform1f(halo.uniforms.uDownscale, canvas.width / haloA.width);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.useProgram(blur.program);
        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(blur.uniforms.uSource, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, haloB.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, haloA.textures[0]);
        gl.uniform2f(blur.uniforms.uStep, 1 / haloA.width, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, haloA.framebuffer);
        gl.bindTexture(gl.TEXTURE_2D, haloB.textures[0]);
        gl.uniform2f(blur.uniforms.uStep, 0, 1 / haloA.height);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(composite.program);
      bindGlyphs(composite, canvas.width, canvas.height);
      const cu = composite.uniforms;
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, haloA.textures[0]);
      gl.uniform1i(cu.uHalo, 3);
      gl.uniform1f(cu.uGlow, glowing ? s.glow : 0);
      gl.uniform1f(cu.uGradient, s.gradientOpacity);
      gl.uniform1f(cu.uGrain, s.grain);
      gl.uniform1f(cu.uFrame, frameSeed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let rectCache = container.getBoundingClientRect();
    let resizeRaf = 0;

    const refreshRect = () => {
      rectCache = container.getBoundingClientRect();
    };

    const resize = () => {
      const s = settingsRef.current;
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      // Cap DPR at 1.5 — visually identical on 18px ASCII cells, ~44% less fragment fill cost
      view.ratio = Math.min(s.dpr || window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      refreshRect();
      sizeTarget(
        gl,
        fieldTarget,
        Math.max(1, Math.round(canvas.width / 2)),
        Math.max(1, Math.round(canvas.height / 2)),
      );
      const haloWidth = Math.max(1, Math.round(canvas.width / 4));
      const haloHeight = Math.max(1, Math.round(canvas.height / 4));
      sizeTarget(gl, haloA, haloWidth, haloHeight);
      sizeTarget(gl, haloB, haloWidth, haloHeight);
      if (started && visible) {
        draw();
        wake();
      }
    };

    const updateInput = (dt: number) => {
      const s = settingsRef.current;
      const engaged = pointer.inside && s.mouseInteraction && !reduce;
      const follow = 1 - Math.exp(-dt * (engaged ? 4.2 : 2.2));
      const targetX = engaged ? pointer.x : 0;
      const targetY = engaged ? pointer.y : 0;
      const targetActive = engaged ? 1 : 0;
      cursor.x += (targetX - cursor.x) * follow;
      cursor.y += (targetY - cursor.y) * follow;
      cursor.active += (targetActive - cursor.active) * follow;

      trail.forEach((point) => {
        point.age += dt;
      });
      while (trail.length && trail[trail.length - 1].age > TRAIL_LIFE) {
        trail.pop();
      }
      for (let i = 0; i < MAX_TRAIL; i++) {
        const point = trail[i];
        if (!point) {
          trailData[i * 4 + 2] = 0;
          continue;
        }
        const k = 1 - point.age / TRAIL_LIFE;
        trailData.set([point.x, point.y, k * k * point.strength, 0], i * 4);
      }
      clicks.forEach((click) => {
        click.age += dt;
      });
      while (clicks.length && clicks[clicks.length - 1].age > CLICK_LIFE) {
        clicks.pop();
      }
      for (let i = 0; i < MAX_CLICKS; i++) {
        const click = clicks[i];
        if (!click) {
          clickData[i * 4 + 3] = 0;
          continue;
        }
        const k = click.age / CLICK_LIFE;
        const envelope = Math.min(1, click.age / 0.08) * (1 - k) * (1 - k);
        clickData.set([click.x, click.y, click.age, envelope], i * 4);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !started || !visible || document.hidden) return;
      if (!ready) {
        if (!gl.isContextLost() && !linked()) {
          raf = requestAnimationFrame(frame);
          return;
        }
        if (!programs.every((item) => resolve(gl, item))) {
          dispose();
          return;
        }
        ready = true;
      }
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.001, 0.05) : 1 / 60;
      last = now;
      if (!reduce) {
        time += dt * s.speed * 0.5;
        glyphTime += dt * Math.max(s.speed, 0.15);
      }
      if (introClock < 1) {
        introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      }
      grainClock += dt;
      if (!reduce && grainClock > 1 / 24) {
        grainClock = 0;
        frameSeed = (frameSeed + 1) % 97;
      }
      updateInput(dt);
      draw();
      const busy =
        !reduce || introClock < 1 || clicks.length > 0 || trail.length > 0;
      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    function wake() {
      if (!raf && !disposed && started && visible && !document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    }

    const locate = (event: PointerEvent) => {
      const rect = rectCache;
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      const aspect = rect.width / Math.max(1, rect.height);
      pointer.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
      pointer.x = (x - 0.5) * aspect;
      pointer.y = y - 0.5;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!started || !visible) return;
      locate(event);
      const s = settingsRef.current;
      if (!pointer.inside || !s.mouseInteraction || reduce) return;
      const head = trail[0];
      const gap = head
        ? Math.hypot(pointer.x - head.x, pointer.y - head.y)
        : Infinity;
      if (gap < TRAIL_STEP) return;
      // Scale trail strength by pointer speed so slow glides stay lush without strobing
      const speed = head ? gap / Math.max(0.016, head.age) : 0.6;
      const strength = clamp((speed - 0.05) / 0.7, 0.45, 1);
      if (head && head.age < 0.1) {
        const steps = Math.min(6, Math.floor(gap / (TRAIL_STEP * 2)));
        for (let i = 1; i <= steps; i++) {
          const k = i / (steps + 1);
          trail.unshift({
            x: head.x + (pointer.x - head.x) * k,
            y: head.y + (pointer.y - head.y) * k,
            age: 0,
            strength,
          });
        }
      }
      trail.unshift({ x: pointer.x, y: pointer.y, age: 0, strength });
      trail.length = Math.min(trail.length, MAX_TRAIL);
      wake();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!started || !visible) return;
      locate(event);
      const s = settingsRef.current;
      if (!pointer.inside || !s.clickEffect || reduce) return;
      clicks.unshift({ x: pointer.x, y: pointer.y, age: 0, strength: 1 });
      if (clicks.length > MAX_CLICKS) clicks.pop();
      wake();
    };

    const onVisibility = () => {
      last = 0;
      wake();
    };

    const onResizeObserved = () => {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        resize();
      });
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const resizeObserver = new ResizeObserver(onResizeObserved);
    resizeObserver.observe(container);

    const intersection = new IntersectionObserver(
      (entries) => {
        const isInView = entries.some((entry) => entry.isIntersecting);
        visible = isInView;
        if (isInView && activeRef.current) {
          started = true;
          last = 0;
          refreshRect();
          wake();
        }
      },
      { threshold: startWhenInView ? viewThreshold : 0 },
    );
    intersection.observe(container);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", refreshRect, { passive: true });
    canvas.addEventListener("webglcontextlost", onContextLost);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    wakeRef.current = wake;
    activateRef.current = () => {
      if (visible && !started) {
        started = true;
        last = 0;
        refreshRect();
        wake();
      }
    };

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      wakeRef.current = null;
      activateRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", refreshRect);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      [fieldTarget, haloA, haloB].forEach((target) => {
        target.textures.forEach((texture) => gl.deleteTexture(texture));
        gl.deleteFramebuffer(target.framebuffer);
      });
      if (atlas) gl.deleteTexture(atlas.texture);
      gl.deleteVertexArray(vao);
      if (canvas.isConnected) {
        release();
      } else {
        programs.forEach((item) => gl.deleteProgram(item.program));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };

    return dispose;
  }, [startWhenInView, viewThreshold]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden${className ? ` ${className}` : ""}`}
      style={style}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}

export default GradientASCII;
