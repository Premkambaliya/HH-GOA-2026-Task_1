import Image from "next/image";
import Generator from "@/components/Generator";
import ScrollToStudio from "@/components/ScrollToStudio";
import DeployLinkCopy from "@/components/DeployLinkCopy";
import { DEPLOY_HOST, DEPLOY_URL } from "@/lib/site";

const TICKER = [
  "GOA, INDIA · 28–31 OCT 2026",
  "LESS NOISE · MORE SIGNAL",
  "#FrameInGoa",
  "TASK #1 · FRAME / ID GENERATOR",
  "AI × CRYPTO RESIDENCY",
  "2:47 PM STUDIO",
  DEPLOY_HOST,
];

export default function Home() {
  return (
    <main className="flex min-h-full flex-1 flex-col">
      <header className="relative z-20 flex items-center justify-between gap-4 border-b-2 border-black bg-[#fffbe8] px-4 py-3 sm:px-6">
        <a href="https://hhgoa.com/" className="flex items-center gap-3">
          <Image
            src="/brand/hacker-house.png"
            alt="Hacker House"
            width={120}
            height={36}
            className="h-8 w-auto"
            priority
          />
          <span className="hidden font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-black/55 uppercase sm:inline">
            Official task · FrameInGoa
          </span>
        </a>
        <div className="flex items-center gap-3">
          <a
            href={DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden border-2 border-black bg-white px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold tracking-wider text-black uppercase sm:inline-flex"
          >
            {DEPLOY_HOST}
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#fee101] px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold tracking-wider uppercase">
            <span className="live-dot h-2 w-2 rounded-full bg-[#0b6839]" />
            Live studio
          </span>
          <Image
            src="/brand/goa_hindi.svg"
            alt="Goa"
            width={44}
            height={44}
            className="h-10 w-10"
          />
        </div>
      </header>

      <section className="relative isolate flex min-h-[min(92svh,920px)] items-end overflow-hidden border-b-2 border-black">
        <Image
          src="/brand/sunrise.png"
          alt="HH Goa sunrise over the water"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0b6839]/35 to-transparent"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <p className="hero-rise inline-flex w-fit items-center gap-2 border-2 border-black bg-[#fee101] px-3 py-1 font-[family-name:var(--font-mono)] text-[11px] font-semibold tracking-[0.16em] text-black uppercase">
            GOA, INDIA · 28–31 OCT 2026
          </p>

          <h1 className="hero-rise hero-rise-delay-1 mt-5 font-[family-name:var(--font-display)] text-[clamp(4rem,14vw,8.5rem)] leading-[0.82] tracking-tight text-[#fffbe8]">
            HH GOA
            <span className="mt-1 block text-[#fee101]">SIGNAL PASS</span>
          </h1>

          <p className="hero-rise hero-rise-delay-2 mt-5 max-w-xl text-base leading-relaxed text-[#fffbe8]/88 sm:text-lg">
            Less noise. More signal. Upload once — get an instantly recognizable
            HH Goa 2026 Builder ID or PFP frame, then drop it on X with{" "}
            <span className="text-[#fee101]">#FrameInGoa</span>.
          </p>

          <div className="hero-rise hero-rise-delay-3 mt-8 flex flex-wrap items-center gap-4">
            <ScrollToStudio />
            <div className="flex items-center gap-3 text-[#fffbe8]/75">
              <Image
                src="/brand/studio-clock.svg"
                alt=""
                width={56}
                height={28}
                className="h-7 w-auto opacity-90"
                style={{ width: "auto", height: "1.75rem" }}
              />
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] uppercase">
                2:47 pm Studio · no login
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b-2 border-black bg-[#0b6839] py-2.5 text-[#fee101]">
        <div className="ticker-track gap-10 whitespace-nowrap font-[family-name:var(--font-mono)] text-[12px] font-medium tracking-[0.18em] uppercase">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex items-center gap-10 px-2">
              <span>{item}</span>
              <span aria-hidden className="text-[#fffbe8]/45">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      <section id="studio" className="relative">
        <div className="studio-in relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.2em] text-[#0b6839] uppercase">
                Task #1 · Build this
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-5xl leading-[0.9] tracking-tight text-black sm:text-6xl">
                Frame it.
                <span className="text-[#0b6839]"> Ship it.</span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-black/70">
                Instant HH Goa identity on any photo — portrait, landscape, or
                off-center. Download in one click. Share to X with a real
                preview. Get featured in the Radar with #FrameInGoa.
              </p>
            </div>

            <div className="relative overflow-hidden border-2 border-black bg-[#0b6839]">
              <Image
                src="/brand/coconut-beach.png"
                alt="Coconut Beach · Tropical Paradise"
                width={960}
                height={540}
                className="h-44 w-full object-cover object-[center_55%] sm:h-52"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent px-4 py-3">
                <div>
                  <p className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.16em] text-[#fee101] uppercase">
                    Explore Coconut Beach · Tropical Paradise
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[9px] tracking-wide text-[#fffbe8]/75">
                    Surf Point · Paradise Cove · Hammock Haven
                  </p>
                </div>
                <Image
                  src="/brand/goa_hindi.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9"
                />
              </div>
            </div>
          </div>

          <Generator />
        </div>
      </section>

      <section className="relative overflow-hidden border-t-2 border-black bg-[#0b6839] text-[#fffbe8]">
        <Image
          src="/brand/footer-trees.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom opacity-35"
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-[#fee101] uppercase">
              Less Noise. More Signal
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[0.92] sm:text-5xl">
              Lock in. Build your legacy.
            </h2>
            <p className="mt-4 max-w-xl text-[#fffbe8]/80">
              This generator is your shortlisting signal — make the pass, post
              it, and show up on the Radar. Fiber, ocean, 500 builders. See you
              on the sand.
            </p>
          </div>
          <DeployLinkCopy />
        </div>
      </section>

      <footer className="border-t-2 border-black bg-[#fffbe8] px-5 py-5 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 font-[family-name:var(--font-mono)] text-[11px] text-black/55">
          <span>© 2026 HH-Goa · FrameInGoa task</span>
          <a
            href={DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0b6839] hover:underline"
          >
            {DEPLOY_HOST}
          </a>
          <span>#FrameInGoa · photo stays in browser until you share</span>
        </div>
      </footer>
    </main>
  );
}
