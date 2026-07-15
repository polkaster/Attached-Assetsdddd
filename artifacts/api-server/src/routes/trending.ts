import { Router, type IRouter } from "express";
import { GetTrendingQueryParams, GetTrendingResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// Public Invidious instances — tried in order, first success wins
const INVIDIOUS_INSTANCES = [
  "invidious.flokinet.to",
  "invidious.perennialte.ch",
  "yewtu.be",
  "inv.tux.pizza",
];

interface InvidiousVideo {
  type: string;
  videoId: string;
  title: string;
  author: string;
  viewCount: number;
  viewCountText: string;
  published: number; // unix timestamp (seconds)
  publishedText: string;
  lengthSeconds: number;
  videoThumbnails: Array<{ quality: string; url: string; width: number; height: number }>;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViewCount(count: number): string {
  if (!count || count <= 0) return "Live";
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}M ditonton`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}Jt ditonton`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}Rb ditonton`;
  return `${count} ditonton`;
}

function formatPublished(unixSecs: number): string {
  if (!unixSecs) return "Baru saja";
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixSecs;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} bulan lalu`;
  return `${Math.floor(diff / 31536000)} tahun lalu`;
}

function ytThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

async function fetchFromInvidious(
  regionCode: string
): Promise<InvidiousVideo[]> {
  const errors: string[] = [];
  for (const host of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(
        `https://${host}/api/v1/trending?region=${regionCode}&type=default`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(8000),
        }
      );
      if (!res.ok) {
        errors.push(`${host}: HTTP ${res.status}`);
        continue;
      }
      const data = (await res.json()) as InvidiousVideo[];
      if (Array.isArray(data) && data.length > 0) return data;
      errors.push(`${host}: empty response`);
    } catch (err) {
      errors.push(`${host}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  throw new Error(`All instances failed: ${errors.join("; ")}`);
}

router.get("/trending", async (req, res): Promise<void> => {
  const parsed = GetTrendingQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const regionCode = parsed.data.regionCode ?? "ID";

  let rawVideos: InvidiousVideo[];
  try {
    rawVideos = await fetchFromInvidious(regionCode);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch trending from all Invidious instances");
    res.status(502).json({ error: "Gagal mengambil data trending dari YouTube" });
    return;
  }

  const videos = rawVideos
    .filter((v) => v.type === "video" && v.videoId && v.title)
    .slice(0, 30)
    .map((v, index) => ({
      videoId: v.videoId,
      title: v.title,
      channelName: v.author,
      viewCount: formatViewCount(v.viewCount),
      publishedAt: formatPublished(v.published),
      // Always use YouTube's CDN — Invidious thumbnail URLs are self-hosted & unreliable
      thumbnailUrl: ytThumbnail(v.videoId),
      duration: formatDuration(v.lengthSeconds),
      rank: index + 1,
    }));

  res.json(
    GetTrendingResponse.parse({
      videos,
      regionCode,
    })
  );
});

export default router;
