import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCrystalGeometry } from './CrystalGeometry';
import CrystalMaterial from './CrystalMaterial';

interface CrystalProps {
  isHovered: boolean;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
  onClick: (e: any) => void;
}

export default function Crystal({ isHovered, onPointerOver, onPointerOut, onClick }: CrystalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  
  // Generate the highly displaced, jagged non-indexed geometry once
  const geometry = useMemo(() => createCrystalGeometry(), []);
  
  // Create an intense glowing core that will be heavily distorted by the outer glass
  useFrame((state, delta) => {
    // Smooth, single-axis turntable rotation. No weird tumbling.
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
    
    // Core slowly rotates opposite
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group 
      onPointerOver={onPointerOver} 
      onPointerOut={onPointerOut} 
      onClick={onClick}
      // Slightly scale up on hover to feel reactive
      scale={isHovered ? 1.02 : 1}
    >
      {/* THE OUTER SHELL: Displaced Shattered Ice */}
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <CrystalMaterial isHovered={isHovered} />
      </mesh>

      {/* THE INNER CORE: A highly emissive, abstract glowing rune/structure */}
      <mesh ref={coreRef} scale={0.5}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={isHovered ? 3.0 : 1.0} 
          wireframe={true} 
          wireframeLinewidth={3}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}
