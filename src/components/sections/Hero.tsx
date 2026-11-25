import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { EditorialText } from "@/components/ui/EditorialText";
import { ScrollHeading, ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionDivider } from "@/components/ui/SectionDivider";
import {
  CopyEmailRow,
  DiscordSocialCard,
  IdentityShowcase,
  LiveClock,
  OverviewRow,
} from "@/components/sections/hero/HeroInteractive";
import { Portrait3D } from "@/components/sections/hero/Portrait3D";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    handle: "@DShivam9",
    href: PROFILE.socials.github,
    iconSrc: "https://img.icons8.com/ios-filled/96/f0f0f2/github.png",
    invertInLight: true,
  },
  {
    label: "LinkedIn",
    handle: "@shivam-diwan",
    href: PROFILE.socials.linkedin,
    iconSrc: "https://img.icons8.com/color/96/linkedin.png",
    invertInLight: false,
  },
  {
    label: "Portfolio",
    handle: "portfolioshivam-drab.vercel.app",
    href: PROFILE.socials.portfolio,
    iconSrc: "/logos/brand-sd.svg",
    invertInLight: true,
  },
] as const;

export function Hero() {
  return (
    <section id="top" className="w-full">
      {/* Block 1 — Profile Header */}
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <div className="flex-1 overflow-hidden">
            <IdentityShowcase />
          </div>

          <div className="rail-reveal w-full shrink-0 border-t border-border p-2.5 sm:w-72 sm:border-l sm:border-t-0 md:w-80">
            <Portrait3D />
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Block 2 — Clean Structured Overview (1 Full-Width Lead + Balanced 4x2 Grid) */}
      <div className="section-shell">
        <div className="flex flex-col gap-2.5 px-6 py-6 sm:px-10 sm:py-7">
          <OverviewRow icon="briefcase" revealDelay={0.36}>
            <span className="font-mono text-sm text-text">
              Open to SWE, Full-Stack &amp; Creative Frontend roles
            </span>
          </OverviewRow>

          <div className="grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {/* Row 1: Role | Pronouns */}
            <OverviewRow icon="code" revealDelay={0.41}>
              <span className="font-mono text-sm text-text">
                Full-Stack Engineer &amp; UI Craft
              </span>
            </OverviewRow>

            <OverviewRow icon="user" revealDelay={0.46}>
              <span className="font-mono text-sm text-text">he/him</span>
            </OverviewRow>

            {/* Row 2: Education | Resume */}
            <OverviewRow icon="grad" revealDelay={0.51}>
              <span className="font-mono text-sm text-text">
                B.Tech CSBS · GITAM University{" "}
                <span className="text-text-muted">(9.0)</span>
              </span>
            </OverviewRow>

            <OverviewRow icon="resume" href="/resume" revealDelay={0.56}>
              <span className="font-mono text-sm text-text">Resume</span>
            </OverviewRow>

            {/* Row 3: Location | Email */}
            <OverviewRow icon="pin" revealDelay={0.61}>
              <span className="inline-flex items-center gap-2 font-mono text-sm text-text">
                <span>{PROFILE.location}</span>
                <svg
                  viewBox="0 0 24 16"
                  aria-label="India"
                  className="h-3 w-4.5 shrink-0 rounded-[2px] ring-1 ring-white/15"
                >
                  <rect width="24" height="5.33" fill="#FF9933" />
                  <rect y="5.33" width="24" height="5.34" fill="#FFFFFF" />
                  <rect y="10.67" width="24" height="5.33" fill="#138808" />
                  <circle
                    cx="12"
                    cy="8"
                    r="1.9"
                    fill="none"
                    stroke="#000080"
                    strokeWidth="0.7"
                  />
                  <circle cx="12" cy="8" r="0.5" fill="#000080" />
                </svg>
              </span>
            </OverviewRow>

            <CopyEmailRow revealDelay={0.66} />

            {/* Row 4: Live Time | Phone */}
            <OverviewRow icon="clock" revealDelay={0.71}>
              <LiveClock
                showSeconds
                className="font-mono text-sm tabular-nums text-text"
              />
            </OverviewRow>

            <OverviewRow
              icon="phone"
              href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`}
              revealDelay={0.76}
            >
              <span className="font-mono text-sm tabular-nums text-text">
                {PROFILE.phone}
              </span>
            </OverviewRow>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Block 3 — Dedicated 2x2 Social Cards */}
      <div className="section-shell">
        <div className="border-b border-border px-6 py-2.5 sm:px-10">
          <ScrollHeading>
            <h2 className="section-title">Socials</h2>
          </ScrollHeading>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 [&>*]:border-b [&>*]:border-border [&>*:last-child]:border-b-0 sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-last-child(-n+2)]:border-b-0">
          {SOCIAL_LINKS.map((item, idx) => (
            <ScrollReveal
              key={item.label}
              variant="card"
              delay={0.08 + idx * 0.11}
              className="p-3 sm:p-3.5"
            >
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable group flex min-w-0 items-center justify-between gap-4 rounded-xl bg-surface px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.14)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-[1px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.24),0_4px_10px_rgba(0,0,0,0.18)]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <Image
                    src={item.iconSrc}
                    alt={`${item.label} icon`}
                    width={44}
                    height={44}
                    className={`h-11 w-11 shrink-0 object-contain ${item.invertInLight ? "github-app-icon" : ""}`}
                  />
                  <div className="min-w-0">
                    <p className="text-base font-medium text-text">
                      <EditorialText>{item.label}</EditorialText>
                    </p>
                    <p className="truncate font-mono text-xs text-text-muted transition-colors duration-200 group-hover:text-text-secondary">
                      {item.handle}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="arrow-glide h-4 w-4 shrink-0 text-text-muted group-hover:text-text"
                  strokeWidth={1.5}
                />
              </a>
            </ScrollReveal>
          ))}
          <ScrollReveal variant="card" delay={0.41} className="p-3 sm:p-3.5">
            <DiscordSocialCard />
          </ScrollReveal>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
