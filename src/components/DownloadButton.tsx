"use client";

import { useState } from "react";
import { downloadFromUrl } from "@/lib/download";

type Props = {
  href: string;
  fileName: string;
  className?: string;
  children: React.ReactNode;
};

export default function DownloadButton({ href, fileName, className, children }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await downloadFromUrl(href, fileName);
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
      setError("Download failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      <button type="button" onClick={onClick} disabled={busy} className={className}>
        {busy ? "Saving…" : children}
      </button>
      {error ? (
        <p className="text-center text-xs text-[#ff8fa3]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
