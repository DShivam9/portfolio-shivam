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
const GITHUB_CONTRIBUTIONS_URL = `https://github.com/users/${GITHUB_USERNAME}/contributions`;
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

function parseGitHubContributionsHtml(
  html: string,
): GitHubContributionsResponse | null {
  const countsById = new Map<string, number>();
  const tipRe = /<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/gi;
  let tipMatch: RegExpExecArray | null;
  while ((tipMatch = tipRe.exec(html)) !== null) {
    const countMatch = tipMatch[2].trim().match(/^(\d+)\s+contribution/i);
    countsById.set(tipMatch[1], countMatch ? Number(countMatch[1]) : 0);
  }

  const days: ContributionDay[] = [];
  const cellRe = /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*>/gi;
  let cellMatch: RegExpExecArray | null;
  while ((cellMatch = cellRe.exec(html)) !== null) {
    const tag = cellMatch[0];
    const date = cellMatch[1];
    const levelMatch = tag.match(/data-level="([0-4])"/i);
    const idMatch = tag.match(/id="([^"]+)"/i);
    const level = (levelMatch ? Number(levelMatch[1]) : 0) as 0 | 1 | 2 | 3 | 4;
    const count = idMatch ? (countsById.get(idMatch[1]) ?? 0) : 0;
    days.push({ date, count, level });
  }

  if (days.length === 0) return null;

  // GitHub renders the table row-by-row (Sundays, Mondays...); sort chronologically for buildWeeks
  days.sort((a, b) => a.date.localeCompare(b.date));

  const totalMatch = html.match(
    /([\d,]+)\s+contributions?\s+in\s+the\s+last\s+year/i,
  );
  const parsedTotal = totalMatch
    ? Number(totalMatch[1].replace(/,/g, ""))
    : undefined;

  return {
    total: {
      lastYear: Number.isFinite(parsedTotal) ? parsedTotal : undefined,
    },
    contributions: days,
  };
}

async function fetchContributions(): Promise<GitHubContributionsResponse | null> {
  // 1. Direct GitHub contributions fragment (15m fresh, avoids third-party proxy lag)
  try {
    const res = await fetch(GITHUB_CONTRIBUTIONS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "X-Requested-With": "XMLHttpRequest",
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(4500),
    });
    if (res.ok) {
      const parsed = parseGitHubContributionsHtml(await res.text());
      if (parsed) return parsed;
    }
  } catch {
    // Fall through to secondary JSON mirror
  }

  // 2. Fallback JSON mirror
  try {
    const res = await fetch(CONTRIBUTIONS_API, {
      next: { revalidate: 900 },
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
      <div className="mx-auto max-w-5xl border-x border-border px-6 py-10 sm:px-7 sm:py-12">
        <div className="h-[168px] w-full animate-pulse rounded-[4px] bg-surface" />
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
    <section
      id="activity"
      aria-label="GitHub contributions"
      className="w-full scroll-mt-16"
    >
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
