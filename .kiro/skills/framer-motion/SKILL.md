---
name: framer-motion
description: Framer Motion animation patterns for React. Use when implementing UI animations, transitions, gestures, or layout animations with framer-motion or motion/react. Covers variants, AnimatePresence, layout animations, and performance.
user-invocable: true
source: project-specific
---

# Framer Motion Best Practices

This project uses `framer-motion` v12 alongside GSAP. Use Framer Motion for **React component transitions and UI micro-interactions**; use GSAP for **scroll-driven cinematic animations**.

## Import Pattern (v12)

```tsx
// framer-motion v12 — use motion/react for React-specific imports
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
```

## Core: Variants

Define animation states as named objects, pass to `motion.*` components:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants} />
  ))}
</motion.div>
```

## AnimatePresence (Exit Animations)

Wrap conditionally rendered elements to animate them out:

```tsx
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    />
  )}
</AnimatePresence>
```

- `mode="wait"` — waits for exit animation before entering new element
- `mode="popLayout"` — pop layout for list reordering
- Always provide a stable `key` prop

## Layout Animations

```tsx
// Animate layout changes automatically
<motion.div layout>
  {expanded && <p>Extra content</p>}
</motion.div>

// Shared layout transitions between components
<motion.div layoutId="hero-image" />
// In another component:
<motion.div layoutId="hero-image" />
```

## useReducedMotion — Accessibility

**Always check this when using motion animations:**

```tsx
import { useReducedMotion } from "framer-motion"

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    />
  )
}
```

## Performance Rules

- Animate `transform` and `opacity` only — avoids layout recalculation
- Avoid animating `width`, `height`, `top`, `left` — use `scale`/`translate` instead
- Use `will-change: transform` via Tailwind `will-change-transform` for GPU promotion
- `useMotionValue` + `useTransform` for scroll-linked animations (no re-renders)

```tsx
const scrollY = useMotionValue(0)
const opacity = useTransform(scrollY, [0, 200], [1, 0])
```

## GSAP vs Framer Motion in This Project

| Use case | Use |
|---|---|
| Scroll-driven section transitions | GSAP + ScrollTrigger |
| Component mount/unmount | Framer Motion AnimatePresence |
| Page routing transitions | Framer Motion |
| Character/text stagger | GSAP SplitText |
| Hover micro-interactions | Either (Framer for simple, GSAP for complex) |
| 3D canvas animations | GSAP / R3F useFrame |

## Transition Presets

```tsx
const spring = { type: "spring", stiffness: 300, damping: 30 }
const cinematic = { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // expo out
const snappy = { duration: 0.15, ease: "easeOut" }
```
