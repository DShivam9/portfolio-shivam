export const ALL_PROJECTS = [
  {
    id: "01",
    title: "Campusly",
    description: "A scalable PERN stack campus management platform serving 4 distinct user roles. Features real-time GPS bus tracking and RBAC.",
    shortDescription: "Decentralized school infrastructure orchestration with real-time mapping arrays.",
    tech: ["PostgreSQL", "Express", "React", "Node.js", "PostGIS", "Firebase", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    video: "", 
    live: "#",
    github: "https://github.com/DShivam9/Campusly",
    category: "Full Stack"
  },
  {
    id: "02",
    title: "RetroRift",
    description: "A browser-based platform to play classic retro games. Cinematic arcade-inspired UI built with WebGL and WebAssembly.",
    shortDescription: "High-performance retro console emulation running entirely in the browser.",
    tech: ["React", "Vite", "WebGL", "WebAssembly", "Tailwind CSS"],
    image: "/projects/retrorift.png",
    live: "https://www.retrorift.online/",
    github: "https://github.com/DShivam9/RetroRift",
    category: "Web App"
  },
  {
    id: "03",
    title: "SNIPCAST",
    description: "Generate beautiful, share-ready images from your code snippets in seconds. Developer-first interface with Next.js 14.",
    shortDescription: "Privacy-first code snippet image generator running local client processing.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/snipcast.png",
    live: "https://codesnippt.vercel.app",
    github: "https://github.com/DShivam9/SNIPCAST",
    category: "Tool"
  },
  {
    id: "04",
    title: "HEIC Studio",
    description: "Drag-and-drop tool to convert iPhone HEIC photos to JPG/PNG instantly. Client-side processing for privacy.",
    shortDescription: "Local drag-and-drop HEIC image conversion directly in the browser.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    image: "/projects/heicstudio.png",
    live: "https://www.heicstudio.space/",
    github: "https://github.com/DShivam9/HEIC-STUDIO",
    category: "Tool"
  },
  {
    id: "05",
    title: "WeatherEye",
    description: "Real-time weather app with dynamic themes, dark mode, and animated visuals.",
    shortDescription: "Real-time weather app with dynamic themes and animated visuals.",
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
    shortDescription: "Stunning 3D landing page with smooth motion interactions and scroll-driven experience.",
    tech: ["HTML", "CSS", "JavaScript", "Spline 3D"],
    image: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2069&auto=format&fit=crop",
    live: "https://dshivam9.github.io/Immersive-Landing-Page/",
    github: "https://github.com/DShivam9/Immersive-Landing-Page",
    category: "3D Web"
  }
];

export const HOME_PROJECTS = [
  ALL_PROJECTS[1], // RetroRift
  ALL_PROJECTS[2], // SNIPCAST
  ALL_PROJECTS[3], // HEIC Studio
  ALL_PROJECTS[0], // Campusly
];
