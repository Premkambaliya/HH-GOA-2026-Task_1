"use client";

import { forwardRef } from "react";
import type { PhotoTransform } from "./IdCard";

type PfpFrameProps = {
  photoUrl: string | null;
  name: string;
  photo: PhotoTransform;
  accent?: string;
};

const PfpFrame = forwardRef<HTMLDivElement, PfpFrameProps>(function PfpFrame(
  { photoUrl, name, photo, accent = "#fee101" },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative w-full max-w-[380px] overflow-hidden border-[6px] border-black bg-[#0b6839] shadow-[8px_8px_0_#fee101]"
      style={{ aspectRatio: "1 / 1", borderColor: accent === "#fffbe8" ? "#0b6839" : accent }}
    >
      <div className="absolute inset-0 overflow-hidden bg-[#074a28]">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            draggable={false}
            className="pointer-events-none absolute top-1/2 left-1/2 max-w-none select-none"
            style={{
              width: `${100 * photo.scale}%`,
              height: `${100 * photo.scale}%`,
              objectFit: "cover",
              transform: `translate(calc(-50% + ${photo.x}px), calc(-50% + ${photo.y}px))`,
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-[family-name:var(--font-mono)] text-sm tracking-wider text-[#fffbe8]/45 uppercase">
            Upload a photo
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute top-3 left-3 h-6 w-6 border-t-[3px] border-l-[3px]"
        style={{ borderColor: accent }}
      />
      <div
        className="pointer-events-none absolute top-3 right-3 h-6 w-6 border-t-[3px] border-r-[3px]"
        style={{ borderColor: accent }}
      />
      <div
        className="pointer-events-none absolute bottom-[5.5rem] left-3 h-6 w-6 border-b-[3px] border-l-[3px]"
        style={{ borderColor: accent }}
      />
      <div
        className="pointer-events-none absolute right-3 bottom-[5.5rem] h-6 w-6 border-b-[3px] border-r-[3px]"
        style={{ borderColor: accent }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
        <span className="border border-black bg-black/70 px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[#fffbe8] uppercase">
          2:47 pm Studio
        </span>
        <span
          className="border border-black px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] font-bold tracking-wider text-black uppercase"
          style={{ backgroundColor: accent === "#0b6839" ? "#fee101" : accent }}
        >
          #FrameInGoa
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent px-3.5 pt-16 pb-3.5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p
              className="font-[family-name:var(--font-display)] text-[1.65rem] leading-none tracking-tight"
              style={{ color: accent === "#0b6839" ? "#fee101" : accent }}
            >
              HACKER HOUSE
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[#fffbe8]/70 uppercase">
              Goa · 28–31 Oct 2026
            </p>
            {name ? (
              <p className="mt-1 text-xs text-[#fffbe8]/55">{name}</p>
            ) : null}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/goa_hindi.svg"
            alt=""
            className="h-11 w-11 shrink-0 border-2 border-black bg-[#fee101] p-1"
          />
        </div>
      </div>
    </div>
  );
});

export default PfpFrame;
