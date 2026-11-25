"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import {
  TECH_CATEGORIES,
  TECH_STACK,
  type TechCategory,
  type TechItem,
} from "@/constants/techStack";
import { TechLogo } from "@/components/sections/skills/TechIcons";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollHeading, ScrollReveal } from "@/components/ui/ScrollReveal";

const TAB_SPRING = { type: "spring" as const, duration: 0.24, bounce: 0 };
const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TECH_BY_ID = new Map<string, TechItem>(
  TECH_STACK.map((item) => [item.id, item]),
);

interface TechGridProps {
  category: TechCategory;
  pinnedId: string | null;
  autoId: string | null;
  connectedSet: ReadonlySet<string> | null;
  revealed: boolean;
  onInspect: (id: string | null) => void;
  onTogglePin: (id: string) => void;
}

// Memoized so aggressive hovering causes 0 grid re-renders; all tile hover/press runs in pure GPU CSS
const TechGrid = memo(function TechGrid({
  category,
  pinnedId,
  autoId,
  connectedSet,
  revealed,
  onInspect,
  onTogglePin,
}: TechGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      onMouseLeave={() => onInspect(null)}
      className="grid grid-cols-3 gap-px border-b border-border bg-border sm:grid-cols-6 lg:grid-cols-9"
    >
      {TECH_STACK.map((item, idx) => {
        const waveDelay = 0.16 + ((idx % 9) + Math.floor(idx / 9)) * 0.048;
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
              className={`tech-tile-body relative z-10 flex h-full w-full flex-col items-center justify-center ${
                isDimmed ? "opacity-15" : "opacity-100"
              }`}
            >
              <motion.span
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 12, scale: 0.86, filter: "blur(4px)" }
                }
                animate={
                  revealed || shouldReduceMotion
                    ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, y: 12, scale: 0.86, filter: "blur(4px)" }
                }
                transition={{
                  duration: 0.62,
                  delay: waveDelay,
                  ease: REVEAL_EASE,
                }}
                className="flex h-full w-full flex-col items-center justify-center"
              >
              <span className="tech-tile-icon flex h-8 w-8 items-center justify-center">
                <TechLogo id={item.id} name={item.name} />
              </span>

              {/* Letter-by-letter vertical slot-reveal on hover/pin/auto — matches EditorialText */}
              <span className="pointer-events-none absolute inset-x-1.5 bottom-3 flex justify-center overflow-hidden font-mono text-[11px] leading-[1.3] text-text">
                <span className="sr-only">{item.name}</span>
                <span aria-hidden="true" className="inline-flex">
                  {Array.from(item.name).map((char, idx) => (
                    <span
                      key={`${idx}-${char}`}
                      style={{
                        transitionDelay: `${idx * (item.name.length > 10 ? 14 : 22)}ms`,
                      }}
                      className="inline-block translate-y-[125%] opacity-0 transition-[transform,opacity] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-data-[auto=true]:translate-y-0 group-data-[auto=true]:opacity-100 group-data-[pinned=true]:translate-y-0 group-data-[pinned=true]:opacity-100 motion-reduce:transition-none"
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>
              </span>
              </motion.span>
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
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.35 });
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
      <div className="section-shell">
        {/* Header + tactile segmented category pills matching navbar Search ⌘K */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-2.5 sm:px-10">
          <ScrollHeading>
            <h2 className="section-title">Stack</h2>
          </ScrollHeading>

          <ScrollReveal y={8} delay={0.08}>
          <div
            role="tablist"
            aria-label="Filter tech stack by category"
            className="tactile-dock flex-wrap gap-0.5"
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
                  className={`pressable relative flex cursor-pointer items-center rounded-lg px-3 py-1.5 font-sans text-xs font-medium transition-colors duration-150 ${
                    isSelected
                      ? "text-text"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="stack-filter-pill"
                      transition={
                        shouldReduceMotion ? { duration: 0.12 } : TAB_SPRING
                      }
                      className="pointer-events-none absolute inset-0 rounded-lg bg-bg shadow-[inset_0_1px_2px_rgba(0,0,0,0.14)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
          </ScrollReveal>
        </div>

        <div ref={gridRef}>
          <TechGrid
            category={category}
            pinnedId={pinnedId}
            autoId={activeAutoId}
            connectedSet={connectedSet}
            revealed={gridInView}
            onInspect={handleInspect}
            onTogglePin={handleTogglePin}
          />
        </div>

        {/* Fixed-height Inspector Bar (instant zero-overhead swap for aggressive scrubbing) */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={
            gridInView || shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 8 }
          }
          transition={{ duration: 0.56, delay: 0.55, ease: REVEAL_EASE }}
          className="flex min-h-[60px] items-center justify-between gap-4 px-6 py-3 sm:px-10"
        >
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
        </motion.div>
      </div>

      <SectionDivider />
    </section>
  );
}
