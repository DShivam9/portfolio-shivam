---
name: next-best-practices
description: Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling
user-invocable: false
source: https://github.com/vercel-labs/next-skills
---

# Next.js Best Practices

Apply these rules when writing or reviewing Next.js code.

## RSC Boundaries

Detect invalid React Server Component patterns.

- Async client components are INVALID — client components cannot be `async function`
- Non-serializable props (functions, Date, Map, Set, class instances) cannot be passed Server → Client
- Server Actions marked with `'use server'` ARE the exception and CAN be passed to client components

## Async Patterns (Next.js 15+)

`params`, `searchParams`, `cookies()`, and `headers()` are all **async** and must be awaited.

```tsx
// Pages
type Props = { params: Promise<{ slug: string }> }
export default async function Page({ params }: Props) {
  const { slug } = await params
}

// Synchronous components: use React.use()
import { use } from 'react'
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
}
```

## Dynamic Imports & SSR

- Use `next/dynamic` with `{ ssr: false }` for Three.js / R3F / browser-only libraries
- This is already applied in this project for `SceneCanvas` and cursor components

## Directives

- `'use client'` — needed for hooks, event handlers, browser APIs (window, document, localStorage)
- `'use server'` — for Server Actions only
- `'use cache'` — Next.js caching directive (advanced)

## Image Optimization

- Always use `next/image` over `<img>` for remote/external images
- For local static assets in `/public`, `<img>` is acceptable but `next/image` is preferred

## Font Optimization

- Use `next/font/google` (already applied — Inter + Playfair Display)
- Define fonts once in `layout.tsx`, pass via CSS variables

## Error Handling

- Use `error.tsx` for route-level error boundaries
- Use `global-error.tsx` for root layout errors
- Always include `'use client'` in error boundary files

## Bundling

- Avoid importing barrel files — import directly from source
- Use `next/dynamic` for heavy client-side-only components (Three.js, GSAP-heavy)
- Three.js / R3F MUST be dynamically imported with `ssr: false`

## Middleware rename in v16

- `middleware.ts` is now named `proxy.ts` in Next.js 16+
