"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

const ShaderPlane = ({ scrollProgress }: { scrollProgress?: MotionValue<number> }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(size.width, size.height) },
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      iScroll: { value: 0 }, // New uniform for scroll sync
    }),
    [size]
  );

  // Update uniforms every frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.iResolution.value.set(size.width, size.height);
      
      const mouseX = ((pointer.x + 1) / 2) * size.width;
      // Invert Y for correct Shadertoy coordinate space
      const mouseY = ((pointer.y + 1) / 2) * size.height; 
      
      materialRef.current.uniforms.iMouse.value.set(mouseX, mouseY, 0, 0);

      // Read real-time scroll physics from Framer Motion
      const scroll = scrollProgress ? scrollProgress.get() : 0;
      materialRef.current.uniforms.iScroll.value = scroll;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Restored the original fdjfDc shader and added iScroll physics
  const fragmentShader = `
    uniform float iTime;
    uniform float iScroll;
    uniform vec2 iResolution;
    uniform vec4 iMouse;
    
    #define M iMouse
    #define R iResolution.xy
    #define PI 3.14159265358979
    #define TAU 6.283185307179586

    void mainImage( out vec4 RGBA, in vec2 XY )
    {
        vec3 c = vec3(0);
        vec2 m = (M.xy-.5*R)/R.y*2.; // mouse coords
        
        // ADDED SCROLL PHYSICS: Scroll directly advances the timeline of the fractal
        float scrollTime = iTime + (iScroll * 50.0);
        
        float t = (M.z > 0.) ? atan(m.x, -m.y): -.54+(scrollTime*TAU)/3600., // arc from time or mouse
              n = (cos(t) > 0.) ? sin(t): 1./sin(t), // t to sin/csc
              e = n*2.,                              // exponent
              z = clamp(pow(500., n), 1e-16, 1e+18); // zoom
        vec2 uv = (XY-.5*R)/R.y*2., // screen coords
              u = uv*z;             // coords with zoom
        float ro = -PI/2.,               // rotation
              cr = scrollTime*TAU/5.,         // counter rotation (massively affected by scroll)
              a = atan(u.y, u.x)-ro,     // screen arc
              i = a/TAU,                 // arc to range between +/-0.5
              r = exp(log(length(u))/e), // radius | slightly faster than pow(length(u), 1./e)
              sc = ceil(r-i),            // spiral contour
              s = pow(sc+i, 2.),         // spiral gradient
              vd = cos((sc*TAU+a)/n),    // visual denominator
              ts = cr+s/n*TAU;           // segment with time
              
        c += sin(ts/2.); // spiral 1
        c *= cos(ts);    // spiral 2
        c *= pow(abs(sin((r-i)*PI)), abs(e)+5.);    // smooth edges & thin near inf
        c *= .2+abs(vd);                            // dark folds
        c = min(c, pow(length(u)/z, -1./n));        // dark gradient
        vec3 rgb = vec3(vd+1., abs(sin(t)), 1.-vd); // color
        c += (c*2.)-(rgb*.5);                       // add color
        
        // Desaturate and darken slightly to match the vibe
        c *= 0.6;
        
        // Output final color
        RGBA = vec4(c, 1.);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

export default function CosmicDustBg({ scrollProgress, className }: { scrollProgress?: MotionValue<number>, className?: string }) {
  return (
    <div className={className ?? 'absolute inset-0 w-full h-full'}>
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
        <ShaderPlane scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
