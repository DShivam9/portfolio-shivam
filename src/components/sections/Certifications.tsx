import { ArrowUpRight } from "lucide-react";
import { FaAws } from "react-icons/fa6";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  url: string;
}

const CERTIFICATIONS: readonly Certification[] = [
  {
    title: "AWS Cloud Practitioner Essentials",
    issuer: "AWS Training & Certification",
    date: "Sep 2026",
    url: "https://drive.google.com/file/d/1c7zt5a_Phm3AUL7vImDu2rt3Brlhoau0/view?usp=sharing",
  },
];

export function Certifications() {
  return (
    <section id="certifications" className="w-full scroll-mt-16">
      <div className="mx-auto max-w-5xl border-x border-border">
        <div className="border-b border-border px-6 py-3 sm:px-10">
          <h2 className="font-brand text-3xl font-normal leading-none tracking-normal text-text">
            Certifications
          </h2>
        </div>

        <ScrollReveal y={18}>
          <div className="divide-y divide-border">
          {CERTIFICATIONS.map((cert) => (
            <a
              key={cert.title}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between gap-4 px-6 py-6 transition-colors duration-150 hover:bg-surface/40 sm:flex-row sm:items-center sm:px-10 sm:py-7"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-[#FF9900]"
                >
                  <FaAws className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="text-base font-medium tracking-tight text-text sm:text-lg">
                    {cert.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-text-secondary">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 font-mono text-xs tabular-nums text-text-muted transition-colors duration-150 group-hover:text-text sm:justify-end">
                <span>{cert.date}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.7}
                />
              </span>
            </a>
          ))}
          </div>
        </ScrollReveal>
      </div>

      <SectionDivider />
    </section>
  );
}
