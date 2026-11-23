export interface PortfolioProject {
  id: string;
  title: string;
  tagline: string;
  period: string;
  status?: string;
  highlights: readonly string[];
  stack: readonly string[];
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
}

export const FEATURED_PROJECTS: readonly PortfolioProject[] = [
  {
    id: "abyss",
    title: "Abyss",
    tagline: "Open-source collection of creative, copy-paste React components.",
    period: "",
    status: "Shipping",
    highlights: [
      "Maintaining an open-source library of **23 copy-paste React components**, adding new ones as I build them.",
      "Covers interactive UI pieces, **motion primitives**, and **WebGL visuals** built with React, Next.js, TypeScript, and Tailwind.",
      "Shipped using **Antigravity** for rapid first drafts, followed by my own design tuning, motion polish, and code review.",
      "Live interactive showcase on **Vercel** with copy-ready source so developers drop components straight into existing apps.",
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "WebGL"],
    liveUrl: "https://abssy.vercel.app/",
    githubUrl: "https://github.com/DShivam9/Abyss",
  },
  {
    id: "retrorift",
    title: "RetroRift",
    tagline: "Web-based retro gaming platform running client-side via WebAssembly.",
    period: "Jan - Apr 2026",
    highlights: [
      "Launched a browser retro gaming platform with **50+ games** across GBA, NDS, and more for **100+ users**.",
      "Runs console emulators entirely client-side with **WebAssembly** so players start instantly with no downloads or installs.",
      "Kept heavy ROM files from freezing the page by decompressing ZIPs asynchronously and caching ROMs in **IndexedDB**.",
      "Added **Firebase Auth** sign-in and **Firestore cloud saves** so players keep save states across sessions and devices.",
    ],
    stack: ["React", "Vite", "WebAssembly", "Firebase"],
    liveUrl: "https://www.retrorift.online/",
    githubUrl: "https://github.com/DShivam9/RetroRift",
    image: "/projects/retrorift.png",
  },
  {
    id: "uk-wind-desk",
    title: "UK Wind Power Forecast Desk",
    tagline: "Trading and day-ahead wind forecast evaluation desk.",
    period: "Sep 2026",
    highlights: [
      "Measured day-ahead wind forecast accuracy across all **1,488 half-hour** settlement periods of January 2026.",
      "Found forecasts ran too high in **~78% of periods** with an average miss of **2,108 MW** using Python and pandas.",
      "Built a **FastAPI** backend verified with **25 pytest tests (82% coverage)** paired with a React and TypeScript dashboard.",
      "Containerized the backend with **Docker** and deployed live across **Render** and **Vercel**.",
    ],
    stack: ["Python", "FastAPI", "React", "TypeScript", "Docker"],
    liveUrl: "https://frontend-woad-six-16.vercel.app/",
    githubUrl: "https://github.com/DShivam9/kjhad",
  },
  {
    id: "campusly",
    title: "Campusly",
    tagline: "Smart campus management platform for 4 distinct user roles.",
    period: "2025 - 2026",
    highlights: [
      "All-in-one campus platform covering attendance, grades, timetables, fees, and events for **4 user roles**.",
      "Includes **real-time GPS bus tracking** and dedicated views tailored to students, faculty, and admins.",
      "Backed by a **10+ table PostgreSQL** database with **JWT authentication** and **role-based access control**.",
      "Built collaboratively in a **team of 4** across React, TypeScript, Node.js, and Express.",
    ],
    stack: ["React", "Node.js", "Express", "TypeScript", "PostgreSQL"],
    githubUrl: "https://github.com/DShivam9/Campusly",
  },
] as const;

export const ARCHIVED_PROJECTS: readonly PortfolioProject[] = [
  {
    id: "heic-studio",
    title: "HEIC Studio",
    tagline: "Local drag-and-drop HEIC image converter",
    period: "Archived",
    highlights: [
      "Converts iPhone HEIC photos to JPG and PNG entirely **client-side** with zero file uploads.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://www.heicstudio.space/",
    githubUrl: "https://github.com/DShivam9/HEIC-STUDIO",
    image: "/projects/heicstudio.png",
  },
  {
    id: "codesnippt",
    title: "SNIPCAST",
    tagline: "Privacy-first code snippet image generator",
    period: "Archived",
    highlights: [
      "Generates share-ready syntax-highlighted code images directly in the browser with **local client processing**.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://codesnippt.vercel.app",
    githubUrl: "https://github.com/DShivam9/SNIPCAST",
    image: "/projects/snipcast.png",
  },
  {
    id: "oscorp",
    title: "OSCORP",
    tagline: "3D landing page with scroll-driven motion",
    period: "Archived",
    highlights: [
      "Early creative frontend experiment exploring **Spline 3D** embeds and scroll-driven transitions.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Spline 3D"],
    liveUrl: "https://dshivam9.github.io/Immersive-Landing-Page/",
    githubUrl: "https://github.com/DShivam9/Immersive-Landing-Page",
  },
  {
    id: "weathereye",
    title: "WeatherEye",
    tagline: "Real-time weather app with dynamic themes",
    period: "Archived",
    highlights: [
      "Early web fundamentals project integrating the **OpenWeatherMap API** with dynamic weather states and dark mode.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "OpenWeatherMap API"],
    liveUrl: "https://dshivam9.github.io/WeatherEye/",
    githubUrl: "https://github.com/DShivam9/WeatherEye",
  },
] as const;
