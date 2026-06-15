import React from "react";
import Image from "next/image";
import { IconType } from "react-icons";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss, SiHtml5, SiCss, SiVite, SiVercel,
  SiNodedotjs, SiExpress, SiPostgresql, SiMysql, SiFirebase, SiGit, SiGithub,
  SiThreedotjs, SiWebgl, SiGreensock, SiFramer, SiFigma,
  SiAnthropic, SiGoogle, SiOpengl
} from "react-icons/si";
import { FaRobot, FaProjectDiagram } from "react-icons/fa";

// ── CUSTOM ICON WRAPPERS TO MATCH SIZING ──

const IconWrapper = ({ Icon, color }: { Icon: IconType, color?: string }) => (
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
  { id: "threejs", name: "Three.js", desc: "Integrating ready-made 3D components to build interactive models and scenes.", IconComponent: () => <IconWrapper Icon={SiThreedotjs} /> },
  { id: "webgl", name: "WebGL", desc: "Creating rich web graphics using high-level 3D library abstractions.", IconComponent: () => <IconWrapper Icon={SiWebgl} color="#990000" /> },
  { id: "glsl", name: "GLSL Shaders", desc: "Adding custom visual effects using community-crafted shader components.", IconComponent: () => <IconWrapper Icon={SiOpengl} color="#5586A4" /> },
  { id: "gsap", name: "GSAP", desc: "Building smooth, cinematic scroll animations and complex timelines.", IconComponent: () => <IconWrapper Icon={SiGreensock} color="#88CE02" /> },
  { id: "framer", name: "Framer Motion", desc: "Adding fluid, spring-based animations and page transitions to React apps.", IconComponent: () => <IconWrapper Icon={SiFramer} color="#0055FF" /> },
  { id: "figma", name: "Figma", desc: "Designing layouts, prototyping interfaces, and collaborating on UI mockups.", IconComponent: () => <IconWrapper Icon={SiFigma} color="#F24E1E" /> }
];

export const CORE_ENGINEERING: TechItem[] = [
  { id: "javascript", name: "JavaScript", desc: "The core language I use to add interactivity and logic to web pages.", IconComponent: () => <IconWrapper Icon={SiJavascript} color="#F7DF1E" /> },
  { id: "react", name: "React.js", desc: "Building dynamic, component-based user interfaces.", IconComponent: () => <IconWrapper Icon={SiReact} color="#61DAFB" /> },
  { id: "nextjs", name: "Next.js", desc: "Building fast, production-ready React applications with server-side rendering.", IconComponent: () => <IconWrapper Icon={SiNextdotjs} /> },
  { id: "tailwind", name: "Tailwind CSS", desc: "Styling websites quickly and consistently using utility classes.", IconComponent: () => <IconWrapper Icon={SiTailwindcss} color="#06B6D4" /> },
  { id: "html5", name: "HTML5", desc: "Structuring web content with clean, accessible, and semantic markup.", IconComponent: () => <IconWrapper Icon={SiHtml5} color="#E34F26" /> },
  { id: "css3", name: "CSS3", desc: "Designing responsive layouts, smooth animations, and custom styling.", IconComponent: () => <IconWrapper Icon={SiCss} color="#1572B6" /> },
  { id: "vite", name: "Vite", desc: "A lightning-fast build tool for modern web projects.", IconComponent: () => <IconWrapper Icon={SiVite} color="#646CFF" /> },
  { id: "vercel", name: "Vercel", desc: "Deploying and hosting web applications on a fast, global edge network.", IconComponent: () => <IconWrapper Icon={SiVercel} /> }
];

export const SYSTEMS_DEVOPS: TechItem[] = [
  { id: "nodejs", name: "Node.js", desc: "Running JavaScript on the server to build fast and scalable backends.", IconComponent: () => <IconWrapper Icon={SiNodedotjs} color="#5FA04E" /> },
  { id: "mysql", name: "MySQL", desc: "Storing and querying structured relational data.", IconComponent: () => <IconWrapper Icon={SiMysql} color="#4479A1" /> },
  { id: "firebase", name: "Firebase (Firestore)", desc: "Adding user authentication and real-time database capabilities.", IconComponent: () => <IconWrapper Icon={SiFirebase} color="#FFCA28" /> },
  { id: "git", name: "Git", desc: "Tracking code changes and managing project versions locally.", IconComponent: () => <IconWrapper Icon={SiGit} color="#F05032" /> },
  { id: "github", name: "GitHub", desc: "Hosting code, collaborating with others, and automating deployments.", IconComponent: () => <IconWrapper Icon={SiGithub} /> },
  { id: "cloudflare", name: "Cloudflare", desc: "Protecting websites and speeding them up using a global edge network.", IconComponent: () => <Image src="/icons/cloudflare.svg" alt="Cloudflare" width={30} height={30} className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> }
];

export const INTELLIGENT_AGENTS: TechItem[] = [
  { id: "claude", name: "Claude", desc: "My go-to AI assistant for writing code, debugging, and solving complex problems.", IconComponent: () => <Image src="/icons/claude.svg" alt="Claude" width={60} height={60} className="h-[48px] md:h-[60px] w-auto object-contain brightness-0 invert" /> },
  { id: "antigravity", name: "Google Antigravity", desc: "An advanced AI agent that pair-programs with me directly inside my workspace.", IconComponent: () => <Image src="/icons/antigravity.svg" alt="Google Antigravity" width={30} height={30} className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> },
  { id: "gemini", name: "Google Gemini", desc: "A powerful AI model I use for deep reasoning and multimodal analysis.", IconComponent: () => <Image src="/icons/google-gemini.svg" alt="Google Gemini" width={30} height={30} className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> },
  { id: "manus", name: "Manus", desc: "An autonomous AI agent that handles long-running research and complex workflows.", IconComponent: () => <Image src="/icons/manus.svg" alt="Manus" width={30} height={30} className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> },
  { id: "shadcn", name: "Shadcn UI", desc: "A collection of beautifully designed, fully customizable UI components.", IconComponent: () => <Image src="/icons/shadcn-ui.svg" alt="Shadcn UI" width={30} height={30} className="h-[24px] md:h-[30px] w-auto object-contain brightness-0 invert" /> }
];
