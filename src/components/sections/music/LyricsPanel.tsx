"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Disc3, SkipForward } from "lucide-react";
import type { LyricsPayload } from "@/app/api/lyrics/route";
import type { SpotifyTrack } from "@/app/api/spotify-playlist/route";
import type { TimeListener } from "@/components/sections/music/useMusicPlayer";

interface LyricsPanelProps {
  loading: boolean;
  data: LyricsPayload;
  subscribeTime: (listener: TimeListener) => () => void;
  nextTrack: SpotifyTrack | null;
  onSeek: (seconds: number) => void;
  onPlayNext: () => void;
}

interface TimelineItem {
  kind: "lyric" | "break";
  timeSec: number;
  endSec: number;
  text: string;
}

const SYNC_LOOKAHEAD_SEC = 0.2;
const SLOT_GAP_PX = 96;
const LONG_GAP_THRESHOLD_SEC = 7;
const SUNG_LINE_HOLD_SEC = 4.2;
const REEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HARMONIC_BARS = [
  { height: 14, delay: 0 },
  { height: 24, delay: 180 },
  { height: 32, delay: 360 },
  { height: 22, delay: 540 },
  { height: 14, delay: 720 },
] as const;

function isInstrumentalSymbol(text: string): boolean {
  const cleaned = text.trim();
  if (!cleaned) return true;
  if (/^[♪♫♩♬🎵🎶•·….\-–—\s()[\]]+$/.test(cleaned)) return true;
  if (/^\(?\[?\s*(instrumental|music|interlude)\s*\]?\)?$/i.test(cleaned)) {
    return true;
  }
  return false;
}

const UpNextMarquee = memo(function UpNextMarquee({
  title,
  reduceMotion,
}: {
  title: string;
  reduceMotion: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [overflowPx, setOverflowPx] = useState(0);

  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      const text = textRef.current;
      if (!wrap || !text) return;
      const diff = Math.ceil(text.scrollWidth - wrap.clientWidth);
      setOverflowPx(diff > 2 ? diff + 6 : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [title]);

  const shouldAnimate = overflowPx > 0 && !reduceMotion;
  const duration = Math.max(6.2, overflowPx / 22 + 3.8);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden whitespace-nowrap"
      style={
        shouldAnimate
          ? {
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, #000 5%, #000 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, #000 5%, #000 88%, transparent 100%)",
            }
          : undefined
      }
    >
      {shouldAnimate ? (
        <motion.span
          ref={textRef}
          key={`${title}-${overflowPx}`}
          animate={{
            x: [0, 0, -overflowPx, -overflowPx, -overflowPx, 0, 0],
            opacity: [1, 1, 1, 1, 0, 0, 1],
          }}
          transition={{
            duration,
            times: [0, 0.2, 0.72, 0.84, 0.91, 0.92, 1],
            ease: ["linear", "linear", "linear", "easeOut", "linear", "easeIn"],
            repeat: Infinity,
          }}
          className="inline-block pl-0.5 text-xs font-medium text-white/95 will-change-transform"
        >
          {title}
        </motion.span>
      ) : (
        <span
          ref={textRef}
          className="block truncate text-xs font-medium text-white/95"
        >
          {title}
        </span>
      )}
    </div>
  );
});

export const LyricsPanel = memo(function LyricsPanel({
  loading,
  data,
  subscribeTime,
  nextTrack,
  onSeek,
  onPlayNext,
}: LyricsPanelProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const syncedLines = data.syncedLines;
  const breakProgressRef = useRef<HTMLSpanElement | null>(null);

  const timeline = useMemo<TimelineItem[]>(() => {
    if (!syncedLines?.length) return [];
    const items: Array<{ kind: "lyric" | "break"; timeSec: number; text: string }> =
      [];

    if (syncedLines[0].timeSec > 2) {
      items.push({ kind: "break", timeSec: 0, text: "" });
    }

    for (let i = 0; i < syncedLines.length; i++) {
      const curr = syncedLines[i];
      const next = syncedLines[i + 1];

      if (isInstrumentalSymbol(curr.text)) {
        if (items[items.length - 1]?.kind !== "break") {
          items.push({ kind: "break", timeSec: curr.timeSec, text: "" });
        }
        continue;
      }

      items.push({ kind: "lyric", timeSec: curr.timeSec, text: curr.text });

      if (
        next &&
        !isInstrumentalSymbol(next.text) &&
        next.timeSec - curr.timeSec > LONG_GAP_THRESHOLD_SEC
      ) {
        items.push({
          kind: "break",
          timeSec: curr.timeSec + SUNG_LINE_HOLD_SEC,
          text: "",
        });
      }
    }

    return items.map((item, idx) => ({
      ...item,
      endSec: items[idx + 1]?.timeSec ?? item.timeSec + 6,
    }));
  }, [syncedLines]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Only re-render when activeIndex actually changes; drive break bar via direct GPU transform ref
  useEffect(() => {
    if (!timeline.length) return;
    return subscribeTime((timeSec) => {
      const t = timeSec + SYNC_LOOKAHEAD_SEC;
      let idx = 0;
      for (let i = 0; i < timeline.length; i++) {
        if (timeline[i].timeSec <= t) idx = i;
        else break;
      }
      setActiveIndex((prev) => (prev === idx ? prev : idx));

      const active = timeline[idx];
      if (active?.kind === "break" && breakProgressRef.current) {
        const span = Math.max(0.5, active.endSec - active.timeSec);
        const ratio = Math.min(1, Math.max(0, (t - active.timeSec) / span));
        breakProgressRef.current.style.transform = `scaleX(${ratio})`;
      }
    });
  }, [timeline, subscribeTime]);

  const clampedActive =
    timeline.length > 0 ? Math.min(activeIndex, timeline.length - 1) : -1;

  const visibleSlots = useMemo(() => {
    if (!timeline.length || clampedActive < 0) return [];
    const indices = [clampedActive - 1, clampedActive, clampedActive + 1].filter(
      (i) => i >= 0 && i < timeline.length,
    );
    return indices.map((idx) => ({
      idx,
      offset: idx - clampedActive,
      item: timeline[idx],
    }));
  }, [timeline, clampedActive]);

  const plainLines = useMemo(() => {
    if (!data.plainLyrics) return [];
    return data.plainLyrics
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !isInstrumentalSymbol(l));
  }, [data.plainLyrics]);

  return (
    <div className="relative flex h-[440px] flex-col items-center justify-center overflow-hidden [contain:layout_paint] lg:h-[496px]">
      {loading ? (
        <div className="flex w-full max-w-md flex-col items-center gap-4 px-8">
          <div className="h-4 w-40 animate-pulse rounded-full bg-surface" />
          <div className="h-8 w-72 animate-pulse rounded-full bg-surface" />
          <div className="h-4 w-48 animate-pulse rounded-full bg-surface" />
        </div>
      ) : timeline.length > 0 ? (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-8 pb-10">
          {/* Minimal soft top & bottom fog masks */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-bg via-bg/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-bg via-bg/80 to-transparent"
          />

          {/* Continuous gliding 3-line lyric reel — GPU transform + opacity only */}
          <div className="relative flex h-full w-full max-w-xl items-center justify-center">
            <AnimatePresence initial={false}>
              {visibleSlots.map(({ idx, offset, item }) => {
                const isCenter = offset === 0;
                const isTop = offset === -1;

                const targetY = offset * SLOT_GAP_PX;
                const targetOpacity = isCenter ? 1 : isTop ? 0.3 : 0.34;
                const targetScale = isCenter ? 1 : 0.86;

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => onSeek(item.timeSec)}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0, y: targetY }
                        : {
                            opacity: 0,
                            y: (offset + 1) * SLOT_GAP_PX,
                            scale: 0.82,
                          }
                    }
                    animate={{
                      opacity: targetOpacity,
                      y: targetY,
                      scale: targetScale,
                    }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            y: (offset - 1) * SLOT_GAP_PX,
                            scale: 0.82,
                          }
                    }
                    transition={{ duration: 0.56, ease: REEL_EASE }}
                    className="absolute inset-x-0 mx-auto block w-full cursor-pointer text-center will-change-transform focus-visible:outline-none"
                  >
                    {item.kind === "break" ? (
                      <div
                        aria-label="Instrumental interlude"
                        className="flex flex-col items-center justify-center gap-3"
                      >
                        <div className="flex h-9 items-center justify-center gap-1.5">
                          {HARMONIC_BARS.map((bar, barIdx) => (
                            <span
                              key={barIdx}
                              className={`w-[3px] origin-center rounded-full bg-text/80 ${
                                isCenter && !shouldReduceMotion
                                  ? "harmonic-wave-bar"
                                  : "opacity-40"
                              }`}
                              style={{
                                height: `${isCenter ? bar.height : Math.round(bar.height * 0.65)}px`,
                                animationDelay:
                                  isCenter && !shouldReduceMotion
                                    ? `${bar.delay}ms`
                                    : undefined,
                              }}
                            />
                          ))}
                        </div>

                        {isCenter && (
                          <span className="h-[2.5px] w-16 overflow-hidden rounded-full bg-text/15">
                            <span
                              ref={breakProgressRef}
                              className="block h-full origin-left rounded-full bg-text/70 will-change-transform"
                              style={{ transform: "scaleX(0)" }}
                            />
                          </span>
                        )}
                      </div>
                    ) : isCenter ? (
                      <span className="block text-center text-[26px] font-semibold leading-[1.3] tracking-tight text-text sm:text-[32px]">
                        {item.text}
                      </span>
                    ) : (
                      <span className="block text-center text-[19px] font-medium leading-[1.38] tracking-tight text-text transition-opacity duration-200 hover:opacity-80 sm:text-[22px]">
                        {item.text}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : plainLines.length > 0 ? (
        <div className="no-scrollbar h-full w-full overflow-y-auto px-8 pb-24 pt-10 text-center">
          <div className="mx-auto max-w-md space-y-3.5">
            {plainLines.map((line, idx) => (
              <p
                key={idx}
                className="text-[19px] font-medium leading-[1.6] tracking-tight text-text/80 sm:text-[22px]"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 pb-12 text-center">
          <p className="font-mono text-xs text-text-muted">
            {data.instrumental
              ? "Instrumental track."
              : "Lyrics unavailable for this track."}
          </p>
        </div>
      )}

      {/* Bottom-right borderless soft charcoal Up Next pill with fade-reset marquee */}
      {nextTrack && (
        <button
          type="button"
          onClick={onPlayNext}
          className="pressable group absolute bottom-3.5 right-4 z-20 flex w-[236px] cursor-pointer items-center gap-2.5 rounded-2xl bg-[#1a1a1f]/95 py-2 pl-2 pr-3.5 text-left text-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.45)] transition-colors duration-200 hover:bg-[#24242b] sm:right-5 sm:w-[252px]"
        >
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-black/40">
            {nextTrack.coverUrl ? (
              <Image
                src={nextTrack.coverUrl}
                alt=""
                width={32}
                height={32}
                sizes="32px"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Disc3 className="h-3.5 w-3.5 text-white/50" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              Up Next
            </p>
            <UpNextMarquee
              title={nextTrack.title}
              reduceMotion={shouldReduceMotion}
            />
          </div>
          <SkipForward
            className="h-3.5 w-3.5 shrink-0 text-white/55 transition-colors duration-150 group-hover:text-white"
            strokeWidth={1.8}
          />
        </button>
      )}
    </div>
  );
});
