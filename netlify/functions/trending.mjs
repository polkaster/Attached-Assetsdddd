// Netlify serverless function — replaces the Express /api/trending route.
// Uses public Invidious instances (no API key required).

const INVIDIOUS_INSTANCES = [
  "invidious.flokinet.to",
  "yewtu.be",
  "inv.tux.pizza",
  "invidious.perennialte.ch",
];

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatViewCount(count) {
  if (!count || count <= 0) return "Live";
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}M ditonton`;
  if (count >= 1_000_000)     return `${(count / 1_000_000).toFixed(1)}Jt ditonton`;
  if (count >= 1_000)         return `${(count / 1_000).toFixed(1)}Rb ditonton`;
  return `${count} ditonton`;
}

function formatPublished(unixSecs) {
  if (!unixSecs) return "Baru saja";
  const diff = Math.floor(Date.now() / 1000) - unixSecs;
  if (diff < 60)       return "Baru saja";
  if (diff < 3600)     return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400)    return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000)  return `${Math.floor(diff / 86400)} hari lalu`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} bulan lalu`;
  return `${Math.floor(diff / 31536000)} tahun lalu`;
}

async function fetchTrending(regionCode) {
  const errors = [];
  for (const host of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(
        `https://${host}/api/v1/trending?region=${regionCode}&type=default`,
        {
          headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
          signal: AbortSignal.timeout(8000),
        }
      );
      if (!res.ok) { errors.push(`${host}: HTTP ${res.status}`); continue; }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
      errors.push(`${host}: empty`);
    } catch (err) {
      errors.push(`${host}: ${err.message}`);
    }
  }
  throw new Error(`All instances failed: ${errors.join("; ")}`);
}

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  const regionCode = event.queryStringParameters?.regionCode ?? "ID";

  let rawVideos;
  try {
    rawVideos = await fetchTrending(regionCode);
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Gagal mengambil data trending dari YouTube" }),
    };
  }

  const videos = rawVideos
    .filter((v) => v.type === "video" && v.videoId && v.title)
    .slice(0, 30)
    .map((v, index) => ({
      videoId:      v.videoId,
      title:        v.title,
      channelName:  v.author ?? "Unknown",
      viewCount:    formatViewCount(v.viewCount),
      publishedAt:  formatPublished(v.published),
      thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
      duration:     formatDuration(v.lengthSeconds),
      rank:         index + 1,
    }));

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ videos, regionCode }),
  };
};
