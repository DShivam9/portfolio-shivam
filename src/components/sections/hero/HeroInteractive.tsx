"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { BriefcaseIcon } from "@/components/icons/briefcase-icon";
import { CodeXmlIcon } from "@/components/icons/code-xml-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { GraduationCapIcon } from "@/components/icons/graduation-cap-icon";
import { FileTextIcon } from "@/components/icons/file-text-icon";
import { MapPinIcon } from "@/components/icons/map-pin-icon";
import { MailIcon } from "@/components/icons/mail-icon";
import { ClockIcon } from "@/components/icons/clock-icon";
import { PhoneIcon } from "@/components/icons/phone-icon";

interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export type OverviewIconName =
  | "briefcase"
  | "code"
  | "user"
  | "grad"
  | "resume"
  | "pin"
  | "clock"
  | "phone";

const OVERVIEW_ICONS = {
  briefcase: BriefcaseIcon,
  code: CodeXmlIcon,
  user: UserIcon,
  grad: GraduationCapIcon,
  resume: FileTextIcon,
  pin: MapPinIcon,
  clock: ClockIcon,
  phone: PhoneIcon,
} as const;

export function OverviewRow({
  icon,
  href,
  external = false,
  children,
}: {
  icon: OverviewIconName;
  href?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const IconComponent = OVERVIEW_ICONS[icon];

  const handleEnter = () => iconRef.current?.startAnimation();
  const handleLeave = () => iconRef.current?.stopAnimation();

  const iconBox = (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-text-muted transition-colors duration-150 group-hover:text-text">
      <IconComponent ref={iconRef} size={18} />
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="pressable group -mx-2 flex min-h-9 items-center gap-3 rounded-md px-2 transition-colors duration-150 hover:bg-surface/70"
      >
        {iconBox}
        {children}
        {external && (
          <ArrowUpRight
            className="-ml-1 h-3.5 w-3.5 text-text-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
            strokeWidth={1.5}
          />
        )}
      </a>
    );
  }

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex min-h-9 items-center gap-3"
    >
      {iconBox}
      {children}
    </div>
  );
}

const MOOD_NOTES = [
  {
    src: "/logos/smiling-green-cloud.svg",
    alt: "Smiling green cloud",
    text: "Builds interfaces that feel right.",
  },
  {
    src: "/logos/cool-cloud.svg",
    alt: "Cool cloud",
    text: "Calm under pressure, mostly.",
  },
  {
    src: "/logos/starstruck-cloud.svg",
    alt: "Starstruck cloud",
    text: "Obsessed with motion & small details.",
  },
  {
    src: "/logos/cloud-music-listener.svg",
    alt: "Cloud listening to music",
    text: "Always got something playing while I work.",
  },
  {
    src: "/logos/excited-cloud.svg",
    alt: "Excited blushing cloud",
    text: "Web, 3D, and tactile UI.",
  },
  {
    src: "/logos/laughing-cloud.svg",
    alt: "Laughing cloud",
    text: "Just here having fun building.",
  },
  {
    src: "/logos/winking-cloud.svg",
    alt: "Winking cloud",
    text: "Turns ideas into shipped products.",
  },
  {
    src: "/logos/sleepy-cloud.svg",
    alt: "Sleepy lavender cloud",
    text: "Night owl. Best ideas show up past midnight.",
  },
  {
    src: "/logos/serene-angel-cloud.svg",
    alt: "Serene angel cloud",
    text: "Full-stack web, end to end.",
  },
  {
    src: "/logos/confused-cloud.svg",
    alt: "Confused cloud",
    text: "Overthinking spacing at 1am.",
  },
  {
    src: "/logos/crying-cloud.svg",
    alt: "Crying blue cloud",
    text: "Will rewrite it from scratch if it feels off.",
  },
  {
    src: "/logos/smiling-cloud.svg",
    alt: "Smiling cloud",
    text: "Designing and coding for the web.",
  },
] as const;

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Hoisted formatters avoid allocating a new Intl.DateTimeFormat every second
const IST_HM = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const IST_HMS = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function IdentityShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || paused) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setIndex((prev) => (prev + 1) % MOOD_NOTES.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, paused]);

  const active = MOOD_NOTES[index];

  const cycleMood = () => setIndex((prev) => (prev + 1) % MOOD_NOTES.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex h-full min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[300px] sm:px-10 md:px-12"
    >
      <h1 className="inline-flex flex-wrap items-center justify-center gap-x-3 font-brand text-5xl font-normal leading-[1.04] tracking-normal text-text sm:gap-x-4 sm:text-6xl md:text-[4.5rem]">
        <span>{PROFILE.name}</span>

        <button
          type="button"
          onClick={cycleMood}
          aria-label={`${active.alt} - cycle mood`}
          className="inline-flex h-12 w-12 shrink-0 translate-y-[3px] cursor-pointer items-center justify-center focus:outline-none sm:h-14 sm:w-14 md:h-[66px] md:w-[66px]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active.src}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.92, y: 7, filter: "blur(5px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : {
                    opacity: 0,
                    scale: 0.88,
                    y: -6,
                    filter: "blur(5px)",
                    transition: {
                      duration: 0.26,
                      ease: [0.32, 0.72, 0, 1],
                    },
                  }
              }
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-flex items-center justify-center will-change-transform"
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={68}
                height={68}
                className="h-12 w-12 select-none object-contain sm:h-14 sm:w-14 md:h-[66px] md:w-[66px]"
              />
            </motion.span>
          </AnimatePresence>
        </button>
      </h1>

      <button
        type="button"
        onClick={cycleMood}
        aria-label="Cycle hero note"
        className="mt-4 flex min-h-6 cursor-pointer items-center justify-center focus:outline-none"
      >
        {shouldReduceMotion ? (
          <span className="font-mono text-xs text-text-secondary sm:text-[13px]">
            {active.text}
          </span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active.text}
              exit={{
                opacity: 0,
                y: -4,
                filter: "blur(4px)",
                transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
              }}
              className="flex flex-wrap items-center justify-center gap-x-[0.38em] font-mono text-xs text-text-secondary sm:text-[13px]"
            >
              {active.text.split(" ").map((word, wordIdx) => (
                <motion.span
                  key={`${active.text}-${wordIdx}`}
                  initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.36,
                    delay: 0.08 + wordIdx * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block will-change-transform"
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
          </AnimatePresence>
        )}
      </button>
    </div>
  );
}

function subscribeClock(intervalMs: number) {
  return (onStoreChange: () => void) => {
    const id = window.setInterval(() => {
      if (!document.hidden) onStoreChange();
    }, intervalMs);
    return () => window.clearInterval(id);
  };
}

const subscribeClockSec = subscribeClock(1000);
const subscribeClockMin = subscribeClock(15_000);
const getClockServerSnapshot = () => "--:-- IST";

export function LiveClock({
  className = "font-mono text-xs tabular-nums text-text-muted",
  showSeconds = false,
}: {
  className?: string;
  showSeconds?: boolean;
}) {
  const time = useSyncExternalStore(
    showSeconds ? subscribeClockSec : subscribeClockMin,
    () => `${(showSeconds ? IST_HMS : IST_HM).format(new Date())} IST`,
    getClockServerSnapshot,
  );

  return (
    <span suppressHydrationWarning className={className}>
      {time}
    </span>
  );
}

export function CopyToast({
  open,
  title,
  detail,
}: {
  open: boolean;
  title: string;
  detail: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(8px) scale(0.95)" }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, transform: "translateY(0px) scale(1)" }
          }
          exit={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: "translateY(8px) scale(0.95)" }
          }
          transition={{ duration: 0.22, ease: EASE_OUT }}
          className="pointer-events-none fixed bottom-6 right-6 z-[80] flex origin-bottom-right items-center gap-2.5 rounded-lg border border-border-strong bg-surface px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-text text-bg">
            <Check className="h-3 w-3" strokeWidth={2.2} />
          </span>
          <span className="text-sm font-medium text-text">{title}</span>
          <span className="hidden font-mono text-xs text-text-muted sm:inline">
            {detail}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function CopyEmailRow() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const mailRef = useRef<AnimatedIconHandle>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        onMouseEnter={() => mailRef.current?.startAnimation()}
        onMouseLeave={() => mailRef.current?.stopAnimation()}
        aria-label="Copy email address"
        className="pressable group -mx-2 flex min-h-9 w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-md px-2 text-left transition-colors duration-150 hover:bg-surface/70"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-text-muted transition-colors duration-150 group-hover:text-text">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "check" : "mail"}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "scale(0.25)", filter: "blur(4px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "scale(1)", filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "scale(0.25)", filter: "blur(4px)" }
              }
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              className="flex items-center justify-center"
            >
              {copied ? (
                <Check className="h-[18px] w-[18px] text-text" strokeWidth={1.8} />
              ) : (
                <MailIcon ref={mailRef} size={18} />
              )}
            </motion.span>
          </AnimatePresence>
        </span>

        <span className="relative min-w-0 flex-1 truncate font-mono text-sm text-text">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "email"}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "translateY(4px)", filter: "blur(2px)" }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, transform: "translateY(-4px)", filter: "blur(2px)" }
              }
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className="block truncate"
            >
              {copied ? "Copied to clipboard" : PROFILE.email}
            </motion.span>
          </AnimatePresence>
        </span>

        <Copy
          className="ml-auto h-3.5 w-3.5 shrink-0 text-text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          strokeWidth={1.5}
        />
      </button>

      <CopyToast open={copied} title="Email copied" detail={PROFILE.email} />
    </>
  );
}

export function DiscordSocialCard() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.socials.discord);
      setCopied(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback ignored if clipboard is blocked
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy Discord username ${PROFILE.socials.discord}`}
        className="pressable group flex w-full cursor-pointer items-center justify-between px-6 py-6 text-left transition-colors duration-150 hover:bg-surface sm:px-7"
      >
        <div className="flex items-center gap-4">
          <Image
            src="https://img.icons8.com/color/96/discord-logo.png"
            alt="Discord icon"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
          />
          <div>
            <p className="text-base font-medium text-text">Discord</p>
            <p className="font-mono text-xs text-text-muted">
              {copied ? "Copied username" : `@${PROFILE.socials.discord}`}
            </p>
          </div>
        </div>
        {copied ? (
          <Check className="h-4 w-4 text-text" strokeWidth={1.75} />
        ) : (
          <Copy
            className="h-4 w-4 text-text-muted transition-colors duration-150 group-hover:text-text"
            strokeWidth={1.5}
          />
        )}
      </button>

      <CopyToast
        open={copied}
        title="Discord copied"
        detail={`@${PROFILE.socials.discord}`}
      />
    </>
  );
}
