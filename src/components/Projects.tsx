import { useRef } from "react"
import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"
import type { SiteMode } from "@/lib/mode"

const projects = [
  {
    index: "01",
    name: "onchain-ui",
    type: "Open Source / Design System",
    description:
      "Open-source shadcn registry of copy-paste web3 components for teams building onchain interfaces: address display and ENS/Base identity, token logos, prices, balances, network badges, and portfolio asset rows. Registry-first, components install straight into your codebase via the shadcn CLI, inspectable and wired to your own data layer.",
    frontendDescription:
      "Open-source shadcn registry: a component library and distribution model for teams building modern web interfaces, currently focused on web3 primitives (address display, token logos, prices, balances, network badges). Registry-first architecture, components install straight into your codebase via the shadcn CLI, inspectable and wired to your own data layer, not hidden behind a package boundary.",
    highlights: [
      "Merged into the official shadcn registry directory",
      "Live registry at onchain-ui.dev",
      "One-line install via the shadcn CLI",
      "Registry contract tests, docs with live demos",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "shadcn",
      "wagmi",
      "viem",
      "Fumadocs",
    ],
    chains: [],
    url: "https://onchain-ui.dev",
    video: "/onchain-ui-promo.mp4",
    poster: "/onchain-ui-promo-poster.jpg",
  },
  {
    index: "02",
    name: "Web3 Product Suite + INDX",
    type: "DeFi Protocol",
    description:
      "Co-founded and led a full DeFi product suite: swap, bridge, staking, yield farming, and NFT platform, then spun out INDX, a novel on-chain index protocol. Users send USDC and receive proportional exposure to a basket of up to 20 tokens via real swaps. No proxies, no synthetics.",
    frontendDescription:
      "Co-founded and led engineering on a full product suite, including swap, bridge, staking, yield farming, and an NFT platform, handling real-time data, wallet state, and transaction feedback under sub-second response requirements. Spun out INDX, a novel index protocol in the DeFi space, built on the same performance-first architecture.",
    highlights: [
      "$1M+ revenue",
      "4 chains deployed",
      "~$50K TVL at peak",
      "Community in the thousands",
    ],
    tech: [
      "Next.js",
      "React",
      "TypeScript",
      "Wagmi",
      "Viem",
      "TanStack Query",
      "The Graph",
      "Moralis",
      "Solidity",
    ],
    chains: ["Base", "Ethereum", "BSC", "Arbitrum"],
    url: null,
    video: null,
    poster: null,
  },
  {
    index: "03",
    name: "Algo Trading System",
    type: "Systems / Trading",
    description:
      "Autonomous trading system for HyperLiquid perpetual futures, and the MVP prototype for a future ClawOps Trading Companion. Trade via natural language through Telegram, or let it run: every 4 hours it scores RSI, funding, and momentum signals alongside a DBRCI breakout scanner, then decides whether to act. Full execution layer with leverage, GTC limit orders, fill polling, and TP/SL bracket management.",
    highlights: [
      "Natural language trading via Telegram",
      "Autonomous 4-hour signal cycle",
      "Full execution layer on HyperLiquid",
      "ClawOps Trading Companion prototype",
    ],
    tech: [
      "Python",
      "HyperLiquid SDK",
      "cron",
      "Hetzner VPS",
      "Telegram Bot API",
    ],
    chains: ["HyperLiquid"],
    url: null,
    video: null,
    poster: null,
  },
  {
    index: "04",
    name: "ClawOps",
    type: "SaaS / AI",
    description:
      "Commercial SaaS AI assistant platform built on OpenClaw. Each customer gets a personal Telegram bot on a dedicated Hetzner VPS, live in minutes. The Companions platform is the real differentiator, with installable AI personality layers, domain-specific knowledge, QMD-indexed persistent memory, their own data stores, third-party API integrations, and dedicated visual dashboard UIs. First companion: Entertainment Buddy (alpha), tracking taste profiles, artists, movies, gig history, and SoundCloud sets with smart recommendations.",
    highlights: [
      "Companions: installable AI skill layers",
      "End-to-end automated provisioning",
      "Smart model switching across 600+ models",
      "Entertainment Buddy companion in alpha",
    ],
    tech: [
      "React",
      "Vite",
      "Convex",
      "TypeScript",
      "Stripe",
      "Hetzner API",
      "OpenRouter",
      "Telegram Bot API",
      "QMD",
    ],
    chains: [],
    url: "https://clawops.io",
    video: null,
    poster: null,
  },
]

const projectOrder: Record<SiteMode, string[]> = {
  web3: [
    "onchain-ui",
    "Web3 Product Suite + INDX",
    "Algo Trading System",
    "ClawOps",
  ],
  frontend: [
    "ClawOps",
    "onchain-ui",
    "Web3 Product Suite + INDX",
    "Algo Trading System",
  ],
  ai: [
    "ClawOps",
    "Algo Trading System",
    "Web3 Product Suite + INDX",
    "onchain-ui",
  ],
}

async function playFullscreen(video: HTMLVideoElement | null) {
  if (!video) return

  const restore = () => {
    video.muted = true
    void (screen.orientation as unknown as { unlock?: () => void })?.unlock?.()
    document.removeEventListener("fullscreenchange", onChange)
  }
  const onChange = () => {
    if (!document.fullscreenElement) restore()
  }

  video.muted = false
  video.play().catch(() => {})

  const el = video as HTMLVideoElement & {
    webkitEnterFullscreen?: () => void
    webkitRequestFullscreen?: () => void
  }

  try {
    if (el.requestFullscreen) {
      await el.requestFullscreen()
      document.addEventListener("fullscreenchange", onChange)
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen()
      document.addEventListener("fullscreenchange", onChange)
    } else if (el.webkitEnterFullscreen) {
      // iOS Safari — native player handles landscape rotation itself
      el.webkitEnterFullscreen()
      video.addEventListener(
        "webkitendfullscreen",
        () => (video.muted = true),
        { once: true }
      )
      return
    }
    await (
      screen.orientation as unknown as { lock?: (o: string) => Promise<void> }
    )?.lock?.("landscape")
  } catch {
    /* orientation lock unsupported or fullscreen denied — video still plays */
  }
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0]
  index: number
}) {
  const { ref, inView } = useInView()
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div
      ref={ref}
      className={cn(
        "border border-zinc-200 bg-white p-8 lg:p-10",
        inView
          ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-4"
          : "opacity-0"
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        {/* Left */}
        <div>
          <div className="mb-5 flex items-start gap-4">
            <span className="mt-1 shrink-0 font-mono text-xs text-copy-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg font-bold text-zinc-900">
                  {project.name}
                </h3>
                <span className="rounded-sm border border-chart-5/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-chart-5 uppercase">
                  {project.type}
                </span>
              </div>
            </div>
          </div>

          <p className="mb-6 max-w-xl font-sans text-sm leading-relaxed text-zinc-500">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="bg-zinc-100 px-2.5 py-1 font-mono text-[11px] tracking-wide text-copy-subtle"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — highlights */}
        <div className="lg:border-l lg:border-zinc-100 lg:pl-8">
          <p className="mb-4 font-mono text-[10px] tracking-[0.25em] text-copy-subtle uppercase">
            Highlights
          </p>
          <ul className="mb-6 space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-1 shrink-0 text-xs text-chart-5">▸</span>
                <span className="font-sans text-sm text-zinc-500">{h}</span>
              </li>
            ))}
          </ul>

          {project.chains.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.chains.map((c) => (
                <span
                  key={c}
                  className="bg-zinc-100 px-2 py-1 font-mono text-[10px] tracking-wide text-copy-subtle"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {(project.url || project.video) && (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-chart-5 transition-opacity hover:opacity-70"
                >
                  Visit site ↗
                </a>
              )}
              {project.video && (
                <button
                  type="button"
                  onClick={() => playFullscreen(videoRef.current)}
                  aria-label={`Watch ${project.name} promo video`}
                  className="inline-flex items-center gap-1.5 border border-chart-5/40 px-2.5 py-1 font-mono text-[11px] tracking-widest text-chart-5 uppercase transition-colors hover:bg-chart-5/10"
                >
                  <span aria-hidden>▶</span> Watch video
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {project.video && (
        <video
          ref={videoRef}
          src={project.video}
          poster={project.poster ?? undefined}
          loop
          playsInline
          preload="none"
          controls
          aria-label={`${project.name}, promo video`}
          tabIndex={-1}
          className="pointer-events-none absolute h-0 w-0"
        />
      )}
    </div>
  )
}

export function Projects({ mode }: { mode: SiteMode }) {
  const { ref: headingRef, inView: headingInView } = useInView(0.3)
  const orderedProjects = projectOrder[mode]
    .map((name) => projects.find((p) => p.name === name)!)
    .map((project) => ({
      ...project,
      description:
        mode === "frontend" && project.frontendDescription
          ? project.frontendDescription
          : project.description,
    }))

  return (
    <section id="projects" className="bg-stone-50 px-8 py-28">
      <div className="mx-auto max-w-4xl">
        <div
          ref={headingRef}
          className={cn(
            "mb-14",
            headingInView
              ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-3"
              : "opacity-0"
          )}
        >
          <p className="mb-6 font-mono text-xs tracking-[0.25em] text-copy-subtle uppercase">
            <EncryptedText
              text="03: Projects"
              revealDelayMs={80}
              flipDelayMs={40}
              charset="@#%*=+-:."
            />
          </p>
          <h2
            className="font-display leading-tight font-bold text-zinc-900"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Things I've built
            <br />
            and shipped.
          </h2>
        </div>

        <div className="space-y-4">
          {orderedProjects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
