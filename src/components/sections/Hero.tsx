import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { EditorialText } from "@/components/ui/EditorialText";
import { SectionDivider } from "@/components/ui/SectionDivider";
import {
  CopyEmailRow,
  DiscordSocialCard,
  HeroReveal,
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
      <div className="mx-auto max-w-5xl border-x border-border">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
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
        <div className="flex flex-col gap-2.5 px-6 py-6 sm:px-10 sm:py-7">
          <HeroReveal delay={1.15}>
            <OverviewRow icon="briefcase" revealDelay={1.15}>
              <span className="font-mono text-sm text-text">
                Open to SWE, Full-Stack &amp; Creative Frontend roles
              </span>
            </OverviewRow>
          </HeroReveal>

          <div className="grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {/* Row 1: Role | Pronouns */}
            <HeroReveal delay={1.2}>
              <OverviewRow icon="code" revealDelay={1.2}>
                <span className="font-mono text-sm text-text">
                  Full-Stack Engineer &amp; UI Craft
                </span>
              </OverviewRow>
            </HeroReveal>

            <HeroReveal delay={1.26}>
              <OverviewRow icon="user" revealDelay={1.26}>
                <span className="font-mono text-sm text-text">he/him</span>
              </OverviewRow>
            </HeroReveal>

            {/* Row 2: Education | Resume */}
            <HeroReveal delay={1.32}>
              <OverviewRow icon="grad" revealDelay={1.32}>
                <span className="font-mono text-sm text-text">
                  B.Tech CSBS · GITAM University{" "}
                  <span className="text-text-muted">(9.0)</span>
                </span>
              </OverviewRow>
            </HeroReveal>

            <HeroReveal delay={1.38}>
              <OverviewRow icon="resume" href="/resume" revealDelay={1.38}>
                <span className="font-mono text-sm text-text">Resume</span>
              </OverviewRow>
            </HeroReveal>

            {/* Row 3: Location | Email */}
            <HeroReveal delay={1.44}>
              <OverviewRow icon="pin" revealDelay={1.44}>
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
            </HeroReveal>

            <HeroReveal delay={1.5}>
              <CopyEmailRow revealDelay={1.5} />
            </HeroReveal>

            {/* Row 4: Live Time | Phone */}
            <HeroReveal delay={1.56}>
              <OverviewRow icon="clock" revealDelay={1.56}>
                <LiveClock
                  showSeconds
                  className="font-mono text-sm tabular-nums text-text"
                />
              </OverviewRow>
            </HeroReveal>

            <HeroReveal delay={1.62}>
              <OverviewRow
                icon="phone"
                href={`tel:${PROFILE.phone.replace(/\s+/g, "")}`}
                revealDelay={1.62}
              >
                <span className="font-mono text-sm tabular-nums text-text">
                  {PROFILE.phone}
                </span>
              </OverviewRow>
            </HeroReveal>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Block 3 — Dedicated 2x2 Social Cards */}
      <div className="mx-auto max-w-5xl border-x border-border">
        <div className="border-b border-border px-6 py-2.5 sm:px-10">
          <h2 className="font-brand text-3xl font-normal leading-none tracking-normal text-text">
            Socials
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 [&>*]:border-b [&>*]:border-border [&>*:last-child]:border-b-0 sm:[&>*:nth-child(odd)]:border-r sm:[&>*:nth-last-child(-n+2)]:border-b-0">
          {SOCIAL_LINKS.map((item, idx) => (
            <HeroReveal
              key={item.label}
              delay={1.55 + idx * 0.06}
              mask={false}
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
                  className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                  strokeWidth={1.5}
                />
              </a>
            </HeroReveal>
          ))}
          <HeroReveal delay={1.73} mask={false} className="p-3 sm:p-3.5">
            <DiscordSocialCard />
          </HeroReveal>
        </div>
      </div>

      <SectionDivider />
    </section>
  );
}
