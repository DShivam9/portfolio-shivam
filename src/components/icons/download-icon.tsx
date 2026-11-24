"use client";

import type { Variants } from "framer-motion";
import {
  LazyMotion,
  domAnimation,
  m,
  useAnimation,
  useReducedMotion,
} from "framer-motion";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
} from "react";

export interface DownloadIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface DownloadIconProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  | "color"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
> {
  size?: number;
  isAnimated?: boolean;
}

const ARROW_VARIANTS: Variants = {
  normal: { y: 0, opacity: 1 },
  animate: {
    y: [0, -2, 3.5, -4.5, 0],
    opacity: [1, 1, 0, 0, 1],
    transition: {
      duration: 0.62,
      times: [0, 0.18, 0.48, 0.52, 1],
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const TRAY_VARIANTS: Variants = {
  normal: { y: 0, scaleX: 1 },
  animate: {
    y: [0, 0, 1.2, 0],
    scaleX: [1, 1, 1.08, 1],
    transition: {
      duration: 0.62,
      times: [0, 0.3, 0.48, 0.8],
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const DownloadIcon = forwardRef<DownloadIconHandle, DownloadIconProps>(
  (
    {
      onMouseEnter,
      onMouseLeave,
      className,
      size = 16,
      isAnimated = true,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation();
    const reduced = useReducedMotion();
    const isControlled = useRef(false);

    useImperativeHandle(ref, () => {
      isControlled.current = true;
      return {
        startAnimation: () =>
          reduced ? controls.start("normal") : controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleEnter = useCallback(
      (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!isAnimated || reduced) return;
        if (!isControlled.current) controls.start("animate");
        else if (e) onMouseEnter?.(e);
      },
      [controls, reduced, isAnimated, onMouseEnter],
    );

    const handleLeave = useCallback(
      (e?: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlled.current) controls.start("normal");
        else if (e) onMouseLeave?.(e);
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={`inline-flex items-center justify-center ${className ?? ""}`}
        {...props}
      >
        <LazyMotion features={domAnimation}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="overflow-visible"
          >
            <m.path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              variants={TRAY_VARIANTS}
              animate={controls}
              initial="normal"
              style={{ transformOrigin: "12px 18px" }}
            />
            <m.g variants={ARROW_VARIANTS} animate={controls} initial="normal">
              <path d="M12 15V3" />
              <path d="m7 10 5 5 5-5" />
            </m.g>
          </svg>
        </LazyMotion>
      </div>
    );
  },
);

DownloadIcon.displayName = "DownloadIcon";

export { DownloadIcon };
