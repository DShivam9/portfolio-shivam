"use client";

import { setSmoothScrollPaused } from "@/utils/editorialNavigate";

export type ThemeMode = "dark" | "light";

const TARGET_COLS_DESKTOP = 14;
const TARGET_COLS_MOBILE = 8;
const DURATION_MS = 960;

let isTransitioning = false;

function easeGentle(t: number): number {
  const sine = -(Math.cos(Math.PI * t) - 1) / 2;
  // Blend linear + ease-in-out sine so crawl stays steady and unhurried from bottom to top
  return t * 0.35 + sine * 0.65;
}

interface CellSpec {
  threshold: number;
  subpath: string;
}

function buildSquareCells(width: number, height: number): CellSpec[] {
  const cols = width < 640 ? TARGET_COLS_MOBILE : TARGET_COLS_DESKTOP;
  const blockSize = Math.ceil(width / cols);
  const rows = Math.ceil(height / blockSize);
  const rowSpan = Math.max(1, rows - 1);
  // +1px bleed prevents subpixel hairline seams between adjacent blipped squares
  const tile = blockSize + 1;

  const cells: CellSpec[] = [];
  for (let r = rows - 1; r >= 0; r--) {
    const levelFromBottom = (rows - 1 - r) / rowSpan;
    const y = r * blockSize;
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const hash = Math.sin(idx * 127.1 + 311.7) * 43758.5453;
      const jitter = (hash - Math.floor(hash)) * 0.18;
      const x = c * blockSize;
      cells.push({
        threshold: levelFromBottom * 0.78 + jitter,
        subpath: `M${x} ${y}h${tile}v${tile}h-${tile}Z`,
      });
    }
  }

  cells.sort((a, b) => a.threshold - b.threshold);
  return cells;
}

const RULE_PREFIX =
  'html[data-theme-transition="active"]::view-transition-new(root){clip-path:';

/**
 * Live-page level-by-level pixel-blip theme transition using View Transitions API + inline CSS clip-path: path().
 * Uses direct pixel-coordinate disjoint square subpaths (avoids Chromium's top-layer SVG url(#id) bug).
 */
export function runPixelThemeTransition(
  _nextTheme: ThemeMode,
  applyTheme: () => void,
  reducedMotion: boolean,
): void {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => {
      ready: Promise<void>;
      finished: Promise<void>;
    };
  };

  if (reducedMotion || typeof window === "undefined" || !doc.startViewTransition) {
    applyTheme();
    return;
  }

  if (isTransitioning) return;
  isTransitioning = true;

  const cells = buildSquareCells(window.innerWidth, window.innerHeight);

  const styleEl = document.createElement("style");
  styleEl.textContent = `${RULE_PREFIX}inset(100% 0 0 0);}`;
  document.head.appendChild(styleEl);

  document.documentElement.setAttribute("data-theme-transition", "active");
  setSmoothScrollPaused(true);

  let rafId = 0;
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    if (rafId) cancelAnimationFrame(rafId);
    styleEl.remove();
    document.documentElement.removeAttribute("data-theme-transition");
    setSmoothScrollPaused(false);
    isTransitioning = false;
  };

  const transition = doc.startViewTransition(() => {
    applyTheme();
  });

  transition.ready
    .then(() => {
      // Keep View Transition pseudo-elements alive for the full pixel-blip duration
      document.documentElement.animate([{ opacity: 1 }, { opacity: 1 }], {
        duration: DURATION_MS,
        pseudoElement: "::view-transition-new(root)",
      });

      const start = performance.now();
      let cursor = 0;
      let pathData = "";

      const step = (now: number) => {
        const raw = Math.min(1, (now - start) / (DURATION_MS - 32));
        const progress = easeGentle(raw);

        let added = false;
        while (cursor < cells.length && cells[cursor].threshold <= progress) {
          pathData += cells[cursor].subpath;
          cursor += 1;
          added = true;
        }

        if (added) {
          if (cursor >= cells.length) {
            styleEl.textContent = `${RULE_PREFIX}none;}`;
          } else {
            styleEl.textContent = `${RULE_PREFIX}path("${pathData}");}`;
          }
        }

        if (raw < 1 && cursor < cells.length) {
          rafId = requestAnimationFrame(step);
        }
      };

      rafId = requestAnimationFrame(step);
    })
    .catch(() => {
      cleanup();
    });

  transition.finished.finally(cleanup);
}
