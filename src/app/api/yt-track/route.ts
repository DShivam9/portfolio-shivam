import { NextRequest, NextResponse } from "next/server";

const YT_VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
const MAX_PARAM_LEN = 120;
const MAX_DURATION_MS = 3_600_000;
const MAX_TRAVERSAL_DEPTH = 30;
const SUCCESS_HEADERS = {
  "Cache-Control": "public, s-maxage=604800, stale-while-revalidate=2592000",
};
const ERROR_HEADERS = {
  "Cache-Control": "no-store",
};

interface YtCandidate {
  videoId: string;
  title: string;
  channel: string;
  durationSec: number | null;
}

function parseLengthText(text?: string): number | null {
  if (!text) return null;
  const parts = text
    .trim()
    .split(":")
    .map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function extractVideoRenderers(
  node: unknown,
  out: YtCandidate[],
  limit = 12,
  depth = 0,
): void {
  if (!node || typeof node !== "object" || out.length >= limit || depth > MAX_TRAVERSAL_DEPTH) {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      if (out.length >= limit) break;
      extractVideoRenderers(item, out, limit, depth + 1);
    }
    return;
  }

  const record = node as Record<string, unknown>;
  if ("videoRenderer" in record && record.videoRenderer) {
    const vr = record.videoRenderer as Record<string, unknown>;
    const videoId =
      typeof vr.videoId === "string" && YT_VIDEO_ID_RE.test(vr.videoId)
        ? vr.videoId
        : null;
    if (videoId) {
      const titleObj = vr.title as
        | { runs?: Array<{ text?: string }>; simpleText?: string }
        | undefined;
      const title =
        titleObj?.runs?.map((r) => r.text ?? "").join("") ||
        titleObj?.simpleText ||
        "";
      const ownerObj = vr.ownerText as
        | { runs?: Array<{ text?: string }> }
        | undefined;
      const channel = ownerObj?.runs?.map((r) => r.text ?? "").join("") || "";
      const lengthObj = vr.lengthText as { simpleText?: string } | undefined;
      const durationSec = parseLengthText(lengthObj?.simpleText);
      out.push({ videoId, title, channel, durationSec });
    }
    return;
  }

  for (const val of Object.values(record)) {
    if (out.length >= limit) break;
    if (val && typeof val === "object") {
      extractVideoRenderers(val, out, limit, depth + 1);
    }
  }
}

function scoreCandidate(
  candidate: YtCandidate,
  targetTitle: string,
  targetDurationSec: number | null,
): number {
  let score = 0;
  const titleLower = candidate.title.toLowerCase();
  const channelLower = candidate.channel.toLowerCase();
  const targetLower = targetTitle.toLowerCase();

  // Official auto-generated Topic channels are studio audio masters & embed cleanly
  if (channelLower.includes(" - topic")) score += 45;
  if (titleLower.includes("official audio") || titleLower.includes("(audio)")) {
    score += 25;
  }
  if (titleLower.includes("lyric")) score += 10;

  // Penalize non-studio versions unless the track title itself asks for them
  const badWords = ["live", "cover", "karaoke", "reaction", "tutorial", "1 hour", "8d"];
  for (const word of badWords) {
    if (titleLower.includes(word) && !targetLower.includes(word)) {
      score -= 40;
    }
  }

  // Prefer close duration match to Spotify track length
  if (targetDurationSec && candidate.durationSec) {
    const diff = Math.abs(candidate.durationSec - targetDurationSec);
    if (diff <= 5) score += 35;
    else if (diff <= 15) score += 20;
    else if (diff <= 35) score += 5;
    else if (diff > 90) score -= 35;
  }

  // Reject very short clips (< 45s) or huge compilations (> 15m)
  if (candidate.durationSec !== null) {
    if (candidate.durationSec < 45 || candidate.durationSec > 900) score -= 50;
  }

  return score;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title")?.trim() ?? "").slice(0, MAX_PARAM_LEN);
  const artist = (searchParams.get("artist")?.trim() ?? "").slice(0, MAX_PARAM_LEN);
  const rawDurationMs = Number(searchParams.get("durationMs") ?? 0);
  const durationMs =
    Number.isFinite(rawDurationMs) && rawDurationMs > 0
      ? Math.min(rawDurationMs, MAX_DURATION_MS)
      : 0;
  const targetDurationSec = durationMs > 0 ? durationMs / 1000 : null;

  if (!title) {
    return NextResponse.json({ videoId: null }, { headers: ERROR_HEADERS });
  }

  const primaryArtist = artist.split(",")[0]?.trim() || artist;
  const query = `${title} ${primaryArtist} audio`.trim();

  try {
    const res = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 604800 },
      },
    );

    if (!res.ok) {
      return NextResponse.json({ videoId: null }, { headers: ERROR_HEADERS });
    }

    const html = await res.text();
    const match = html.match(/var\s+ytInitialData\s*=\s*(\{[\s\S]*?\});<\/script>/);
    if (!match?.[1]) {
      return NextResponse.json({ videoId: null }, { headers: ERROR_HEADERS });
    }

    const data = JSON.parse(match[1]) as unknown;
    const candidates: YtCandidate[] = [];
    extractVideoRenderers(data, candidates, 12);

    if (!candidates.length) {
      return NextResponse.json({ videoId: null }, { headers: ERROR_HEADERS });
    }

    let best = candidates[0];
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      const s = scoreCandidate(candidate, title, targetDurationSec);
      if (s > bestScore) {
        bestScore = s;
        best = candidate;
      }
    }

    return NextResponse.json(
      { videoId: best.videoId },
      { headers: SUCCESS_HEADERS },
    );
  } catch {
    return NextResponse.json({ videoId: null }, { headers: ERROR_HEADERS });
  }
}
