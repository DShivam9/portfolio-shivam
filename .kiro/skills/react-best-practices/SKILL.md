---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns.
user-invocable: false
source: https://github.com/vercel-labs/agent-skills
license: MIT
---

# Vercel React Best Practices

Performance-focused React patterns for this project (Next.js 16, React 19, Three.js, GSAP).

## Critical: Avoid Waterfalls

- Use `Promise.all()` for independent async operations
- Start promises early, await late
- Use Suspense to stream content progressively

## Bundle Size

- Import directly — avoid barrel files
- Use `next/dynamic` for heavy components (Three.js, postprocessing)
- Load analytics/non-critical code after hydration

## Re-render Optimization (important for R3F + GSAP)

- Don't subscribe to Zustand state that's only read in callbacks — use `useScrollStore.getState()` directly in event handlers
- Use `useRef` for values that change every frame (scroll position, animation state) — never `useState`
- Avoid defining components inside render functions
- `useMemo` for expensive Three.js geometry/particle arrays (already applied in Scene.tsx)
- Derive state during render, not in effects

## useFrame / Animation Loop Rules (R3F specific)

- NEVER read `window.scrollY` outside `useFrame` — use it inside the frame loop only
- NEVER call `setState` inside `useFrame` — it causes React re-renders every frame
- Use `useRef` to store mutable animation state (positions, velocities, progress)
- `safeDelta = Math.min(delta, 0.1)` to prevent physics explosions on tab resume

## Event Listener Patterns

- Deduplicate global event listeners
- Use passive listeners for scroll: `{ passive: true }`
- Always clean up in `useEffect` return

## GSAP + ScrollTrigger Rules

- Always wrap in `gsap.context()` for proper cleanup
- Call `ctx.revert()` in the `useEffect` cleanup
- Register plugins once: `gsap.registerPlugin(ScrollTrigger)`
- Never animate the same element from two different ScrollTriggers

## Functional setState

Use functional setState for stable callbacks:
```tsx
// Good
setState(prev => ({ ...prev, value: newValue }))
// Avoid when previous state is needed
setState({ ...state, value: newValue })
```

## Lazy State Init

Pass a function to `useState` for expensive initial values:
```tsx
// Good
const [state] = useState(() => computeExpensiveValue())
```
