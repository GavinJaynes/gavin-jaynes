import { useEffect, useState } from "react"
import { Nav } from "@/components/Nav"
import { Button } from "@/components/ui/button"

const ALL_STATS = [
  { value: "5,657", label: "Slack messages replied to" },
  { value: "7,456", label: "Hours in meetings" },
  { value: "672", label: "Sprint plannings survived" },
  { value: "∞", label: "console.logs deleted" },
  { value: "1.4M", label: "Lines of code (net negative)" },
  { value: "847", label: "PRs reviewed on a Friday" },
  { value: "3am", label: "Mainnet launch time" },
  { value: "0", label: "Designs accepted first pass" },
  { value: "404", label: "Bugs marked won't fix" },
  { value: "12", label: "Rebrands survived" },
]

function pickTwo<T>(arr: T[]): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

export function Hero() {
  const [colored, setColored] = useState(false)
  const [stats] = useState(() => pickTwo(ALL_STATS))

  useEffect(() => {
    const t = setTimeout(() => setColored(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="flex min-h-svh flex-col overflow-hidden bg-stone-50">
      <Nav />

      {/* ── Mobile layout ── */}
      <div className="flex flex-1 flex-col justify-between lg:hidden">

        {/* Hello + tagline */}
        <div className="px-6 pt-2 pb-2">
          <h1
            className="font-display font-bold leading-none tracking-tight text-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            style={{ fontSize: "clamp(4rem, 19vw, 7rem)" }}
          >
            Hello
          </h1>
          <p className="font-sans mt-1.5 text-sm leading-snug text-zinc-400 max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
            Frontend engineer. DeFi native. Algo trading systems. AI-augmented.
          </p>
        </div>

        {/* Image — grows to fill all remaining space, clipped so whitespace in photo file doesn't show */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <img
            src="/me.png"
            alt="Gavin Jaynes"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter] duration-1000 ${colored ? "grayscale-0" : "grayscale"}`}
          />
        </div>

        {/* Buttons — full width, side by side, pinned to bottom */}
        <div className="grid grid-cols-2 animate-in fade-in duration-700 delay-500 fill-mode-both">
          <a
            href="#projects"
            className="flex items-center justify-center bg-zinc-900 py-5 font-mono text-xs tracking-widest text-white uppercase hover:bg-zinc-700 transition-colors"
          >
            View work
          </a>
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center bg-stone-200 py-5 font-mono text-xs tracking-widest text-zinc-600 uppercase hover:bg-stone-300 transition-colors"
          >
            Scroll down ↓
          </button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="relative hidden flex-1 lg:flex lg:flex-row">

        {/* Sidebar labels */}
        <div className="absolute bottom-0 left-5 top-0 flex flex-col items-center justify-between py-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-300 uppercase [writing-mode:vertical-rl] rotate-180">
            Frontend · DeFi · Systems
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-300 uppercase [writing-mode:vertical-rl] rotate-180">
            2026
          </span>
        </div>
        <div className="absolute bottom-0 left-14 top-0 w-px bg-zinc-200" />

        {/* Left content */}
        <div className="flex flex-1 flex-col justify-between pl-24 pr-12 py-10">
          {/* Stats */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-zinc-900">{value}</p>
                  <p className="font-mono mt-1 text-[10px] tracking-[0.2em] text-zinc-400 uppercase">{label}</p>
                </div>
              ))}
            </div>
            <p className="font-sans mt-5 text-xs text-zinc-400 italic max-w-sm leading-relaxed">
              The numbers might be made up, but the experience is real.{" "}
              <button
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="underline underline-offset-2 hover:text-zinc-700 transition-colors"
              >
                Find out more below.
              </button>
            </p>
          </div>

          {/* Hello + tagline */}
          <div className="my-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <h1
              className="font-display font-bold leading-none tracking-tight text-zinc-900"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
            >
              Hello
            </h1>
            <p className="font-sans mt-6 max-w-sm text-lg leading-relaxed text-zinc-400">
              Frontend engineer. DeFi native. Algo trading systems. AI-augmented.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-5 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-700 fill-mode-both">
            <Button
              className="rounded-none bg-zinc-900 font-mono text-xs tracking-widest text-white uppercase hover:bg-zinc-700"
              asChild
            >
              <a href="#projects">View work</a>
            </Button>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="font-mono text-xs tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-700"
            >
              Scroll down ↓
            </button>
          </div>
        </div>

        {/* Right photo */}
        <div className="relative w-[46%] flex-none">
          <div className="absolute inset-y-0 left-0 z-10 w-32 bg-linear-to-r from-stone-50 to-transparent" />
          <img
            src="/me.png"
            alt="Gavin Jaynes"
            className={`h-full w-full object-cover object-top transition-[filter] duration-1000 ${colored ? "grayscale-0" : "grayscale"}`}
          />
        </div>
      </div>
    </section>
  )
}
