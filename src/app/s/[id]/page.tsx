import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import { getBaseUrl } from "@/lib/baseUrl";
import { loadPass } from "@/lib/passStore";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pass = await loadPass(id);
  const base = await getBaseUrl();

  if (!pass) {
    return { title: "Pass not found · HH Goa 2026" };
  }

  const title = `${pass.meta.name} — HH Goa 2026 Signal Pass`;
  const description =
    pass.meta.mode === "pfp"
      ? `${pass.meta.name} locked a PFP frame for Hacker House Goa 2026. #FrameInGoa`
      : `${pass.meta.title ? `${pass.meta.title} · ` : ""}${pass.meta.name} · #FrameInGoa`;
  const imageUrl = `${base}/api/share/${id}/image?v=og`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${base}/s/${id}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePassPage({ params }: Props) {
  const { id } = await params;
  const pass = await loadPass(id);
  if (!pass) notFound();

  const base = await getBaseUrl();
  const shareUrl = `${base}/s/${id}`;
  const label = pass.meta.mode === "pfp" ? "PFP frame" : "Builder ID";
  const tweet = encodeURIComponent(
    `Just locked my HH Goa 2026 ${label} ✦\n\n${
      pass.meta.title ? `${pass.meta.title} · ` : ""
    }${pass.meta.name}\n\nMake yours →\n\n#FrameInGoa`
  );
  const slug =
    pass.meta.name.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-_]/g, "") ||
    "pass";

  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#fffbe8]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(254,225,1,0.35),transparent_55%),linear-gradient(180deg,#0b6839_0%,#074a28_42%,#fffbe8_100%)]"
      />

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-6 py-14">
        <div className="text-center">
          <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] text-[#fee101] uppercase">
            Hacker House Goa 2026
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-5xl tracking-tight text-[#fffbe8]">
            {pass.meta.name}
          </h1>
          {pass.meta.mode === "id" && pass.meta.title ? (
            <p className="mt-1 text-[#ff0080]">{pass.meta.title}</p>
          ) : null}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/api/share/${id}/image`}
          alt={`${pass.meta.name} HH Goa Signal Pass`}
          className="w-full max-w-[420px] border-[3px] border-black shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
        />

        <div className="flex w-full max-w-[420px] flex-col gap-3 sm:flex-row">
          <DownloadButton
            href={`/api/share/${id}/image?download=1`}
            fileName={`hh-goa-2026-${pass.meta.mode}-${slug}.jpg`}
            className="w-full border-2 border-black bg-[#fee101] px-4 py-3 text-center text-sm font-bold text-black disabled:opacity-60"
          >
            Download
          </DownloadButton>
          <a
            href={`https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border-2 border-black bg-[#ff0080] px-4 py-3 text-center text-sm font-bold text-white"
          >
            Share to X
          </a>
        </div>

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
