import { useCallback, useEffect, useRef, useState } from "react"
import { AsciiLens } from "@/components/AsciiLens"
import {
  CELL_H,
  CELL_W,
  SHADES,
  buildStaticLayer,
  FONT,
  hash,
  randomScrambleChar,
  sampleCells,
  shadeFor,
} from "@/components/ascii"
import { Nav } from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { EncryptedText } from "@/components/ui/encrypted-text"
import type { SiteMode } from "@/lib/mode"

const ALL_STATS = [
  { value: "5,657", label: "Slack messages replied to" },
  { value: "7,456", label: "Hours in meetings" },
  { value: "672", label: "Sprint plannings survived" },
  { value: "∞", label: "console.logs deleted" },
  { value: "1.4M", label: "Lines of code (net negative)" },
  { value: "847", label: "PRs reviewed on a Friday" },
  { value: "3am", label: "Mainnet launch time", web3Only: true },
  { value: "0", label: "Designs accepted first pass" },
  { value: "304", label: "Bugs marked won't fix" },
  { value: "12", label: "Rebrands survived" },
  { value: "62", label: "Webpack configurations" },
]

function pickTwo<T>(arr: T[]): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

const COPY = {
  web3: {
    sidebarLabel: "Frontend · DeFi · Systems",
    heading: (
      <>
        Building the systems behind
        <br />
        DeFi, agentic trading and
        <br />
        autonomous software.
      </>
    ),
    headingMobile:
      "Building the systems behind DeFi, agentic trading and autonomous software.",
  },
  frontend: {
    sidebarLabel: "Frontend · Product · Systems",
    heading: (
      <>
        Building fast, accessible
        <br />
        frontends for products
        <br />
        that run at real scale.
      </>
    ),
    headingMobile:
      "Building fast, accessible frontends for products that run at real scale.",
  },
  ai: {
    sidebarLabel: "AI · Product · Systems",
    heading: (
      <>
        Building production AI
        <br />
        products, agent workflows
        <br />
        and reliable systems.
      </>
    ),
    headingMobile:
      "Building production AI products, agent workflows and reliable systems.",
  },
}

// Load-in reveal using the same pipeline as the hover effect: sparse noise
// while the image loads, then a scramble-edged wipe expands from the center,
// resolving into the ASCII portrait sampled from the image's own pixels
function AsciiReveal({
  src,
  onComplete,
  visible,
}: {
  src: string
  onComplete: () => void
  visible: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = 0
    let H = 0
    let cols = 0
    let rows = 0
    let dpr = 1
    let cells: Uint8Array | null = null
    let staticLayer: HTMLCanvasElement | null = null
    let noise: HTMLCanvasElement | null = null
    let nctx: CanvasRenderingContext2D | null = null
    let radius = 0
    let raf = 0
    let lastTb = -1
    let failedMeasures = 0
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    // Repaint the scramble layer: everything on `full`, else flip a subset.
    // Before the image loads, a fixed pseudo-random subset of cells carries
    // noise; once sampled, noise follows the portrait's real silhouette
    const paintNoise = (full: boolean) => {
      if (!nctx) return
      const tb = Math.floor(performance.now() / 70)
      if (full) nctx.clearRect(0, 0, W, H)
      for (let i = 0; i < cols * rows; i++) {
        const ci = cells ? cells[i] : hash(i, 1) > 0.55 ? 3 : 0
        if (ci === 0) continue
        if (!full && (ci === 1 || hash(i, tb) > 0.3)) continue
        const cx = (i % cols) * CELL_W + CELL_W / 2
        const cy = ((i / cols) | 0) * CELL_H + CELL_H / 2
        if (!full)
          nctx.clearRect(cx - CELL_W / 2, cy - CELL_H / 2, CELL_W, CELL_H)
        nctx.fillStyle = cells ? shadeFor(ci) : SHADES[1]
        nctx.fillText(ci === 1 ? "." : randomScrambleChar(i, tb), cx, cy)
      }
    }

    const img = new Image()
    img.src = src

    const tryBuild = () => {
      if (!W || !img.complete || !img.naturalWidth || cells) return
      cells = sampleCells(img, W, H, cols, rows)
      if (!cells) return
      staticLayer = buildStaticLayer(
        cells,
        cols,
        rows,
        canvas.width,
        canvas.height,
        dpr
      )
      paintNoise(true)
    }

    const measure = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return false
      W = rect.width
      H = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(W / CELL_W)
      rows = Math.ceil(H / CELL_H)
      noise = document.createElement("canvas")
      noise.width = canvas.width
      noise.height = canvas.height
      nctx = noise.getContext("2d")
      if (nctx) {
        nctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        nctx.font = FONT
        nctx.textAlign = "center"
        nctx.textBaseline = "middle"
      }
      paintNoise(true)
      tryBuild()
      return true
    }

    img.onload = tryBuild

    const tick = () => {
      // hidden layout instance (mobile vs desktop): give up quietly
      if (!W && !measure()) {
        if (++failedMeasures > 300) return
        raf = requestAnimationFrame(tick)
        return
      }

      const tb = Math.floor(performance.now() / 70)
      if (tb !== lastTb) {
        paintNoise(false)
        lastTb = tb
      }

      ctx.clearRect(0, 0, W, H)
      const px = W / 2
      const py = H / 2
      const far = Math.hypot(px, py)

      if (cells && staticLayer && noise) {
        const target = (far / 0.7) * 1.02
        radius += (target - radius) * (reduceMotion ? 1 : 0.05)
        const coverR = radius * 0.7
        // scrambled silhouette outside the resolve front
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, W, H)
        ctx.arc(px, py, Math.min(coverR, far + 10), 0, Math.PI * 2)
        ctx.clip("evenodd")
        ctx.drawImage(noise, 0, 0, W, H)
        ctx.restore()
        // resolved portrait inside
        ctx.save()
        ctx.beginPath()
        ctx.arc(px, py, coverR, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(staticLayer, 0, 0, W, H)
        ctx.restore()

        if (coverR >= far) {
          onCompleteRef.current()
          return
        }
      } else if (noise) {
        ctx.drawImage(noise, 0, 0, W, H)
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      img.onload = null
    }
  }, [src])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 select-none ${visible ? "opacity-100" : "opacity-0"}`}
    />
  )
}

function LatestLink({ className }: { className?: string }) {
  return (
    <a
      href="#projects"
      className={`inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] text-copy-subtle uppercase transition-colors hover:text-zinc-800 ${className ?? ""}`}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-chart-1" />
      Latest, onchain-ui merged into the shadcn registry
      <span aria-hidden>→</span>
    </a>
  )
}

export function Hero({ mode }: { mode: SiteMode }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [asciiComplete, setAsciiComplete] = useState(false)
  const [stats] = useState(() =>
    pickTwo(mode === "web3" ? ALL_STATS : ALL_STATS.filter((s) => !s.web3Only))
  )
  const copy = COPY[mode]

  // Image reveals only after both conditions are met:
  // the ASCII animation has finished AND the image has loaded
  const showImage = imageLoaded && asciiComplete

  const handleAsciiComplete = useCallback(() => setAsciiComplete(true), [])

  return (
    <section className="flex min-h-svh flex-col overflow-hidden bg-stone-50">
      <Nav />

      {/* ── Mobile layout ── */}
      <div className="flex flex-1 flex-col justify-between lg:hidden">
        {/* Hello + tagline */}
        <div className="px-6 pt-2 pb-2">
          <div
            className="animate-in font-display leading-none font-bold tracking-tight text-zinc-900 duration-700 fill-mode-both fade-in slide-in-from-bottom-4"
            style={{ fontSize: "clamp(4rem, 19vw, 7rem)" }}
          >
            <EncryptedText
              text="Hello"
              revealDelayMs={120}
              flipDelayMs={40}
              charset="@#%*=+-:."
            />
          </div>
          <h1 className="mt-1.5 max-w-xs animate-in font-sans text-sm leading-snug text-zinc-900 delay-150 duration-700 fill-mode-both fade-in slide-in-from-bottom-3">
            {copy.headingMobile}
          </h1>
          <p className="mt-2 max-w-xs animate-in font-sans text-sm leading-snug text-copy-subtle delay-200 duration-700 fill-mode-both fade-in slide-in-from-bottom-3">
            Frontend engineer. Product builder. Based in Brisbane, AU.
          </p>
          <LatestLink className="mt-3 animate-in delay-300 duration-700 fill-mode-both fade-in" />
        </div>

        {/* Image */}
        <div className="@container relative min-h-0 flex-1 overflow-hidden">
          <AsciiReveal
            src="/me.png"
            onComplete={handleAsciiComplete}
            visible={!showImage}
          />
          <img
            src="/me.png"
            alt="Gavin Jaynes"
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter,opacity] duration-1000 ${showImage ? "opacity-100 grayscale-0" : "opacity-0 grayscale"}`}
          />
          <AsciiLens src="/me.png" active={showImage} />
        </div>

        {/* Buttons */}
        <div className="grid animate-in grid-cols-2 delay-500 duration-700 fill-mode-both fade-in">
          <a
            href="#projects"
            className="flex items-center justify-center bg-zinc-900 py-5 font-mono text-xs tracking-widest text-white uppercase transition-colors hover:bg-zinc-700"
          >
            View work
          </a>
          <button
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center justify-center bg-stone-200 py-5 font-mono text-xs tracking-widest text-zinc-600 uppercase transition-colors hover:bg-stone-300"
          >
            About me
          </button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="relative hidden flex-1 lg:flex lg:flex-row">
        {/* Sidebar labels */}
        <div className="absolute top-0 bottom-0 left-5 flex flex-col items-center justify-between py-8">
          <span className="rotate-180 font-mono text-[10px] tracking-[0.3em] text-copy-subtle uppercase [writing-mode:vertical-rl]">
            {copy.sidebarLabel}
          </span>
          <span className="rotate-180 font-mono text-[10px] tracking-[0.3em] text-copy-subtle uppercase [writing-mode:vertical-rl]">
            2026
          </span>
        </div>
        <div className="absolute top-0 bottom-0 left-14 w-px bg-zinc-200" />

        {/* Left content */}
        <div className="flex flex-1 flex-col justify-between py-10 pr-12 pl-24">
          {/* Stats */}
          <div className="animate-in delay-150 duration-700 fill-mode-both fade-in slide-in-from-bottom-3">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-zinc-900">
                    {value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-copy-subtle uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-copy-subtle">
              * figures unaudited
            </p>
          </div>

          {/* Hello + tagline */}
          <div className="my-auto animate-in py-10 delay-300 duration-700 fill-mode-both fade-in slide-in-from-bottom-4">
            <div
              className="font-display leading-none font-bold tracking-tight text-zinc-900"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
            >
              <EncryptedText
                text="Hello"
                revealDelayMs={120}
                flipDelayMs={40}
                charset="@#%*=+-:."
              />
            </div>
            <h1 className="mt-6 max-w-lg font-sans text-3xl leading-tight text-zinc-900 xl:text-4xl">
              {copy.heading}
            </h1>
            <p className="mt-5 max-w-sm font-sans text-lg leading-relaxed text-copy-subtle">
              Frontend engineer. Product builder. Based in Brisbane, AU.
            </p>
            <LatestLink className="mt-6" />
          </div>

          {/* CTAs */}
          <div className="flex animate-in items-center gap-5 delay-700 duration-700 fill-mode-both fade-in slide-in-from-bottom-3">
            <Button
              className="rounded-none bg-zinc-900 font-mono text-xs tracking-widest text-white uppercase hover:bg-zinc-700"
              asChild
            >
              <a href="#projects">View work</a>
            </Button>
            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-mono text-xs tracking-widest text-copy-subtle uppercase transition-colors hover:text-zinc-800"
            >
              About me
            </button>
          </div>
        </div>

        {/* Right photo */}
        <div className="@container relative w-[46%] flex-none overflow-hidden">
          <AsciiReveal
            src="/me.png"
            onComplete={handleAsciiComplete}
            visible={!showImage}
          />
          <img
            src="/me.png"
            alt="Gavin Jaynes"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-cover object-top transition-[filter,opacity] duration-1000 ${showImage ? "opacity-100 grayscale-0" : "opacity-0 grayscale"}`}
          />
          <AsciiLens src="/me.png" active={showImage} />
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-linear-to-r from-stone-50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
