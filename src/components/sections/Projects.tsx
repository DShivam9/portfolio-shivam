"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Archive, Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import {
  ARCHIVED_PROJECTS,
  FEATURED_PROJECTS,
  type PortfolioProject,
} from "@/constants/projects";
import { TechLogo } from "@/components/sections/skills/TechIcons";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollHeading, ScrollReveal } from "@/components/ui/ScrollReveal";

const DRAWER_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

function renderHighlight(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-medium text-text">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

const STACK_TO_ICON_ID: Record<string, string> = {
  React: "react",
  "Next.js": "nextjs",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "Tailwind CSS": "tailwind",
  WebGL: "threejs",
  "Three.js": "threejs",
  Vite: "vite",
  WebAssembly: "wasm",
  Firebase: "firebase",
  Python: "python",
  FastAPI: "fastapi",
  Docker: "docker",
  "Node.js": "nodejs",
  Express: "express",
  PostgreSQL: "postgresql",
};

const drawerVariants: Variants = {
  closed: {
    height: 0,
    transition: {
      height: { duration: 0.36, delay: 0.09, ease: DRAWER_EASE },
      staggerChildren: 0.035,
      staggerDirection: -1,
    },
  },
  open: {
    height: "auto",
    transition: {
      height: { duration: 0.42, ease: DRAWER_EASE },
      staggerChildren: 0.055,
      delayChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  closed: {
    opacity: 0,
    transform: "translateY(-6px)",
    transition: { duration: 0.22, ease: DRAWER_EASE },
  },
  open: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.32, ease: DRAWER_EASE },
  },
};

const previewVariants: Variants = {
  closed: {
    opacity: 0,
    transform: "scale(0.97) translateY(-4px)",
    filter: "blur(2px)",
    transition: { duration: 0.22, ease: DRAWER_EASE },
  },
  open: {
    opacity: 1,
    transform: "scale(1) translateY(0px)",
    filter: "blur(0px)",
    transition: { duration: 0.38, delay: 0.08, ease: DRAWER_EASE },
  },
};

// Single 2-path SVG where both chevrons physically flip between expand (<>) and collapse (><)
function ExpandMark({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex h-9 w-9 items-center justify-center transition-colors duration-150 group-hover:text-text ${open ? "text-text" : "text-text-muted"
        }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        <path
          d="M7 9l5-5 5 5"
          style={{
            transformOrigin: "12px 6.5px",
            transform: open
              ? "translateY(2px) rotate(180deg)"
              : "translateY(0px) rotate(0deg)",
            transition: "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        />
        <path
          d="M7 15l5 5 5-5"
          style={{
            transformOrigin: "12px 17.5px",
            transform: open
              ? "translateY(-2px) rotate(-180deg)"
              : "translateY(0px) rotate(0deg)",
            transition: "transform 380ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
        />
      </svg>
    </span>
  );
}

function ProjectRow({
  project,
  isOpen,
  onToggle,
}: {
  project: PortfolioProject;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-7 text-left transition-colors duration-150 hover:bg-surface/40 sm:px-10 sm:py-8"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-xl font-medium tracking-tight text-text sm:text-2xl">
              {project.title}
            </h3>

            {project.status && (
              <span className="rounded-full bg-surface-hover px-2.5 py-1 font-mono text-[11px] leading-none text-text-secondary">
                {project.status}
              </span>
            )}

            {project.period && (
              <span className="font-mono text-xs tabular-nums text-text-muted">
                {project.period}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-text-secondary [text-wrap:pretty] sm:text-[15px]">
            {project.tagline}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${project.title} live site`}
              className="pressable group/tip relative inline-flex h-10 w-10 items-center justify-center text-text-muted transition-colors duration-150 hover:text-text"
            >
              <Globe className="h-5 w-5" strokeWidth={1.6} />
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg bg-surface-hover px-2.5 py-1 font-mono text-[11px] text-text opacity-0 shadow-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tip:translate-y-0 group-hover/tip:scale-100 group-hover/tip:opacity-100"
              >
                Visit
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-surface-hover"
                />
              </span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} source on GitHub`}
              className="pressable group/tip relative inline-flex h-10 w-10 items-center justify-center text-text-muted transition-colors duration-150 hover:text-text"
            >
              <FaGithub className="h-5 w-5" />
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg bg-surface-hover px-2.5 py-1 font-mono text-[11px] text-text opacity-0 shadow-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tip:translate-y-0 group-hover/tip:scale-100 group-hover/tip:opacity-100"
              >
                GitHub
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-surface-hover"
                />
              </span>
            </a>
          )}

          <ExpandMark open={isOpen} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="drawer"
            variants={shouldReduceMotion ? undefined : drawerVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "closed"}
            animate={shouldReduceMotion ? { opacity: 1 } : "open"}
            exit={shouldReduceMotion ? { opacity: 0 } : "closed"}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-0 sm:px-10 sm:pb-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-6">
                  <ul className="relative pt-3 font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
                    {/* Root node + stem anchoring the tree directly under the project tagline */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[5.5px] -top-1 h-1.5 w-1.5 rounded-full bg-border-strong"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-2 top-0 h-3 w-px bg-border-strong"
                    />

                    {project.highlights.map((line, idx) => {
                      const isLast = idx === project.highlights.length - 1;
                      return (
                        <motion.li
                          key={line}
                          variants={shouldReduceMotion ? undefined : itemVariants}
                          className={`relative pl-7 [text-wrap:pretty] ${isLast ? "" : "pb-4"
                            }`}
                        >
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute bottom-0 left-2 top-0 w-px bg-border-strong"
                            />
                          )}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-2 top-0 h-[12px] w-3.5 rounded-bl-[8px] border-b border-l border-border-strong"
                          />
                          <span>{renderHighlight(line)}</span>
                        </motion.li>
                      );
                    })}
                  </ul>

                  {/* Official stack logos at full crisp 28px scale */}
                  <motion.div
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className="flex flex-wrap items-center gap-4 pl-7 pt-1"
                  >
                    {project.stack.map((tech) => {
                      const iconId = STACK_TO_ICON_ID[tech];
                      if (iconId) {
                        return (
                          <span
                            key={tech}
                            aria-label={tech}
                            className="group/logo relative inline-flex h-8 w-8 items-center justify-center"
                          >
                            <span className="inline-flex items-center justify-center opacity-90 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:-translate-y-0.5 group-hover/logo:opacity-100">
                              <TechLogo id={iconId} name={tech} size="md" />
                            </span>
                            <span
                              role="tooltip"
                              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg bg-surface-hover px-2.5 py-1 font-mono text-[11px] text-text opacity-0 shadow-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:translate-y-0 group-hover/logo:scale-100 group-hover/logo:opacity-100"
                            >
                              {tech}
                              <span
                                aria-hidden="true"
                                className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-surface-hover"
                              />
                            </span>
                          </span>
                        );
                      }
                      return (
                        <span
                          key={tech}
                          className="font-mono text-xs text-text-muted"
                        >
                          {tech}
                        </span>
                      );
                    })}
                  </motion.div>
                </div>

                {project.image && (
                  <motion.div
                    variants={shouldReduceMotion ? undefined : previewVariants}
                    className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[6px] bg-surface outline outline-1 -outline-offset-1 outline-border-strong sm:w-72 md:w-80"
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 288px"
                      className="object-cover object-top"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArchivedRow({
  project,
  isOpen,
  onToggle,
}: {
  project: PortfolioProject;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div variants={shouldReduceMotion ? undefined : itemVariants}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-3.5 text-left transition-colors duration-150 hover:bg-surface/60 sm:px-10 sm:py-4 ${
          isOpen ? "bg-surface/40" : ""
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-6">
          <h3
            className={`shrink-0 text-sm font-medium tracking-tight transition-colors duration-150 sm:w-36 ${
              isOpen
                ? "text-text"
                : "text-text-secondary group-hover:text-text"
            }`}
          >
            {project.title}
          </h3>
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-text-muted transition-colors duration-150 group-hover:text-text-secondary">
            {project.tagline}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${project.title} live site`}
              className="pressable group/tip relative inline-flex h-10 w-10 items-center justify-center text-text-muted transition-colors duration-150 hover:text-text"
            >
              <Globe className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg bg-surface-hover px-2.5 py-1 font-mono text-[11px] text-text opacity-0 shadow-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tip:translate-y-0 group-hover/tip:scale-100 group-hover/tip:opacity-100"
              >
                Visit
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-surface-hover"
                />
              </span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} source on GitHub`}
              className="pressable group/tip relative inline-flex h-10 w-10 items-center justify-center text-text-muted transition-colors duration-150 hover:text-text"
            >
              <FaGithub className="h-[18px] w-[18px]" />
              <span
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg bg-surface-hover px-2.5 py-1 font-mono text-[11px] text-text opacity-0 shadow-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tip:translate-y-0 group-hover/tip:scale-100 group-hover/tip:opacity-100"
              >
                GitHub
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-surface-hover"
                />
              </span>
            </a>
          )}

          <ExpandMark open={isOpen} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="archived-detail"
            variants={shouldReduceMotion ? undefined : drawerVariants}
            initial={shouldReduceMotion ? { opacity: 0 } : "closed"}
            animate={shouldReduceMotion ? { opacity: 1 } : "open"}
            exit={shouldReduceMotion ? { opacity: 0 } : "closed"}
            className="overflow-hidden bg-surface/40"
          >
            <div className="px-6 pb-5 pt-1 sm:pl-[calc(2.5rem+10.5rem)] sm:pr-10 sm:pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1 space-y-3.5">
                  {project.highlights[0] && (
                    <motion.p
                      variants={shouldReduceMotion ? undefined : itemVariants}
                      className="text-sm leading-relaxed text-text-secondary [text-wrap:pretty]"
                    >
                      {renderHighlight(project.highlights[0])}
                    </motion.p>
                  )}

                  <motion.div
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className="flex flex-wrap items-center gap-3"
                  >
                    {project.stack.map((tech) => {
                      const iconId = STACK_TO_ICON_ID[tech];
                      if (iconId) {
                        return (
                          <span
                            key={tech}
                            aria-label={tech}
                            className="group/logo relative inline-flex h-6 w-6 items-center justify-center"
                          >
                            <span className="inline-flex items-center justify-center opacity-85 transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:-translate-y-0.5 group-hover/logo:opacity-100">
                              <TechLogo id={iconId} name={tech} size="sm" />
                            </span>
                            <span
                              role="tooltip"
                              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg bg-surface-hover px-2.5 py-1 font-mono text-[11px] text-text opacity-0 shadow-none transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/logo:translate-y-0 group-hover/logo:scale-100 group-hover/logo:opacity-100"
                            >
                              {tech}
                              <span
                                aria-hidden="true"
                                className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-surface-hover"
                              />
                            </span>
                          </span>
                        );
                      }
                      return (
                        <span
                          key={tech}
                          className="font-mono text-[11px] text-text-muted"
                        >
                          {tech}
                        </span>
                      );
                    })}
                  </motion.div>
                </div>

                {project.image && (
                  <motion.div
                    variants={shouldReduceMotion ? undefined : previewVariants}
                    className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-[5px] bg-surface outline outline-1 -outline-offset-1 outline-border-strong sm:w-48"
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 192px"
                      className="object-cover object-top"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(FEATURED_PROJECTS[0].id);
  const [showArchived, setShowArchived] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="projects" className="w-full scroll-mt-16">
      <div className="section-shell">
        <div className="border-b border-border px-6 py-3 sm:px-10">
          <ScrollHeading>
            <h2 className="section-title">
              Projects
            </h2>
          </ScrollHeading>
        </div>

        <div className="divide-y divide-border">
          {FEATURED_PROJECTS.map((project, index) => (
            <ScrollReveal key={project.id} y={14} delay={0.06 + index * 0.08}>
              <ProjectRow
                project={project}
                isOpen={openId === project.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === project.id ? null : project.id))
                }
              />
            </ScrollReveal>
          ))}
        </div>

        {/* Distinct archived drawer separated by subtle dashed hairline */}
        <div className="border-t border-dashed border-border-strong/50">
          <button
            type="button"
            aria-expanded={showArchived}
            onClick={() => setShowArchived((prev) => !prev)}
            className="group flex w-full cursor-pointer items-center justify-between px-6 py-4 font-mono text-xs text-text-secondary transition-colors duration-150 hover:bg-surface/40 hover:text-text active:bg-surface/70 sm:px-10"
          >
            <span className="flex items-center gap-2.5">
              <Archive
                className="h-3.5 w-3.5 shrink-0 text-text-muted"
                strokeWidth={1.6}
              />
              <span>Archived projects</span>
              <span className="tabular-nums text-text-muted">
                ({ARCHIVED_PROJECTS.length})
              </span>
              <span className="hidden text-text-muted sm:inline">
                · early builds from learning the fundamentals
              </span>
            </span>
            <ExpandMark open={showArchived} />
          </button>

          <AnimatePresence initial={false}>
            {showArchived && (
              <motion.div
                key="archived-drawer"
                variants={shouldReduceMotion ? undefined : drawerVariants}
                initial={shouldReduceMotion ? { opacity: 0 } : "closed"}
                animate={shouldReduceMotion ? { opacity: 1 } : "open"}
                exit={shouldReduceMotion ? { opacity: 0 } : "closed"}
                className="overflow-hidden"
              >
                <div className="divide-y divide-border/70 border-t border-border/70 bg-surface/20">
                  {ARCHIVED_PROJECTS.map((project) => (
                    <ArchivedRow
                      key={project.id}
                      project={project}
                      isOpen={openId === project.id}
                      onToggle={() =>
                        setOpenId((prev) =>
                          prev === project.id ? null : project.id,
                        )
                      }
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
