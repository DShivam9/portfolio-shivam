"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  CornerDownLeft,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { PROFILE } from "@/constants/profile";
import { SearchIcon, type SearchIconHandle } from "@/components/icons/search-icon";
import { SunIcon, type SunIconHandle } from "@/components/icons/sun-icon";
import { MoonIcon, type MoonIconHandle } from "@/components/icons/moon-icon";
import { editorialNavigate } from "@/utils/editorialNavigate";

type CommandGroup = "Navigate" | "Links" | "Theme";

interface CommandItem {
  id: string;
  label: string;
  group: CommandGroup;
  href?: string;
  external?: boolean;
  action?: "toggle-theme" | "copy-discord";
}

const STATIC_COMMANDS: CommandItem[] = [
  { id: "top", label: "Go to Top", href: "#top", group: "Navigate" },
  { id: "about", label: "About", href: "#about", group: "Navigate" },
  { id: "projects", label: "Projects", href: "#projects", group: "Navigate" },
  { id: "skills", label: "Skills", href: "#skills", group: "Navigate" },
  { id: "contact", label: "Contact", href: "#contact", group: "Navigate" },
  {
    id: "resume",
    label: "Resume",
    href: PROFILE.resumePath,
    group: "Links",
    external: true,
  },
  {
    id: "github",
    label: "GitHub · @DShivam9",
    href: PROFILE.socials.github,
    group: "Links",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn · Shivam Diwan",
    href: PROFILE.socials.linkedin,
    group: "Links",
    external: true,
  },
  {
    id: "discord",
    label: `Copy Discord · @${PROFILE.socials.discord}`,
    group: "Links",
    action: "copy-discord",
  },
];

const GROUP_ORDER: CommandGroup[] = ["Navigate", "Links", "Theme"];
const GLIDE_SPRING = { type: "spring" as const, duration: 0.22, bounce: 0 };
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SCROLL_SPRING = { stiffness: 90, damping: 24, mass: 0.9 };

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener("theme-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("theme-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getThemeSnapshot(): "dark" | "light" {
  const saved = window.localStorage.getItem("theme");
  return saved === "light" ? "light" : "dark";
}

const getThemeServerSnapshot = (): "dark" | "light" => "dark";

export function Navbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [centerOffset, setCenterOffset] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLAnchorElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const rawMorph = useTransform(scrollY, [70, 260], [0, 1]);
  const smoothMorph = useSpring(rawMorph, SCROLL_SPRING);
  const leftX = useTransform(smoothMorph, [0, 1], [0, centerOffset]);
  const rightX = useTransform(smoothMorph, [0, 1], [0, -centerOffset]);
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const sunRef = useRef<SunIconHandle>(null);
  const moonRef = useRef<MoonIconHandle>(null);
  const searchRef = useRef<SearchIconHandle>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem("theme", next);
      window.dispatchEvent(new Event("theme-change"));
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (shouldReduceMotion || !doc.startViewTransition) {
      apply();
      return;
    }

    const transition = doc.startViewTransition(() => {
      apply();
    });

    // Skiper26 rectangle (bottom-up) variant: crisp expo-out polygon wipe, old root frozen
    transition.ready
      .then(() => {
        document.documentElement.animate(
          [
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          ],
          {
            duration: 700,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => {
        // Fallback already applied if view transition is skipped
      });
  };

  const openPalette = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    setPaletteOpen(true);
  }, []);

  const allCommands: CommandItem[] = [
    ...STATIC_COMMANDS,
    {
      id: "theme-toggle",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      group: "Theme",
      action: "toggle-theme",
    },
  ];

  const filtered = allCommands.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: filtered.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);

  const flatFiltered = grouped.flatMap((section) => section.items);
  const indexById = new Map(flatFiltered.map((item, idx) => [item.id, idx]));

  const runCommand = (item: CommandItem) => {
    setPaletteOpen(false);
    if (item.action === "toggle-theme") {
      toggleTheme();
      return;
    }
    if (item.action === "copy-discord") {
      navigator.clipboard?.writeText(PROFILE.socials.discord).catch(() => { });
      return;
    }
    if (!item.href) return;
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      editorialNavigate(item.href, shouldReduceMotion);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Measure inner rail width once + on resize so brand and controls glide purely on GPU translateX
  useEffect(() => {
    const measure = () => {
      const bar = barRef.current;
      const left = leftRef.current;
      const right = rightRef.current;
      if (!bar || !left || !right) return;
      const style = getComputedStyle(bar);
      const innerW =
        bar.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const gap = 28;
      setCenterOffset(
        Math.max(0, (innerW - (left.offsetWidth + gap + right.offsetWidth)) / 2),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (barRef.current) ro.observe(barRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!paletteOpen) return;
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 20);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [paletteOpen]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatFiltered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatFiltered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + flatFiltered.length) % flatFiltered.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatFiltered[selectedIndex] ?? flatFiltered[0];
      if (target) runCommand(target);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/90 backdrop-blur-md">
        <div
          ref={barRef}
          className="relative mx-auto flex h-16 max-w-5xl items-center justify-between border-x border-border px-6"
        >
          <motion.a
            ref={leftRef}
            style={shouldReduceMotion ? undefined : { x: leftX }}
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              editorialNavigate("#top", shouldReduceMotion);
            }}
            aria-label={PROFILE.name}
            className="pressable relative z-10 inline-flex shrink-0 items-center opacity-90 transition-opacity duration-150 hover:opacity-100 will-change-transform"
          >
            <Image
              src="/logos/brand-sd.svg"
              alt={PROFILE.name}
              width={44}
              height={22}
              priority
              className="github-app-icon h-[22px] w-auto object-contain"
            />
          </motion.a>

          <motion.div
            ref={rightRef}
            style={shouldReduceMotion ? undefined : { x: rightX }}
            className="relative z-10 flex shrink-0 items-center gap-2.5 will-change-transform"
          >
            {/* Aesthetic Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              onMouseEnter={() => {
                sunRef.current?.startAnimation();
                moonRef.current?.startAnimation();
              }}
              onMouseLeave={() => {
                sunRef.current?.stopAnimation();
                moonRef.current?.stopAnimation();
              }}
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="pressable inline-flex cursor-pointer items-center justify-center p-1 text-text/85 hover:text-text"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "rotate(-25deg) scale(0.85)" }
                  }
                  animate={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, transform: "rotate(0deg) scale(1)" }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, transform: "rotate(25deg) scale(0.85)" }
                  }
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  className="flex items-center justify-center"
                >
                  {theme === "dark" ? (
                    <SunIcon ref={sunRef} size={20} />
                  ) : (
                    <MoonIcon ref={moonRef} size={20} />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={openPalette}
              onMouseEnter={() => searchRef.current?.startAnimation()}
              onMouseLeave={() => searchRef.current?.stopAnimation()}
              aria-label="Open command search"
              className="pressable inline-flex h-9 items-center gap-3 rounded-lg border border-border-strong bg-surface px-3.5 text-xs font-medium text-text hover:bg-surface-hover"
            >
              <SearchIcon ref={searchRef} size={14} className="text-text-secondary" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="rounded-[5px] border border-border bg-surface-hover px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">
                ⌘K
              </kbd>
            </button>

            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="pressable inline-flex items-center justify-center p-1 text-text/85 hover:text-text"
            >
              <FaGithub className="h-5.5 w-5.5" />
            </a>
          </motion.div>
        </div>
      </header>

      {/* Clean Monochrome Command Palette with Grouped Sections */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            onClick={() => setPaletteOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/75 px-4 backdrop-blur-sm"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                    opacity: 0,
                    transform: "scale(0.96) translateY(8px)",
                  }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                    opacity: 1,
                    transform: "scale(1) translateY(0px)",
                  }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                    opacity: 0,
                    transform: "scale(0.97) translateY(4px)",
                  }
              }
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_rgba(128,128,136,0.12),0_28px_80px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center gap-3 px-5 pb-3 pt-4">
                <SearchIcon size={16} className="shrink-0 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Type a section, link, or theme..."
                  className="w-full bg-transparent text-base text-text placeholder:text-text-muted focus:outline-none"
                />
                <kbd className="rounded-md bg-surface-hover px-2 py-0.5 font-mono text-[10px] text-text-secondary">
                  ESC
                </kbd>
              </div>

              <div className="no-scrollbar max-h-96 overflow-y-auto overscroll-contain p-2">
                {grouped.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                    <Image
                      src="/logos/confused-cloud.svg"
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain"
                    />
                    <p className="text-sm text-text-secondary">
                      Nothing for{" "}
                      <span className="font-mono text-text">
                        &ldquo;{query.trim()}&rdquo;
                      </span>
                      . Either it doesn&apos;t exist or I forgot to build it.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {grouped.map((section) => (
                      <div key={section.group}>
                        <p className="px-3 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                          {section.group}
                        </p>
                        <ul className="flex flex-col gap-0.5">
                          {section.items.map((item) => {
                            const itemIndex = indexById.get(item.id) ?? 0;
                            const isSelected = itemIndex === selectedIndex;
                            const isThemeItem = item.action === "toggle-theme";

                            return (
                              <li key={item.id} className="relative">
                                <button
                                  type="button"
                                  onMouseEnter={() =>
                                    setSelectedIndex(itemIndex)
                                  }
                                  onFocus={() => setSelectedIndex(itemIndex)}
                                  onClick={() => runCommand(item)}
                                  className={`relative flex w-full cursor-pointer items-center justify-between rounded-[6px] px-3.5 py-2.5 text-left text-sm transition-colors duration-150 ${isSelected
                                    ? "text-text"
                                    : "text-text-secondary"
                                    }`}
                                >
                                  {isSelected && (
                                    <motion.span
                                      layoutId="cmd-active-row"
                                      transition={
                                        shouldReduceMotion
                                          ? { duration: 0.1 }
                                          : GLIDE_SPRING
                                      }
                                      className="absolute inset-0 -z-10 rounded-[6px] bg-surface-hover"
                                    />
                                  )}
                                  <span className="relative z-10">
                                    {item.label}
                                  </span>
                                  {isThemeItem ? (
                                    theme === "dark" ? (
                                      <SunIcon
                                        size={16}
                                        className="relative z-10 text-text-muted"
                                      />
                                    ) : (
                                      <MoonIcon
                                        size={16}
                                        className="relative z-10 text-text-muted"
                                      />
                                    )
                                  ) : item.external ? (
                                    <ArrowUpRight
                                      className="relative z-10 h-4 w-4 text-text-muted"
                                      strokeWidth={1.5}
                                    />
                                  ) : (
                                    <CornerDownLeft
                                      className="relative z-10 h-4 w-4 text-text-muted"
                                      strokeWidth={1.5}
                                    />
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between bg-bg/35 px-5 py-2.5 font-mono text-[11px] text-text-muted">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
