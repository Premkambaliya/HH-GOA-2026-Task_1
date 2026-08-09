"use client";

import { forwardRef } from "react";

type OgCompositeProps = {
  cardDataUrl: string | null;
  name: string;
  builderTitle: string;
  mode: "id" | "pfp";
  accent: string;
};

const OgComposite = forwardRef<HTMLDivElement, OgCompositeProps>(
  function OgComposite({ cardDataUrl, name, builderTitle, mode, accent }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 64px",
          background: "linear-gradient(140deg, #0b6839 0%, #074a28 50%, #0a0a0a 120%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(254, 225, 1, 0.18)",
            filter: "blur(10px)",
          }}
        />

        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: mode === "id" ? 18 : 15,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#fee101",
              margin: 0,
              whiteSpace: "nowrap",
            }}
          >
            Hacker House Goa · 28–31 Oct 2026
          </p>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: mode === "id" ? 84 : 64,
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "#fffbe8",
              margin: "20px 0 0",
              whiteSpace: "nowrap",
            }}
          >
            HH GOA
            <span style={{ display: "block", color: accent }}>SIGNAL PASS</span>
          </h1>

          <p
            style={{
              fontSize: 34,
              color: "#fffbe8",
              margin: "28px 0 0",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name || "Your Name"}
          </p>
          <p
            style={{
              fontSize: 26,
              color: "#ff0080",
              margin: "6px 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {mode === "id" ? builderTitle || "builder" : "PFP frame"}
          </p>

          <span
            style={{
              display: "inline-block",
              marginTop: 32,
              padding: "10px 20px",
              border: "2px solid #0a0a0a",
              background: accent,
              color: "#0a0a0a",
              fontFamily: "var(--font-mono)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            #FrameInGoa
          </span>
        </div>

        <div
          style={{
            position: "relative",
            height: 534,
            width: mode === "id" ? 372 : 534,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cardDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cardDataUrl}
              alt=""
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: 20,
                boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
);

export default OgComposite;
