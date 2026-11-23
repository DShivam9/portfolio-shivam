import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/constants/profile";
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
  },
  {
    label: "LinkedIn",
    handle: "@shivam-diwan",
    href: PROFILE.socials.linkedin,
    iconSrc: "https://img.icons8.com/color/96/linkedin.png",
  },
] as const;

export function Hero() {
  return (
    <section id="top" className="w-full">
      {/* Block 1 — Profile Header */}
      <div className="mx-auto max-w-5xl border-x border-border">
        <div className="reveal-soft flex flex-col sm:flex-row sm:items-stretch">
          <div className="flex-1 overflow-hidden">
            <IdentityShowcase />
          </div>

          <div className="w-full shrink-0 border-t border-border p-2.5 sm:w-72 sm:border-l sm:border-t-0 md:w-80">
            <Portrait3D />
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Block 2 — Clean Structured Overview (1 Full-Width Lead + Balanced 4x2 Grid) */}
      <div className="mx-auto max-w-5xl border-x border-border">
        <div className="reveal-soft flex flex-col gap-2.5 px-6 py-6 [animation-delay:60ms] sm:px-10 sm:py-7">
          <OverviewRow icon="briefcase">
            <span className="font-mono text-sm text-text">
              Open to SWE, Full-Stack &amp; Creative Frontend roles
            </span>
          </OverviewRow>

          <div className="grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {/* Row 1: Role | Pronouns */}
            <OverviewRow icon="code">
              <span className="font-mono text-sm text-text">
                Full-Stack Engineer &amp; UI Craft
              </span>
            </OverviewRow>

            <OverviewRow icon="user">
              <span className="font-mono text-sm text-text">he/him</span>
            </OverviewRow>

            {/* Row 2: Education | Resume */}
            <OverviewRow icon="grad">
              <span className="font-mono text-sm text-text">
                B.Tech CSBS · GITAM University{" "}
                <span className="text-text-muted">(9.0)</span>
              </span>
            </OverviewRow>

            <OverviewRow icon="resume" href={PROFILE.resumePath} external>
              <span className="font-mono text-sm text-text">Resume</span>
            </OverviewRow>

            {/* Row 3: Location | Email */}
            <OverviewRow icon="pin">
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

            <CopyEmailRow />

            {/* Row 4: Live Time | Phone */}
            <OverviewRow icon="clock">
              <LiveClock
                showSeconds
                className="font-mono text-sm tabular-nums text-text"
              />
            </OverviewRow>

            <OverviewRow
              icon="phone"
              href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`}
            >
              <span className="font-mono text-sm tabular-nums text-text">
                {PROFILE.phone}
              </span>
            </OverviewRow>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Block 3 — Dedicated 3-Column Social Cards */}
      <div className="mx-auto max-w-5xl border-x border-border">
        <div className="border-b border-border px-6 py-2.5 sm:px-10">
          <h2 className="font-brand text-3xl font-normal leading-none tracking-normal text-text">
            Socials
          </h2>
        </div>
        <div className="reveal-soft grid grid-cols-1 divide-y divide-border [animation-delay:110ms] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable group flex items-center justify-between px-6 py-6 transition-colors duration-150 hover:bg-surface sm:px-7"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.iconSrc}
                  alt={`${item.label} icon`}
                  width={44}
                  height={44}
                  className={`h-11 w-11 shrink-0 object-contain transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 ${item.label === "GitHub" ? "github-app-icon" : ""
                    }`}
                />
                <div>
                  <p className="text-base font-medium text-text">
                    {item.label}
                  </p>
                  <p className="font-mono text-xs text-text-muted">
                    {item.handle}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 text-text-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                strokeWidth={1.5}
              />
            </a>
          ))}
          <DiscordSocialCard />
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
