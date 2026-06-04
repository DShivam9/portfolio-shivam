"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";
import { useScrollStore } from "@/store/scrollStore";

export default function RetroKitModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Create refs for individual floating bits
  const bitsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !bitsRef.current) return;
    const safeDelta = Math.min(delta, 0.1);
    
    // Project 2 (RetroKit) is Text Right, Model Left. So X is negative.
    const targetX = -3.5; 
    // Viewport 5 (Chapter 1, 2, 3, 4a, 4b) = 5 * -8.3 = -41.5
    const targetY = -41.5; 
    
    const targetPos = new THREE.Vector3(targetX, targetY, -12);
    
    meshRef.current.position.lerp(targetPos, safeDelta * 2.5);
    
    // Read Scroll Progress from Zustand
    const relic3Progress = useScrollStore.getState().progress.relic3;

    // Orbiting motion for bits
    bitsRef.current.rotation.y -= safeDelta * 0.3;
    bitsRef.current.rotation.z += safeDelta * 0.1;

    // Assemble and Shatter Logic
    let scatterAmount = 0;
    if (relic3Progress < 0.5) {
      // Assemble: 0 to 0.5 -> scatter decreases from max to 0
      scatterAmount = (0.5 - relic3Progress) * 10;
    } else {
      // Shatter: 0.5 to 1.0 -> scatter increases from 0 to max
      scatterAmount = (relic3Progress - 0.5) * 15;
    }

    // Apply scatter to children
    bitsRef.current.children.forEach((child, i) => {
      const angle = (i / 5) * Math.PI * 2;
      // Base radius is 2
      const radius = 2 + scatterAmount * (1 + (i % 2) * 0.5); // Vary scatter per child
      
      child.position.lerp(new THREE.Vector3(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * scatterAmount
      ), safeDelta * 5);
    });
  });

  return (
    <group ref={meshRef} position={[0, -41.5, -15]}>
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={1.5}
      >
        <group scale={2.5}>
          {/* Main Crystal */}
          <mesh>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#5A189A" // var(--rune-component) Violet
              roughness={0.2}
              metalness={0.9}
              emissive="#3C096C"
              emissiveIntensity={0.5}
            />
          </mesh>
          
          {/* Orbiting UI fragments */}
          <group ref={bitsRef}>
            {[...Array(5)].map((_, i) => (
              <mesh key={i} position={[
                Math.sin((i / 5) * Math.PI * 2) * 2,
                Math.cos((i / 5) * Math.PI * 2) * 2,
                0
              ]}>
                <boxGeometry args={[0.4, 0.4, 0.4]} />
                <meshStandardMaterial 
                  color="#E0AAFF"
                  wireframe
                  emissive="#7B2CBF"
                  emissiveIntensity={0.8}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>
    </group>
  );
}
