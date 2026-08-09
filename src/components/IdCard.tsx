"use client";

import { forwardRef } from "react";
import { skillShort } from "@/lib/skills";

export type PhotoTransform = { x: number; y: number; scale: number };

type IdCardProps = {
  photoUrl: string | null;
  name: string;
  stack: string;
  builderTitle: string;
  skills: string[];
  qrDataUrl?: string | null;
  photo: PhotoTransform;
};

const IdCard = forwardRef<HTMLDivElement, IdCardProps>(function IdCard(
  { photoUrl, name, stack, builderTitle, skills, qrDataUrl, photo },
  ref
) {
  const chips = skills.length ? skills : stack ? [stack] : ["Builder"];
  const passNo = String(
    Math.abs(
      Array.from(`${name}|${builderTitle}`).reduce(
        (acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0,
        7
      )
    )
  )
    .padStart(6, "0")
    .slice(0, 6);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[380px] overflow-hidden border-[7px] border-black bg-[#fffbe8] text-black shadow-[10px_10px_0_#0b6839]"
      style={{ aspectRatio: "3 / 4.6" }}
    >
      {/* lanyard hole */}
      <div className="absolute top-2.5 left-1/2 z-30 h-[14px] w-11 -translate-x-1/2 rounded-full border-[3px] border-black bg-[#0b6839]" />

      {/* yellow signal ribbon */}
      <div className="pointer-events-none absolute top-12 -left-8 z-20 rotate-[-32deg] border-y-[3px] border-black bg-[#fee101] px-12 py-1.5 shadow-[2px_2px_0_#000]">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-[0.32em] text-black uppercase">
          ✦ More Signal ✦
        </p>
      </div>

      {/* PHOTO HERO */}
      <div className="relative h-[46%] overflow-hidden border-b-[4px] border-black bg-[#0b6839]">
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
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#fffbe8]/55">
            <div className="h-16 w-16 border-2 border-[#fee101]/50 bg-[#fee101]/10" />
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] uppercase">
              Drop your photo
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/goa_hindi.svg"
            alt=""
            className="h-10 w-10 border-[2.5px] border-black bg-[#fee101] p-1"
          />
        </div>

        <div className="absolute top-3 right-3 z-10 text-right">
          <p className="border border-black bg-[#fee101] px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] font-bold tracking-wider text-black uppercase">
            LIVE
          </p>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.14em] text-[#fee101] uppercase">
            Pass #{passNo}
          </p>
        </div>

        <div className="absolute right-3 bottom-3 left-3 z-10 flex items-end justify-between gap-2">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.18em] text-[#fee101] uppercase">
              HH Goa · 2026
            </p>
            <p className="font-[family-name:var(--font-display)] text-[1.7rem] leading-none text-[#fffbe8]">
              SIGNAL PASS
            </p>
          </div>
          <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.12em] text-[#fffbe8]/75 uppercase">
            2:47 pm
            <br />
            Studio
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="relative flex h-[54%] flex-col">
        <div className="flex flex-1 gap-0">
          {/* skill spine */}
          <div className="flex w-11 shrink-0 flex-col gap-1.5 border-r-[3px] border-black bg-[#0b6839] px-1.5 py-3">
            {chips.slice(0, 5).map((skill) => (
              <div
                key={skill}
                title={skill}
                className="flex aspect-square items-center justify-center border-[2px] border-black bg-[#fee101] text-[9px] font-bold text-black"
              >
                {skillShort(skill)}
              </div>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-col px-3.5 pt-3 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.2em] text-[#0b6839] uppercase">
                  Builder class
                </p>
                <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-[1.85rem] leading-[0.92] tracking-tight lowercase">
                  {builderTitle || "stack overflower"}
                  <span className="text-[#ff0080]">.</span>
                </h2>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/hacker-house.png"
                alt=""
                className="mt-1 h-6 w-auto opacity-80"
              />
            </div>

            <div className="mt-2.5 inline-flex max-w-full self-start border-[2.5px] border-black bg-[#fee101] px-2.5 py-1">
              <p className="truncate font-[family-name:var(--font-display)] text-[1.2rem] leading-none">
                {name || "Your Name"}
              </p>
            </div>

            <p className="mt-1.5 font-[family-name:var(--font-mono)] text-[10px] text-black/55">
              {stack ? `${stack} · ` : ""}Residency builder
            </p>

            <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
              <div className="border-[2px] border-black bg-white px-2 py-1.5">
                <p className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-black/40 uppercase">
                  Location
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] font-semibold text-[#0b6839] uppercase">
                  Goa, India
                </p>
              </div>
              <div className="border-[2px] border-black bg-white px-2 py-1.5">
                <p className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-black/40 uppercase">
                  Residency
                </p>
                <p className="font-[family-name:var(--font-mono)] text-[10px] font-semibold text-[#0b6839] uppercase">
                  28–31 Oct
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* footer strip */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t-[4px] border-black bg-[#0b6839] px-3 py-2.5">
          <div className="flex items-center gap-2">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt=""
                className="border-[2px] border-black bg-white p-0.5"
                style={{ width: 46, height: 46 }}
              />
            ) : (
              <div className="flex h-[46px] w-[46px] items-center justify-center border-[2px] border-dashed border-[#fee101]/40 text-[8px] text-[#fee101]/60">
                QR
              </div>
            )}
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[8px] tracking-[0.14em] text-[#fffbe8]/55 uppercase">
                Scan · make yours
              </p>
              <p className="mt-0.5 border border-black bg-[#fee101] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] font-bold text-black">
                #FrameInGoa
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-[family-name:var(--font-display)] text-[1.05rem] leading-none text-[#fee101]">
              Lock in.
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[8px] leading-tight tracking-wide text-[#fffbe8]/65 uppercase">
              Build on
              <br />
              the sand
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default IdCard;
