"use client";

import React, { useState, useRef } from 'react';
import CrystalMonolith from './CrystalMonolith';
import OrbitingTechRing from './OrbitingTechRing';
import { 
  CREATIVE_TECH, 
  CORE_ENGINEERING, 
  SYSTEMS_DEVOPS 
} from '@/constants/skillsData';
import { useScrollStore } from '@/store/scrollStore';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SkillsCrystals() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const crystal1Ref = useRef<THREE.Group>(null);
  const crystal2Ref = useRef<THREE.Group>(null);
  const crystal3Ref = useRef<THREE.Group>(null);

  // The Canvas is now 200vh tall and scrolls naturally with the page.
  // We no longer need manual scroll tracking! The crystals will stay perfectly locked to their HTML text counterparts.
  useFrame(() => {
    // We can add a gentle floating animation here instead of scroll parallax
    const time = Date.now() * 0.001;
    if (crystal1Ref.current) crystal1Ref.current.position.y = 2.07 + Math.sin(time) * 0.1;
    if (crystal2Ref.current) crystal2Ref.current.position.y = 2.9 + Math.cos(time * 0.8) * 0.1;
    if (crystal3Ref.current) crystal3Ref.current.position.y = -2.48 + Math.sin(time * 1.2) * 0.1;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 
        LOCALIZED LIGHTING RIG (No CDN dependencies!)
        We use strategically placed lights to illuminate the glass and trigger specular highlights.
      */}
      {/* Key Light: Sharp overhead spotlight to catch the top facets */}
      <spotLight position={[-10, 20, 10]} intensity={150} angle={0.2} penumbra={1} color="#ffffff" castShadow />
      
      {/* Fill Light: Soft blue light from below to illuminate the volume */}
      <pointLight position={[0, -10, 5]} intensity={80} color="#4488ff" distance={30} />
      
      {/* Rim Light: High intensity from the back to trigger the clearcoat and iridescence */}
      <spotLight position={[10, 5, -15]} intensity={200} angle={0.4} penumbra={0.5} color="#aaddff" />
      
      {/* Gentle Ambient to prevent pitch black shadows */}
      <ambientLight intensity={0.2} />
      <ambientLight intensity={0.5} />

      {/* Upper Left - Creative Tech (Matches top-[25%] in HTML) */}
      <group 
        ref={crystal1Ref}
        position={[-3.5, 2.07, 1]} 
        onPointerOver={(e) => { e.stopPropagation(); setHoveredIndex(0); }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredIndex(null); }}
      >
        <CrystalMonolith runeText="< />" scale={0.7} seed={1} />
        <OrbitingTechRing techList={CREATIVE_TECH} isHovered={hoveredIndex === 0} radius={3.0} />
      </group>

      {/* Center Right - Core Engineering (Matches top-[15%] in HTML) */}
      <group 
        ref={crystal2Ref}
        position={[2.5, 2.9, -2]} 
        onPointerOver={(e) => { e.stopPropagation(); setHoveredIndex(1); }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredIndex(null); }}
      >
        <CrystalMonolith runeText="{ }" scale={0.9} rotation={[0, Math.PI / 4, 0]} seed={42} />
        <OrbitingTechRing techList={CORE_ENGINEERING} isHovered={hoveredIndex === 1} radius={3.6} tiltX={Math.PI / 6} speed={0.2} />
      </group>

      {/* Bottom Right - Systems (Matches bottom-[20%] in HTML) */}
      <group 
        ref={crystal3Ref}
        position={[3.5, -2.48, -1]} 
        onPointerOver={(e) => { e.stopPropagation(); setHoveredIndex(2); }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredIndex(null); }}
      >
        <CrystalMonolith runeText="!!" scale={0.65} rotation={[Math.PI / 8, 0, 0]} seed={100} />
        <OrbitingTechRing techList={SYSTEMS_DEVOPS} isHovered={hoveredIndex === 2} radius={2.8} tiltZ={Math.PI / 10} />
      </group>
    </group>
  );
}
