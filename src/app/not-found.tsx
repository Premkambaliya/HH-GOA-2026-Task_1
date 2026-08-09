import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.22em] text-[#0b6839] uppercase">
        Hacker House Goa 2026
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-black">
        Pass not found
      </h1>
      <p className="text-black/60">
        This pass may have expired or the link is incomplete.
      </p>
      <Link
        href="/"
        className="mt-2 border-2 border-black bg-[#fee101] px-5 py-3 text-sm font-bold text-black"
      >
        Make your Signal Pass
      </Link>
    </main>
  );
}
