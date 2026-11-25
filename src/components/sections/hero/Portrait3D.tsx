"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const TILT_SPRING = { stiffness: 150, damping: 24, mass: 0.85 };
const LIFT_SPRING = { stiffness: 180, damping: 26, mass: 0.75 };

export function Portrait3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hintDismissed, setHintDismissed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawHover = useMotionValue(0);

  const springX = useSpring(rawX, TILT_SPRING);
  const springY = useSpring(rawY, TILT_SPRING);
  const springHover = useSpring(rawHover, LIFT_SPRING);

  // Stage 3D perspective tilt
  const rotateY = useTransform(springX, [-1, 1], [-10, 10]);
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);

  // Background mural stays crisp (no blur), shifts deeply opposite foreground for interactive mouse parallax
  const bgX = useTransform(springX, [-1, 1], [22, -22]);
  const bgY = useTransform(springY, [-1, 1], [16, -16]);
  const bgScale = useTransform(springHover, [0, 1], [1.14, 1.18]);
  const bgBright = useTransform(springHover, [0, 1], [1, 0.92]);

  // Foreground subject floats in true 3D Z-space, tightly tucked inside the frame bounds
  const fgX = useTransform(springX, [-1, 1], [-6, 6]);
  const fgY = useTransform(springY, [-1, 1], [-4, 4]);
  const fgZ = useTransform(springHover, [0, 1], [14, 38]);
  const fgScale = useTransform(springHover, [0, 1], [0.98, 1.0]);

  // Directional cast shadow falls onto the backdrop card opposite cursor movement
  const shadowX = useTransform(springX, [-1, 1], [14, -14]);
  const shadowY = useTransform(springY, [-1, 1], [18, 8]);
  const shadowBlur = useTransform(springHover, [0, 1], [14, 24]);
  const shadowAlpha = useTransform(springHover, [0, 1], [0.45, 0.65]);

  const stageTransform = useMotionTemplate`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  const bgTransform = useMotionTemplate`translate3d(${bgX}px, ${bgY}px, 0px) scale(${bgScale})`;
  const bgFilter = useMotionTemplate`brightness(${bgBright})`;
  const fgTransform = useMotionTemplate`translate3d(${fgX}px, ${fgY}px, ${fgZ}px) scale(${fgScale})`;
  const fgFilter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha}))`;

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && !hintDismissed) {
      setHintDismissed(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && !hintDismissed) {
      setHintDismissed(true);
    }
    if (shouldReduceMotion || e.pointerType !== "mouse") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawX.set(Math.max(-1, Math.min(1, nx)));
    rawY.set(Math.max(-1, Math.min(1, ny)));
    rawHover.set(1);
  };

  const handlePointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
    rawHover.set(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative aspect-[3/4] w-full select-none [perspective:950px]"
    >
      <motion.div
        style={
          shouldReduceMotion
            ? undefined
            : { transform: stageTransform, transformStyle: "preserve-3d" }
        }
        className="relative h-full w-full"
      >
        {/* Layer 1: Clipped backdrop card — enters with portrait so no empty box sits alone */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.52, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "translateZ(0px)" }}
          className="absolute inset-0 overflow-hidden rounded-[6px] bg-surface ring-1 ring-inset ring-white/10"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.58,
              delay: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0"
          >
            <motion.div
              style={
                shouldReduceMotion
                  ? undefined
                  : { transform: bgTransform, filter: bgFilter }
              }
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src="/about/bg.png"
                alt="Mountain mural backdrop"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>

          {/* Subtle atmospheric edge vignette separates backdrop from floating subject */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_44%,rgba(0,0,0,0.46)_100%)]"
          />

          {/* Subtle bottom grounding fade on backdrop card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent"
          />
        </motion.div>

        {/* Layer 2: Tack-sharp foreground subject — arrives right as card opens */}
        <motion.div
          style={
            shouldReduceMotion
              ? {
                  filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.45))",
                }
              : {
                  transform: fgTransform,
                  filter: fgFilter,
                  transformStyle: "preserve-3d",
                }
          }
          className="pointer-events-none absolute bottom-[1.5%] left-[12.5%] h-[75%] w-[75%] will-change-transform"
        >
          <motion.div
            initial={
              shouldReduceMotion ? false : { opacity: 0, scale: 0.86, y: 10 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.56,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-full w-full"
          >
            <Image
              src="/about/me.png"
              alt="Shivam Diwan"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-contain object-bottom"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* One-time playful hover callout — draws once on load, disappears permanently on first hover */}
      <AnimatePresence>
        {!hintDismissed && (
          <motion.div
            aria-hidden="true"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }
            }
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.42,
                delay: 0.92,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0.16 } }
                : {
                    opacity: 0,
                    y: -4,
                    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
                  }
            }
            className="pointer-events-none absolute left-[calc(100%+1.1rem)] top-[46%] z-20 hidden -translate-y-1/2 items-center gap-2 whitespace-nowrap text-text-muted [@media(hover:hover)]:xl:inline-flex"
          >
            <svg
              viewBox="0 0 84 44"
              fill="none"
              className="h-11 w-[84px] overflow-visible"
            >
              <motion.path
                d="M 80 28 C 68 35, 52 34, 48 22 C 45 14, 54 11, 56 18 C 58 26, 44 30, 30 25 C 18 21, 10 19, 4 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={
                  shouldReduceMotion
                    ? { pathLength: 1 }
                    : { pathLength: 0 }
                }
                animate={{ pathLength: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 0.72,
                        delay: 1.0,
                        ease: [0.22, 1, 0.36, 1],
                      }
                }
              />
              <motion.path
                d="M 11.5 13.5 L 3.5 19 L 11.5 24.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, delay: 1.62, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </svg>
            <span className="-rotate-2 translate-y-1 font-brand text-[16px] italic leading-none tracking-wide">
              try hovering
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
