"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import {
  TECH_CATEGORIES,
  TECH_STACK,
  type TechCategory,
  type TechItem,
} from "@/constants/techStack";
import { TechLogo } from "@/components/sections/skills/TechIcons";
import { SectionDivider } from "@/components/ui/SectionDivider";

const TAB_SPRING = { type: "spring" as const, duration: 0.24, bounce: 0 };
const TECH_BY_ID = new Map<string, TechItem>(
  TECH_STACK.map((item) => [item.id, item]),
);

interface TechGridProps {
  category: TechCategory;
  pinnedId: string | null;
  autoId: string | null;
  connectedSet: ReadonlySet<string> | null;
  onInspect: (id: string | null) => void;
  onTogglePin: (id: string) => void;
}

// Memoized so aggressive hovering causes 0 grid re-renders; all tile hover/press runs in pure GPU CSS
const TechGrid = memo(function TechGrid({
  category,
  pinnedId,
  autoId,
  connectedSet,
  onInspect,
  onTogglePin,
}: TechGridProps) {
  return (
    <div
      onMouseLeave={() => onInspect(null)}
      className="grid grid-cols-3 gap-px border-b border-border bg-border sm:grid-cols-6 lg:grid-cols-9"
    >
      {TECH_STACK.map((item) => {
        const isPinned = pinnedId === item.id;
        const isAuto = !pinnedId && autoId === item.id;
        const isConnected = connectedSet ? connectedSet.has(item.id) : false;
        const matchesCategory =
          category === "all"
            ? true
            : category === "learning"
              ? Boolean(item.learning)
              : item.category === category;

        const isFilteredOut = !matchesCategory;
        const isMatchedFilter = category !== "all" && matchesCategory && !pinnedId;
        const isDimmed = pinnedId
          ? !isPinned && !isConnected
          : isFilteredOut;

        return (
          <button
            key={item.id}
            type="button"
            disabled={isFilteredOut}
            tabIndex={isFilteredOut ? -1 : 0}
            data-pinned={isPinned ? "true" : undefined}
            data-auto={isAuto ? "true" : undefined}
            data-connected={isConnected ? "true" : undefined}
            data-matched={isMatchedFilter ? "true" : undefined}
            aria-pressed={isPinned}
            onMouseEnter={() => {
              if (!isFilteredOut) onInspect(item.id);
            }}
            onFocus={() => {
              if (!isFilteredOut) onInspect(item.id);
            }}
            onBlur={() => onInspect(null)}
            onClick={() => {
              if (!isFilteredOut) onTogglePin(item.id);
            }}
            className={`tech-tile group relative flex aspect-square flex-col items-center justify-center bg-bg px-2 text-center focus:outline-none focus-visible:z-10 ${isFilteredOut
              ? "pointer-events-none cursor-default"
              : "cursor-pointer"
              }`}
          >
            {/* Recessed hover/pinned card — smooth 1:1 notched SVG for learning tiles */}
            {item.learning ? (
              <svg
                viewBox="0 0 100 100"
                aria-hidden="true"
                className="tech-tile-bg pointer-events-none absolute inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] overflow-visible"
              >
                <path
                  d="M8 0H44Q50 0 50 6V10Q50 16 56 16H94Q100 16 100 22V92Q100 100 92 100H8Q0 100 0 92V8Q0 0 8 0Z"
                  fill="var(--surface)"
                  stroke={isPinned ? "var(--border-strong)" : "none"}
                  strokeWidth={isPinned ? 1 : 0}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            ) : (
              <span
                aria-hidden="true"
                className={`tech-tile-bg pointer-events-none absolute inset-1.5 rounded-lg ${isPinned
                  ? "border border-border-strong bg-surface"
                  : "bg-surface"
                  }`}
              />
            )}

            {item.learning && (
              <span
                className={`pointer-events-none absolute right-2 top-1.5 z-20 font-mono text-[10px] font-medium leading-none tracking-tight transition-[opacity,color] duration-150 ${isDimmed
                  ? "opacity-25 text-text-secondary"
                  : isPinned || isAuto
                    ? "text-text opacity-100"
                    : "text-text-secondary opacity-100 group-hover:text-text"
                  }`}
              >
                learning
              </span>
            )}

            <span
              className={`tech-tile-body relative z-10 flex flex-col items-center gap-2.5 ${isDimmed ? "opacity-15" : "opacity-100"
                }`}
            >
              <span className="tech-tile-icon flex h-8 w-8 items-center justify-center">
                <TechLogo id={item.id} name={item.name} />
              </span>

              <span
                className={`font-mono text-[11px] leading-none transition-colors duration-150 ${isPinned || isAuto
                    ? "text-text"
                    : isConnected || isMatchedFilter
                      ? "text-text-secondary group-hover:text-text"
                      : "text-text-muted group-hover:text-text"
                  }`}
              >
                {item.name}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
});

export function TechStack() {
  const [category, setCategory] = useState<TechCategory>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [autoId, setAutoId] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const visibleIds = useMemo(
    () =>
      TECH_STACK.filter((item) =>
        category === "all"
          ? true
          : category === "learning"
            ? Boolean(item.learning)
            : item.category === category,
      ).map((item) => item.id),
    [category],
  );

  const activeAutoId = hoveredId || pinnedId ? null : autoId;
  const pinnedItem = pinnedId ? (TECH_BY_ID.get(pinnedId) ?? null) : null;
  const inspectedItem = hoveredId
    ? (TECH_BY_ID.get(hoveredId) ?? pinnedItem)
    : pinnedItem ?? (activeAutoId ? (TECH_BY_ID.get(activeAutoId) ?? null) : null);

  const connectedSet = useMemo(
    () => (pinnedItem ? new Set(pinnedItem.connected) : null),
    [pinnedItem],
  );

  const handleInspect = useCallback((id: string | null) => {
    setHoveredId(id);
    if (id !== null) setAutoId(null);
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setAutoId(null);
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Calm, low-frequency idle highlight — starts only after sitting idle in view for 5.5s
  useEffect(() => {
    if (
      shouldReduceMotion ||
      !isInView ||
      hoveredId ||
      pinnedId ||
      visibleIds.length === 0
    ) {
      return;
    }

    const pickNext = () => {
      if (document.hidden) return;
      setAutoId((prev) => {
        if (visibleIds.length === 1) return visibleIds[0];
        let next = visibleIds[Math.floor(Math.random() * visibleIds.length)];
        while (next === prev) {
          next = visibleIds[Math.floor(Math.random() * visibleIds.length)];
        }
        return next;
      });
    };

    let intervalId: number | null = null;
    const startTimer = window.setTimeout(() => {
      pickNext();
      intervalId = window.setInterval(pickNext, 5500);
    }, 5500);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [shouldReduceMotion, isInView, hoveredId, pinnedId, visibleIds]);

  useEffect(() => {
    if (!pinnedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinnedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pinnedId]);

  return (
    <section ref={sectionRef} id="skills" className="w-full scroll-mt-16">
      <div className="mx-auto max-w-5xl border-x border-border">
        {/* Header + rail-integrated hairline category tabs */}
        <div className="flex flex-wrap items-stretch justify-between border-b border-border">
          <div className="flex items-center px-6 py-2.5 sm:px-10">
            <h2 className="font-brand text-3xl font-normal leading-none tracking-normal text-text">
              Tech Stack
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter tech stack by category"
            className="flex flex-wrap items-stretch divide-x divide-border border-t border-border sm:border-l sm:border-t-0"
          >
            {TECH_CATEGORIES.map((tab) => {
              const isSelected = category === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCategory(tab.id);
                    setHoveredId(null);
                    setPinnedId(null);
                    setAutoId(null);
                  }}
                  className={`pressable relative flex cursor-pointer items-center px-3.5 py-2.5 font-mono text-xs transition-colors duration-150 ${isSelected
                      ? "bg-surface text-text"
                      : "text-text-muted hover:bg-surface/50 hover:text-text-secondary"
                    }`}
                >
                  <span>{tab.label}</span>
                  {isSelected && (
                    <motion.span
                      layoutId="stack-filter-pill"
                      transition={
                        shouldReduceMotion ? { duration: 0.12 } : TAB_SPRING
                      }
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] bg-text"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <TechGrid
          category={category}
          pinnedId={pinnedId}
          autoId={activeAutoId}
          connectedSet={connectedSet}
          onInspect={handleInspect}
          onTogglePin={handleTogglePin}
        />

        {/* Fixed-height Inspector Bar (instant zero-overhead swap for aggressive scrubbing) */}
        <div className="flex min-h-[60px] items-center justify-between gap-4 px-6 py-3 sm:px-10">
          {inspectedItem ? (
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <TechLogo
                    id={inspectedItem.id}
                    name={inspectedItem.name}
                    size="sm"
                  />
                </span>
                <p className="min-w-0 truncate font-mono text-xs text-text-secondary">
                  <span className="font-medium text-text">
                    {inspectedItem.name}
                  </span>{" "}
                  <span className="text-text-muted">·</span>{" "}
                  {inspectedItem.usage}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {inspectedItem.learning && (
                  <span className="hidden rounded-md border border-border-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary md:inline">
                    Learning
                  </span>
                )}
                <span className="hidden font-mono text-[10px] uppercase tracking-wider text-text-muted sm:inline">
                  Used in
                </span>
                <div className="flex items-center gap-1.5">
                  {inspectedItem.projects.map((project) => (
                    <span
                      key={project}
                      className="whitespace-nowrap rounded-md bg-surface-hover px-2 py-0.5 font-mono text-[11px] text-text-secondary"
                    >
                      {project}
                    </span>
                  ))}
                </div>
                {pinnedItem && (
                  <button
                    type="button"
                    onClick={() => setPinnedId(null)}
                    aria-label="Clear stack trace"
                    className="pressable ml-1 inline-flex cursor-pointer items-center gap-1 rounded-md bg-surface-hover px-2 py-0.5 font-mono text-[11px] text-text-muted hover:text-text"
                  >
                    <span>Clear</span>
                    <X className="h-3 w-3" strokeWidth={1.75} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between gap-4 font-mono text-xs text-text-muted">
              <span>
                Hover a tool to see how I use it. Click one to see what it
                pairs with.
              </span>
            </div>
          )}
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
