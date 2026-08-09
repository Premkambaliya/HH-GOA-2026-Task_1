/**
 * Save a Blob to the device as reliably as browsers allow.
 *
 * Desktop + Android Chrome honor <a download> with a blob URL.
 * iOS Safari ignores download=, so we fall back to the share sheet
 * (Save Image / Save to Files) and finally to opening the image.
 */
export async function downloadBlob(blob: Blob, fileName: string): Promise<void> {
  const nav = navigator as Navigator & {
    msSaveOrOpenBlob?: (blob: Blob, name: string) => void;
  };

  if (typeof nav.msSaveOrOpenBlob === "function") {
    nav.msSaveOrOpenBlob(blob, fileName);
    return;
  }

  const url = URL.createObjectURL(blob);

  try {
    if (isAppleTouchDevice()) {
      const file = new File([blob], fileName, {
        type: blob.type || "image/png",
      });

      if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
        });
        return;
      }

      // Older iOS: open the image so the user can long-press → Save Image.
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        // Popup blocked — navigate as a last resort.
        window.location.assign(url);
      }
      return;
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    // Keep the URL alive long enough for iOS new-tab loads to finish.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}

export async function downloadFromUrl(url: string, fileName: string): Promise<void> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not fetch image");
  const blob = await res.blob();
  await downloadBlob(blob, fileName);
}

export function exportPixelRatio(): number {
  if (typeof window === "undefined") return 2;
  const dpr = window.devicePixelRatio || 1;
  // Sharp enough for phones/tablets/laptops without blowing past Mongo size limits.
  return Math.min(3, Math.max(2, Math.round(dpr)));
}

function isAppleTouchDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  // iPadOS reports as MacIntel but is touch-first.
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
