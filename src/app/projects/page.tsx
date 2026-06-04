"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code, ArrowLeft } from "lucide-react";

const ALL_PROJECTS = [
  {
    id: "01",
    title: "Campusly",
    description: "A scalable PERN stack campus management platform serving 4 distinct user roles. Features real-time GPS bus tracking and RBAC.",
    tech: ["PostgreSQL", "Express", "React", "Node.js", "PostGIS", "Firebase", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    video: "", 
    live: "#",
    github: "#",
    category: "Full Stack"
  },
  {
    id: "02",
    title: "RetroRift",
    description: "A browser-based platform to play classic retro games. Cinematic arcade-inspired UI built with WebGL and WebAssembly.",
    tech: ["React", "Vite", "WebGL", "WebAssembly", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    live: "https://www.retrorift.online/",
    github: "https://github.com/DShivam9/RetroRift",
    category: "Web App"
  },
  {
    id: "03",
    title: "SNIPCAST",
    description: "Generate beautiful, share-ready images from your code snippets in seconds. Developer-first interface with Next.js 14.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    live: "https://codesnippt.vercel.app",
    github: "https://github.com/DShivam9/SNIPCAST",
    category: "Tool"
  },
  {
    id: "04",
    title: "HEIC Studio",
    description: "Drag-and-drop tool to convert iPhone HEIC photos to JPG/PNG instantly. Client-side processing for privacy.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop",
    live: "https://www.heicstudio.space/",
    github: "https://github.com/DShivam9/HEIC-STUDIO",
    category: "Tool"
  },
  {
    id: "05",
    title: "WeatherEye",
    description: "Real-time weather app with dynamic themes, dark mode, and animated visuals.",
    tech: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=2065&auto=format&fit=crop",
    live: "https://dshivam9.github.io/WeatherEye/",
    github: "https://github.com/DShivam9/WeatherEye",
    category: "Web App"
  },
  {
    id: "06",
    title: "OSCORP",
    description: "Stunning 3D landing page with smooth motion interactions and scroll-driven cinematic experience.",
    tech: ["HTML", "CSS", "JavaScript", "Spline 3D"],
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop",
    live: "https://dshivam9.github.io/Immersive-Landing-Page/",
    github: "https://github.com/DShivam9/Immersive-Landing-Page",
    category: "3D Web"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const }
  }
};

export default function ProjectsPage() {
  return (
    <main className="relative w-full min-h-screen bg-black text-text-primary selection:bg-accent selection:text-black overflow-x-hidden pt-24 pb-24">
      
      {/* Background ambient light */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-20 lg:px-32 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col gap-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="flex flex-col gap-4 mt-8"
          >
            <span className="text-mono text-accent tracking-widest text-sm uppercase opacity-80 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-accent" />
              Complete Archive
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-text-primary">
              All Projects
            </h1>
            <p className="font-light text-white/60 text-lg md:text-xl max-w-2xl mt-4">
              A comprehensive collection of my work, experiments, and open-source contributions. Ranging from scalable full-stack applications to immersive 3D web experiences.
            </p>
          </motion.div>
        </div>

        {/* Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12"
        >
          {ALL_PROJECTS.map((project, idx) => (
            <motion.div 
              key={project.id}
              variants={itemVariants}
              className="group relative flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors duration-500"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-video overflow-hidden bg-black/50">
                <Image 
                  src={project.image} 
                  alt={project.title}
                  fill
                  className="object-cover object-center grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[0.43,0.13,0.23,0.96]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-white/80 uppercase">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow p-6 md:p-8 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-mono text-accent/80 text-xs tracking-widest">{project.id}</span>
                  <div className="flex gap-3">
                    {project.github && project.github !== "#" && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                        <Code className="w-5 h-5" />
                      </a>
                    )}
                    {project.live && project.live !== "#" && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-white group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="font-light text-sm text-white/60 leading-relaxed flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                  {project.tech.map((t, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-mono tracking-wider text-white/50 bg-white/5 rounded px-2 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </main>
  );
}
