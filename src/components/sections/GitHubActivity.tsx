import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/constants/profile";
import { SectionDivider } from "@/components/ui/SectionDivider";
import {
  ContributionGraph,
  type ContributionDay,
} from "@/components/sections/github/ContributionGraph";

interface GitHubContributionsResponse {
  total: {
    lastYear?: number;
  };
  contributions: ContributionDay[];
}

const GITHUB_USERNAME = "DShivam9";
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

async function fetchContributions(): Promise<GitHubContributionsResponse | null> {
  try {
    const res = await fetch(CONTRIBUTIONS_API, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as GitHubContributionsResponse;
    if (!Array.isArray(data.contributions) || data.contributions.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function GitHubActivitySkeleton() {
  return (
    <section aria-label="GitHub activity loading" className="w-full">
      <div className="mx-auto max-w-5xl border-x border-border px-6 py-6 sm:px-10 sm:py-7">
        <div className="h-[146px] w-full animate-pulse rounded-[4px] bg-surface" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-4 w-56 animate-pulse rounded bg-surface" />
          <div className="h-4 w-28 animate-pulse rounded bg-surface" />
        </div>
      </div>
      <SectionDivider />
    </section>
  );
}

export async function GitHubActivity() {
  const data = await fetchContributions();

  const total =
    data?.total?.lastYear ??
    data?.contributions.reduce((sum, day) => sum + day.count, 0) ??
    0;

  return (
    <section aria-label="GitHub contributions" className="w-full">
      <div className="mx-auto max-w-5xl border-x border-border">
        {data ? (
          <ContributionGraph
            contributions={data.contributions}
            total={total}
          />
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-sm text-text-secondary sm:px-10 sm:py-7">
            <p>Live GitHub contribution graph is temporarily unavailable.</p>
            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="pressable inline-flex items-center gap-1.5 text-text underline decoration-border-strong underline-offset-4 hover:decoration-text"
            >
              <span>View @{GITHUB_USERNAME} on GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </div>
        )}
      </div>

      <SectionDivider />
    </section>
  );
}
