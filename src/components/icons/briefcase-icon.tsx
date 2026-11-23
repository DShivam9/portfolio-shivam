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
export interface BriefcaseIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BriefcaseIconProps extends Omit<
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
 duration?: number;
 isAnimated?: boolean;
 color?: string;
}

const BriefcaseIcon = forwardRef<BriefcaseIconHandle, BriefcaseIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   color,
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

  const caseVariants: Variants = {
   normal: { y: 0, rotate: 0 },
   animate: {
    y: [0, -1, 0, 0],
    rotate: [0, -5, 4, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  return (
   <LazyMotion features={domAnimation} strict>
    <m.div
     className={`inline-flex items-center justify-center ${className ?? ""}`}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     {...props}
     style={{ color, ...props.style }}
    >
     <m.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      initial="normal"
     >
      <m.g
       variants={caseVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "3px" }}
      >
       <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
       <rect width="20" height="14" x="2" y="6" rx="2" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BriefcaseIcon.displayName = "BriefcaseIcon";
export { BriefcaseIcon };
