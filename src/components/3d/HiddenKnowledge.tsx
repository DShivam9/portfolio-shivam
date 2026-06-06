"use client";

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface HiddenKnowledgeProps {
  isActive: boolean;
  specialization: string;
  years: string;
  projects: string;
}

export default function HiddenKnowledge({ isActive, specialization, years, projects }: HiddenKnowledgeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const specMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const yearsMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const projMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    // Smoothly fade in/out the text based on active state
    const targetOpacity = isActive ? 1 : 0;
    const lerpSpeed = delta * 3;
    
    if (specMatRef.current) specMatRef.current.opacity = THREE.MathUtils.lerp(specMatRef.current.opacity, targetOpacity, lerpSpeed);
    if (yearsMatRef.current) yearsMatRef.current.opacity = THREE.MathUtils.lerp(yearsMatRef.current.opacity, targetOpacity, lerpSpeed);
    if (projMatRef.current) projMatRef.current.opacity = THREE.MathUtils.lerp(projMatRef.current.opacity, targetOpacity, lerpSpeed);

    if (groupRef.current) {
      // Slight vertical floating motion for ethereal feel
      const targetY = isActive ? 0 : -0.5;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        {specialization.toUpperCase()}
        <meshBasicMaterial ref={specMatRef} transparent opacity={0} toneMapped={false} color={[2, 2, 2]} />
      </Text>
      
      <Text
        position={[0, -0.1, 0]}
        fontSize={0.15}
        color="#aaddff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {years} EXPERIENCE
        <meshBasicMaterial ref={yearsMatRef} transparent opacity={0} toneMapped={false} color={[1.5, 1.5, 2]} />
      </Text>

      <Text
        position={[0, -0.4, 0]}
        fontSize={0.15}
        color="#aaddff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {projects} PROJECTS
        <meshBasicMaterial ref={projMatRef} transparent opacity={0} toneMapped={false} color={[1.5, 1.5, 2]} />
      </Text>
    </group>
  );
}
