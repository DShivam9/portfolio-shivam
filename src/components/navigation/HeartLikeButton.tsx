"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { CopyToast } from "@/components/sections/hero/HeroInteractive";

const STORAGE_KEY = "portfolio-liked";
const LIKE_EVENT = "portfolio-likes-change";
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Precomputed 6-point radial micro-sparks (pure GPU transform + opacity)
const SPARK_ANGLES = [
  { x: -13, y: -11 },
  { x: 0, y: -15 },
  { x: 13, y: -11 },
  { x: -14, y: 7 },
  { x: 14, y: 7 },
  { x: 0, y: 14 },
] as const;

function subscribeLiked(cb: () => void) {
  window.addEventListener(LIKE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(LIKE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function getLikedSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function setLikedStorage(liked: boolean) {
  try {
    if (liked) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(LIKE_EVENT));
  } catch {
    // Storage unavailable in restricted browsing mode
  }
}

export function HeartLikeButton() {
  const liked = useSyncExternalStore(
    subscribeLiked,
    getLikedSnapshot,
    () => false,
  );
  const [count, setCount] = useState<number | null>(null);
  const [countDir, setCountDir] = useState<1 | -1>(1);
  const [burstKey, setBurstKey] = useState(0);
  const [pending, setPending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/likes", { signal: controller.signal, cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { count?: number } | null) => {
        if (typeof data?.count === "number") {
          setCount(data.count);
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
      });
    return () => controller.abort();
  }, []);

  const handleToggle = async () => {
    if (pending) return;
    const nextLiked = !liked;
    const prevCount = count ?? 0;

    setPending(true);
    setCountDir(nextLiked ? 1 : -1);
    setLikedStorage(nextLiked);
    setCount(Math.max(0, prevCount + (nextLiked ? 1 : -1)));
    if (nextLiked && !shouldReduceMotion) {
      setBurstKey((prev) => prev + 1);
    }

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    if (nextLiked) {
      setToastOpen(true);
      toastTimerRef.current = window.setTimeout(() => setToastOpen(false), 2600);
    } else {
      setToastOpen(false);
    }

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextLiked ? "like" : "unlike" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { count?: number };
      if (typeof data.count === "number") {
        setCount(data.count);
      }
    } catch {
      // Roll back optimistic state if persistence fails
      setLikedStorage(!nextLiked);
      setCount(prevCount);
      setToastOpen(false);
    } finally {
      setPending(false);
    }
  };

  const displayCount = count ?? 0;

  return (
    <>
      <button
      type="button"
      onClick={handleToggle}
      aria-pressed={liked}
      aria-label={
        liked
          ? `Unlike portfolio (${displayCount} likes)`
          : `Like portfolio (${displayCount} likes)`
      }
      title={liked ? "You liked this" : "Leave a heart"}
      className={`pressable tactile-key group relative h-8 gap-1.5 px-2.5 py-0 transition-colors duration-200 ${
        liked
          ? "text-[#f43f5e]"
          : "text-text-secondary hover:text-[#f43f5e]"
      }`}
    >
      {/* Heart + radial micro-sparks */}
      <span className="relative flex h-4 w-4 items-center justify-center">
        <AnimatePresence>
          {burstKey > 0 && (
            <span
              key={burstKey}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              {SPARK_ANGLES.map((spark, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0.95, scale: 0.4, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: spark.x,
                    y: spark.y,
                  }}
                  transition={{ duration: 0.44, ease: EASE_OUT }}
                  className="absolute h-1 w-1 rounded-full bg-[#f43f5e]"
                />
              ))}
            </span>
          )}
        </AnimatePresence>

        <motion.span
          key={liked ? "liked" : "idle"}
          initial={
            shouldReduceMotion
              ? false
              : liked
                ? { scale: 0.72 }
                : { scale: 0.92 }
          }
          animate={
            shouldReduceMotion
              ? { scale: 1 }
              : liked
                ? { scale: [0.72, 1.28, 1] }
                : { scale: [1, 1.18, 1, 1.12, 1] }
          }
          transition={
            liked
              ? { duration: 0.36, ease: EASE_OUT }
              : {
                  duration: 1.1,
                  repeat: Infinity,
                  repeatDelay: 3.4,
                  ease: "easeInOut",
                }
          }
          className="flex items-center justify-center"
        >
          <Heart
            className={`h-3.5 w-3.5 transition-colors duration-200 ${
              liked
                ? "fill-[#f43f5e] text-[#f43f5e]"
                : "group-hover:text-[#f43f5e]"
            }`}
            strokeWidth={1.85}
          />
        </motion.span>
      </span>

      {/* Rolling odometer counter */}
      <span className="relative inline-flex h-4 min-w-[1ch] items-center justify-center overflow-hidden font-mono text-[11px] font-medium tabular-nums text-text">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={count === null ? "loading" : displayCount}
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: countDir > 0 ? 8 : -8 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: countDir > 0 ? -8 : 8 }
            }
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="inline-block"
          >
            {count === null ? "·" : displayCount}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>

    <CopyToast
      open={toastOpen}
      icon="heart"
      title="Thank you for liking!"
      detail="Glad you enjoyed the portfolio"
    />
    </>
  );
}
