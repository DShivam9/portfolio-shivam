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

export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="w-full border-y border-border bg-bg"
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, var(--border) 0 1px, transparent 1px 8px)",
      }}
    >
      <div className="relative mx-auto h-9 max-w-5xl border-x border-border">
        <Crosshair className="-left-px -top-px -translate-x-1/2 -translate-y-1/2" />
        <Crosshair className="-right-px -top-px translate-x-1/2 -translate-y-1/2" />
        <Crosshair className="-bottom-px -left-px -translate-x-1/2 translate-y-1/2" />
        <Crosshair className="-bottom-px -right-px translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
}
