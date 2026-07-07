import { XMLParser } from "fast-xml-parser";

export interface MediumPost {
  title: string;
  url: string;
  publishedAt: string; // ISO
  tags: string[];      // lowercase
  excerpt: string;
  thumbnail?: string;
}

const MEDIUM_HANDLE = process.env.MEDIUM_HANDLE ?? "me.shivansh007";
const FEED_URL = `https://medium.com/feed/@${MEDIUM_HANDLE}`;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function firstImageSrc(html: string): string | undefined {
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? m[1] : undefined;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export async function getMediumPosts(limit?: number): Promise<MediumPost[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "shivanshsingh.in portfolio-fetch" },
    });

    if (!res.ok) return [];
    const xml = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      cdataPropName: "__cdata",
      textNodeName: "#text",
    });
    const parsed = parser.parse(xml);

    const raw: unknown = parsed?.rss?.channel?.item ?? [];
    const items: unknown[] = Array.isArray(raw) ? raw : [raw];

    const posts = items
      .map((entry): MediumPost | null => {
        const e = entry as Record<string, unknown>;
        const readCdata = (v: unknown): string => {
          if (v == null) return "";
          if (typeof v === "string") return v;
          if (typeof v === "object" && "__cdata" in (v as Record<string, unknown>)) {
            const c = (v as Record<string, unknown>).__cdata;
            return typeof c === "string" ? c : "";
          }
          if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
            const t = (v as Record<string, unknown>)["#text"];
            return typeof t === "string" ? t : "";
          }
          return "";
        };

        const title = readCdata(e.title);
        const link = typeof e.link === "string" ? e.link : readCdata(e.link);
        const pubDate = typeof e.pubDate === "string" ? e.pubDate : readCdata(e.pubDate);
        const contentEncoded =
          readCdata((e as Record<string, unknown>)["content:encoded"]) ||
          readCdata(e.description);

        const catField = e.category;
        const cats: string[] = Array.isArray(catField)
          ? catField.map(readCdata)
          : catField
          ? [readCdata(catField)]
          : [];

        if (!title || !link) return null;

        return {
          title: title.trim(),
          url: link.trim(),
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          tags: cats.map((c) => c.toLowerCase().trim()).filter(Boolean),
          excerpt: truncate(stripHtml(contentEncoded), 220),
          thumbnail: firstImageSrc(contentEncoded),
        };
      })
      .filter((p): p is MediumPost => p !== null)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return typeof limit === "number" ? posts.slice(0, limit) : posts;
  } catch {
    return [];
  }
}
