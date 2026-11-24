import { NextRequest, NextResponse } from "next/server";

export interface SyncedLyricLine {
  timeSec: number;
  text: string;
}

export interface LyricsPayload {
  syncedLines: SyncedLyricLine[] | null;
  plainLyrics: string | null;
  instrumental: boolean;
}

interface LrclibRecord {
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
  instrumental?: boolean;
}

function parseLrc(raw?: string | null): SyncedLyricLine[] | null {
  if (!raw?.trim()) return null;
  const lines: SyncedLyricLine[] = [];
  const regex = /^\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]\s*(.*)$/;

  for (const row of raw.split(/\r?\n/)) {
    const match = row.trim().match(regex);
    if (!match) continue;
    const mins = Number(match[1]);
    const secs = Number(match[2]);
    const fracRaw = match[3] ?? "0";
    const frac = Number(fracRaw.padEnd(3, "0")) / 1000;
    const text = match[4].trim();
    if (!text) continue;
    lines.push({ timeSec: mins * 60 + secs + frac, text });
  }

  return lines.length > 0 ? lines : null;
}

const MAX_PARAM_LEN = 120;
const SUCCESS_HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
};
const ERROR_HEADERS = {
  "Cache-Control": "no-store",
};

function cleanTrackTitle(raw: string) {
  return raw
    .replace(/\([^()]*\)|\[[^[\]]*\]/g, " ")
    .replace(/\s*-\s*(slowed|sped up|reverb|remix|edit|version).*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function primaryArtist(raw: string) {
  return raw.split(",")[0]?.trim() || raw.trim();
}

async function queryLrclibJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ShivamDiwanPortfolio/1.0" },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function recordToPayload(record: LrclibRecord): LyricsPayload {
  return {
    syncedLines: parseLrc(record.syncedLyrics),
    plainLyrics: record.plainLyrics?.trim() || null,
    instrumental: Boolean(record.instrumental),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title")?.trim() ?? "").slice(0, MAX_PARAM_LEN);
  const artist = (searchParams.get("artist")?.trim() ?? "").slice(0, MAX_PARAM_LEN);

  if (!title) {
    const empty: LyricsPayload = {
      syncedLines: null,
      plainLyrics: null,
      instrumental: false,
    };
    return NextResponse.json(empty, { headers: ERROR_HEADERS });
  }

  // 1. Exact lookup on LRCLIB
  const exactData = await queryLrclibJson<LrclibRecord>(
    `https://lrclib.net/api/get?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(primaryArtist(artist))}`,
  );
  if (exactData && typeof exactData === "object") {
    const payload = recordToPayload(exactData);
    if (payload.syncedLines || payload.plainLyrics || payload.instrumental) {
      return NextResponse.json(payload, { headers: SUCCESS_HEADERS });
    }
  }

  // 2. Cleaned fallback search (prefer syncedLyrics first, then plainLyrics)
  const cleaned = cleanTrackTitle(title);
  const searchQuery = artist
    ? `${cleaned} ${primaryArtist(artist)}`
    : cleaned;
  const results = await queryLrclibJson<unknown>(
    `https://lrclib.net/api/search?q=${encodeURIComponent(searchQuery)}`,
  );
  if (Array.isArray(results)) {
    const records = results as LrclibRecord[];
    const syncedMatch = records.find((item) => parseLrc(item.syncedLyrics));
    if (syncedMatch) {
      return NextResponse.json(recordToPayload(syncedMatch), {
        headers: SUCCESS_HEADERS,
      });
    }
    const plainMatch = records.find((item) => item.plainLyrics?.trim());
    if (plainMatch) {
      return NextResponse.json(recordToPayload(plainMatch), {
        headers: SUCCESS_HEADERS,
      });
    }
    if (records[0]?.instrumental) {
      return NextResponse.json(
        { syncedLines: null, plainLyrics: null, instrumental: true },
        { headers: SUCCESS_HEADERS },
      );
    }
  }

  return NextResponse.json(
    { syncedLines: null, plainLyrics: null, instrumental: false },
    { headers: ERROR_HEADERS },
  );
}
