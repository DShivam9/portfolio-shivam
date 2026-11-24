"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { SpotifyTrack } from "@/app/api/spotify-playlist/route";

export const DEFAULT_VOLUME = 0.22;
const MAX_AMBIENT_GAIN = 0.35;
const MANUAL_XFADE_MS = 1800;
const AUTO_XFADE_MS = 3000;
const AUTO_XFADE_LEAD_SEC = 3.2;
const START_FADE_MS = 950;
const PAUSE_FADE_MS = 420;
const MAX_FRAME_DT_MS = 40;

interface YTPlayerInstance {
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      height?: string | number;
      width?: string | number;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayerInstance;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type DeckKey = "a" | "b";
export type TimeListener = (timeSec: number, durationSec: number) => void;

export interface MusicPlayerHosts {
  ytHostARef: RefObject<HTMLDivElement | null>;
  ytHostBRef: RefObject<HTMLDivElement | null>;
}

function toAmbientGain(level: number, isMuted: boolean) {
  if (isMuted || level <= 0) return 0;
  return Math.pow(Math.min(1, Math.max(0, level)), 1.8) * MAX_AMBIENT_GAIN;
}

let ytApiPromise: Promise<YTNamespace | null> | null = null;

function loadYouTubeApi(): Promise<YTNamespace | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.();
      resolve(window.YT ?? null);
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    }
  });

  return ytApiPromise;
}

export function useMusicPlayer(
  tracks: SpotifyTrack[],
  hosts: MusicPlayerHosts,
  ytEnabled: boolean,
) {
  const { ytHostARef, ytHostBRef } = hosts;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);

  // High-frequency time channel: avoids re-rendering Music.tsx while playing
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const timeListenersRef = useRef(new Set<TimeListener>());

  const emitTime = useCallback((t: number, dur: number) => {
    currentTimeRef.current = t;
    if (Number.isFinite(dur) && dur > 0) {
      if (Math.abs(dur - durationRef.current) > 0.5) {
        durationRef.current = dur;
        setDuration(dur);
      }
    }
    timeListenersRef.current.forEach((fn) => fn(t, durationRef.current));
  }, []);

  const subscribeTime = useCallback((listener: TimeListener) => {
    timeListenersRef.current.add(listener);
    listener(currentTimeRef.current, durationRef.current);
    return () => {
      timeListenersRef.current.delete(listener);
    };
  }, []);

  const ytPlayersRef = useRef<Record<DeckKey, YTPlayerInstance | null>>({
    a: null,
    b: null,
  });
  const ytReadyRef = useRef<Record<DeckKey, boolean>>({ a: false, b: false });
  const activeDeckRef = useRef<DeckKey>("a");
  const deckVideoIdRef = useRef<Record<DeckKey, string | null>>({
    a: null,
    b: null,
  });
  const deckTrackRef = useRef<Record<DeckKey, SpotifyTrack | null>>({
    a: null,
    b: null,
  });

  const fadeRafRef = useRef<number>(0);
  const playRequestIdRef = useRef(0);
  const autoXfadeTriggeredRef = useRef(false);
  const gainTargetRef = useRef(toAmbientGain(DEFAULT_VOLUME, false));
  const videoCacheRef = useRef(new Map<string, string | null>());
  const inFlightLookupRef = useRef(new Map<string, Promise<string | null>>());
  const tracksRef = useRef(tracks);
  const activeIndexRef = useRef(activeIndex);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);

  useEffect(() => {
    tracksRef.current = tracks;
    const initial = tracks[activeIndexRef.current];
    if (initial && initial.durationMs > 0 && durationRef.current === 0) {
      const initialSec = initial.durationMs / 1000;
      durationRef.current = initialSec;
      setDuration(initialSec);
      timeListenersRef.current.forEach((fn) => fn(0, initialSec));
    }
  }, [tracks]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = 0;
    }
  }, []);

  const setDeckGain = useCallback((which: DeckKey, gain01: number) => {
    const clamped = Math.max(0, Math.min(1, gain01));
    const yt = ytPlayersRef.current[which];
    if (yt && ytReadyRef.current[which]) {
      try {
        yt.setVolume(Math.round(clamped * 100));
      } catch {
        // Ignore transient YT bridge errors
      }
    }
  }, []);

  const getDeckGain = useCallback((which: DeckKey): number => {
    const yt = ytPlayersRef.current[which];
    if (yt && ytReadyRef.current[which]) {
      try {
        return (yt.getVolume() ?? 0) / 100;
      } catch {
        return 0;
      }
    }
    return 0;
  }, []);

  const pauseDeckRaw = useCallback((which: DeckKey) => {
    const yt = ytPlayersRef.current[which];
    if (yt && ytReadyRef.current[which]) {
      try {
        yt.pauseVideo();
      } catch {
        // Ignore
      }
    }
  }, []);

  const isDeckPlayingRaw = useCallback((which: DeckKey): boolean => {
    const yt = ytPlayersRef.current[which];
    if (yt && ytReadyRef.current[which]) {
      try {
        return yt.getPlayerState() === 1;
      } catch {
        return false;
      }
    }
    return false;
  }, []);

  const resolveVideoId = useCallback(
    async (track: SpotifyTrack): Promise<string | null> => {
      if (videoCacheRef.current.has(track.id)) {
        return videoCacheRef.current.get(track.id) ?? null;
      }
      const existing = inFlightLookupRef.current.get(track.id);
      if (existing) return existing;

      const promise = fetch(
        `/api/yt-track?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}&durationMs=${track.durationMs}`,
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { videoId?: string | null } | null) => {
          const id = data?.videoId ?? null;
          videoCacheRef.current.set(track.id, id);
          return id;
        })
        .catch(() => {
          videoCacheRef.current.set(track.id, null);
          return null;
        })
        .finally(() => {
          inFlightLookupRef.current.delete(track.id);
        });

      inFlightLookupRef.current.set(track.id, promise);
      return promise;
    },
    [],
  );

  const findNextIndex = useCallback((startIndex: number, step: 1 | -1): number => {
    const list = tracksRef.current;
    if (!list.length) return 0;
    if (shuffleRef.current && step === 1 && list.length > 1) {
      const pool = list
        .map((_, i) => (i !== startIndex ? i : -1))
        .filter((i) => i >= 0);
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return (startIndex + step + list.length) % list.length;
  }, []);

  const rampDeck = useCallback(
    (
      which: DeckKey,
      from: number,
      fadeIn: boolean,
      durationMs: number,
      onDone?: () => void,
    ) => {
      cancelFade();
      let elapsed = 0;
      let prevNow = performance.now();
      const step = (now: number) => {
        elapsed += Math.min(MAX_FRAME_DT_MS, Math.max(0, now - prevNow));
        prevNow = now;
        const t = Math.min(1, elapsed / durationMs);
        const curve = fadeIn
          ? Math.pow(0.5 * (1 - Math.cos(Math.PI * t)), 1.35)
          : 0.5 * (1 - Math.cos(Math.PI * t));
        const target = fadeIn ? gainTargetRef.current : 0;
        setDeckGain(which, from + (target - from) * curve);
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          fadeRafRef.current = 0;
          onDone?.();
        }
      };
      fadeRafRef.current = requestAnimationFrame(step);
    },
    [cancelFade, setDeckGain],
  );

  const runCrossfade = useCallback(
    (prevKey: DeckKey, nextKey: DeckKey, xfadeMs: number) => {
      cancelFade();
      const prevStartVol = getDeckGain(prevKey);
      let elapsed = 0;
      let prevNow = performance.now();
      const step = (now: number) => {
        elapsed += Math.min(MAX_FRAME_DT_MS, Math.max(0, now - prevNow));
        prevNow = now;
        const t = Math.min(1, elapsed / xfadeMs);
        const outCurve = 0.5 * (1 + Math.cos(Math.PI * t));
        const inCurve = Math.pow(0.5 * (1 - Math.cos(Math.PI * t)), 1.35);
        setDeckGain(prevKey, prevStartVol * outCurve);
        setDeckGain(nextKey, gainTargetRef.current * inCurve);
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(step);
        } else {
          fadeRafRef.current = 0;
          pauseDeckRaw(prevKey);
          setDeckGain(prevKey, 0);
        }
      };
      fadeRafRef.current = requestAnimationFrame(step);
    },
    [cancelFade, getDeckGain, pauseDeckRaw, setDeckGain],
  );

  const waitForDeckReady = useCallback(
    (deckKey: DeckKey, timeoutMs = 6000): Promise<YTPlayerInstance | null> => {
      return new Promise((resolve) => {
        const start = performance.now();
        const check = () => {
          const yt = ytPlayersRef.current[deckKey];
          if (yt && ytReadyRef.current[deckKey]) {
            resolve(yt);
            return;
          }
          if (performance.now() - start > timeoutMs) {
            resolve(null);
            return;
          }
          requestAnimationFrame(check);
        };
        check();
      });
    },
    [],
  );

  const playTrackAtRef = useRef<(index: number, xfadeMs?: number) => void>(
    () => {},
  );

  const playTrackAt = useCallback(
    (index: number, xfadeMs = MANUAL_XFADE_MS) => {
      const target = tracksRef.current[index];
      if (!target) return;

      const prevKey = activeDeckRef.current;
      const nextKey: DeckKey = prevKey === "a" ? "b" : "a";
      const reqId = ++playRequestIdRef.current;

      cancelFade();
      autoXfadeTriggeredRef.current = false;
      setActiveIndex(index);
      const targetDur = target.durationMs > 0 ? target.durationMs / 1000 : 0;
      durationRef.current = targetDur;
      setDuration(targetDur);
      emitTime(0, targetDur);

      const shouldCrossfade = isDeckPlayingRaw(prevKey);
      activeDeckRef.current = nextKey;
      deckTrackRef.current[nextKey] = target;
      setBuffering(true);

      // Synchronously unlock the target YouTube iframe inside the user click gesture
      // so Chrome never blocks playback after an async /api/yt-track lookup
      const syncDeck = ytPlayersRef.current[nextKey];
      if (syncDeck && ytReadyRef.current[nextKey]) {
        try {
          syncDeck.setVolume(0);
          syncDeck.playVideo();
        } catch {
          // Deck may not have a video loaded yet; iframe activation still registers
        }
      }

      Promise.all([resolveVideoId(target), waitForDeckReady(nextKey)]).then(
        ([videoId, yt]) => {
          if (reqId !== playRequestIdRef.current) return;

          if (!videoId || !yt) {
            pauseDeckRaw(prevKey);
            setDeckGain(prevKey, 0);
            setBuffering(false);
            setIsPlaying(false);
            return;
          }

          try {
            yt.setVolume(0);
            if (deckVideoIdRef.current[nextKey] === videoId) {
              yt.seekTo(0, true);
              yt.playVideo();
            } else {
              deckVideoIdRef.current[nextKey] = videoId;
              yt.loadVideoById(videoId, 0);
              yt.playVideo();
            }

            const startedAt = performance.now();
            let lastNudgeAt = startedAt;
            let nudgeCount = 0;
            const waitPlaying = () => {
              if (reqId !== playRequestIdRef.current) return;
              let state = -1;
              try {
                state = yt.getPlayerState();
              } catch {
                return;
              }
              if (state === 1) {
                setBuffering(false);
                setIsPlaying(true);
                const ytDur = yt.getDuration();
                if (Number.isFinite(ytDur) && ytDur > 0) emitTime(0, ytDur);
                if (shouldCrossfade) {
                  runCrossfade(prevKey, nextKey, xfadeMs);
                } else {
                  pauseDeckRaw(prevKey);
                  setDeckGain(prevKey, 0);
                  rampDeck(nextKey, 0, true, START_FADE_MS);
                }
                return;
              }
              const now = performance.now();
              // If deck stalls in CUED (5) or UNSTARTED (-1), gently nudge playVideo
              if (
                (state === 5 || state === -1) &&
                nudgeCount < 4 &&
                now - lastNudgeAt > 300
              ) {
                lastNudgeAt = now;
                nudgeCount++;
                try {
                  yt.playVideo();
                } catch {
                  // Ignore transient state errors
                }
              }
              if (now - startedAt > 8000) {
                setBuffering(false);
                setIsPlaying(false);
                return;
              }
              requestAnimationFrame(waitPlaying);
            };
            requestAnimationFrame(waitPlaying);
          } catch {
            setBuffering(false);
            setIsPlaying(false);
          }
        },
      );
    },
    [
      cancelFade,
      emitTime,
      isDeckPlayingRaw,
      pauseDeckRaw,
      rampDeck,
      resolveVideoId,
      runCrossfade,
      setDeckGain,
      waitForDeckReady,
    ],
  );

  useEffect(() => {
    playTrackAtRef.current = playTrackAt;
  }, [playTrackAt]);

  // Lazy-init YouTube IFrame API once Music nears viewport
  useEffect(() => {
    if (!ytEnabled) return;
    let disposed = false;

    loadYouTubeApi().then((YT) => {
      if (disposed || !YT?.Player) return;

      const mountDeck = (which: DeckKey, host: HTMLDivElement | null) => {
        if (!host || ytPlayersRef.current[which]) return;
        ytPlayersRef.current[which] = new YT.Player(host, {
          width: 1,
          height: 1,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (disposed) return;
              ytReadyRef.current[which] = true;
              try {
                ytPlayersRef.current[which]?.setVolume(0);
              } catch {
                // Ignore
              }
            },
            onStateChange: (event) => {
              if (disposed) return;
              if (
                which === activeDeckRef.current &&
                event.data === YT.PlayerState.ENDED &&
                !autoXfadeTriggeredRef.current
              ) {
                const nextIdx = repeatRef.current
                  ? activeIndexRef.current
                  : findNextIndex(activeIndexRef.current, 1);
                playTrackAtRef.current(nextIdx, MANUAL_XFADE_MS);
              }
            },
            onError: () => {
              if (disposed) return;
              if (which === activeDeckRef.current) {
                const failedTrack = deckTrackRef.current[which];
                if (failedTrack) {
                  videoCacheRef.current.set(failedTrack.id, null);
                }
                setBuffering(false);
                setIsPlaying(false);
              }
            },
          },
        });
      };

      mountDeck("a", ytHostARef.current);
      mountDeck("b", ytHostBRef.current);
    });

    const ytPlayers = ytPlayersRef.current;
    const ytReady = ytReadyRef.current;

    return () => {
      disposed = true;
      cancelFade();
      (["a", "b"] as const).forEach((key) => {
        try {
          ytPlayers[key]?.destroy();
        } catch {
          // Ignore
        }
        ytPlayers[key] = null;
        ytReady[key] = false;
      });
    };
  }, [ytEnabled, cancelFade, findNextIndex, ytHostARef, ytHostBRef]);

  // Prefetch active + next track videoIds & pre-cue next track on idle YT deck
  useEffect(() => {
    if (!ytEnabled || !tracks.length) return;
    const active = tracks[activeIndex];
    const nextIdx = (activeIndex + 1) % tracks.length;
    const next = tracks[nextIdx];

    if (active) void resolveVideoId(active);
    if (next && next.id !== active?.id) {
      void resolveVideoId(next).then((videoId) => {
        if (!videoId) return;
        const idleKey: DeckKey = activeDeckRef.current === "a" ? "b" : "a";
        const idleYt = ytPlayersRef.current[idleKey];
        if (
          idleYt &&
          ytReadyRef.current[idleKey] &&
          !isDeckPlayingRaw(idleKey) &&
          deckVideoIdRef.current[idleKey] !== videoId
        ) {
          try {
            deckVideoIdRef.current[idleKey] = videoId;
            idleYt.cueVideoById(videoId, 0);
          } catch {
            // Ignore pre-cue failure
          }
        }
      });
    }
  }, [ytEnabled, tracks, activeIndex, resolveVideoId, isDeckPlayingRaw]);

  useEffect(() => {
    const nextGain = toAmbientGain(volume, muted);
    gainTargetRef.current = nextGain;
    if (!fadeRafRef.current) {
      setDeckGain(activeDeckRef.current, nextGain);
    }
  }, [volume, muted, setDeckGain]);

  // Poll active YT deck time (80ms) and push to subscribers without re-rendering Music.tsx
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const which = activeDeckRef.current;
      const yt = ytPlayersRef.current[which];
      if (!yt || !ytReadyRef.current[which]) return;

      let t = 0;
      let dur = 0;
      try {
        t = yt.getCurrentTime() || 0;
        dur = yt.getDuration() || 0;
      } catch {
        return;
      }

      emitTime(t, dur);

      const effectiveDur = dur > 0 ? dur : durationRef.current;
      if (
        Number.isFinite(effectiveDur) &&
        effectiveDur > AUTO_XFADE_LEAD_SEC + 1 &&
        !autoXfadeTriggeredRef.current &&
        effectiveDur - t <= AUTO_XFADE_LEAD_SEC
      ) {
        autoXfadeTriggeredRef.current = true;
        const nextIdx = repeatRef.current
          ? activeIndexRef.current
          : findNextIndex(activeIndexRef.current, 1);
        playTrackAtRef.current(nextIdx, AUTO_XFADE_MS);
      }
    }, 80);

    return () => window.clearInterval(id);
  }, [isPlaying, emitTime, findNextIndex]);

  const togglePlay = useCallback(() => {
    const list = tracksRef.current;
    if (!list.length) return;

    const which = activeDeckRef.current;
    const other: DeckKey = which === "a" ? "b" : "a";

    if (isPlaying || buffering) {
      playRequestIdRef.current++;
      pauseDeckRaw(other);
      setDeckGain(other, 0);
      setBuffering(false);
      setIsPlaying(false);
      rampDeck(which, getDeckGain(which), false, PAUSE_FADE_MS, () => {
        pauseDeckRaw(which);
      });
      return;
    }

    const activeTrack = list[activeIndexRef.current];
    if (!activeTrack) return;

    if (deckTrackRef.current[which]?.id === activeTrack.id) {
      const yt = ytPlayersRef.current[which];
      if (yt && ytReadyRef.current[which]) {
        try {
          yt.setVolume(0);
          yt.playVideo();
          setIsPlaying(true);
          rampDeck(which, 0, true, START_FADE_MS);
          return;
        } catch {
          // Fall through to full playTrackAt
        }
      }
    }

    playTrackAt(activeIndexRef.current, START_FADE_MS);
  }, [
    buffering,
    getDeckGain,
    isPlaying,
    pauseDeckRaw,
    playTrackAt,
    rampDeck,
    setDeckGain,
  ]);

  const seekTo = useCallback(
    (seconds: number) => {
      const dur = durationRef.current || duration;
      const clamped = Math.max(0, Math.min(dur || 0, seconds));
      const which = activeDeckRef.current;
      autoXfadeTriggeredRef.current = false;
      emitTime(clamped, dur);

      const yt = ytPlayersRef.current[which];
      if (yt && ytReadyRef.current[which]) {
        try {
          yt.seekTo(clamped, true);
        } catch {
          // Ignore
        }
      }
    },
    [duration, emitTime],
  );

  const prefetchTrack = useCallback(
    (track: SpotifyTrack) => {
      void resolveVideoId(track);
    },
    [resolveVideoId],
  );

  return useMemo(
    () => ({
      activeIndex,
      isPlaying,
      buffering,
      shuffle,
      repeat,
      volume,
      muted,
      duration,
      setShuffle,
      setRepeat,
      setVolume,
      setMuted,
      togglePlay,
      playTrackAt,
      prefetchTrack,
      seekTo,
      findNextIndex,
      subscribeTime,
    }),
    [
      activeIndex,
      buffering,
      duration,
      findNextIndex,
      isPlaying,
      muted,
      playTrackAt,
      prefetchTrack,
      repeat,
      seekTo,
      shuffle,
      subscribeTime,
      togglePlay,
      volume,
    ],
  );
}
