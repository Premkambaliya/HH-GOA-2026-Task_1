"use client";

import { useState } from "react";
import { DEPLOY_URL } from "@/lib/site";

export default function DeployLinkCopy() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(DEPLOY_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="border-2 border-[#fee101] bg-black/35 p-5 backdrop-blur-sm">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[#fee101] uppercase">
        Residency
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[#fffbe8]">
        28–31 Oct 2026
      </p>
      <p className="mt-4 break-all font-[family-name:var(--font-mono)] text-[12px] leading-relaxed text-[#fffbe8]/85">
        {DEPLOY_URL}
      </p>
      <button
        type="button"
        onClick={copyLink}
        className="mt-4 inline-flex border-2 border-black bg-[#fee101] px-4 py-2.5 text-sm font-bold text-black transition hover:-translate-y-0.5"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
