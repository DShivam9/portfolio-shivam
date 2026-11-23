// Calm, unhurried GPU letter-by-letter vertical slot-glide on parent .group hover
export function EditorialText({
  children,
  hoverClassName = "text-text",
}: {
  children: string;
  hoverClassName?: string;
}) {
  const chars = Array.from(children);
  const stepMs = chars.length > 14 ? 14 : 24;

  return (
    <span className="relative inline-flex align-bottom leading-[1.3]">
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex">
        {chars.map((char, index) => {
          const glyph = char === " " ? "\u00A0" : char;
          const delay = { transitionDelay: `${index * stepMs}ms` };
          return (
            <span
              key={`${index}-${char}`}
              className="relative inline-grid overflow-hidden"
            >
              <span
                style={delay}
                className="col-start-1 row-start-1 transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[115%] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
              >
                {glyph}
              </span>
              <span
                style={delay}
                className={`col-start-1 row-start-1 translate-y-[115%] transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:hidden ${hoverClassName}`}
              >
                {glyph}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
