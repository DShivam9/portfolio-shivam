import { NextResponse } from "next/server";
import { PROFILE } from "@/constants/profile";

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  durationMs: number;
  isExplicit: boolean;
  previewUrl: string | null;
  coverUrl: string | null;
  spotifyUrl: string;
}

export interface SpotifyPlaylistPayload {
  title: string;
  creator: string;
  coverUrl: string | null;
  playlistUrl: string;
  tracks: SpotifyTrack[];
}

interface EmbedTrackRaw {
  uri?: string;
  title?: string;
  subtitle?: string;
  duration?: number;
  isExplicit?: boolean;
  audioPreview?: { url?: string | null } | null;
}

interface EmbedEntityRaw {
  name?: string;
  title?: string;
  subtitle?: string;
  coverArt?: { sources?: Array<{ url?: string }> };
  visualIdentity?: { image?: Array<{ url?: string }> };
  trackList?: EmbedTrackRaw[];
}

export const revalidate = 3600;

const SPOTIFY_TRACK_ID_RE = /^[a-zA-Z0-9]{22}$/;
const MAX_TRACKS = 50;
const OEMBED_BATCH_SIZE = 8;

function sanitizeSpotifyMediaUrl(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:") return null;
    const host = parsed.hostname.toLowerCase();
    if (host.endsWith(".scdn.co") || host.endsWith(".spotifycdn.com")) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchTrackCover(trackUrl: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`,
      {
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: string };
    return sanitizeSpotifyMediaUrl(data.thumbnail_url);
  } catch {
    return null;
  }
}

export async function GET() {
  const playlistId = PROFILE.socials.spotifyPlaylistId;
  const playlistUrl = PROFILE.socials.spotifyPlaylist;

  try {
    const embedRes = await fetch(
      `https://open.spotify.com/embed/playlist/${playlistId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      },
    );

    if (!embedRes.ok) {
      throw new Error(`Spotify embed HTTP ${embedRes.status}`);
    }

    const html = await embedRes.text();
    const match = html.match(
      /<script\s+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    );
    if (!match?.[1]) {
      throw new Error("Missing Spotify __NEXT_DATA__ payload");
    }

    const parsed = JSON.parse(match[1]) as {
      props?: { pageProps?: { state?: { data?: { entity?: EmbedEntityRaw } } } };
    };
    const entity = parsed.props?.pageProps?.state?.data?.entity;
    if (!entity) {
      throw new Error("Missing Spotify playlist entity");
    }

    const playlistCover = sanitizeSpotifyMediaUrl(
      entity.visualIdentity?.image?.[0]?.url ??
        entity.coverArt?.sources?.[0]?.url ??
        null,
    );

    const rawTracks = (entity.trackList ?? []).slice(0, MAX_TRACKS);
    const baseTracks = rawTracks.map((item, idx) => {
      const uriParts = (item.uri ?? "").split(":");
      const rawId = uriParts[uriParts.length - 1] ?? "";
      const hasValidTrackId =
        Boolean(item.uri?.startsWith("spotify:track:")) &&
        SPOTIFY_TRACK_ID_RE.test(rawId);
      const trackId = hasValidTrackId ? rawId : `track-${idx}`;
      return {
        id: trackId,
        title: item.title?.trim() || "Untitled",
        artist: item.subtitle?.trim() || "",
        durationMs: typeof item.duration === "number" ? item.duration : 0,
        isExplicit: Boolean(item.isExplicit),
        previewUrl: sanitizeSpotifyMediaUrl(item.audioPreview?.url),
        spotifyUrl: hasValidTrackId
          ? `https://open.spotify.com/track/${trackId}`
          : playlistUrl,
        isTrackUri: hasValidTrackId,
      };
    });

    // Fetch per-track album artwork in bounded batches to avoid upstream rate limits
    const coverUrls: (string | null)[] = new Array(baseTracks.length).fill(null);
    for (let i = 0; i < baseTracks.length; i += OEMBED_BATCH_SIZE) {
      const slice = baseTracks.slice(i, i + OEMBED_BATCH_SIZE);
      const batch = await Promise.allSettled(
        slice.map((track) =>
          track.isTrackUri
            ? fetchTrackCover(track.spotifyUrl)
            : Promise.resolve(null),
        ),
      );
      batch.forEach((settled, offset) => {
        coverUrls[i + offset] =
          settled.status === "fulfilled" ? settled.value : null;
      });
    }

    const tracks: SpotifyTrack[] = baseTracks.map((track, idx) => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      durationMs: track.durationMs,
      isExplicit: track.isExplicit,
      previewUrl: track.previewUrl,
      coverUrl: coverUrls[idx] ?? playlistCover,
      spotifyUrl: track.spotifyUrl,
    }));

    const payload: SpotifyPlaylistPayload = {
      title: entity.name?.trim() || entity.title?.trim() || "Shivam's Playlist",
      creator: entity.subtitle?.trim() || "Spotify",
      coverUrl: playlistCover,
      playlistUrl,
      tracks,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    const fallback: SpotifyPlaylistPayload = {
      title: "Shivam's Playlist",
      creator: "Spotify",
      coverUrl: null,
      playlistUrl,
      tracks: [],
    };
    return NextResponse.json(fallback, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
