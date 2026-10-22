import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The card LinkedIn shows when the /amazon link is pasted in a message.
// Real photo, name first, own domain, no Amazon logo, so it reads as a person and not a phish.

export const alt = "Shivansh Singh, software engineer in Boston, applying for Amazon SDE, Early Career 2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAME = "Shivansh Singh";
const ROLE = "Software engineer in Boston";
const ASK = "Applying for Amazon SDE, Early Career 2027";
const DOMAIN = "shivanshsingh.in";
const HINT = "1-minute intro + referral details";

async function geist(weight: number) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Geist font not found");
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public", "gpt_image.png"));
  // Offline builds fall back to next/og's bundled font instead of failing.
  const fonts = await Promise.all([geist(400), geist(700)])
    .then(([regular, bold]) => [
      { name: "Geist", data: regular, weight: 400 as const },
      { name: "Geist", data: bold, weight: 700 as const },
    ])
    .catch(() => undefined);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px 0",
          background: "#080808",
          color: "#f0f0f0",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 56, flex: 1 }}>
          <div
            style={{
              display: "flex",
              width: 280,
              height: 280,
              padding: 8,
              borderRadius: 9999,
              backgroundImage: "linear-gradient(135deg, #f04bda, #5865ff 55%, #1cc8d0)",
            }}
          >
            <img
              src={`data:image/png;base64,${photo.toString("base64")}`}
              alt=""
              width={264}
              height={264}
              style={{ borderRadius: 9999, border: "8px solid #080808", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>{NAME}</div>
            <div style={{ marginTop: 18, fontSize: 32, color: "#888888" }}>{ROLE}</div>
            <div style={{ display: "flex", marginTop: 36 }}>
              <div
                style={{
                  display: "flex",
                  padding: "14px 26px",
                  borderRadius: 9999,
                  background: "#f0f0f0",
                  color: "#080808",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                {ASK}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 0 36px",
            borderTop: "1px solid #242424",
            fontSize: 26,
            color: "#888888",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#cc0000",
                color: "#ffffff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              SS
            </div>
            <div style={{ color: "#f0f0f0" }}>{DOMAIN}</div>
          </div>
          <div>{HINT}</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 8,
            backgroundImage: "linear-gradient(90deg, #f04bda, #5865ff, #1cc8d0)",
          }}
        />
      </div>
    ),
    { ...size, fonts }
  );
}
