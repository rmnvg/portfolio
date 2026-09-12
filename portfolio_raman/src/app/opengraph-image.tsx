import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { personal, stats } from "@/lib/data";
import { ogAlt } from "@/lib/site";

export const alt = ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Font = {
  name: string;
  data: ArrayBuffer | Buffer;
  style: "normal";
  weight: 400;
};

// Geist ships with the OG renderer, so the sans face is always available offline.
async function sansFont(): Promise<Font[]> {
  try {
    const data = await readFile(
      join(
        process.cwd(),
        "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
      ),
    );
    return [{ name: "Geist", data, style: "normal", weight: 400 }];
  } catch {
    return [];
  }
}

// The display face has no local copy — fetched at build time, and the card
// degrades to sans for the headline if the network is unavailable.
async function displayFont(): Promise<Font[]> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return [];
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return [{ name: "Instrument Serif", data, style: "normal", weight: 400 }];
  } catch {
    return [];
  }
}

const BG = "#14110d";
const FG = "#f0e9dc";
const MUTED = "#9a9083";
const BORDER = "#332c23";
const ACCENT = "#e4703a";
const ACCENT_2 = "#5fb49c";

export default async function Image() {
  const [sans, display] = await Promise.all([sansFont(), displayFont()]);
  const fonts = [...sans, ...display];
  const serif = display.length ? "Instrument Serif" : "Geist";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          backgroundImage: `radial-gradient(900px circle at 12% -10%, rgba(228,112,58,0.20), transparent 60%), radial-gradient(700px circle at 95% 110%, rgba(95,180,156,0.13), transparent 60%)`,
          padding: "64px 72px",
          color: FG,
          fontFamily: "Geist",
        }}
      >
        {/* masthead */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 21,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          <span style={{ color: FG }}>{personal.name}</span>
          <span style={{ color: BORDER }}>/</span>
          <span>Software Engineer · Gen AI</span>
          <span style={{ color: BORDER }}>/</span>
          <span>{personal.location}</span>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: serif,
              fontSize: 82,
              lineHeight: 1.04,
              letterSpacing: "-0.022em",
              maxWidth: 1000,
            }}
          >
            <span>2.5 million documents a year,&nbsp;</span>
            <span style={{ color: ACCENT }}>classified without a human.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.45,
              color: MUTED,
              maxWidth: 720,
            }}
          >
            I build the retrieval and LLM systems behind numbers like that — and
            the guardrails that keep them auditable when they are wrong.
          </div>
        </div>

        {/* stat rail */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 26,
          }}
        >
          <div style={{ display: "flex", gap: 44 }}>
            {stats.slice(0, 3).map((s) => (
              <div
                key={s.label}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <span style={{ fontSize: 38, color: ACCENT_2 }}>{s.value}</span>
                <span
                  style={{
                    fontSize: 17,
                    color: MUTED,
                    marginTop: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              marginLeft: 32,
              paddingBottom: 4,
              fontSize: 17,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: MUTED,
            }}
          >
            {personal.badge}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
