import React from 'react';
import { MeshTransmissionMaterial } from '@react-three/drei';

interface CrystalMaterialProps {
  isHovered: boolean;
}

export default function CrystalMaterial({ isHovered }: CrystalMaterialProps) {
  return (
    <MeshTransmissionMaterial
      backside={false}         
      thickness={3.0}          // High volume to give it heavy, dense ice/rock weight
      roughness={0.15}         // Frost the glass so it feels organic and catches the sharp fractures
      transmission={1.0}       
      ior={1.35}               // Ice/Water IOR
      chromaticAberration={0.03} // Keep extremely low to prevent the noisy TV static rendering artifacts
      anisotropy={0.2}
      envMapIntensity={0.15}   // Highly controlled reflections so the studio doesn't wash out the crystal
      clearcoat={0.1}          // Extremely low clearcoat to avoid massive specular hotspots
      clearcoatRoughness={0.5} // Rough clearcoat diffuses any remaining hotspots softly across the surface
      color={isHovered ? "#ffffff" : "#d8ebff"} // Pale glacial ice tint
      attenuationDistance={8}  // Deep light absorption
      attenuationColor="#aaccff"
      resolution={1024}
      samples={6}
    />
  );
}
