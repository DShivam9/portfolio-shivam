import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Crystal from './Crystal';
import SceneLighting from './SceneLighting';
import PostProcessing from './PostProcessing';
import CameraController from './CameraController';
import SkillCluster from './SkillCluster';
import { useSkillReveal } from './store';

const FRONTEND_SKILLS = ["React", "Next.js", "Three.js", "WebGL", "GSAP", "TailwindCSS", "TypeScript"];
const BACKEND_SKILLS = ["Node.js", "Python", "PostgreSQL", "Redis", "Docker", "AWS", "GraphQL"];
const DESIGN_SKILLS = ["Figma", "UI/UX", "Motion Design", "Spline", "Cinema4D", "Shaders"];

export default function HeroCrystalScene() {
  const status = useSkillReveal((state) => state.status);
  const setStatus = useSkillReveal((state) => state.setStatus);

  return (
    <div className="w-full h-full absolute inset-0 bg-black cursor-crosshair">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={['#000000']} />
        
        <CameraController />
        <SceneLighting />
        
        <Suspense fallback={null}>
          <Environment preset="studio" />
          
          <group position={[0, -1.5, 0]}>
            <Crystal 
              isHovered={status === 'hovered' || status === 'selected'}
              onPointerOver={() => {
                if (status !== 'selected') setStatus('hovered');
              }}
              onPointerOut={() => {
                if (status !== 'selected') setStatus('idle');
              }}
              onClick={() => {
                setStatus(status === 'selected' ? 'idle' : 'selected');
              }}
            />
            
            <SkillCluster 
              category="Frontend" 
              skills={FRONTEND_SKILLS} 
              radius={4} 
              speed={0.2} 
              baseRotation={[0, 0, 0]} 
            />
            <SkillCluster 
              category="Backend" 
              skills={BACKEND_SKILLS} 
              radius={5} 
              speed={-0.15} 
              baseRotation={[Math.PI / 4, 0, Math.PI / 8]} 
            />
            <SkillCluster 
              category="Design" 
              skills={DESIGN_SKILLS} 
              radius={4.5} 
              speed={0.25} 
              baseRotation={[-Math.PI / 4, 0, -Math.PI / 8]} 
            />
          </group>
          
          <PostProcessing />
        </Suspense>
      </Canvas>
      
      {/* HTML OVERLAY: Minimalist Instructions */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 tracking-[0.4em] text-[10px] uppercase font-light pointer-events-none transition-opacity duration-1000" 
        style={{ opacity: status === 'hovered' ? 1 : 0 }}
      >
        [ DISCOVER ]
      </div>
    </div>
  );
}
