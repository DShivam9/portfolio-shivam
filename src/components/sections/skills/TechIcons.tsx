import Image from "next/image";
import { SiGreensock, SiOpenai, SiShadcnui, SiWebassembly } from "react-icons/si";

const TECHICON_ASSETS: Record<string, { src: string; invertOnDark?: boolean }> = {
  html: { src: "/icons/tech/html5.svg" },
  css: { src: "/icons/tech/css3.svg" },
  typescript: { src: "/icons/tech/typescript.svg" },
  javascript: { src: "/icons/tech/javascript.svg" },
  python: { src: "/icons/tech/python.svg" },
  react: { src: "/icons/tech/react.svg" },
  nextjs: { src: "/icons/tech/nextjs.svg", invertOnDark: true },
  tailwind: { src: "/icons/tech/tailwind.svg" },
  threejs: { src: "/icons/tech/threejs.svg", invertOnDark: true },
  nodejs: { src: "/icons/tech/nodejs.svg" },
  express: { src: "/icons/tech/express.svg", invertOnDark: true },
  fastapi: { src: "/icons/tech/fastapi.svg" },
  postgresql: { src: "/icons/tech/postgresql.svg" },
  firebase: { src: "/icons/tech/firebase.svg" },
  cursor: { src: "/icons/tech/cursor.svg", invertOnDark: true },
  vite: { src: "/icons/tech/vite.svg" },
  docker: { src: "/icons/tech/docker.svg" },
  git: { src: "/icons/tech/git.svg" },
  github: { src: "/icons/tech/github.svg", invertOnDark: true },
  vercel: { src: "/icons/tech/vercel.svg", invertOnDark: true },
  cloudflare: { src: "/icons/tech/cloudflare.svg" },
};

interface TechLogoProps {
  id: string;
  name: string;
  size?: "md" | "sm";
}

export function TechLogo({ id, name, size = "md" }: TechLogoProps) {
  const px = size === "sm" ? 18 : 28;
  const boxClass = size === "sm" ? "h-4.5 w-4.5" : "h-7 w-7";

  const asset = TECHICON_ASSETS[id];
  if (asset) {
    return (
      <Image
        src={asset.src}
        alt={name}
        width={px}
        height={px}
        className={`${boxClass} object-contain ${asset.invertOnDark ? "invert-on-dark" : ""}`}
      />
    );
  }

  switch (id) {
    case "claude":
      return (
        <svg viewBox="0 0 112 112" fill="#D97757" className={boxClass} aria-hidden="true">
          <path d="m21.564 73.123 21.62-12.132.361-1.057-.361-.584h-1.058l-3.617-.223-12.354-.334-10.712-.445-10.379-.556-2.615-.557L0 54.007l.25-1.613 2.199-1.475 3.144.278 6.956.473 10.434.724 7.568.445 11.214 1.168h1.78l.25-.723-.611-.445-.473-.445-10.796-7.318-11.687-7.735-6.12-4.452-3.312-2.254-1.67-2.115-.723-4.619 3.005-3.31 4.035.277 1.03.279 4.09 3.144 8.736 6.761 11.408 8.403 1.67 1.391.668-.473.083-.333-.751-1.253-6.205-11.213-6.622-11.408-2.95-4.73-.779-2.838c-.278-1.169-.473-2.143-.473-3.34L28.771.613 30.663 0l4.563.612 1.92 1.67 2.838 6.483 4.591 10.211 7.123 13.885 2.087 4.118 1.113 3.812.417 1.168h.724v-.667l.584-7.819 1.085-9.6 1.058-12.354.361-3.478 1.725-4.173 3.423-2.254 2.67 1.28 2.2 3.144-.307 2.031-1.308 8.487-2.56 13.3-1.67 8.904h.975l1.113-1.113 4.507-5.983 7.569-9.46 3.339-3.756 3.895-4.146 2.504-1.976h4.73l3.478 5.176-1.558 5.342-4.869 6.177-4.035 5.231-5.787 7.79-3.617 6.234.334.5.862-.083 13.078-2.782 7.067-1.28 8.431-1.447 3.812 1.78.417 1.81-1.502 3.7-9.015 2.226-10.574 2.114-15.748 3.729-.195.139.222.278 7.096.668 3.033.167h7.429l13.829 1.03 3.617 2.392 2.17 2.922-.362 2.226-5.565 2.838-7.512-1.78-17.53-4.174-6.01-1.503h-.835v.5l5.009 4.898 9.182 8.292 6.83 6.115.584 2.644-1.475 2.087-1.558-.223-10.1-7.596-3.896-3.423-8.82-7.429h-.584v.78l2.03 2.977 10.741 16.138.556 4.953-.779 1.613-2.782.974-3.06-.556-6.29-8.82-6.482-9.934-5.231-8.904-.64.362-3.089 33.25-1.447 1.698-3.339 1.28-2.782-2.115-1.475-3.423 1.475-6.76 1.78-8.821 1.448-7.012 1.307-8.71.78-2.893-.056-.195-.64.084-6.567 9.015-9.989 13.495-7.902 8.459-1.892.75-3.283-1.697.306-3.032 1.836-2.7 10.935-13.912 6.595-8.625 4.257-4.98-.028-.724h-.25L18.92 85.06l-5.175.668-2.226-2.087.279-3.423 1.057-1.113 8.737-6.01z" />
        </svg>
      );
    case "antigravity":
      return (
        <svg viewBox="0 0 24 24" fill="#4285F4" className={boxClass} aria-hidden="true">
          <path d="M12.006 3.02q1.736-.02 2.682 1.303q.945 1.323 1.648 2.985q.612 1.46 1.212 3.288q.6 1.829 1.256 3.683q.65 1.779 1.387 3.342q.736 1.564 1.703 2.643q.123.148.118.323t-.13.284q-.142.129-.31.135t-.31-.117q-1.745-1.627-2.933-3.434q-1.189-1.807-2.296-3.02q-.85-.95-1.823-1.51q-.972-.56-2.204-.54q-1.233-.02-2.205.54t-1.822 1.51q-1.108 1.213-2.296 3.02T2.75 20.889q-.14.123-.31.117t-.311-.135q-.123-.11-.129-.284t.117-.323q.967-1.06 1.704-2.633t1.387-3.352q.655-1.854 1.255-3.683t1.212-3.288q.704-1.662 1.649-2.985t2.682-1.304" />
        </svg>
      );
    case "motion":
      return (
        <svg
          viewBox="0 0 34 12"
          fill="#EAB308"
          className={size === "sm" ? "h-2.5 w-6" : "h-3.5 w-8"}
          aria-hidden="true"
        >
          <path d="M 12.838 0 L 6.12 11.989 L 0 11.989 L 5.245 2.628 C 6.059 1.176 8.088 0 9.778 0 Z M 27.846 2.997 C 27.846 1.342 29.216 0 30.906 0 C 32.596 0 33.966 1.342 33.966 2.997 C 33.966 4.653 32.596 5.995 30.906 5.995 C 29.216 5.995 27.846 4.653 27.846 2.997 Z M 13.985 0 L 20.105 0 L 13.387 11.989 L 7.267 11.989 Z M 21.214 0 L 27.334 0 L 22.088 9.362 C 21.275 10.813 19.246 11.989 17.556 11.989 L 14.496 11.989 Z" />
        </svg>
      );
    case "shadcn":
      return <SiShadcnui className={`${boxClass} text-text`} aria-hidden="true" />;
    case "chatgpt":
      return <SiOpenai className={`${boxClass} text-text`} aria-hidden="true" />;
    case "gsap":
      return <SiGreensock className={boxClass} style={{ color: "#88CE02" }} aria-hidden="true" />;
    case "wasm":
      return <SiWebassembly className={boxClass} style={{ color: "#654FF0" }} aria-hidden="true" />;
    default:
      return null;
  }
}
