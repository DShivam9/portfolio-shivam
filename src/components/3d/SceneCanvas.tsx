"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { Suspense } from "react";
import { ToneMappingMode } from "postprocessing";
import Lighting from "./Lighting";
import PhoenixModel from "./PhoenixModel";
import CameraRig from "./CameraRig";

export default function SceneCanvas() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
    >

      <CameraRig />
      <Lighting />

      <Suspense fallback={null}>
        <PhoenixModel />
      </Suspense>

      <EffectComposer multisampling={0}>
        {/* Slightly lower threshold so Minecraft emissive textures catch bloom */}
        <Bloom luminanceThreshold={0.15} mipmapBlur intensity={1.8} radius={0.75} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}
