import type Lenis from "lenis";

let activeRaf = 0;
let cancelListeners: (() => void) | null = null;
let lenisInstance: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function setSmoothScrollPaused(paused: boolean) {
  if (!lenisInstance) return;
  if (paused) lenisInstance.stop();
  else lenisInstance.start();
}

function resolveTargetY(href: string): number {
  if (href === "#top") return 0;
  const el = document.querySelector(href);
  if (!el) return window.scrollY;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - 64);
}

function stopActiveScroll() {
  if (activeRaf) {
    cancelAnimationFrame(activeRaf);
    activeRaf = 0;
  }
  if (cancelListeners) {
    cancelListeners();
    cancelListeners = null;
  }
}

// Graceful ease-in-out-cubic glide: soft lift-off, calm cruise, velvety landing
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Interruptible, distance-scaled RAF smooth scroll to `#top` or any section.
 * Never freezes or pauses live animations, music, shaders, or navbar choreography.
 */
export function editorialNavigate(
  href: string,
  reducedMotion: boolean | null,
) {
  if (typeof window === "undefined") return;

  // If invoked from a non-home route (e.g. 404), navigate back to home with anchor
  if (window.location.pathname !== "/") {
    window.location.assign(href === "#top" ? "/" : `/${href}`);
    return;
  }

  stopActiveScroll();

  const startY = window.scrollY;
  const targetY = resolveTargetY(href);
  const distance = targetY - startY;
  if (Math.abs(distance) < 4) return;

  if (reducedMotion) {
    window.scrollTo({ top: targetY, behavior: "instant" });
    return;
  }

  // Distance-scaled duration: ~700ms for nearby sections, up to ~1350ms for full-page return to top
  const duration = Math.min(1350, Math.max(700, 520 + Math.abs(distance) * 0.2));

  // Delegate to Lenis when smooth scroll is active so wheel & anchor jumps share identical physics
  if (lenisInstance) {
    lenisInstance.scrollTo(targetY, {
      duration: duration / 1000,
      easing: easeInOutCubic,
    });
    return;
  }

  const startTime = performance.now();

const INTERRUPT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

  // Yield immediately if user scrolls, touches, or presses a navigation key mid-glide
  const onUserInterrupt = () => stopActiveScroll();
  const onKeyInterrupt = (event: KeyboardEvent) => {
    if (INTERRUPT_KEYS.has(event.key)) stopActiveScroll();
  };
  window.addEventListener("wheel", onUserInterrupt, { passive: true });
  window.addEventListener("touchstart", onUserInterrupt, { passive: true });
  window.addEventListener("keydown", onKeyInterrupt, { passive: true });
  cancelListeners = () => {
    window.removeEventListener("wheel", onUserInterrupt);
    window.removeEventListener("touchstart", onUserInterrupt);
    window.removeEventListener("keydown", onKeyInterrupt);
  };

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    window.scrollTo({
      top: startY + distance * easeInOutCubic(progress),
      behavior: "instant",
    });

    if (progress < 1) {
      activeRaf = requestAnimationFrame(step);
    } else {
      stopActiveScroll();
    }
  };

  activeRaf = requestAnimationFrame(step);
}
