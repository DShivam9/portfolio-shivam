"use client";

import React, { useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import CinematicCanvasBg from "./CinematicCanvasBg";
import CosmicDustBg from "./CosmicDustBg";

export default function GlobalEnvironment() {
  const { scrollYProgress } = useScroll();

  // Smooth scroll physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001
  });

  // ==========================================
  // CURSOR INTERACTIVITY (3D TILT PHYSICS)
  // ==========================================
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize cursor position from -1 to 1 based on screen size
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Apply heavy spring physics so the video tilts fluidly and carries weight
  const smoothMouseX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Map normalized mouse coordinates to 3D rotation degrees
  const rotateX = useTransform(smoothMouseY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-8, 8]);

  // Add slight positional shift for extra depth parallax
  const xOffset = useTransform(smoothMouseX, [-1, 1], ["-2%", "2%"]);
  const yOffset = useTransform(smoothMouseY, [-1, 1], ["-2%", "2%"]);

  // Scroll parallax
  const scrollY = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

  // Combine scroll parallax with mouse parallax
  const yFinal = useTransform(() => `calc(${scrollY.get()} + ${yOffset.get()})`);

  // Color grading
  const overlayOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0, 0.3, 0.6]);

  // Using the original working Cloudfront video, but applying intense CSS VFX 
  // to completely invert and transform it into a dark magical/ethereal void.
  const FLUID_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020202]"
    >
      {/* 
        ====================================================
        THE SHADERTOY WEBGL BACKGROUND
        (Temporarily disabled by user request)
        ====================================================
      */}
      {/* <CosmicDustBg scrollProgress={smoothProgress} className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen" /> */}
      
      {/* 
        ====================================================
        VIGNETTE / FOCAL MASK
        A massive black radial gradient that fades out the edges 
        of the shader, ensuring the center 3D models (Phoenix) 
        and text remain the absolute focal point of the page.
        ====================================================
      */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#020202_80%)] pointer-events-none" />
      
      {/* 
        ====================================================
        NOISE TEXTURE (FILM GRAIN)
        Adds cinematic texture over the raw WebGL output
        ====================================================
      */}
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
