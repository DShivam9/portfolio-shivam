import React from 'react';
import { EffectComposer, Bloom, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer disableNormalPass>
      {/* Controlled Bloom: High threshold so only the sharpest edges and core glow, preventing blown-out highlights */}
      <Bloom 
        luminanceThreshold={1.5} 
        luminanceSmoothing={0.5} 
        intensity={0.3} 
        mipmapBlur 
      /><ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {/* Heavy vignette to isolate the hero object in the void */}
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
