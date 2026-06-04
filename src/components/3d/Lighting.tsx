"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

// Section accent colors
// sec1 (0.02–0.40): warm amber — nostalgia / craft
// sec2 (0.35–0.72): sage green — systems thinking
// sec3 (0.68–1.0 ): cool cyan — perspective / balance
const COLOR_SEC1 = new THREE.Color("#C8822A"); // amber-gold
const COLOR_SEC2 = new THREE.Color("#7BAF6E"); // sage green
const COLOR_SEC3 = new THREE.Color("#4A9EBF"); // cool cyan

const accentColor = new THREE.Color();

export default function Lighting() {
  const orbitRef    = useRef<THREE.PointLight>(null);
  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const accentRef   = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    const cameraY = state.camera.position.y;
    const time    = state.clock.getElapsedTime();
    const aboutP  = useScrollStore.getState().progress.about;

    // ── Orbiting warm fill light ─────────────────────────────────────────────
    if (orbitRef.current) {
      orbitRef.current.position.x = Math.sin(time * 0.5) * 6;
      orbitRef.current.position.z = Math.cos(time * 0.5) * 6 + 2;
      orbitRef.current.position.y = cameraY + Math.sin(time * 0.3) * 2;
    }

    // ── Camera-tracking directional lights ───────────────────────────────────
    if (dirLightRef.current) dirLightRef.current.position.y = cameraY + 2;
    if (keyLightRef.current) keyLightRef.current.position.y = cameraY + 5;

    // ── About section accent light ───────────────────────────────────────────
    // Lerps between the three section colors based on scroll progress.
    // Intensity ramps in as the About section becomes active.
    if (accentRef.current) {
      // Color blend: sec1 → sec2 → sec3
      if (aboutP < 0.35) {
        accentColor.copy(COLOR_SEC1);
      } else if (aboutP < 0.68) {
        const t = (aboutP - 0.35) / 0.33; // 0→1 between sec1 & sec2
        accentColor.lerpColors(COLOR_SEC1, COLOR_SEC2, t);
      } else {
        const t = (aboutP - 0.68) / 0.32; // 0→1 between sec2 & sec3
        accentColor.lerpColors(COLOR_SEC2, COLOR_SEC3, t);
      }
      accentRef.current.color.lerp(accentColor, safeDelta * 1.5);

      // Intensity: ramp in when About is active, ramp out when done
      let targetIntensity = 0;
      if (aboutP > 0.02 && aboutP < 0.95) {
        const fadeIn  = Math.min(1, (aboutP - 0.02) / 0.08);
        const fadeOut = Math.min(1, (0.95 - aboutP) / 0.05);
        targetIntensity = Math.min(fadeIn, fadeOut) * 4.0;
      }
      accentRef.current.intensity = THREE.MathUtils.lerp(
        accentRef.current.intensity,
        targetIntensity,
        safeDelta * 2.0
      );

      // Accent light follows camera Y + gentle oscillation
      accentRef.current.position.y = cameraY + Math.sin(time * 0.4) * 1.5;
      accentRef.current.position.x = Math.sin(time * 0.3) * 3;
      accentRef.current.position.z = Math.cos(time * 0.2) * 2 + 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#E8E0CC" />

      {/* Key light — warm gold, follows camera */}
      <directionalLight
        ref={keyLightRef}
        position={[5, 5, 5]}
        intensity={2.0}
        color="#C8822A"
      />

      {/* Fill light — cool blue, follows camera */}
      <directionalLight
        ref={dirLightRef}
        position={[-5, 2, 5]}
        intensity={1.0}
        color="#4A9EBF"
      />

      {/* Orbiting warm point light */}
      <pointLight
        ref={orbitRef}
        intensity={3.0}
        color="#E8A84A"
        distance={20}
      />

      {/* About section: reactive accent point light, starts dim */}
      <pointLight
        ref={accentRef}
        intensity={0}
        distance={18}
        position={[0, 0, 3]}
      />
    </>
  );
}
