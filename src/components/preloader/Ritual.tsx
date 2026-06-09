"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Canvas } from "@react-three/fiber";
import MascotModel from "../3d/MascotModel";
import { Environment, ContactShadows } from "@react-three/drei";

export default function Ritual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Prevent scrolling while the landing screen is active
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    // 1. Mascot fades in and floats up slightly
    tl.fromTo(mascotRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: "power3.out" }
    );

    // 2. Fade in the background glow
    tl.fromTo(bgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: "power2.out" },
      "-=1.5"
    );

    // 3. Fade in the "AWAKEN" prompt
    tl.fromTo(promptRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
      "-=1"
    );

    return () => {
      document.body.style.overflow = "auto";
      tl.kill();
    };
  }, []);

  const handleEnter = () => {
    if (isExiting) return;
    setIsExiting(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        document.body.style.overflow = "auto";
      }
    });

    // Fade out the prompt and background glow
    tl.to([promptRef.current, bgRef.current], {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });

    // The mascot blasts forward (scale up significantly) and fades out
    tl.to(mascotRef.current, {
      scale: 5,
      opacity: 0,
      duration: 1.2,
      ease: "power4.inOut"
    }, "<");

    // Fade away the entire container to reveal the site
    tl.to(containerRef.current, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 1.5,
      ease: "power2.inOut",
    }, "-=0.8");
  };

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] cursor-pointer overflow-hidden backdrop-blur-xl"
      onClick={handleEnter}
    >
      {/* Subtle Ethereal Background Glow */}
      <div 
        ref={bgRef}
        className="absolute inset-0 pointer-events-none opacity-0 flex items-center justify-center"
      >
        <div className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#E8A84A] blur-[120px] opacity-10" />
      </div>

      {/* The 3D Mascot */}
      <div 
        ref={mascotRef}
        className="relative w-full h-full max-w-[800px] max-h-[800px]"
        style={{ willChange: 'transform, opacity' }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#E8A84A" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A90E2" />
          
          <MascotModel scale={1.5} active={isExiting} />
          
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div 
        ref={promptRef}
        className="absolute bottom-12 font-mono uppercase tracking-[0.4em] text-[10px] md:text-xs text-[#E8A84A]/80 animate-pulse pointer-events-none"
      >
        [ WAKE THE MASCOT ]
      </div>
    </div>
  );
}
