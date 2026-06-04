---
name: threejs-r3f
description: Three.js and React Three Fiber (R3F) best practices for cinematic 3D web experiences. Use when working on 3D models, shaders, animations, postprocessing, or SceneCanvas.
user-invocable: true
source: community + project-specific
---

# Three.js / React Three Fiber Best Practices

Tailored for this portfolio project: R3F v9, Three.js 0.184, @react-three/drei v10, @react-three/postprocessing v3.

## Core R3F Rules

### Never call React state setters in useFrame
```tsx
// BAD — causes re-render every frame (60fps = 60 React renders/sec)
useFrame(() => setState(newValue))

// GOOD — mutate refs directly
useFrame(() => { meshRef.current.position.y = newY })
```

### useRef for all mutable 3D state
```tsx
const position = useRef(new THREE.Vector3())
const currentProgress = useRef(0)
// Mutate directly in useFrame — no re-renders
```

### safeDelta pattern (already in this project)
```tsx
useFrame((state, delta) => {
  const safeDelta = Math.min(delta, 0.1) // Clamp for tab-resume safety
})
```

### GLTF Loading
```tsx
// Always preload at module level
useGLTF.preload('/models/my-model/scene.gltf')

// Use Suspense wrapper in Canvas
<Suspense fallback={null}>
  <MyModel />
</Suspense>
```

### Instanced Meshes for particles
```tsx
// Use InstancedMesh for repeated geometry (embers, particles)
// Set instanceMatrix.needsUpdate = true after updating matrices
meshRef.current.instanceMatrix.needsUpdate = true
```

## Lighting Setup (this project)

- `ambientLight` with `#1a103c` (deep purple) for fill
- `directionalLight` at `#ffb84d` for warm phoenix glow
- `directionalLight` white for secondary highlight
- Avoid `pointLight` spam — use directional lights for performance

## PostProcessing

```tsx
// Current setup: Bloom + ACES Filmic ToneMapping
<EffectComposer>
  <Bloom luminanceThreshold={0.2} mipmapBlur intensity={2.0} radius={0.8} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
</EffectComposer>
```
- Lower `luminanceThreshold` = more things glow
- `mipmapBlur` = smoother, more organic glow
- ACES Filmic gives cinematic tone compression

## Camera

- `fov: 45` — cinematic, not distorted
- `position: [0, 0, 10]` — looking down -Z
- Don't change camera position reactively; use a `CameraRig` component with smooth lerp

## Fog

```tsx
<fogExp2 attach="fog" args={["#030304", 0.03]} />
```
- `fogExp2` gives natural depth fall-off
- Match fog color exactly to `--bg-base` so models fade into background seamlessly

## DOM ↔ 3D Sync Pattern (this project)

- DOM sections have invisible anchor `div`s (`#bird-anchor`, `#cat-anchor`, etc.)
- 3D models read `window.scrollY` in `useFrame` to compute target positions
- Smooth lerp with `currentPos.current.lerp(target, safeDelta * speed)`
- Never use `getBoundingClientRect()` in `useFrame` — too expensive

## Model Scale Guide (this project)

- Phoenix: `scale={0.015}` — large hero model
- Minecraft models (cat, fox, tree): small decorative scale
- All models: apply scale on `<primitive object={scene} />`

## Additive Blending for emissive effects
```tsx
<meshBasicMaterial 
  color="#ffaa00" 
  transparent 
  opacity={0.6} 
  blending={THREE.AdditiveBlending} 
/>
```
- Use for fire, glow, particles — blends with scene additively (always brighter)

## Performance Checklist

- [ ] `useMemo` for particle arrays and geometry that doesn't change
- [ ] `useRef` for all per-frame mutable state
- [ ] `safeDelta` clamp on all physics
- [ ] Geometry disposed on unmount for dynamic scenes
- [ ] `pointer-events-none` on the Canvas container (already applied)
- [ ] `ssr: false` on `next/dynamic` import (already applied)
