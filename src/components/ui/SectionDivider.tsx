import { useId } from "react";

function Crosshair({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 flex h-2.5 w-2.5 items-center justify-center ${className}`}
    >
      <span className="absolute h-px w-full bg-border-strong" />
      <span className="absolute h-full w-px bg-border-strong" />
    </span>
  );
}

export function InterlockingPattern({ className = "" }: { className?: string }) {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern
          id={patternId}
          width="240"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="var(--divider-stroke)"
            strokeWidth="1"
            strokeLinejoin="miter"
          >
            {/* Cluster 1: upright L + nested inverted stepped-L + lower-right L */}
            <path d="M 3 8 H 14 V 23 H 44 V 33 H 3 Z" />
            <path d="M 18 3 H 78 V 12 H 44 V 19 H 18 Z" />
            <path d="M 48 16 H 78 V 33 H 67 V 25 H 48 Z" />

            {/* Cluster 2: tall left hook + stepped lower bar + top-right inverted L */}
            <path d="M 82 3 H 116 V 13 H 94 V 33 H 82 Z" />
            <path d="M 98 17 H 126 V 24 H 158 V 33 H 98 Z" />
            <path d="M 120 3 H 158 V 20 H 130 V 13 H 120 Z" />

            {/* Cluster 3: top hooked bar + stepped bottom L + right vertical wrap */}
            <path d="M 162 3 H 214 V 19 H 202 V 12 H 162 Z" />
            <path d="M 162 16 H 198 V 24 H 222 V 33 H 162 Z" />
            <path d="M 218 3 H 239 V 33 H 226 V 20 H 218 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full border-y border-border bg-bg"
    >
      <div className="relative mx-auto h-9 max-w-5xl border-x border-border">
        <InterlockingPattern className="opacity-60" />
        <Crosshair className="-left-px -top-px -translate-x-1/2 -translate-y-1/2" />
        <Crosshair className="-right-px -top-px translate-x-1/2 -translate-y-1/2" />
        <Crosshair className="-bottom-px -left-px -translate-x-1/2 translate-y-1/2" />
        <Crosshair className="-bottom-px -right-px translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
