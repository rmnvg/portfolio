import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14110d",
          backgroundImage:
            "radial-gradient(180px circle at 30% 10%, rgba(228,112,58,0.45), transparent 65%)",
          color: "#f0e9dc",
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: "-0.04em",
        }}
      >
        RS
        <span style={{ color: "#e4703a" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
