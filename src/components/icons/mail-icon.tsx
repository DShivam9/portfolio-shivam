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
export interface MailIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MailIconProps extends Omit<
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

const MailIcon = forwardRef<MailIconHandle, MailIconProps>(
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

  const flapVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, -0.8, -0.8, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.65, 1],
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
      <m.path
       d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"
       variants={flapVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "7px" }}
      />
      <rect x="2" y="4" width="20" height="16" rx="2" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MailIcon.displayName = "MailIcon";
export { MailIcon };
