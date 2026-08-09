import { ImageResponse } from "next/og";

export const alt = "FrameInGoa · HH Goa 2026 Builder ID & PFP generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          background: "linear-gradient(145deg, #0b6839 0%, #074a28 55%, #0a0a0a 120%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "10px 18px",
            border: "2px solid #0a0a0a",
            background: "#fee101",
            color: "#0a0a0a",
            fontSize: 22,
            letterSpacing: 3,
            fontWeight: 700,
          }}
        >
          GOA, INDIA · 28–31 OCT 2026
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 108,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: -3,
            color: "#fffbe8",
          }}
        >
          <span>HH GOA</span>
          <span style={{ color: "#fee101" }}>SIGNAL PASS</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "rgba(255,251,232,0.8)",
          }}
        >
          Less noise. More signal. #FrameInGoa
        </div>
      </div>
    ),
    size
  );
}
