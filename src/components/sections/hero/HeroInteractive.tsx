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
import { ArrowUpRight, Check, Copy, Heart } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { EditorialText } from "@/components/ui/EditorialText";
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
  revealDelay,
  children,
}: {
  icon: OverviewIconName;
  href?: string;
  external?: boolean;
  revealDelay?: number;
  children: ReactNode;
}) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const IconComponent = OVERVIEW_ICONS[icon];
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (revealDelay === undefined || shouldReduceMotion) return;
    const timer = window.setTimeout(() => {
      iconRef.current?.startAnimation();
    }, revealDelay * 1000);
    return () => window.clearTimeout(timer);
  }, [revealDelay, shouldReduceMotion]);

  const handleEnter = () => iconRef.current?.startAnimation();
  const handleLeave = () => iconRef.current?.stopAnimation();

  const iconBox = (
    <motion.span
      initial={
        shouldReduceMotion || revealDelay === undefined
          ? false
          : { opacity: 0, scale: 0.6 }
      }
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 24,
        delay: revealDelay ?? 0,
      }}
      className="flex h-5 w-5 shrink-0 items-center justify-center text-text-muted transition-colors duration-150 group-hover:text-text"
    >
      <IconComponent ref={iconRef} size={18} />
    </motion.span>
  );

  const revealedText =
    shouldReduceMotion || revealDelay === undefined ? (
      children
    ) : (
      <span className="inline-flex min-w-0 overflow-hidden">
        <motion.span
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0%" }}
          transition={{
            duration: 0.56,
            delay: revealDelay + 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-flex min-w-0 items-center"
        >
          {children}
        </motion.span>
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
        {revealedText}
        {external && (
          <ArrowUpRight
            className="arrow-glide -ml-1 h-3.5 w-3.5 text-text-muted group-hover:text-text"
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
      {revealedText}
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
      <h1 className="inline-flex flex-wrap items-center justify-center gap-x-3 font-brand text-5xl font-normal leading-[1.08] tracking-normal text-text sm:gap-x-4 sm:text-6xl md:text-[4.5rem]">
        <span className="inline-flex overflow-hidden pb-1">
          <span className="sr-only">{PROFILE.name}</span>
          <span aria-hidden="true" className="inline-flex">
            {Array.from(PROFILE.name).map((char, idx) =>
              shouldReduceMotion ? (
                <span key={`${idx}-${char}`}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ) : (
                <motion.span
                  key={`${idx}-${char}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.05 + idx * 0.032,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ),
            )}
          </span>
        </span>

        <motion.button
          type="button"
          onClick={cycleMood}
          aria-label={`${active.alt} - cycle mood`}
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, scale: 0.55, rotate: -14 }
          }
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                type: "spring",
                stiffness: 240,
                damping: 20,
                delay: 0.26,
              }
          }
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
        </motion.button>
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
          <AnimatePresence mode="wait">
            <motion.span
              key={active.text}
              exit={{
                opacity: 0,
                y: -4,
                transition: { duration: 0.18, ease: [0.32, 0.72, 0, 1] },
              }}
              className="flex flex-wrap items-center justify-center gap-x-[0.38em] font-mono text-xs text-text-secondary sm:text-[13px]"
            >
              {active.text.split(" ").map((word, wordIdx) => (
                <motion.span
                  key={`${active.text}-${wordIdx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.44,
                    delay: (index === 0 ? 0.62 : 0.04) + wordIdx * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
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
  icon = "check",
}: {
  open: boolean;
  title: string;
  detail: string;
  icon?: "check" | "heart";
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
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="tactile-dock pointer-events-none fixed bottom-6 right-6 z-[80] origin-bottom-right shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2),0_12px_36px_rgba(0,0,0,0.42)]"
        >
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              icon === "heart" ? "text-[#f43f5e]" : "text-text"
            }`}
          >
            {icon === "heart" ? (
              <Heart className="h-4 w-4 fill-[#f43f5e]" strokeWidth={2} />
            ) : (
              <Check className="h-4 w-4" strokeWidth={2.2} />
            )}
          </span>
          <span className="tactile-key h-8 cursor-default gap-2 px-3 py-0">
            <span className="text-xs font-medium text-text">{title}</span>
            <span className="hidden font-mono text-[11px] text-text-muted sm:inline">
              {detail}
            </span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function CopyEmailRow({ revealDelay }: { revealDelay?: number }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const mailRef = useRef<AnimatedIconHandle>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (revealDelay === undefined || shouldReduceMotion) return;
    const introTimer = window.setTimeout(() => {
      mailRef.current?.startAnimation();
    }, revealDelay * 1000);
    return () => window.clearTimeout(introTimer);
  }, [revealDelay, shouldReduceMotion]);

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
        <motion.span
          initial={
            shouldReduceMotion || revealDelay === undefined
              ? false
              : { opacity: 0, scale: 0.6 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 24,
            delay: revealDelay ?? 0,
          }}
          className="flex h-5 w-5 shrink-0 items-center justify-center text-text-muted transition-colors duration-150 group-hover:text-text"
        >
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
        </motion.span>

        <span className="relative min-w-0 flex-1 overflow-hidden font-mono text-sm text-text">
          <motion.span
            initial={
              shouldReduceMotion || revealDelay === undefined
                ? false
                : { opacity: 0, y: "100%" }
            }
            animate={{ opacity: 1, y: "0%" }}
            transition={{
              duration: 0.56,
              delay: (revealDelay ?? 0) + 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="block truncate"
          >
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
          </motion.span>
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
        className="pressable group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl bg-surface px-5 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.14)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[1px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.24),0_4px_10px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-center gap-4">
          <Image
            src="https://img.icons8.com/color/96/discord-logo.png"
            alt="Discord icon"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <div>
            <p className="text-base font-medium text-text">
              <EditorialText>Discord</EditorialText>
            </p>
            <p className="font-mono text-xs text-text-muted transition-colors duration-200 group-hover:text-text-secondary">
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

export function HeroReveal({
  delay,
  children,
  className,
  mask = true,
}: {
  delay: number;
  children: ReactNode;
  className?: string;
  mask?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (mask) {
    return (
      <motion.div
        initial={{ clipPath: "inset(-2px 100% -2px -8px)", opacity: 0.15 }}
        animate={{ clipPath: "inset(-2px -8px -2px -8px)", opacity: 1 }}
        transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.56, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
