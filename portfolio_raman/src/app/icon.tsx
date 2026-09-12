import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Monogram mark — replaces the stock Next.js favicon and the profile photo
// that was previously doing duty as one.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e4703a",
          color: "#14110d",
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          borderRadius: 7,
        }}
      >
        RS
      </div>
    ),
    { ...size },
  );
}
