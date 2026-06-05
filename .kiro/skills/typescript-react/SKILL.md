---
name: typescript-react
description: TypeScript best practices for React 19 and Next.js 16. Use when writing typed components, hooks, stores, or utility functions. Covers component props, event handlers, generics, Zustand stores, and React 19 specific patterns.
user-invocable: false
source: project-specific
---

# TypeScript + React 19 Best Practices

Tailored for this project: TypeScript 5, React 19, Next.js 16, Zustand 5.

## Component Props

```tsx
// Prefer interface for component props
interface HeroProps {
  title: string
  subtitle?: string  // optional with ?
  onComplete: () => void
}

// Use React.ComponentProps to extend HTML elements
interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "ghost"
}
```

## Event Handlers

```tsx
// Always type event handlers inline — avoids import overhead
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {}
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {}
const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {}
```

## Refs

```tsx
// useRef for DOM elements — initialize with null
const containerRef = useRef<HTMLDivElement>(null)
const canvasRef = useRef<HTMLCanvasElement>(null)

// useRef for mutable values — initialize with actual value
const progressRef = useRef<number>(0)
const tlRef = useRef<gsap.core.Timeline | null>(null)
```

## Zustand Store (v5 patterns)

```ts
// src/store/scrollStore.ts
import { create } from "zustand"

interface ScrollState {
  progress: Record<string, number>
  setProgress: (section: string, value: number) => void
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: {},
  setProgress: (section, value) =>
    set((state) => ({
      progress: { ...state.progress, [section]: value }
    }))
}))

// Access outside React (e.g., in GSAP callbacks)
useScrollStore.getState().setProgress("hero", 0.5)
```

## React 19 Patterns

```tsx
// use() hook for promises (React 19)
import { use } from "react"

function Component({ promise }: { promise: Promise<Data> }) {
  const data = use(promise) // suspends until resolved
  return <div>{data.title}</div>
}

// Async server components (Next.js App Router)
async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>{slug}</div>
}
```

## Generic Hooks

```tsx
// Type the return value explicitly when inference is ambiguous
function useScrollProgress(section: string): number {
  return useScrollStore((state) => state.progress[section] ?? 0)
}
```

## Three.js + R3F Types

```tsx
import type { Mesh, Group, BufferGeometry } from "three"
import { useRef } from "react"

const meshRef = useRef<Mesh>(null)
const groupRef = useRef<Group>(null)

// GLTF result
import { useGLTF } from "@react-three/drei"
const { scene, nodes, materials } = useGLTF("/models/phoenix_bird/scene.gltf") as GLTFResult
```

## Type Assertions

```tsx
// Prefer narrowing over `as` casts
if (element instanceof HTMLVideoElement) {
  element.play() // TS knows the type here
}

// When you must use as — be explicit
const canvas = document.getElementById("canvas") as HTMLCanvasElement
```

## Avoid

- `any` — use `unknown` and narrow, or use a proper type
- `!` non-null assertion unless absolutely certain (e.g., well-established refs)
- Type-only imports at runtime — use `import type`
- Enums — prefer `const` objects or union types (`"hero" | "about" | "projects"`)
