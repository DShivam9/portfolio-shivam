import { SectionDivider } from "@/components/ui/SectionDivider";
import { AboutCloudPeekers } from "@/components/ui/CloudPeeker";
import { ScrollHeading, ScrollReveal } from "@/components/ui/ScrollReveal";

export function About() {
  return (
    <section id="about" className="w-full scroll-mt-16">
      <div className="section-shell">
        <div className="relative z-10 flex items-end justify-between border-b border-border px-6 py-2.5 sm:px-10">
          <ScrollHeading>
            <h2 className="section-title">
              About
            </h2>
          </ScrollHeading>

          <div className="-mb-3.5 -mt-2">
            <AboutCloudPeekers />
          </div>
        </div>

        <ul className="relative z-20 list-disc space-y-3.5 bg-bg px-6 py-6 pl-11 font-mono text-sm leading-relaxed text-text-secondary marker:text-text-muted [text-wrap:pretty] sm:px-10 sm:py-7 sm:pl-14">
          <li>
            <ScrollReveal y={12} delay={0.08}>
              <strong className="font-medium text-text">
                Full-stack developer
              </strong>{" "}
              based in{" "}
              <strong className="font-medium text-text">Hyderabad</strong>,
              building complete web products end to end, from backend systems and
              APIs to clean, responsive interfaces.
            </ScrollReveal>
          </li>

          <li>
            <ScrollReveal y={12} delay={0.17}>
              <strong className="font-medium text-text">
                Learn best by building:
              </strong>{" "}
              I pick up new tools and frameworks by turning them into real,
              impactful software, working through edge cases firsthand, and
              iterating until the result holds up.
            </ScrollReveal>
          </li>

          <li>
            <ScrollReveal y={12} delay={0.26}>
              Use <strong className="font-medium text-text">Claude Code</strong>,{" "}
              <strong className="font-medium text-text">Cursor</strong>, and{" "}
              <strong className="font-medium text-text">Antigravity</strong>{" "}
              daily, and keep exploring new AI tools as they come out. I drive the
              architecture and design, and use AI to move faster.
            </ScrollReveal>
          </li>

          <li>
            <ScrollReveal y={12} delay={0.35}>
              Take ownership of what I ship, sweat the details that make products
              genuinely enjoyable to use, and want to be around{" "}
              <strong className="font-medium text-text">strong engineers</strong>{" "}
              where I can contribute and grow fast.
            </ScrollReveal>
          </li>
        </ul>
      </div>

      <SectionDivider />
    </section>
  );
}
