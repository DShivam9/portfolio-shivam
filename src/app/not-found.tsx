import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { Navbar } from "@/components/navigation/Navbar";
import { EditorialText } from "@/components/ui/EditorialText";
import { GradientWaves } from "@/components/ui/GradientWaves";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col bg-bg text-text">
      <Navbar />

      {/* Centered editorial stage inside max-w-5xl rails with sky-blue & white GradientWaves */}
      <main className="relative flex flex-1 flex-col">
        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center overflow-hidden border-x border-border px-6 py-20 text-center sm:px-10">
          {/* Soft, confident sky-blue & cloud-white atmospheric gradient waves */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <GradientWaves
              horizonColor="#0284C7"
              waveColor="#38BDF8"
              crestColor="#FFFFFF"
              speed={0.28}
              amplitude={3.6}
              waveScale={0.42}
              waveRatio={1.35}
              swell={52}
              turbulence={10}
              tilt={73}
              zoom={1.18}
              height={3.2}
              fogDepth={38}
              relief={0.45}
              sheen={0}
              brightness={1.22}
              opacity={0.92}
              grain={0.06}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <Image
              src="/logos/confused-cloud.svg"
              alt="Confused cloud"
              width={84}
              height={84}
              priority
              className="mb-4 h-20 w-20 -rotate-6 select-none object-contain transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:rotate-3 hover:scale-105"
            />

            <span className="mb-2 font-mono text-xs tracking-[0.22em] text-text-muted">
              404
            </span>

            <h1 className="font-brand text-6xl font-normal leading-none tracking-normal text-text sm:text-8xl">
              Not Found
            </h1>

            <p className="mt-4 max-w-sm font-mono text-xs leading-relaxed text-text-secondary sm:text-sm">
              This page drifted off the map.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="pressable group inline-flex h-11 min-w-[172px] items-center justify-center gap-2 rounded-lg bg-text px-5 text-sm font-medium text-bg transition-opacity duration-300 hover:opacity-95"
              >
                <ArrowLeft
                  className="h-4 w-4 transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5"
                  strokeWidth={1.8}
                />
                <EditorialText hoverClassName="text-bg">
                  Back to home
                </EditorialText>
              </Link>

              <Link
                href="/#projects"
                className="pressable group inline-flex h-11 min-w-[172px] items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface/85 px-5 text-sm font-medium text-text-secondary backdrop-blur-sm transition-colors duration-300 hover:bg-surface-hover hover:text-text"
              >
                <EditorialText>View projects</EditorialText>
                <ArrowUpRight
                  className="h-4 w-4 text-text-muted transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text"
                  strokeWidth={1.8}
                />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal closing hairline */}
      <footer className="w-full border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between border-x border-border px-6 py-4 font-mono text-xs text-text-muted sm:px-10">
          <span>© 2026 {PROFILE.name} Portfolio</span>
          <span>Hyderabad, IN</span>
        </div>
      </footer>
    </div>
  );
}
