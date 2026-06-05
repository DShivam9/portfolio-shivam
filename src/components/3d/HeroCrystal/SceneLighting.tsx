import React from 'react';

export default function SceneLighting() {
  return (
    <group>
      {/* Absolute pitch black atmosphere, extremely minimal ambient light to maintain deep shadows */}
      <ambientLight intensity={0.05} />
      
      {/* Key Light: Very soft, diffuse directional light to gently reveal facets without creating white hotspots */}
      <directionalLight 
        position={[-5, 5, 5]} 
        intensity={0.8} 
        color="#e0ffff" 
      />
      
      {/* Rim Light 1: Sharp, grazing light from below/behind to highlight the fractured edges and silhouette */}
      <spotLight 
        position={[-10, -10, -10]} 
        intensity={20} 
        angle={0.6} 
        penumbra={1} 
        color="#ffffff" 
        distance={40}
      />

      {/* Rim Light 2: Sharp, grazing light from top/behind to trace the upper geological edges */}
      <spotLight 
        position={[10, 15, -10]} 
        intensity={25} 
        angle={0.6} 
        penumbra={1} 
        color="#aaccff" 
        distance={40}
      />
    </group>
  );
}
