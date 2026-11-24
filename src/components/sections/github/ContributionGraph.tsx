"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { PROFILE } from "@/constants/profile";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  contributions: ContributionDay[];
  total: number;
}

type CellStyle = CSSProperties & {
  "--cell-fill"?: string;
  "--cell-glow"?: string;
  "--on-delay"?: string;
  "--glow-delay"?: string;
};

type WeekStyle = CSSProperties & {
  "--week-delay": string;
};

type MetaStyle = CSSProperties & {
  "--meta-delay": string;
};

const LEVELS = [0, 1, 2, 3, 4] as const;

const LEVEL_COLOR: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "var(--gh-0)",
  1: "var(--gh-1)",
  2: "var(--gh-2)",
  3: "var(--gh-3)",
  4: "var(--gh-4)",
};

const LEVEL_GLOW: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "rgba(240, 240, 242, 0.16)",
  1: "rgba(14, 68, 41, 0.65)",
  2: "rgba(0, 109, 50, 0.65)",
  3: "rgba(38, 166, 65, 0.6)",
  4: "rgba(57, 211, 83, 0.7)",
};

const NEIGHBOR_OFFSETS: readonly [number, number, "0" | "1" | "2"][] = [
  [0, 0, "0"],
  [-1, 0, "1"],
  [1, 0, "1"],
  [0, -1, "1"],
  [0, 1, "1"],
  [-1, -1, "2"],
  [-1, 1, "2"],
  [1, -1, "2"],
  [1, 1, "2"],
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
}

function buildWeeks(days: ContributionDay[]): {
  weeks: (ContributionDay | null)[][];
  monthLabels: { weekIndex: number; label: string }[];
} {
  if (days.length === 0) return { weeks: [], monthLabels: [] };

  const weeks: (ContributionDay | null)[][] = [];
  const firstDayOfWeek = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();

  let currentWeek: (ContributionDay | null)[] = Array.from(
    { length: firstDayOfWeek },
    () => null,
  );

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    const firstValid = week.find((cell): cell is ContributionDay => cell !== null);
    if (!firstValid) return;
    const month = Number(firstValid.date.slice(5, 7)) - 1;
    if (month !== lastMonth) {
      const prev = monthLabels[monthLabels.length - 1];
      if (prev && weekIndex - prev.weekIndex < 3) {
        monthLabels[monthLabels.length - 1] = {
          weekIndex,
          label: MONTH_NAMES[month],
        };
      } else {
        monthLabels.push({ weekIndex, label: MONTH_NAMES[month] });
      }
      lastMonth = month;
    }
  });

  return { weeks, monthLabels };
}

export function ContributionGraph({
  contributions,
  total,
}: ContributionGraphProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLSpanElement>(null);
  const swatchRef = useRef<HTMLSpanElement>(null);
  const countNumRef = useRef<HTMLSpanElement>(null);
  const countLabelRef = useRef<HTMLSpanElement>(null);
  const monthRef = useRef<HTMLSpanElement>(null);
  const dayNumRef = useRef<HTMLSpanElement>(null);
  const yearNumRef = useRef<HTMLSpanElement>(null);
  const visibleRef = useRef(false);
  const cellIndexRef = useRef<Map<string, HTMLElement>>(new Map());
  const litCellsRef = useRef<HTMLElement[]>([]);
  const pendingCellRef = useRef<HTMLElement | null>(null);
  const hoverRafRef = useRef<number>(0);
  const tipSizeRef = useRef<{ width: number; height: number }>({
    width: 240,
    height: 38,
  });

  const { weeks, monthLabels, activeIndexByDate, totalActive } = useMemo(() => {
    const built = buildWeeks(contributions);
    const map = new Map<string, number>();
    let idx = 0;
    for (const day of contributions) {
      if (day.level > 0) {
        map.set(day.date, idx++);
      }
    }
    return { ...built, activeIndexByDate: map, totalActive: Math.max(idx, 1) };
  }, [contributions]);

  const weekCount = weeks.length;

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    // Build O(1) coordinate lookup once for zero-lag proximity ripple
    const lookup = new Map<string, HTMLElement>();
    grid.querySelectorAll<HTMLElement>("[data-coord]").forEach((el) => {
      if (el.dataset.coord) lookup.set(el.dataset.coord, el);
    });
    cellIndexRef.current = lookup;

    const observer = new IntersectionObserver(
      (entries) => {
        const isInView = entries.some((entry) => entry.isIntersecting);
        section.dataset.visible = isInView ? "true" : "false";
        if (isInView && section.dataset.in !== "true") {
          section.dataset.in = "true";
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);
    };
  }, [contributions]);

  const clearRipple = () => {
    for (const el of litCellsRef.current) {
      delete el.dataset.near;
    }
    litCellsRef.current = [];
  };

  const applyRipple = (cell: HTMLElement) => {
    clearRipple();
    const coord = cell.dataset.coord;
    if (!coord) return;
    const [w, d] = coord.split(",").map(Number);
    const nextLit: HTMLElement[] = [];

    for (const [dw, dd, tier] of NEIGHBOR_OFFSETS) {
      const target = cellIndexRef.current.get(`${w + dw},${d + dd}`);
      if (target) {
        target.dataset.near = tier;
        nextLit.push(target);
      }
    }
    litCellsRef.current = nextLit;
  };

  const showTooltipForCell = (cell: HTMLElement) => {
    const wrap = wrapRef.current;
    const tip = tooltipRef.current;
    if (!wrap || !tip) return;

    const rawCount = cell.dataset.rawCount;
    const month = cell.dataset.month;
    const dayNum = cell.dataset.day;
    const yearNum = cell.dataset.year;
    const level = Number(cell.dataset.level ?? 0) as 0 | 1 | 2 | 3 | 4;
    if (!rawCount || !month || !dayNum || !yearNum) return;

    // Read layout geometry BEFORE mutating DOM to avoid forced synchronous reflow
    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const prevTipW = tip.offsetWidth || tipSizeRef.current.width;
    const prevTipH = tip.offsetHeight || tipSizeRef.current.height;
    tipSizeRef.current = { width: prevTipW, height: prevTipH };

    applyRipple(cell);

    const numVal = Number(rawCount);
    const countDisplay = numVal === 0 ? "No" : String(numVal);
    const countSuffix = numVal === 1 ? "contribution" : "contributions";

    if (countNumRef.current) countNumRef.current.textContent = countDisplay;
    if (countLabelRef.current) countLabelRef.current.textContent = countSuffix;
    if (monthRef.current) monthRef.current.textContent = `on ${month}`;
    if (dayNumRef.current) dayNumRef.current.textContent = dayNum;
    if (yearNumRef.current) yearNumRef.current.textContent = yearNum;
    if (swatchRef.current) {
      swatchRef.current.style.backgroundColor = LEVEL_COLOR[level];
    }

    const cellCenterX = cellRect.left - wrapRect.left + cellRect.width / 2;
    const rawX = cellCenterX - prevTipW / 2;
    const clampedX = Math.max(0, Math.min(wrapRect.width - prevTipW, rawX));
    const y = cellRect.top - wrapRect.top - prevTipH - 13;

    if (notchRef.current) {
      const notchX = Math.max(
        16,
        Math.min(prevTipW - 16, cellCenterX - clampedX),
      );
      notchRef.current.style.transform = `translate3d(${notchX}px, 0, 0) translateX(-50%) rotate(45deg)`;
    }

    if (!visibleRef.current) {
      tip.dataset.snap = "true";
      tip.style.transform = `translate3d(${clampedX}px, ${y}px, 0) scale(1)`;
      tip.style.opacity = "1";
      visibleRef.current = true;
      requestAnimationFrame(() => {
        if (tooltipRef.current) tooltipRef.current.dataset.snap = "false";
      });
    } else {
      tip.style.transform = `translate3d(${clampedX}px, ${y}px, 0) scale(1)`;
    }
  };

  const hideTooltip = () => {
    if (hoverRafRef.current) {
      cancelAnimationFrame(hoverRafRef.current);
      hoverRafRef.current = 0;
    }
    pendingCellRef.current = null;
    clearRipple();
    const tip = tooltipRef.current;
    if (!tip) return;
    tip.style.opacity = "0";
    visibleRef.current = false;
  };

  const scheduleCellHover = (cell: HTMLElement) => {
    pendingCellRef.current = cell;
    if (hoverRafRef.current) return;
    hoverRafRef.current = requestAnimationFrame(() => {
      hoverRafRef.current = 0;
      const target = pendingCellRef.current;
      if (target) showTooltipForCell(target);
    });
  };

  const handleGridPointerOver = (e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    if (cell) scheduleCellHover(cell);
  };

  const handleGridFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-date]");
    if (cell) scheduleCellHover(cell);
  };

  const setHighlightLevel = (level: number | null) => {
    const grid = gridRef.current;
    if (!grid) return;
    if (level === null) {
      delete grid.dataset.hl;
    } else {
      grid.dataset.hl = String(level);
    }
  };

  return (
    <div ref={sectionRef} className="gh-section px-6 py-10 sm:px-7 sm:py-12">
      <div ref={wrapRef} className="relative">
        {/* Gliding borderless pill with odometer number roll + cell-tracking notch */}
        <div
          ref={tooltipRef}
          role="tooltip"
          aria-hidden="true"
          style={{ opacity: 0, transform: "translate3d(0px, 0px, 0)" }}
          className="gh-tooltip pointer-events-none absolute left-0 top-0 z-30 flex items-center gap-2.5 whitespace-nowrap rounded-xl bg-surface-hover px-4 py-2.5 font-mono text-[13px] text-text"
        >
          <span
            ref={swatchRef}
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-[2px] transition-colors duration-150"
          />
          <span className="inline-flex items-baseline gap-x-[0.42em] leading-none">
            <span className="inline-flex overflow-hidden font-medium tabular-nums text-text">
              <span ref={countNumRef} className="inline-block" />
            </span>
            <span ref={countLabelRef} className="font-medium text-text" />
            <span ref={monthRef} className="text-text-secondary" />
            <span className="inline-flex items-baseline text-text-secondary">
              <span className="inline-flex overflow-hidden tabular-nums">
                <span ref={dayNumRef} className="inline-block" />
              </span>
              <span>,</span>
            </span>
            <span className="inline-flex overflow-hidden tabular-nums text-text-secondary">
              <span ref={yearNumRef} className="inline-block" />
            </span>
          </span>
          <span
            ref={notchRef}
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-2.5 w-2.5 rounded-[2px] bg-surface-hover"
          />
        </div>

        <div className="no-scrollbar overflow-x-auto pb-1">
          <div className="mx-auto w-fit">
            {/* Fixed integer 15px tracks + 3px gaps fill the rail cleanly with zero sub-pixel jitter */}
            <div
              className="gh-meta relative mb-2.5 grid h-4 gap-[3px] font-mono text-xs text-text-muted"
              style={
                {
                  gridTemplateColumns: `repeat(${weekCount}, 15px)`,
                  "--meta-delay": "80ms",
                } as MetaStyle
              }
            >
              {monthLabels.map(({ weekIndex, label }) => (
                <span
                  key={`${label}-${weekIndex}`}
                  style={{ gridColumnStart: weekIndex + 1 }}
                  className="whitespace-nowrap leading-none"
                >
                  {label}
                </span>
              ))}
            </div>

            <div
              ref={gridRef}
              role="grid"
              aria-label="GitHub contributions over the last year"
              onMouseOver={handleGridPointerOver}
              onMouseLeave={hideTooltip}
              onFocus={handleGridFocus}
              onBlur={hideTooltip}
              className="gh-grid grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, 15px)`,
              }}
            >
              {weeks.map((week, weekIndex) => {
                // Smooth ease-out curve across the 53 columns for organic matrix sweep
                const t = weekCount > 1 ? weekIndex / (weekCount - 1) : 0;
                const easedWeekDelay = Math.round((1 - Math.pow(1 - t, 1.55)) * 620);

                return (
                  <div
                    key={weekIndex}
                    style={{ "--week-delay": `${easedWeekDelay}ms` } as WeekStyle}
                    className="gh-week grid grid-rows-7 gap-[3px]"
                  >
                    {week.map((day, dayIndex) => {
                      if (!day) {
                        return (
                          <span
                            key={`empty-${weekIndex}-${dayIndex}`}
                            aria-hidden="true"
                            className="h-[15px] w-[15px]"
                          />
                        );
                      }

                      const [yearStr, monthStr, dayStr] = day.date.split("-");
                      const monthLabel =
                        MONTH_NAMES[Number(monthStr) - 1] ?? monthStr;
                      const dayNumStr = String(Number(dayStr));
                      const countText =
                        day.count === 0
                          ? "No contributions"
                          : `${day.count} ${day.count === 1 ? "contribution" : "contributions"}`;
                      const formattedDate = formatDate(day.date);
                      const activeIdx = activeIndexByDate.get(day.date);
                      const isGreen = activeIdx !== undefined;
                      const p = isGreen ? activeIdx / totalActive : 0;
                      const igniteDelay = 720 + Math.round(p * 1250);
                      const cellStyle: CellStyle = isGreen
                        ? {
                          "--cell-fill": LEVEL_COLOR[day.level],
                          "--cell-glow": LEVEL_GLOW[day.level],
                          "--on-delay": `${igniteDelay}ms`,
                          "--glow-delay": `${2450 + (activeIdx % 14) * 157}ms`,
                        }
                        : {
                          "--cell-glow": LEVEL_GLOW[0],
                        };

                      return (
                        <button
                          key={day.date}
                          type="button"
                          data-coord={`${weekIndex},${dayIndex}`}
                          data-date={formattedDate}
                          data-raw-count={String(day.count)}
                          data-month={monthLabel}
                          data-day={dayNumStr}
                          data-year={yearStr}
                          data-level={day.level}
                          data-active={isGreen ? "true" : undefined}
                          aria-label={`${countText} on ${formattedDate}`}
                          style={cellStyle}
                          className="gh-cell block h-[15px] w-[15px] cursor-pointer rounded-[3px] focus:outline-none focus-visible:ring-1 focus-visible:ring-text/70"
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer summary + interactive intensity legend */}
      <div
        style={{ "--meta-delay": "420ms" } as MetaStyle}
        className="gh-meta mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[13px] text-text-secondary"
      >
        <p>
          <span className="tabular-nums text-text">
            {total.toLocaleString()}
          </span>{" "}
          contributions in the last year on{" "}
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text underline decoration-border-strong underline-offset-4 transition-colors duration-150 hover:decoration-text"
          >
            GitHub
          </a>
          .
        </p>

        <div
          className="flex items-center gap-1.5 text-xs text-text-muted"
          onMouseLeave={() => setHighlightLevel(null)}
        >
          <span>Less</span>
          <div className="flex items-center gap-[3px]">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onMouseEnter={() => setHighlightLevel(level)}
                onFocus={() => setHighlightLevel(level)}
                onBlur={() => setHighlightLevel(null)}
                aria-label={`Highlight contribution level ${level}`}
                style={{ backgroundColor: LEVEL_COLOR[level] }}
                className="gh-cell h-[15px] w-[15px] cursor-pointer rounded-[3px] transition-transform duration-150 hover:scale-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-text/70"
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
