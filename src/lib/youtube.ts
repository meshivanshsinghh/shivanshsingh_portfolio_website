import { XMLParser } from "fast-xml-parser";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? "";

export async function getLatestVideos(count = 3): Promise<YouTubeVideo[]> {
  if (!CHANNEL_ID) return [];

  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const res = await fetch(rssUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const parsed = parser.parse(xml);

    const entries: unknown[] = parsed?.feed?.entry ?? [];
    const items = Array.isArray(entries) ? entries : [entries];

    return items.slice(0, count).map((entry: unknown) => {
      const e = entry as Record<string, unknown>;
      const videoId = String(
        (e["yt:videoId"] as string) ??
        String(e["id"]).replace("yt:video:", "")
      );
      return {
        videoId,
        title: String(e["title"] ?? ""),
        published: String(e["published"] ?? ""),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch {
    return [];
  }
}
