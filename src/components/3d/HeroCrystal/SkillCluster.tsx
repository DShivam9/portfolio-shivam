import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSkillReveal } from './store';

interface SkillClusterProps {
  category: string;
  skills: string[];
  radius: number;
  speed: number;
  baseRotation: [number, number, number];
}

export default function SkillCluster({ category, skills, radius, speed, baseRotation }: SkillClusterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const status = useSkillReveal((state) => state.status);
  const isRevealed = status === 'selected';

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Extremely slow, majestic drift
      groupRef.current.rotation.y += delta * speed * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={baseRotation}>
      {/* Position the HTML container at the edge of the radius */}
      <group position={[radius, 0, 0]}>
        <Html center>
          <div 
            className={`flex flex-col items-center justify-center transition-all duration-1000 ${
              isRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
            }`}
          >
            <h3 className="text-white/80 font-serif italic text-lg mb-3 tracking-widest whitespace-nowrap">
              {category}
            </h3>
            <div className="flex flex-col gap-1 items-center">
              {skills.map((skill, idx) => (
                <div 
                  key={idx} 
                  className="text-white/40 font-sans text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 hover:text-white"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
