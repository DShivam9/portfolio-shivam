"use client";

import React from "react";

export default function GlobalEnvironment() {
  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020202]"
    >
      {/* Vignette / Focal Mask — keeps 3D models and text as the focal point */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#020202_80%)] pointer-events-none" />
      
      {/* Film Grain Noise Texture */}
      <div 
        className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
