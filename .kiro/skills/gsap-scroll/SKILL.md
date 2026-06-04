---
name: gsap-scroll
description: GSAP and ScrollTrigger patterns for cinematic scroll-driven animations. Use when working on Hero, About, Projects, Skills, Contact sections or any GSAP animation.
user-invocable: true
source: project-specific
---

# GSAP + ScrollTrigger Best Practices

For this project: GSAP 3.15, Lenis smooth scroll, Next.js App Router.

## Core Cleanup Pattern

Always use `gsap.context()` — it scopes selectors and handles cleanup automatically:

```tsx
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  const ctx = gsap.context(() => {
    // all gsap.to(), gsap.fromTo(), ScrollTrigger.create() go here
  }, containerRef) // scopes to containerRef

  return () => ctx.revert() // clean kill of all animations + ScrollTriggers
}, [])
```

## Lenis + ScrollTrigger Integration

This project uses Lenis. ScrollTrigger reads `window.scrollY` natively and works with Lenis because Lenis updates the actual scroll position. No extra integration needed.

- The Lenis RAF loop is in `page.tsx`
- `window.lenis` is exposed globally for programmatic scroll

## ScrollTrigger Config Patterns

```tsx
// Scrubbed timeline (synchronized with scroll)
ScrollTrigger.create({
  trigger: element,
  start: "top top",
  end: "bottom bottom",
  scrub: 1.5, // higher = more lag/smoothness
  onUpdate: (self) => { /* self.progress 0–1 */ }
})

// One-shot trigger (fires once on enter)
gsap.fromTo(element,
  { opacity: 0, y: 50 },
  {
    opacity: 1, y: 0,
    scrollTrigger: { trigger: element, start: "top 80%" }
  }
)
```

## Stagger Patterns

```tsx
// Left-to-right character stagger
gsap.to(chars, {
  stagger: { each: 0.04, from: "start" },
  ease: "power3.out"
})

// Reverse stagger (right-to-left, used on logo leave)
gsap.to(chars, {
  stagger: { each: 0.03, from: "end" }
})
```

## Blur + Fade Reveal (used in About section)

```tsx
gsap.fromTo(".reveal-element",
  { opacity: 0.1, filter: "blur(12px)", y: 30 },
  {
    opacity: 1, filter: "blur(0px)", y: 0,
    stagger: 0.15, duration: 1.2, ease: "power2.out",
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 80%", end: "top 35%",
      scrub: 1.2
    }
  }
)
```

## Perspective / 3D Text Transforms

Apply `[perspective:1000px]` on the parent container, then animate `rotationX`:
```tsx
// Parent: className="[perspective:1000px]"
gsap.fromTo(el,
  { y: 80, opacity: 0, rotationX: -40 },
  { y: 0, opacity: 1, rotationX: 0, ease: "power3.out" }
)
```

## Killing Timelines on Hover Leave

```tsx
let hoverTl: gsap.core.Timeline | null = null

const handleEnter = () => {
  if (hoverTl) hoverTl.kill() // Kill any running animation first
  hoverTl = gsap.timeline()
  hoverTl.to(...)
}
```

## ScrollTrigger Progress → Zustand Store

```tsx
ScrollTrigger.create({
  onUpdate: (self) => {
    useScrollStore.getState().setProgress("hero", self.progress)
    // Use .getState() directly — don't subscribe in useFrame context
  }
})
```

## Kill All on Cleanup

```tsx
return () => {
  ScrollTrigger.getAll().forEach(t => t.kill())
}
// OR with gsap.context:
return () => ctx.revert() // handles everything
```

## Common Pitfalls

- Never register the same plugin twice — `gsap.registerPlugin` is idempotent but messy
- Don't use global class selectors (`.hero-char-1`) across multiple component instances — they'll all animate
- `scrub: true` = instant lock to scroll; `scrub: 1.5` = 1.5s lag behind scroll (cinematic feel)
- `end: "bottom bottom"` on a `300vh` section = scroll all the way through before it ends
