---
name: tailwind-v4
description: Tailwind CSS v4 patterns and best practices. Use when writing or reviewing CSS/styling code, adding utility classes, configuring themes, or working with the CSS-first config approach in this project.
user-invocable: true
source: project-specific
---

# Tailwind CSS v4 Best Practices

This project uses Tailwind v4 with the CSS-first configuration approach (no `tailwind.config.js`).

## Key Differences from Tailwind v3

- **No config file** — theme customization happens in `globals.css` using `@theme`
- **CSS import** — use `@import "tailwindcss"` instead of the three `@tailwind` directives
- **PostCSS plugin** — uses `@tailwindcss/postcss` instead of the classic postcss plugin
- **Arbitrary values** — still supported: `w-[200px]`, `text-[#ff6600]`
- **CSS variables as tokens** — all theme values are exposed as CSS vars automatically

## Theme Customization (CSS-First)

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand: oklch(60% 0.2 260);
  --font-display: "Melodrama", serif;
  --spacing-section: 120px;
}
```

Then use as utilities: `text-brand`, `font-display`, `pt-section`

## Dark Mode

```css
@theme {
  --color-bg: white;
}

@variant dark {
  --color-bg: #030304;
}
```

## Arbitrary Properties

```tsx
// CSS variables from GSAP/Three.js integration
<div className="[--blur:12px] blur-[var(--blur)]" />

// Perspective for 3D transforms
<div className="[perspective:1000px]" />
```

## Responsive Design

Tailwind v4 breakpoints are unchanged:
- `sm:` — 640px+
- `md:` — 768px+
- `lg:` — 1024px+
- `xl:` — 1280px+
- `2xl:` — 1536px+

## Performance

- No purging config needed — v4 scans files automatically
- Use `@layer utilities` to add custom utilities that get purged with the rest
- Avoid dynamic class construction (`text-${color}`) — Tailwind can't detect these

## Common Patterns in This Project

```tsx
// Overlay/glass effect
<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

// Cinematic full-viewport section
<section className="relative min-h-screen w-full overflow-hidden" />

// Pointer-events passthrough for canvas overlay
<div className="pointer-events-none fixed inset-0 z-50" />

// Text gradient
<span className="bg-gradient-to-r from-orange-400 to-rose-600 bg-clip-text text-transparent" />
```
