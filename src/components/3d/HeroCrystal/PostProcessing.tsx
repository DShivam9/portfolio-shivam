import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={1.5} 
        luminanceSmoothing={0.5} 
        intensity={0.3} 
        mipmapBlur 
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
