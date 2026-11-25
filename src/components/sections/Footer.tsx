"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { MailIcon, type MailIconHandle } from "@/components/icons/mail-icon";
import {
  FileTextIcon,
  type FileTextIconHandle,
} from "@/components/icons/file-text-icon";
import { EditorialText } from "@/components/ui/EditorialText";
import { ScrollHeading, ScrollReveal } from "@/components/ui/ScrollReveal";
import { CopyToast } from "@/components/sections/hero/HeroInteractive";
import { editorialNavigate } from "@/utils/editorialNavigate";

const GradientASCII = dynamic(() => import("@/components/ui/GradientASCII"), {
  ssr: false,
});

const ICON_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const WORDMARK_CHARS = Array.from("Shivam Diwan");
const ASCII_COLORS = ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"];

function subscribeTheme(cb: () => void) {
  window.addEventListener("theme-change", cb);
  return () => window.removeEventListener("theme-change", cb);
}

function getIsLightTheme() {
  return document.documentElement.dataset.theme === "light";
}

const INDEX_LINKS = [
  { label: "About", href: "#about" },
  { label: "Jukebox", href: "#music" },
  { label: "Activity", href: "#activity" },
  { label: "Stack", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
] as const;

const IST_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function FooterClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      if (!document.hidden) setTime(IST_FORMATTER.format(new Date()));
    };
    update();
    const id = window.setInterval(update, 1_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  if (!time) return null;
  return <span className="tabular-nums">{time} IST</span>;
}

export function Footer() {
  const [copiedField, setCopiedField] = useState<"email" | "discord" | null>(
    null,
  );
  const [gradientActive, setGradientActive] = useState(false);
  const isLightTheme = useSyncExternalStore(
    subscribeTheme,
    getIsLightTheme,
    () => false,
  );
  const shouldReduceMotion = useReducedMotion();
  const mailRef = useRef<MailIconHandle>(null);
  const resumeRef = useRef<FileTextIconHandle>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyValue = async (field: "email" | "discord", value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 2200);
    } catch {
      // Clipboard unavailable in restricted context
    }
  };

  return (
    <footer
      id="contact"
      className="relative w-full scroll-mt-16 overflow-hidden"
    >
      {/* Full-bleed viewport GradientASCII backdrop — ignites the moment Shivam Diwan lands */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: shouldReduceMotion || gradientActive ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0"
      >
        <GradientASCII
          colors={ASCII_COLORS}
          shape="horizon"
          lightMode={isLightTheme}
          scrambleRadius={0.2}
          clickEffect="wave"
          startWhenInView
          viewThreshold={0.15}
          active={Boolean(shouldReduceMotion) || gradientActive}
          className="!absolute inset-0 pointer-events-auto"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-bg to-transparent"
      />

      <div className="section-shell relative z-10 flex min-h-[calc(100svh-4rem)] flex-col">
        <div className="border-b border-border px-6 py-3 sm:px-10">
          <ScrollHeading delay={0.1}>
            <h2 className="section-title">Contact</h2>
          </ScrollHeading>
        </div>

        {/* Editorial top stage: staggered behind GradientASCII horizon reveal (zero block wrapper collision) */}
        <div className="grid flex-1 grid-cols-1 content-center gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ScrollReveal y={16} delay={0.28}>
              <h3 className="text-3xl font-medium tracking-tight text-text [text-wrap:balance] sm:text-5xl sm:leading-[1.08]">
                Let&apos;s build something worth shipping.
              </h3>
            </ScrollReveal>

            <ScrollReveal y={12} delay={0.42}>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-text/95 [text-wrap:pretty] sm:text-[15px]">
                Open to full-stack engineering roles, internships, and interesting
                builds. Fastest way to reach me is email.
              </p>
            </ScrollReveal>

            <ScrollReveal y={12} delay={0.54}>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
              {/* Tactile email + copy dock matching navbar Search ⌘K */}
              <div className="tactile-dock">
                <a
                  href={`mailto:${PROFILE.email}`}
                  onMouseEnter={() => mailRef.current?.startAnimation()}
                  onMouseLeave={() => mailRef.current?.stopAnimation()}
                  className="pressable group inline-flex h-9 items-center gap-2.5 rounded-lg bg-bg px-4 text-sm font-medium text-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)] focus-visible:outline-none"
                >
                  <MailIcon ref={mailRef} size={16} className="text-text-secondary" />
                  <EditorialText>{PROFILE.email}</EditorialText>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 text-text-muted transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                    strokeWidth={1.8}
                  />
                </a>

                <button
                  type="button"
                  onClick={() => copyValue("email", PROFILE.email)}
                  aria-label="Copy email address"
                  className="pressable inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-3 font-mono text-xs text-text-secondary transition-colors duration-150 hover:text-text"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedField === "email" ? (
                      <motion.span
                        key="copied"
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.85 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, scale: 1 }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.85 }
                        }
                        transition={{ duration: 0.16, ease: ICON_EASE }}
                        className="inline-flex items-center gap-1.5 text-text"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        <span>Copied</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.85 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, scale: 1 }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.85 }
                        }
                        transition={{ duration: 0.16, ease: ICON_EASE }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" strokeWidth={1.7} />
                        <span className="hidden sm:inline">Copy</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              <div className="tactile-dock">
                <Link
                  href="/resume"
                  onMouseEnter={() => resumeRef.current?.startAnimation()}
                  onMouseLeave={() => resumeRef.current?.stopAnimation()}
                  className="pressable group inline-flex h-9 items-center gap-2 rounded-lg bg-bg px-4 font-mono text-xs font-medium text-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]"
                >
                  <FileTextIcon ref={resumeRef} size={15} className="text-text-secondary" />
                  <EditorialText>Resume</EditorialText>
                  <ArrowUpRight
                    className="arrow-glide h-3.5 w-3.5 text-text-muted group-hover:text-text"
                    strokeWidth={1.7}
                  />
                </Link>
              </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:col-span-5 lg:justify-self-end">
            <ScrollReveal y={14} delay={0.4}>
              <p className="eyebrow">
                Jump to
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium">
                {INDEX_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        editorialNavigate(link.href, shouldReduceMotion);
                      }}
                      className="group inline-flex items-center text-text"
                    >
                      <EditorialText>{link.label}</EditorialText>
                    </a>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal y={14} delay={0.55}>
              <p className="eyebrow">
                Connect
              </p>
              <ul className="mt-4 space-y-2.5 text-sm font-medium">
                <li>
                  <a
                    href={PROFILE.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-text"
                  >
                    <EditorialText>GitHub</EditorialText>
                    <ArrowUpRight
                      className="arrow-glide h-3.5 w-3.5 text-text/90 group-hover:text-text"
                      strokeWidth={1.9}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href={PROFILE.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-text"
                  >
                    <EditorialText>LinkedIn</EditorialText>
                    <ArrowUpRight
                      className="arrow-glide h-3.5 w-3.5 text-text/90 group-hover:text-text"
                      strokeWidth={1.9}
                    />
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => copyValue("discord", PROFILE.socials.discord)}
                    className="group inline-flex cursor-pointer items-center gap-1.5 text-text"
                  >
                    <EditorialText>Discord</EditorialText>
                    {copiedField === "discord" ? (
                      <Check className="h-3 w-3 text-text" strokeWidth={2} />
                    ) : (
                      <Copy
                        className="h-3 w-3 text-text/90 transition-colors duration-300 group-hover:text-text"
                        strokeWidth={1.9}
                      />
                    )}
                  </button>
                </li>
                <li className="pt-1 font-mono text-xs font-medium text-text/90">
                  Hyderabad, IN
                </li>
              </ul>
            </ScrollReveal>
          </div>
        </div>

        {/* Monumental architectural wordmark — per-letter masked baseline rise that triggers GradientASCII */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: "some" }}
          aria-hidden="true"
          className="select-none overflow-hidden px-3 pt-4 text-center sm:px-6 sm:pt-6"
        >
          <p className="font-brand -mb-[0.14em] inline-flex whitespace-nowrap text-[clamp(3.2rem,12.6vw,9.2rem)] font-normal leading-[0.8] tracking-normal">
            {WORDMARK_CHARS.map((char, idx) => (
              <motion.span
                key={`${idx}-${char}`}
                variants={
                  shouldReduceMotion
                    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                    : {
                        hidden: {
                          y: "110%",
                          opacity: 0,
                          filter: "blur(6px)",
                        },
                        visible: {
                          y: "0%",
                          opacity: 1,
                          filter: "blur(0px)",
                          transition: {
                            duration: 0.64,
                            delay: 0.1 + idx * 0.034,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }
                }
                onAnimationStart={
                  idx === WORDMARK_CHARS.length - 1
                    ? (definition) => {
                        if (definition === "visible") setGradientActive(true);
                      }
                    : undefined
                }
                className="inline-block -mx-[0.06em] bg-gradient-to-b from-text/28 via-text/14 to-transparent bg-clip-text px-[0.06em] text-transparent"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </p>
        </motion.div>

        {/* Thin colophon bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-border px-6 py-5 sm:flex-row sm:items-center sm:px-10">
          <div className="flex items-center gap-3.5">
            <Image
              src="/logos/brand-sd.svg"
              alt={PROFILE.name}
              width={36}
              height={18}
              className="github-app-icon h-[18px] w-auto object-contain"
            />
            <span className="font-mono text-xs text-text/90">
              © 2026 {PROFILE.name} Portfolio
            </span>
          </div>

          <div className="flex items-center gap-5 font-mono text-xs text-text/90">
            <FooterClock />
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                editorialNavigate("#top", shouldReduceMotion);
              }}
              className="pressable group inline-flex items-center gap-1.5 text-text"
            >
              <EditorialText>Top</EditorialText>
              <ArrowUp
                className="h-3.5 w-3.5 transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:text-text"
                strokeWidth={1.7}
              />
            </a>
          </div>
        </div>
      </div>

      <CopyToast
        open={copiedField === "discord"}
        title="Discord copied"
        detail={`@${PROFILE.socials.discord}`}
      />
      <CopyToast
        open={copiedField === "email"}
        title="Email copied"
        detail={PROFILE.email}
      />
    </footer>
  );
}
