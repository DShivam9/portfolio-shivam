import { NextResponse } from "next/server";

const LIKES_KEY = "portfolio:likes";
let memoryFallbackCount = 0;

function getRedisConfig(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ""), token };
}

async function runRedisCommand(
  config: { url: string; token: string },
  command: string[],
): Promise<number> {
  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(3500),
  });

  if (!res.ok) {
    throw new Error(`Redis REST failed with status ${res.status}`);
  }

  const data = (await res.json()) as { result?: unknown };
  const parsed = Number(data.result ?? 0);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
}

export async function GET() {
  const config = getRedisConfig();
  if (!config) {
    return NextResponse.json(
      { count: memoryFallbackCount, persistent: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const count = await runRedisCommand(config, ["GET", LIKES_KEY]);
    return NextResponse.json(
      { count, persistent: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("Failed to fetch likes:", err);
    return NextResponse.json(
      { count: memoryFallbackCount, persistent: false },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  let action: unknown;
  try {
    const body = (await request.json()) as { action?: unknown };
    action = body?.action;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (action !== "like" && action !== "unlike") {
    return NextResponse.json(
      { error: "Invalid action; expected 'like' or 'unlike'" },
      { status: 400 },
    );
  }

  const config = getRedisConfig();
  if (!config) {
    memoryFallbackCount = Math.max(
      0,
      memoryFallbackCount + (action === "like" ? 1 : -1),
    );
    return NextResponse.json(
      { count: memoryFallbackCount, persistent: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    let count = await runRedisCommand(config, [
      action === "like" ? "INCR" : "DECR",
      LIKES_KEY,
    ]);
    if (count < 0) {
      await runRedisCommand(config, ["SET", LIKES_KEY, "0"]);
      count = 0;
    }
    return NextResponse.json(
      { count, persistent: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("Failed to update likes:", err);
    return NextResponse.json(
      { error: "Failed to update likes" },
      { status: 500 },
    );
  }
}
