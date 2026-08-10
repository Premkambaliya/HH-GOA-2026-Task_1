"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";

type PassInfo = {
  id: string;
  name: string;
  title: string;
  mode: "id" | "pfp";
  imageUrl: string;
};

export default function SharePassView({ id }: { id: string }) {
  const [pass, setPass] = useState<PassInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/share/${id}`);
        if (!res.ok) {
          if (!cancelled) setStatus("missing");
          return;
        }
        const data = (await res.json()) as PassInfo;
        if (!cancelled) {
          setPass(data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("missing");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#fffbe8] px-4 py-10">
        <p className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] text-[#0b6839] uppercase">
          Loading pass…
        </p>
      </main>
    );
  }

  if (status === "missing" || !pass) {
    return (
      <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#fffbe8] px-4 py-10">
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] text-[#0b6839] uppercase">
          Hacker House Goa 2026
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl text-black">
          Pass not found
        </h1>
        <p className="mt-3 max-w-sm text-center text-black/60">
          This pass may have expired or the link is incomplete.
        </p>
        <Link
          href="/"
          className="mt-8 border-2 border-black bg-[#fee101] px-5 py-3 text-sm font-bold text-black"
        >
          Make your Signal Pass
        </Link>
      </main>
    );
  }

  const slug =
    pass.name.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-_]/g, "") ||
    "pass";
  const isPfp = pass.mode === "pfp";

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-[#fffbe8] px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-5">
        <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] text-[#0b6839] uppercase">
          {isPfp ? "PFP frame" : "Builder ID"} · #FrameInGoa
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pass.imageUrl}
          alt={`${pass.name} HH Goa Signal Pass`}
          className="w-full max-w-[380px] border-[3px] border-black shadow-[8px_8px_0_#0b6839]"
        />

        <p className="text-center font-[family-name:var(--font-display)] text-3xl text-black">
          {pass.name}
        </p>
        {pass.mode === "id" && pass.title ? (
          <p className="-mt-3 text-center text-[#ff0080]">{pass.title}</p>
        ) : null}

        <DownloadButton
          href={`/api/share/${id}/image?download=1`}
          fileName={`hh-goa-2026-${pass.mode}-${slug}.jpg`}
          className="w-full border-2 border-black bg-[#fee101] px-4 py-3 text-center text-sm font-bold text-black disabled:opacity-60"
        >
          Download
        </DownloadButton>

        <Link
          href="/"
          className="text-sm font-medium text-[#0b6839] underline decoration-[#fee101] underline-offset-4"
        >
          Create your own #FrameInGoa pass
        </Link>
      </div>
    </main>
  );
}
