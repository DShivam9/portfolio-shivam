"use client";

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export interface TechItem {
  id: string;
  name: string;
  IconComponent: React.ComponentType;
}

interface OrbitingTechRingProps {
  techList: TechItem[];
  radius?: number;
  tiltX?: number;
  tiltZ?: number;
  speed?: number;
  isHovered: boolean;
}

export default function OrbitingTechRing({ 
  techList, 
  radius = 2.8, 
  tiltX = Math.PI / 8, 
  tiltZ = -Math.PI / 12,
  speed = 0.15,
  isHovered 
}: OrbitingTechRingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const htmlRefs = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  useEffect(() => {
    if (isHovered) {
      gsap.to(groupRef.current?.scale || {}, {
        x: 1, y: 1, z: 1,
        duration: 0.8,
        ease: "expo.out"
      });
      htmlRefs.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, { opacity: 1, scale: 1, duration: 0.6, delay: i * 0.05, ease: "back.out(1.5)" });
        }
      });
    } else {
      gsap.to(groupRef.current?.scale || {}, {
        x: 0.8, y: 0.8, z: 0.8,
        duration: 0.8,
        ease: "expo.out"
      });
      htmlRefs.current.forEach((el) => {
        if (el) {
          gsap.to(el, { opacity: 0, scale: 0.5, duration: 0.4, ease: "power2.in" });
        }
      });
    }
  }, [isHovered]);

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
        {techList.map((tech, index) => {
          const angle = (index / techList.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <group key={tech.id} position={[x, 0, z]}>
              <Html center transform={false} zIndexRange={[100, 0]}>
                <div 
                  ref={el => { htmlRefs.current[index] = el; }}
                  className="flex flex-col items-center gap-2 opacity-0 scale-50 pointer-events-none select-none"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
                    <tech.IconComponent />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {tech.name}
                  </span>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
