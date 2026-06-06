import React from "react";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiHtml5, SiCss, SiVite, SiVercel,
  SiNodedotjs, SiExpress, SiPostgresql, SiMysql, SiFirebase, SiGit, SiGithub,
  SiThreedotjs, SiWebgl, SiGreensock, SiFramer, SiFigma,
  SiAnthropic, SiGoogle, SiOpengl
} from "react-icons/si";
import { FaRobot, FaProjectDiagram } from "react-icons/fa";

// ── CUSTOM ICON WRAPPERS TO MATCH SIZING ──

const IconWrapper = ({ Icon, color }: { Icon: React.ElementType, color?: string }) => (
  <Icon className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]" style={{ color: color || 'inherit' }} />
);

export interface TechItem {
  id: string;
  name: string;
  desc: string;
  IconComponent: React.ComponentType;
}

// ── 4 CATEGORY ARRAYS FOR INTERACTIVE DIRECTORY ──

export const CREATIVE_TECH: TechItem[] = [
  { id: "threejs", name: "Three.js", desc: "Interactive 3D scene graphs and WebGL graphics maps.", IconComponent: () => <IconWrapper Icon={SiThreedotjs} /> },
  { id: "webgl", name: "WebGL", desc: "GPU pipeline access and low-level custom render buffers.", IconComponent: () => <IconWrapper Icon={SiWebgl} color="#990000" /> },
  { id: "glsl", name: "GLSL Shaders", desc: "Custom fragment shaders, procedural noise, and raymarching.", IconComponent: () => <IconWrapper Icon={SiOpengl} color="#5586A4" /> },
  { id: "gsap", name: "GSAP", desc: "High-frequency cinematic scroll and timeline tweening physics.", IconComponent: () => <IconWrapper Icon={SiGreensock} color="#88CE02" /> },
  { id: "framer", name: "Framer Motion", desc: "Declarative spring physics and custom route transitions.", IconComponent: () => <IconWrapper Icon={SiFramer} color="#0055FF" /> },
  { id: "figma", name: "Figma", desc: "Collaborative mockups, layout coordinates, and responsive vector grids.", IconComponent: () => <IconWrapper Icon={SiFigma} color="#F24E1E" /> }
];

export const CORE_ENGINEERING: TechItem[] = [
  { id: "javascript", name: "JavaScript", desc: "Dynamic script loops, DOM integrations, and Web API hooks.", IconComponent: () => <IconWrapper Icon={SiJavascript} color="#F7DF1E" /> },
  { id: "typescript", name: "TypeScript", desc: "Compile-time strict type safety and generic schemas.", IconComponent: () => <IconWrapper Icon={SiTypescript} color="#3178C6" /> },
  { id: "react", name: "React.js", desc: "Declarative component trees, virtual DOM diffing, and state render loops.", IconComponent: () => <IconWrapper Icon={SiReact} color="#61DAFB" /> },
  { id: "nextjs", name: "Next.js", desc: "Production App Router structures, SSR, and SSG rendering pipelines.", IconComponent: () => <IconWrapper Icon={SiNextdotjs} /> },
  { id: "tailwind", name: "Tailwind CSS", desc: "Utility-first design token configurations and responsive theme states.", IconComponent: () => <IconWrapper Icon={SiTailwindcss} color="#06B6D4" /> },
  { id: "html5", name: "HTML5", desc: "Semantic structural layers, browser layout guidelines, and SEO accessibility nodes.", IconComponent: () => <IconWrapper Icon={SiHtml5} color="#E34F26" /> },
  { id: "css3", name: "CSS3", desc: "Cascading style trees, responsive designs, custom tokens, and layout physics rules.", IconComponent: () => <IconWrapper Icon={SiCss} color="#1572B6" /> },
  { id: "vite", name: "Vite", desc: "Fast dev server bundling, hot modules replacement, and production assets.", IconComponent: () => <IconWrapper Icon={SiVite} color="#646CFF" /> },
  { id: "vercel", name: "Vercel", desc: "Global edge network caching and instant serverless CDN deployments.", IconComponent: () => <IconWrapper Icon={SiVercel} /> }
];

export const SYSTEMS_DEVOPS: TechItem[] = [
  { id: "nodejs", name: "Node.js", desc: "Scalable event-driven event loop and server-side code runtimes.", IconComponent: () => <IconWrapper Icon={SiNodedotjs} color="#5FA04E" /> },
  { id: "express", name: "Express.js", desc: "RESTful HTTP server routers, custom request middlewares, and API payload handlers.", IconComponent: () => <IconWrapper Icon={SiExpress} /> },
  { id: "postgresql", name: "PostgreSQL", desc: "Relational database queries, indexing, and connection pools.", IconComponent: () => <IconWrapper Icon={SiPostgresql} color="#4169E1" /> },
  { id: "mysql", name: "MySQL", desc: "Structured data storage, database indexing, and schema transactions.", IconComponent: () => <IconWrapper Icon={SiMysql} color="#4479A1" /> },
  { id: "firebase", name: "Firebase (Firestore)", desc: "Cloud document databases, user auth flows, and real-time listeners.", IconComponent: () => <IconWrapper Icon={SiFirebase} color="#FFCA28" /> },
  { id: "git", name: "Git", desc: "Local source control history, commit registers, and branch hooks.", IconComponent: () => <IconWrapper Icon={SiGit} color="#F05032" /> },
  { id: "github", name: "GitHub", desc: "Remote code synchronization, pull reviews, and automated actions.", IconComponent: () => <IconWrapper Icon={SiGithub} /> }
];

export const INTELLIGENT_AGENTS: TechItem[] = [
  { id: "claude", name: "Claude", desc: "Autonomous local shell logic and context-guided code refactoring.", IconComponent: () => <img src="/icons/claude.svg" alt="Claude" className="h-[48px] md:h-[60px] w-auto object-contain brightness-0 invert" /> },
  { id: "antigravity", name: "Google Antigravity", desc: "Advanced pair-programming interactions and automated workspace safety.", IconComponent: () => <img src="/icons/antigravity.svg" alt="Google Antigravity" className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> },
  { id: "gemini", name: "Google Gemini", desc: "Multimodal AI models and advanced reasoning engines.", IconComponent: () => <img src="/icons/google-gemini.svg" alt="Google Gemini" className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> },
  { id: "manus", name: "Manus", desc: "Sequential workflow automation and system loop orchestration.", IconComponent: () => <img src="/icons/manus.svg" alt="Manus" className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> }
];
