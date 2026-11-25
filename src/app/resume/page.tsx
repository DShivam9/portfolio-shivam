import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, FileText } from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { ResumeActions } from "@/components/sections/resume/ResumeActions";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { PROFILE } from "@/constants/profile";

export const metadata: Metadata = {
  title: `Resume · ${PROFILE.name}`,
  description: `Resume of ${PROFILE.name} — Full-Stack Engineer & UI Craft.`,
};

const PDF_VIEW_URL = `${PROFILE.resumePath}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`;

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />

      <main>
        {/* Header Bar */}
        <section className="w-full">
          <div className="section-shell">
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="pressable group inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 font-mono text-xs text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.18),0_1px_4px_rgba(0,0,0,0.12)] transition-colors duration-150 hover:text-text"
                >
                  <ArrowLeft
                    className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-0.5"
                    strokeWidth={1.7}
                  />
                  <span>Back</span>
                </Link>

                <h1 className="section-title">
                  Resume
                </h1>
              </div>

              {/* Tactile action dock matching navbar Search ⌘K */}
              <ResumeActions />
            </div>
          </div>

          <SectionDivider />
        </section>

        {/* Clean Framed US-Letter Document Stage */}
        <section className="w-full">
          <div className="section-shell px-4 py-10 sm:px-10 sm:py-14">
            {/* Desktop / Tablet inline PDF sheet — exact 8.5x11 ratio + negative inset clips Chrome's grey PDF gutter cleanly */}
            <div className="mx-auto hidden max-w-[820px] overflow-hidden rounded-2xl bg-white ring-1 ring-border [box-shadow:var(--music-card-shadow)] sm:block">
              <div className="relative aspect-[8.5/11] w-full overflow-hidden bg-white">
                <object
                  data={PDF_VIEW_URL}
                  type="application/pdf"
                  aria-label={`${PROFILE.name} Resume PDF`}
                  className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] border-0 bg-white"
                >
                  <iframe
                    src={PDF_VIEW_URL}
                    title={`${PROFILE.name} Resume`}
                    className="h-full w-full border-0 bg-white"
                  />
                </object>
              </div>
            </div>

            {/* Mobile fallback card (mobile browsers don't inline-render PDF embeds reliably) */}
            <div className="flex flex-col items-center gap-5 rounded-2xl bg-surface px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.14)] sm:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg text-text-secondary shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]">
                <FileText className="h-5 w-5" strokeWidth={1.6} />
              </div>
              <div>
                <p className="text-base font-medium text-text">
                  {PROFILE.name} · Resume
                </p>
                <p className="mt-1 font-mono text-xs text-text-muted">
                  PDF preview works best in full viewer on mobile.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={PROFILE.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex h-10 items-center gap-2 rounded-xl bg-text px-4 font-mono text-xs font-medium text-bg"
                >
                  <span>Open PDF</span>
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                </a>
                <a
                  href={PROFILE.resumePath}
                  download="Shivam_Diwan_Resume.pdf"
                  className="pressable inline-flex h-10 items-center gap-2 rounded-xl bg-bg px-4 font-mono text-xs font-medium text-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.7} />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>

          <SectionDivider />
        </section>
      </main>
    </div>
  );
}
