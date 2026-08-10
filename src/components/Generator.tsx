"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import QRCode from "qrcode";
import IdCard, { type PhotoTransform } from "./IdCard";
import PfpFrame from "./PfpFrame";
import { pickBuilderTitle, randomBuilderTitle } from "@/lib/builderTitles";
import { parseSkills } from "@/lib/skills";
import { downloadBlob, exportPixelRatio } from "@/lib/download";
import { DEPLOY_URL } from "@/lib/site";

type Mode = "id" | "pfp";

const ACCENTS = ["#fee101", "#0b6839", "#ff0080", "#fb2c36", "#fffbe8", "#edd723"];
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const INITIAL_PHOTO: PhotoTransform = { x: 0, y: 0, scale: 1.15 };

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

async function fileToPreviewUrl(file: File): Promise<string> {
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.hei[cf]$/i.test(file.name);

  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    const blob = Array.isArray(converted) ? converted[0] : converted;
    return URL.createObjectURL(blob);
  }

  return URL.createObjectURL(file);
}

/**
 * html-to-image reads computed styles synchronously, so anything still loading
 * is captured blank. Safari in particular needs a discarded warm-up pass before
 * webfonts and freshly-set images make it into the snapshot.
 */
async function waitForPaint(node: HTMLElement) {
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      /* fonts API unavailable, fall through */
    }
  }

  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
    )
  );

  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, encoded] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export default function Generator() {
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const warmedUp = useRef(false);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    armed: false,
    pointerType: "mouse" as string,
  });
  const pinchRef = useRef<{ distance: number; scale: number } | null>(null);
  const photoStateRef = useRef<PhotoTransform>(INITIAL_PHOTO);

  const [mode, setMode] = useState<Mode>("id");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stack, setStack] = useState("");
  const [skillsInput, setSkillsInput] = useState("React, Next.js, MongoDB");
  const [builderTitle, setBuilderTitle] = useState("stack overflower");
  const [photo, setPhoto] = useState<PhotoTransform>(INITIAL_PHOTO);
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState<null | "download" | "share">(null);
  const [error, setError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const skills = parseSkills(skillsInput);
  const ready = Boolean(photoUrl && name.trim());

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" && !window.location.hostname.includes("localhost")
        ? window.location.origin
        : DEPLOY_URL);
    QRCode.toDataURL(base, {
      margin: 1,
      width: 160,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, []);

  useEffect(() => {
    photoStateRef.current = photo;
  }, [photo]);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  // React registers wheel handlers passively, so preventDefault only works from
  // a manually attached listener. Without it the page scrolls while zooming.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      if (!photoUrl) return;
      event.preventDefault();
      setPhoto((p) => ({
        ...p,
        scale: clampScale(p.scale + (event.deltaY > 0 ? -0.08 : 0.08)),
      }));
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [photoUrl]);

  const loadPhoto = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (!/^image\//.test(file.type) && !/\.hei[cf]$/i.test(file.name)) {
      setError("That file isn't an image. Try a JPG, PNG or HEIC.");
      return;
    }

    setError(null);
    setShareLink(null);
    try {
      const url = await fileToPreviewUrl(file);
      warmedUp.current = false;
      setPhotoUrl(url);
      setPhoto(INITIAL_PHOTO);
    } catch {
      setError("Could not read that photo. Try JPG or PNG.");
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!photoUrl) return;
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      const current = photoStateRef.current;
      if (pointers.current.size === 1) {
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          origX: current.x,
          origY: current.y,
          // Mouse can grab immediately; touch waits so the page can still scroll.
          armed: e.pointerType !== "touch",
          pointerType: e.pointerType,
        };
        if (e.pointerType !== "touch") {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }
      } else if (pointers.current.size === 2) {
        // Pinch zoom — take over touches so the page doesn't scroll mid-gesture.
        dragRef.current.armed = true;
        const target = e.currentTarget as HTMLElement;
        for (const id of pointers.current.keys()) {
          try {
            target.setPointerCapture(id);
          } catch {
            /* already captured or released */
          }
        }
        const [a, b] = Array.from(pointers.current.values());
        pinchRef.current = {
          distance: Math.hypot(a.x - b.x, a.y - b.y) || 1,
          scale: current.scale,
        };
      }
    },
    [photoUrl]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && pinchRef.current) {
      const [a, b] = Array.from(pointers.current.values());
      const distance = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const next = pinchRef.current.scale * (distance / pinchRef.current.distance);
      setPhoto((p) => ({ ...p, scale: clampScale(next) }));
      return;
    }

    const drag = dragRef.current;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    // On touch: vertical flicks scroll the page; pan only after clear framing intent.
    if (!drag.armed && drag.pointerType === "touch") {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < 10 && absY < 10) return;

      // Mostly vertical → let the browser scroll; drop this pointer.
      if (absY > absX * 1.15) {
        pointers.current.delete(e.pointerId);
        return;
      }

      drag.armed = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.origX = photoStateRef.current.x;
      drag.origY = photoStateRef.current.y;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      return;
    }

    if (!drag.armed) return;

    setPhoto((p) => ({
      ...p,
      x: drag.origX + (e.clientX - drag.startX),
      y: drag.origY + (e.clientY - drag.startY),
    }));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;

    const remaining = Array.from(pointers.current.values())[0];
    if (remaining) {
      dragRef.current = {
        startX: remaining.x,
        startY: remaining.y,
        origX: photoStateRef.current.x,
        origY: photoStateRef.current.y,
        armed: true,
        pointerType: dragRef.current.pointerType,
      };
    } else {
      dragRef.current.armed = false;
    }
  }, []);

  const captureCard = useCallback(
    async (format: "png" | "jpeg") => {
      const node = cardRef.current;
      if (!node) throw new Error("Preview not ready");

      await waitForPaint(node);
      // No cacheBust: it appends a query string to the photo's blob: URL, which
      // makes the fetch fail and silently drops the photo from the export.
      const backgroundColor = mode === "id" ? "#fffbe8" : "#0b6839";
      const pixelRatio = exportPixelRatio();
      // Fixed logical size so phone/tablet/laptop all export the same sharp PNG,
      // independent of the on-screen preview width.
      const width = 380;
      const height = mode === "id" ? Math.round((380 * 4.6) / 3) : 380;
      const captureOpts = {
        pixelRatio,
        backgroundColor,
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: "none",
        },
      };

      if (!warmedUp.current) {
        await toPng(node, { ...captureOpts, pixelRatio: 1 });
        warmedUp.current = true;
      }

      return format === "png"
        ? toPng(node, captureOpts)
        : toJpeg(node, { ...captureOpts, quality: 0.92 });
    },
    [mode]
  );

  const fileName = `hh-goa-2026-${mode}-${
    name.trim().replace(/\s+/g, "-").toLowerCase() || "pass"
  }.png`;

  async function handleDownload() {
    if (!ready || busy) return;
    setBusy("download");
    setError(null);
    try {
      const dataUrl = await captureCard("png");
      await downloadBlob(dataUrlToBlob(dataUrl), fileName);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      setError("Download failed. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (!ready || busy) return;
    setBusy("share");
    setError(null);
    setShareCopied(false);
    try {
      const cardDataUrl = await captureCard("jpeg");

      const title =
        mode === "id"
          ? builderTitle.trim() || pickBuilderTitle(name, stack || skillsInput)
          : "";

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: cardDataUrl,
          name: name.trim(),
          title,
          mode,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not prepare share link");
      }

      const { id } = (await res.json()) as { id: string };
      // Always link to THIS origin — the pass was saved here.
      const shareUrl = `${window.location.origin}/s/${id}`;
      setShareLink(shareUrl);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Share failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function copyShareLink() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1800);
    } catch {
      setShareCopied(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      <section className="space-y-5 border-2 border-black bg-[#fffbe8] p-5 sm:p-7">
        <div className="flex gap-2 border-2 border-black bg-black p-1">
          {(
            [
              ["id", "Builder ID Card"],
              ["pfp", "PFP Frame"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setShareLink(null);
                warmedUp.current = false;
              }}
              aria-pressed={mode === value}
              className={`flex-1 px-3 py-2.5 text-sm font-semibold transition ${
                mode === value
                  ? "bg-[#fee101] text-black"
                  : "text-[#fffbe8]/70 hover:text-[#fffbe8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div>
          <span className="label">01 · Photo</span>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void loadPhoto(e.dataTransfer.files?.[0]);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed px-4 py-8 text-center transition ${
              dragOver
                ? "border-[#ff0080] bg-[#ff0080]/10"
                : "border-[#0b6839]/40 bg-white/50 hover:border-[#0b6839] hover:bg-white"
            }`}
          >
            <span className="text-sm font-medium text-black">
              {photoUrl ? "Change photo" : "Tap to upload · or drop JPG / PNG / HEIC"}
            </span>
            <span className="text-xs text-black/50">
              Drag the preview to reposition · pinch or scroll to zoom
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
              className="hidden"
              onChange={(e) => void loadPhoto(e.target.files?.[0])}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="label">02 · Name</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setShareLink(null);
              }}
              placeholder="Your name"
              maxLength={36}
              className="field"
            />
          </label>

          {mode === "id" && (
            <>
              <label className="block">
                <span className="label">Skill / Stack</span>
                <input
                  value={stack}
                  onChange={(e) => {
                    setStack(e.target.value);
                    setShareLink(null);
                  }}
                  placeholder="Full-stack · AI"
                  maxLength={40}
                  className="field"
                />
              </label>

              <label className="block">
                <span className="label">Top skills</span>
                <input
                  value={skillsInput}
                  onChange={(e) => {
                    setSkillsInput(e.target.value);
                    setShareLink(null);
                  }}
                  placeholder="React, Python, Docker"
                  className="field"
                />
              </label>

              <div className="sm:col-span-2">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="label mb-0">Builder title</span>
                  <button
                    type="button"
                    onClick={() => {
                      setBuilderTitle(randomBuilderTitle());
                      setShareLink(null);
                    }}
                    className="border border-black bg-[#ff0080] px-2.5 py-1 text-[11px] font-semibold text-white"
                  >
                    Shuffle
                  </button>
                </div>
                <input
                  value={builderTitle}
                  onChange={(e) => {
                    setBuilderTitle(e.target.value);
                    setShareLink(null);
                  }}
                  maxLength={28}
                  className="field"
                />
              </div>
            </>
          )}
        </div>

        {mode === "pfp" && (
          <div>
            <p className="label">Accent color</p>
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Accent ${c}`}
                  aria-pressed={accent === c}
                  onClick={() => {
                    setAccent(c);
                    setShareLink(null);
                  }}
                  className={`h-8 w-8 border-2 transition ${
                    accent === c ? "scale-110 border-black" : "border-black/20"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="zoom" className="label mb-0">
              Zoom
            </label>
            <button
              type="button"
              onClick={() => setPhoto(INITIAL_PHOTO)}
              className="font-[family-name:var(--font-mono)] text-[11px] text-black/50 underline hover:text-black"
            >
              Reset framing
            </button>
          </div>
          <input
            id="zoom"
            type="range"
            min={MIN_SCALE}
            max={MAX_SCALE}
            step={0.01}
            value={photo.scale}
            disabled={!photoUrl}
            onChange={(e) =>
              setPhoto((p) => ({ ...p, scale: Number(e.target.value) }))
            }
            className="w-full accent-[#0b6839] disabled:opacity-40"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={!ready || busy !== null}
            onClick={handleDownload}
            className="btn-primary"
          >
            {busy === "download" ? "Saving…" : "Download image"}
          </button>
          <button
            type="button"
            disabled={!ready || busy !== null}
            onClick={handleShare}
            className="btn-share"
          >
            {busy === "share" ? "Preparing…" : "Share link · #FrameInGoa"}
          </button>
        </div>

        {!ready && (
          <p className="font-[family-name:var(--font-mono)] text-[11px] text-black/45">
            Add a photo and your name to unlock download & share.
          </p>
        )}
        {error && (
          <p className="text-sm text-[#fb2c36]" role="alert">
            {error}
          </p>
        )}
        {shareLink && (
          <div className="space-y-2 border-2 border-black bg-white p-3">
            <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.14em] text-[#0b6839] uppercase">
              Your share link
            </p>
            <p className="break-all font-[family-name:var(--font-mono)] text-[12px] text-black">
              {shareLink}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="border-2 border-black bg-[#fee101] px-3 py-2 text-sm font-bold text-black"
              >
                {shareCopied ? "Copied ✓" : "Copy link"}
              </button>
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex border-2 border-black bg-[#0b6839] px-3 py-2 text-sm font-bold text-[#fffbe8]"
              >
                Open preview
              </a>
            </div>
          </div>
        )}
      </section>

      <section className="lg:sticky lg:top-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[#0b6839] uppercase">
            Live preview
          </p>
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-black/40">
            {mode === "id" ? "ID · 3:4" : "PFP · 1:1 HD"}
          </p>
        </div>

        <div
          ref={stageRef}
          className="mx-auto flex w-full max-w-[380px] touch-pan-y justify-center select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ cursor: photoUrl ? "grab" : "default", touchAction: "pan-y" }}
        >
          {mode === "id" ? (
            <IdCard
              ref={cardRef}
              photoUrl={photoUrl}
              name={name}
              stack={stack}
              builderTitle={builderTitle}
              skills={skills}
              qrDataUrl={qrDataUrl}
              photo={photo}
            />
          ) : (
            <PfpFrame
              ref={cardRef}
              photoUrl={photoUrl}
              name={name}
              photo={photo}
              accent={accent}
            />
          )}
        </div>
      </section>
    </div>
  );
}
