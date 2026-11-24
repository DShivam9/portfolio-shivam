"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  DownloadIcon,
  type DownloadIconHandle,
} from "@/components/icons/download-icon";
import { EditorialText } from "@/components/ui/EditorialText";
import { PROFILE } from "@/constants/profile";

export function ResumeActions() {
  const downloadRef = useRef<DownloadIconHandle>(null);

  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-surface p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2),0_2px_6px_rgba(0,0,0,0.14)]">
      <a
        href={PROFILE.resumePath}
        download="Shivam_Diwan_Resume.pdf"
        onMouseEnter={() => downloadRef.current?.startAnimation()}
        onMouseLeave={() => downloadRef.current?.stopAnimation()}
        className="pressable group inline-flex h-8 items-center gap-2 rounded-lg bg-bg px-3.5 font-mono text-xs font-medium text-text shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]"
      >
        <DownloadIcon
          ref={downloadRef}
          size={14}
          className="text-text-secondary transition-colors duration-150 group-hover:text-text"
        />
        <EditorialText>Download PDF</EditorialText>
      </a>

      <a
        href={PROFILE.resumePath}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open raw PDF in new tab"
        className="pressable group inline-flex h-8 items-center gap-1.5 rounded-lg px-3 font-mono text-xs text-text-secondary transition-colors duration-150 hover:text-text"
      >
        <span className="hidden sm:inline">Raw PDF</span>
        <ArrowUpRight
          className="h-3.5 w-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.7}
        />
      </a>
    </div>
  );
}
