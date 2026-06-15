"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/narrative/Hero";
import Gateway from "@/components/narrative/Gateway";
import About from "@/components/narrative/About";
import Projects from "@/components/narrative/Projects";
import Skills from "@/components/narrative/Skills";
import Contact from "@/components/narrative/Contact";
import CustomCursor from "@/components/cursor/CustomCursor";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const SceneCanvas = dynamic(() => import("@/components/3d/SceneCanvas"), { ssr: false });
const SplashCursor = dynamic(() => import("@/components/cursor/SplashCursor"), { ssr: false });
const GlobalEnvironment = dynamic(() => import("@/components/ui/GlobalEnvironment"), { ssr: false });

export default function Home() {
  
  return (
    <main className="relative w-full min-h-screen bg-bg-base text-text-primary selection:bg-text-primary selection:text-bg-base">
      <CustomCursor />
      <SplashCursor />
      <Navbar />
      
      {/* GLOBAL ATMOSPHERE LAYER (Interactive Framer Motion) */}
      <GlobalEnvironment />
      
      {/* 3D LAYER - FIXED IN BACKGROUND */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <ErrorBoundary>
          <SceneCanvas />
        </ErrorBoundary>
      </div>

      {/* DOM CONTENT LAYER */}
      <div className="relative z-10 w-full mx-auto">
        <Hero />
        
        <Gateway title="Beyond the" highlight="Syntax" variant="scale" />
        <div className="py-24 md:py-48">
          <About />
        </div>
        
        <Gateway title="The Monolith of" highlight="Craft" variant="rotate" />
        <div className="py-8 md:py-16">
          <Skills />
        </div>
        
        <Gateway title="What I've" highlight="Built" variant="scale" />
        <div className="py-24 md:py-48">
          <Projects />
        </div>
        
        <Contact />
      </div>
    </main>
  );
}
