"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpDown,
  ArrowUpRight,
  Disc3,
  Headphones,
  Loader2,
  MessageSquareQuote,
  Pause,
  Play,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { EditorialText } from "@/components/ui/EditorialText";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  useMusicPlayer,
  type TimeListener,
} from "@/components/sections/music/useMusicPlayer";
import { LyricsPanel } from "@/components/sections/music/LyricsPanel";
import type { LyricsPayload } from "@/app/api/lyrics/route";
import type {
  SpotifyPlaylistPayload,
  SpotifyTrack,
} from "@/app/api/spotify-playlist/route";

function formatDuration(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return "--:--";
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatSeconds(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return "0:00";
  const mins = Math.floor(sec / 60);
  const rem = Math.floor(sec % 60);
  return `${mins}:${rem.toString().padStart(2, "0")}`;
}

/** Isolated progress bar: updates fill via direct GPU transform ref (0 React re-renders/sec on Music) */
const PlaybackProgressBar = memo(function PlaybackProgressBar({
  duration,
  subscribeTime,
  onSeek,
}: {
  duration: number;
  subscribeTime: (listener: TimeListener) => () => void;
  onSeek: (seconds: number) => void;
}) {
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const timeTextRef = useRef<HTMLSpanElement | null>(null);
  const lastWholeSecRef = useRef(-1);

  useEffect(() => {
    return subscribeTime((timeSec, durSec) => {
      const effectiveDur = durSec > 0 ? durSec : duration;
      const ratio =
        effectiveDur > 0 ? Math.min(1, Math.max(0, timeSec / effectiveDur)) : 0;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${ratio})`;
      }
      const whole = Math.floor(timeSec);
      if (whole !== lastWholeSecRef.current) {
        lastWholeSecRef.current = whole;
        if (timeTextRef.current) {
          timeTextRef.current.textContent = formatSeconds(timeSec);
        }
        if (sliderRef.current) {
          sliderRef.current.setAttribute("aria-valuenow", String(whole));
        }
      }
    });
  }, [duration, subscribeTime]);

  const handlePointer = (clientX: number, el: HTMLElement) => {
    if (!duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div className="mt-5 flex items-center gap-2.5">
      <span
        ref={timeTextRef}
        className="w-7 shrink-0 font-mono text-[10px] tabular-nums text-white/65"
      >
        0:00
      </span>
      <div
        ref={sliderRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek track position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={0}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handlePointer(e.clientX, e.currentTarget);
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return;
          handlePointer(e.clientX, e.currentTarget);
        }}
        className="group relative flex h-5 flex-1 cursor-pointer items-center focus-visible:outline-none"
      >
        <span className="h-[5px] w-full overflow-hidden rounded-full bg-white/20">
          <span
            ref={fillRef}
            className="block h-full origin-left rounded-full bg-white transition-colors duration-150 will-change-transform group-hover:bg-[#1DB954]"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
      <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums text-white/65">
        {formatSeconds(duration)}
      </span>
    </div>
  );
});

type SortMode = "default" | "az" | "shortest";

const SORT_NEXT: Record<SortMode, SortMode> = {
  default: "az",
  az: "shortest",
  shortest: "default",
};

const SORT_LABELS: Record<SortMode, string> = {
  default: "Order",
  az: "A-Z",
  shortest: "Shortest",
};

interface IndexedTrack {
  track: SpotifyTrack;
  origIndex: number;
}

/** Memoized tracklist: supports live filter/sort while preserving original playback indices */
const TrackList = memo(function TrackList({
  items,
  loading,
  hasTracks,
  query,
  activeIndex,
  isPlaying,
  reduceMotion,
  onClearQuery,
  onTogglePlay,
  onPlayTrack,
  onPrefetchTrack,
}: {
  items: IndexedTrack[];
  loading: boolean;
  hasTracks: boolean;
  query: string;
  activeIndex: number;
  isPlaying: boolean;
  reduceMotion: boolean;
  onClearQuery: () => void;
  onTogglePlay: () => void;
  onPlayTrack: (index: number) => void;
  onPrefetchTrack: (track: SpotifyTrack) => void;
}) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[58px] items-center justify-between gap-4 rounded-xl px-3"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3.5">
              <span className="h-3 w-4 rounded bg-surface" />
              <span className="h-10 w-10 shrink-0 rounded-lg bg-surface" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-44 rounded bg-surface" />
                <div className="h-2.5 w-28 rounded bg-surface/70" />
              </div>
            </div>
            <span className="h-2.5 w-9 rounded bg-surface" />
          </div>
        ))}
      </>
    );
  }

  if (!hasTracks) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 text-center">
        <p className="font-mono text-xs text-text-muted">
          Playlist unavailable right now.
        </p>
        <a
          href={PROFILE.socials.spotifyPlaylist}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-text underline-offset-4 hover:underline"
        >
          <span>Open on Spotify</span>
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.7} />
        </a>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full flex-col items-center justify-center gap-3.5 px-6 pb-8 text-center"
      >
        <Image
          src="/logos/confused-cloud.svg"
          alt=""
          width={52}
          height={52}
          className="h-[52px] w-[52px] select-none object-contain opacity-95"
        />
        <div className="space-y-1">
          <p className="text-lg font-medium tracking-tight text-text">
            Haven&apos;t spun &ldquo;{query}&rdquo; yet.
          </p>
          <p className="font-mono text-xs text-text-muted">
            Maybe I need to add it.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearQuery}
          className="pressable group mt-1.5 inline-flex cursor-pointer items-center rounded-full bg-text/[0.09] px-5 py-2 text-sm font-medium text-text transition-colors duration-200 hover:bg-text/[0.15]"
        >
          <EditorialText>Back to playlist</EditorialText>
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {items.map(({ track, origIndex }) => {
        const isActive = origIndex === activeIndex;
        const isTrackPlaying = isActive && isPlaying;
        return (
          <motion.button
            key={`${track.id}-${origIndex}`}
            layout={reduceMotion ? false : "position"}
            transition={{
              layout: {
                type: "spring",
                stiffness: 220,
                damping: 30,
                mass: 0.9,
              },
            }}
            type="button"
            onPointerEnter={() => onPrefetchTrack(track)}
            onFocus={() => onPrefetchTrack(track)}
            onClick={() => {
              if (isActive) onTogglePlay();
              else onPlayTrack(origIndex);
            }}
            className={`group relative flex w-full cursor-pointer items-center justify-between gap-3.5 overflow-hidden rounded-xl px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none ${
              isActive
                ? "bg-text/[0.09] text-text"
                : "text-text-secondary hover:bg-text/[0.085]"
            }`}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-5 w-[2.5px] -translate-y-1/2 rounded-r-full bg-[#1DB954]"
              />
            )}

            <div className="flex min-w-0 items-center gap-3.5">
              <span className="flex w-5 shrink-0 items-center justify-center font-mono text-[11px] tabular-nums text-text-muted">
                {isTrackPlaying ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-3 items-end gap-[2px] group-hover:hidden"
                    >
                      {[0, 1, 2].map((bar) => (
                        <span
                          key={bar}
                          className={`h-full w-[2px] origin-bottom rounded-full bg-[#1DB954] ${
                            reduceMotion ? "" : "spotify-eq-bar"
                          }`}
                          style={
                            reduceMotion
                              ? undefined
                              : { animationDelay: `${bar * 150}ms` }
                          }
                        />
                      ))}
                    </span>
                    <Pause
                      className="hidden h-3 w-3 fill-current text-text group-hover:block"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <>
                    <span
                      className={`group-hover:hidden ${
                        isActive ? "text-[#1DB954]" : ""
                      }`}
                    >
                      {String(origIndex + 1).padStart(2, "0")}
                    </span>
                    <Play
                      className="hidden h-3 w-3 translate-x-[0.5px] fill-current text-text group-hover:block"
                      strokeWidth={2}
                    />
                  </>
                )}
              </span>

              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface ring-1 ring-inset ring-text/[0.06]">
                {track.coverUrl ? (
                  <Image
                    src={track.coverUrl}
                    alt=""
                    width={40}
                    height={40}
                    sizes="40px"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Disc3
                      className="h-4 w-4 text-text-muted"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p
                    className={`truncate text-sm font-medium ${
                      isActive
                        ? "text-[#1DB954]"
                        : "text-text/95 group-hover:text-text"
                    }`}
                  >
                    {track.title}
                  </p>
                  {track.isExplicit && (
                    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] bg-text/15 font-mono text-[8px] font-semibold text-text-muted">
                      E
                    </span>
                  )}
                </div>
                <p className="truncate font-mono text-[11px] text-text-muted">
                  {track.artist}
                </p>
              </div>
            </div>

            <span className="shrink-0 font-mono text-xs tabular-nums text-text-muted">
              {formatDuration(track.durationMs)}
            </span>
          </motion.button>
        );
      })}
    </>
  );
});

export function Music() {
  const [playlist, setPlaylist] = useState<SpotifyPlaylistPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [ytEnabled, setYtEnabled] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [lyricsState, setLyricsState] = useState<{
    trackId: string;
    loading: boolean;
    data: LyricsPayload;
  }>({
    trackId: "",
    loading: false,
    data: { syncedLines: null, plainLyrics: null, instrumental: false },
  });

  const sectionRef = useRef<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const lyricsCacheRef = useRef(new Map<string, LyricsPayload>());
  const ytHostARef = useRef<HTMLDivElement | null>(null);
  const ytHostBRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = Boolean(useReducedMotion());

  // Defer YouTube IFrame API load until section is within 400px of viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setYtEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/spotify-playlist", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SpotifyPlaylistPayload | null) => {
        if (!data) return;
        setPlaylist(data);
      })
      .catch(() => {
        // Handled cleanly by empty fallback UI
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const tracks = useMemo(
    () => playlist?.tracks ?? [],
    [playlist?.tracks],
  );
  const filteredTracks = useMemo<IndexedTrack[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    const list: IndexedTrack[] = tracks
      .map((track, origIndex) => ({ track, origIndex }))
      .filter(({ track }) =>
        q
          ? track.title.toLowerCase().includes(q) ||
            track.artist.toLowerCase().includes(q)
          : true,
      );
    if (sortMode === "az") {
      return [...list].sort((a, b) =>
        a.track.title.localeCompare(b.track.title),
      );
    }
    if (sortMode === "shortest") {
      return [...list].sort((a, b) => a.track.durationMs - b.track.durationMs);
    }
    return list;
  }, [tracks, searchQuery, sortMode]);

  const clearFilter = useCallback(() => {
    setSearchQuery("");
    setSearchOpen(false);
  }, []);

  const player = useMusicPlayer(
    tracks,
    { ytHostARef, ytHostBRef },
    ytEnabled,
  );
  const activeTrack = tracks[player.activeIndex] ?? null;
  const activeCover = activeTrack?.coverUrl ?? playlist?.coverUrl ?? null;

  useEffect(() => {
    if (!showLyrics || !activeTrack) return;
    const cached = lyricsCacheRef.current.get(activeTrack.id);
    if (cached) {
      setLyricsState({
        trackId: activeTrack.id,
        loading: false,
        data: cached,
      });
      return;
    }

    const controller = new AbortController();
    setLyricsState({
      trackId: activeTrack.id,
      loading: true,
      data: { syncedLines: null, plainLyrics: null, instrumental: false },
    });

    fetch(
      `/api/lyrics?title=${encodeURIComponent(activeTrack.title)}&artist=${encodeURIComponent(activeTrack.artist)}`,
      { signal: controller.signal },
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LyricsPayload | null) => {
        const entry: LyricsPayload = {
          syncedLines: data?.syncedLines ?? null,
          plainLyrics: data?.plainLyrics ?? null,
          instrumental: Boolean(data?.instrumental),
        };
        lyricsCacheRef.current.set(activeTrack.id, entry);
        setLyricsState({
          trackId: activeTrack.id,
          loading: false,
          data: entry,
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLyricsState({
            trackId: activeTrack.id,
            loading: false,
            data: { syncedLines: null, plainLyrics: null, instrumental: false },
          });
        }
      });

    return () => controller.abort();
  }, [showLyrics, activeTrack]);

  const handlePlayNextFromLyrics = useCallback(() => {
    if (!tracks.length) return;
    player.playTrackAt((player.activeIndex + 1) % tracks.length);
  }, [player, tracks.length]);

  const handleVolumeFromClientX = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const next = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    player.setVolume(next);
    if (next > 0 && player.muted) player.setMuted(false);
    if (next === 0) player.setMuted(true);
  };

  const effectiveVolume = player.muted ? 0 : player.volume;
  const VolumeIcon =
    effectiveVolume === 0
      ? VolumeX
      : effectiveVolume < 0.5
        ? Volume1
        : Volume2;

  return (
    <section id="music" ref={sectionRef} className="w-full scroll-mt-16">
      {/* Hidden dual YouTube IFrame decks for full-song playback & crossfading */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
      >
        <div ref={ytHostARef} />
        <div ref={ytHostBRef} />
      </div>

      <div className="mx-auto max-w-5xl border-x border-border">
        {/* Section Heading Bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-2.5 sm:px-10">
          <h2 className="font-brand text-3xl font-normal leading-none tracking-normal text-text">
            Jukebox
          </h2>
          <a
            href={PROFILE.socials.spotifyPlaylist}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-text-secondary"
          >
            <EditorialText>Plug in on Spotify</EditorialText>
            <Headphones
              className="h-4 w-4 text-text-muted transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-6 group-hover:scale-110 group-hover:text-[#1DB954]"
              strokeWidth={1.8}
            />
          </a>
        </div>

        {/* Main 2-Column Stage */}
        <ScrollReveal y={22}>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Borderless Moody Blurred Album-Art Now-Playing Widget */}
          <div className="flex items-center justify-center border-b border-border p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
            <div className="relative flex w-full max-w-[336px] flex-col overflow-hidden rounded-[28px] bg-[#111114] p-6 ring-1 ring-inset ring-white/10 [box-shadow:var(--music-card-shadow)] [contain:layout_paint]">
              {/* Overlapping interruptible album-art backdrop crossfade on isolated GPU layer */}
              <AnimatePresence initial={false}>
                {activeCover && (
                  <motion.div
                    key={`bg-${activeCover}`}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.48 }}
                    className="pointer-events-none absolute -inset-3 scale-105 blur-md saturate-[1.25] brightness-[0.55] will-change-transform"
                  >
                    <Image
                      src={activeCover}
                      alt=""
                      fill
                      sizes="336px"
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70"
              />

              <div className="relative z-10 flex flex-col text-white">
                {/* Minimal hover-expand volume capsule tucked flush in top-left corner */}
                <div className="absolute -left-2.5 -top-2.5 z-20">
                  <div className="group/vol flex items-center rounded-full p-1 transition-colors duration-200 hover:bg-white/15 focus-within:bg-white/15">
                    <button
                      type="button"
                      onClick={() => player.setMuted((prev) => !prev)}
                      aria-label={player.muted ? "Unmute" : "Mute"}
                      className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/75 transition-colors duration-150 hover:text-white"
                    >
                      <VolumeIcon className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>

                    <div className="grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity,margin] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/vol:ml-1.5 group-hover/vol:grid-cols-[1fr] group-hover/vol:opacity-100 group-focus-within/vol:ml-1.5 group-focus-within/vol:grid-cols-[1fr] group-focus-within/vol:opacity-100">
                      <div className="overflow-hidden pr-2">
                        <div
                          role="slider"
                          tabIndex={0}
                          aria-label="Volume"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(effectiveVolume * 100)}
                          onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture(e.pointerId);
                            handleVolumeFromClientX(e.clientX, e.currentTarget);
                          }}
                          onPointerMove={(e) => {
                            if (e.buttons !== 1) return;
                            handleVolumeFromClientX(e.clientX, e.currentTarget);
                          }}
                          className="relative flex h-5 w-20 cursor-pointer items-center focus-visible:outline-none"
                        >
                          <span className="h-[4px] w-full overflow-hidden rounded-full bg-white/25">
                            <span
                              className="block h-full origin-left rounded-full bg-white"
                              style={{ transform: `scaleX(${effectiveVolume})` }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimal Lyrics toggle tucked flush in top-right corner */}
                <div className="absolute -right-2.5 -top-2.5 z-20">
                  <button
                    type="button"
                    onClick={() => setShowLyrics((prev) => !prev)}
                    aria-label={showLyrics ? "Show playlist" : "Show lyrics"}
                    aria-pressed={showLyrics}
                    title={showLyrics ? "Back to playlist" : "Lyrics"}
                    className={`pressable relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ${
                      showLyrics
                        ? "bg-white/15 text-[#1DB954]"
                        : "text-white/75 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <MessageSquareQuote
                      className="h-3.5 w-3.5"
                      strokeWidth={1.8}
                    />
                    {showLyrics && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#1DB954]" />
                    )}
                  </button>
                </div>

                {/* Centered Large Rotating Music-Art Disc */}
                <div className="mb-7 mt-7 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={player.togglePlay}
                    aria-label={player.isPlaying ? "Pause song" : "Play song"}
                    className={`group relative h-[216px] w-[216px] cursor-pointer rounded-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform focus-visible:outline-none [box-shadow:var(--music-disc-shadow)] ${
                      player.isPlaying
                        ? "scale-[1.03]"
                        : "scale-100 hover:scale-[1.02]"
                    }`}
                  >
                    <div
                      className="vinyl-disc relative h-full w-full overflow-hidden rounded-full bg-black/80 will-change-transform"
                      style={{
                        animationPlayState:
                          player.isPlaying && !shouldReduceMotion
                            ? "running"
                            : "paused",
                      }}
                    >
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={activeCover ?? "fallback"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="absolute inset-0"
                        >
                          {activeCover ? (
                            <Image
                              src={activeCover}
                              alt={`${activeTrack?.title ?? "Track"} album art`}
                              fill
                              sizes="216px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-white/10">
                              <Disc3
                                className="h-12 w-12 text-white/50"
                                strokeWidth={1.3}
                              />
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Stationary optical surface: fine concentric micro-grooves + diagonal specular light sweep */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full opacity-[0.14]"
                      style={{
                        backgroundImage:
                          "repeating-radial-gradient(circle at center, rgba(255,255,255,0.45) 0px, transparent 1px, transparent 3.5px)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full opacity-55 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "conic-gradient(from 25deg, transparent 0deg, rgba(255,255,255,0.55) 35deg, transparent 85deg, transparent 180deg, rgba(255,255,255,0.4) 215deg, transparent 270deg)",
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/25"
                    />

                    {/* Precision frosted CD/vinyl spindle hub (no 60fps backdrop-blur re-sample) */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/[0.18] shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)] ring-1 ring-white/35"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/45">
                        <span className="h-3.5 w-3.5 rounded-full bg-[#0d0d10] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] ring-1 ring-white/25" />
                      </span>
                    </span>
                  </button>
                </div>

                {/* Song Title + Artist with smooth crossfade */}
                <div className="min-h-[46px] min-w-0">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeTrack?.id ?? "idle"}
                      initial={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 4 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        shouldReduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -4 }
                      }
                      transition={{ duration: 0.22 }}
                    >
                      <div className="flex items-center gap-2">
                        <p className="truncate text-lg font-semibold leading-snug tracking-tight text-white">
                          {activeTrack?.title ??
                            (loading
                              ? "Loading playlist..."
                              : "Shivam's Playlist")}
                        </p>
                        {activeTrack?.isExplicit && (
                          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-white/20 font-mono text-[9px] font-semibold text-white/90">
                            E
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[13px] text-white/75">
                        {activeTrack?.artist || "Spotify Playlist"}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Isolated 0-rerender Progress Bar */}
                <PlaybackProgressBar
                  duration={player.duration}
                  subscribeTime={player.subscribeTime}
                  onSeek={player.seekTo}
                />

                {/* Transport Controls */}
                <div className="mt-4 flex items-center justify-between px-1">
                  <button
                    type="button"
                    onClick={() => player.setShuffle((prev) => !prev)}
                    aria-label="Toggle shuffle"
                    aria-pressed={player.shuffle}
                    className={`pressable relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ${
                      player.shuffle
                        ? "text-[#1DB954]"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Shuffle className="h-4 w-4" strokeWidth={1.8} />
                    {player.shuffle && (
                      <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#1DB954]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      player.playTrackAt(
                        player.findNextIndex(player.activeIndex, -1),
                      )
                    }
                    disabled={!tracks.length}
                    aria-label="Previous song"
                    className="pressable inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors duration-150 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <SkipBack
                      className="h-[18px] w-[18px] fill-current"
                      strokeWidth={1.6}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={player.togglePlay}
                    disabled={!tracks.length}
                    aria-label={player.isPlaying ? "Pause" : "Play"}
                    className="pressable inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-transform duration-150 hover:scale-[1.04] disabled:cursor-not-allowed disabled:opacity-40 [box-shadow:var(--music-play-shadow)]"
                  >
                    {player.buffering ? (
                      <Loader2
                        className="h-[18px] w-[18px] animate-spin"
                        strokeWidth={2}
                      />
                    ) : player.isPlaying ? (
                      <Pause
                        className="h-[18px] w-[18px] fill-current"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Play
                        className="h-[18px] w-[18px] translate-x-[1px] fill-current"
                        strokeWidth={1.8}
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      player.playTrackAt(
                        player.findNextIndex(player.activeIndex, 1),
                      )
                    }
                    disabled={!tracks.length}
                    aria-label="Next song"
                    className="pressable inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors duration-150 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <SkipForward
                      className="h-[18px] w-[18px] fill-current"
                      strokeWidth={1.6}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => player.setRepeat((prev) => !prev)}
                    aria-label="Toggle repeat"
                    aria-pressed={player.repeat}
                    className={`pressable relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ${
                      player.repeat
                        ? "text-[#1DB954]"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    <Repeat className="h-4 w-4" strokeWidth={1.8} />
                    {player.repeat && (
                      <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#1DB954]" />
                    )}
                  </button>
                </div>

                {/* Playful hand-drawn loop-de-loop arrow callout pointing to Play button when idle */}
                <div className="relative -mb-2 mt-1 flex h-8 items-end justify-center">
                  <AnimatePresence>
                    {!player.isPlaying && !player.buffering && tracks.length > 0 && (
                      <motion.button
                        type="button"
                        onClick={player.togglePlay}
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 4 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 4 }
                        }
                        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                        className="group inline-flex -translate-x-12 cursor-pointer items-end gap-1.5 text-white/70 transition-colors duration-150 hover:text-white"
                      >
                        <span className="-rotate-2 pb-0.5 font-brand text-[15px] italic leading-none tracking-wide">
                          hit play, trust me
                        </span>
                        <svg
                          viewBox="0 0 64 36"
                          fill="none"
                          aria-hidden="true"
                          className="h-8 w-14 -translate-y-0.5 overflow-visible"
                        >
                          <motion.path
                            d="M 3 27 C 16 33, 30 30, 31 19 C 32 12, 23 11, 22 18 C 21 25, 36 27, 47 22 C 55 18, 56 10, 52 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={
                              shouldReduceMotion
                                ? { pathLength: 1, opacity: 1 }
                                : { pathLength: 0, opacity: 1 }
                            }
                            animate={
                              shouldReduceMotion
                                ? { pathLength: 1, opacity: 1 }
                                : {
                                    pathLength: [0, 1, 1, 1, 0],
                                    opacity: [1, 1, 1, 0, 0],
                                  }
                            }
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : {
                                    duration: 4.4,
                                    times: [0, 0.18, 0.88, 0.96, 1],
                                    ease: [0.22, 1, 0.36, 1],
                                    repeat: Infinity,
                                  }
                            }
                          />
                          <motion.path
                            d="M 46.5 9.5 L 52 3.5 L 57.5 8.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0 }
                            }
                            animate={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: [0, 0, 1, 1, 0, 0] }
                            }
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : {
                                    duration: 4.4,
                                    times: [0, 0.15, 0.21, 0.88, 0.96, 1],
                                    ease: "easeOut",
                                    repeat: Infinity,
                                  }
                            }
                          />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Open, Native-Feel Spotify Tracklist Queue ↔ Lyrics View */}
          <div className="flex flex-col lg:col-span-7">
            <div className="flex min-h-[46px] items-center justify-between gap-3 px-6 pb-2 pt-5 sm:px-7">
              <div className="relative min-w-0 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={showLyrics ? "hdr-lyrics" : "hdr-playlist"}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: showLyrics ? 10 : -10 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: showLyrics ? -10 : 10 }
                    }
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="block truncate text-sm font-medium tracking-tight text-text-secondary"
                  >
                    {showLyrics
                      ? "Lyrics"
                      : (playlist?.title ?? "Shivam's Playlist")}
                  </motion.span>
                </AnimatePresence>
              </div>

              {!showLyrics && (
                <div className="flex shrink-0 items-center gap-1.5">
                  <div
                    className={`flex h-7 items-center overflow-hidden rounded-lg transition-colors duration-200 ${
                      searchOpen
                        ? "bg-text/[0.08] px-2"
                        : "hover:bg-text/[0.07]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (searchOpen) {
                          searchInputRef.current?.focus();
                        } else {
                          setSearchOpen(true);
                          requestAnimationFrame(() =>
                            searchInputRef.current?.focus(),
                          );
                        }
                      }}
                      aria-label="Filter songs"
                      title="Filter songs"
                      className={`inline-flex h-7 shrink-0 cursor-pointer items-center justify-center transition-colors duration-150 ${
                        searchOpen
                          ? "w-4 text-text-secondary"
                          : "w-7 text-text-muted hover:text-text"
                      }`}
                    >
                      <Search className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>

                    <AnimatePresence initial={false}>
                      {searchOpen && (
                        <motion.div
                          key="search-field"
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { width: 0, opacity: 0 }
                          }
                          animate={
                            shouldReduceMotion
                              ? { opacity: 1 }
                              : { width: "auto", opacity: 1 }
                          }
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { width: 0, opacity: 0 }
                          }
                          transition={{
                            duration: 0.26,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex items-center overflow-hidden"
                        >
                          <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Escape") clearFilter();
                            }}
                            placeholder="Filter songs..."
                            aria-label="Filter playlist"
                            className="ml-1.5 w-28 bg-transparent text-xs text-text placeholder:text-text-muted focus:outline-none sm:w-36"
                          />
                          <button
                            type="button"
                            onClick={clearFilter}
                            aria-label="Close filter"
                            className="ml-1 inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center text-text-muted transition-colors duration-150 hover:text-text"
                          >
                            <X className="h-3 w-3" strokeWidth={2} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSortMode((prev) => SORT_NEXT[prev])}
                    aria-label={`Sort playlist: ${SORT_LABELS[sortMode]}`}
                    title={`Sort: ${SORT_LABELS[sortMode]}`}
                    className={`pressable inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 font-mono text-[11px] transition-colors duration-200 ${
                      sortMode === "default"
                        ? "text-text-muted hover:bg-text/[0.07] hover:text-text"
                        : "bg-text/[0.09] text-text"
                    }`}
                  >
                    <motion.span
                      key={`icon-${sortMode}`}
                      initial={
                        shouldReduceMotion ? false : { rotate: -90, opacity: 0.5 }
                      }
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-flex items-center"
                    >
                      <ArrowUpDown className="h-3 w-3" strokeWidth={1.8} />
                    </motion.span>
                    <span className="relative inline-flex overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={sortMode}
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 6 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: -6 }
                          }
                          transition={{
                            duration: 0.18,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="inline-block"
                        >
                          {SORT_LABELS[sortMode]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative h-[440px] flex-1 overflow-hidden lg:h-[496px]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 bg-gradient-to-b from-bg to-transparent"
              />

              {/* Overlapping Spatial Z-Depth Push between Playlist & Lyrics (zero blank flash) */}
              <AnimatePresence initial={false}>
                {showLyrics ? (
                  <motion.div
                    key="lyrics-view"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.03, y: 18 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 1.03, y: 18 }
                    }
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <LyricsPanel
                      loading={lyricsState.loading}
                      data={lyricsState.data}
                      subscribeTime={player.subscribeTime}
                      nextTrack={
                        tracks.length > 1
                          ? (tracks[(player.activeIndex + 1) % tracks.length] ??
                            null)
                          : null
                      }
                      onSeek={player.seekTo}
                      onPlayNext={handlePlayNextFromLyrics}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="playlist-view"
                    layoutScroll
                    data-lenis-prevent
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, y: -14 }
                    }
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, y: -14 }
                    }
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="no-scrollbar absolute inset-0 space-y-0.5 overflow-y-auto px-3 pb-12 pt-3 will-change-transform sm:px-4"
                  >
                    <LayoutGroup id="music-playlist">
                      <TrackList
                        items={filteredTracks}
                        loading={loading}
                        hasTracks={tracks.length > 0}
                        query={searchQuery}
                        activeIndex={player.activeIndex}
                        isPlaying={player.isPlaying}
                        reduceMotion={shouldReduceMotion}
                        onClearQuery={clearFilter}
                        onTogglePlay={player.togglePlay}
                        onPlayTrack={player.playTrackAt}
                        onPrefetchTrack={player.prefetchTrack}
                      />
                    </LayoutGroup>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showLyrics && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-bg via-bg/75 to-transparent"
                />
              )}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>

      <SectionDivider />
    </section>
  );
}
