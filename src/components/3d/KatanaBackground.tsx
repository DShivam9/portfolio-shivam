"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * KatanaModel — scroll-driven rotation synced with About section paragraphs.
 * Handle at top (flipped 180° on X). Full 360° rotation across the About section.
 * 5-point lighting setup for realistic metallic appearance.
 */
export default function KatanaModel() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/katana/scene.gltf");

  // Make materials look like real polished metal
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat: any) => {
            mat.transparent = false;
            mat.opacity = 1;
            mat.depthWrite = true;
            if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
              mat.metalness = 0.85;
              mat.roughness = 0.18;
              // Subtle warm tint to the metal color for a forged steel look
              if (mat.color) mat.color.setHex(0xd8cfc0);
            }
            mat.needsUpdate = true;
          });
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;

    const aboutEl = document.getElementById("about");
    if (!aboutEl) {
      group.current.visible = false;
      return;
    }

    const rect = aboutEl.getBoundingClientRect();
    const vh = window.innerHeight;

    // ── Opacity fade ──
    let targetOpacity = 0;
    if (rect.top < vh * 0.5 && rect.bottom > vh * 0.8) {
      const fadeIn = Math.min(1, (vh * 0.5 - rect.top) / (vh * 0.3));
      const fadeOut = Math.min(1, (rect.bottom - vh * 0.8) / (vh * 0.4));
      targetOpacity = Math.min(fadeIn, fadeOut);
    }

    group.current.visible = targetOpacity > 0.01;
    if (!group.current.visible) return;

    // Apply opacity to all materials
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((mat: any) => {
          mat.transparent = targetOpacity < 0.99;
          mat.opacity = targetOpacity;
        });
      }
    });

    // Fixed scale
    group.current.scale.setScalar(0.12);

    // ── Scroll-driven rotation ──
    // Map section scroll progress to a full 360° rotation
    const totalTravel = vh + rect.height;
    const scrollProgress = Math.max(0, Math.min(1, (vh - rect.top) / totalTravel));
    group.current.rotation.y = scrollProgress * Math.PI * 2;

    // ── Gentle floating bob ──
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={group} visible={false} scale={0}>
      {/* 5-POINT LIGHTING for realistic metal look */}
      {/* Key light — warm gold from top-right, main specular highlight */}
      <directionalLight position={[6, 6, 5]} intensity={4} color="#D4A853" />
      {/* Fill light — cool blue from left, fills shadows */}
      <directionalLight position={[-5, 2, 4]} intensity={2} color="#5B8FB9" />
      {/* Rim/back light — bright white from behind, creates edge highlights on metal */}
      <pointLight position={[0, 3, -6]} intensity={8} color="#ffffff" distance={20} />
      {/* Top accent — subtle warm light from above to catch the handle detail */}
      <pointLight position={[0, 8, 2]} intensity={3} color="#E8C87A" distance={15} />
      {/* Bottom bounce — faint warm light from below for ambient fill */}
      <pointLight position={[0, -5, 3]} intensity={1} color="#8B7355" distance={12} />

      {/* Flip 180° on X so handle is at top */}
      <primitive object={scene} scale={1} rotation={[Math.PI, 0, 0]} />
    </group>
  );
}
