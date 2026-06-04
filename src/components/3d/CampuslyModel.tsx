"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { useScrollStore } from "@/store/scrollStore";

export default function CampuslyModel() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const safeDelta = Math.min(delta, 0.1);
    
    // Project 1 (Campusly) is Text Left, Model Right. So X is positive.
    const targetX = 3.5; 
    // Viewport 4 (Chapter 1, 2, 3, 4a) = 4 * -8.3 = -33.2
    const targetY = -33.2; 
    
    const targetPos = new THREE.Vector3(targetX, targetY, -12);
    
    meshRef.current.position.lerp(targetPos, safeDelta * 2.5);
    
    // Read Scroll Progress from Zustand
    const relic2Progress = useScrollStore.getState().progress.relic2;

    // Twist effect
    const twist = relic2Progress * Math.PI * 4;
    meshRef.current.rotation.y += safeDelta * (0.2 + twist);
    meshRef.current.rotation.x += safeDelta * (0.1 + twist * 0.5);

    // Dissipate effect
    if (relic2Progress > 0.5) {
      const exitProgress = (relic2Progress - 0.5) * 2;
      const scale = 1 - Math.pow(exitProgress, 2);
      meshRef.current.scale.set(scale, scale, scale);
    } else {
      // Entrance twist scale
      const enterProgress = relic2Progress * 2; // 0 to 1
      const scale = Math.min(enterProgress * 2, 1);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={meshRef} position={[0, -33.2, -15]}>
      <Float
        speed={1.5}
        rotationIntensity={1}
        floatIntensity={2}
      >
        <group scale={3}>
          {/* Core Structure */}
          <mesh>
            <torusKnotGeometry args={[1, 0.3, 128, 16]} />
            <meshStandardMaterial 
              color="#A3B18A" // var(--rune-campusly) Sage Green
              wireframe
              emissive="#A3B18A"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Inner Core */}
          <mesh>
            <octahedronGeometry args={[0.8]} />
            <meshStandardMaterial 
              color="#D9F0C4" 
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
