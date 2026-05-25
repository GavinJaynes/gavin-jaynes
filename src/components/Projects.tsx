import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"

const projects = [
  {
    index: "01",
    name: "Web3 Product Suite + INDX",
    type: "DeFi Protocol",
    description:
      "Co-founded and led a full DeFi product suite: swap, bridge, staking, yield farming, and NFT platform, then spun out INDX, a novel on-chain index protocol. Users send USDC and receive proportional exposure to a basket of up to 20 tokens via real swaps. No proxies, no synthetics.",
    highlights: ["$1M+ revenue", "4 chains deployed", "~$50K TVL at peak", "Community in the thousands"],
    tech: ["Next.js", "React", "TypeScript", "Wagmi", "Viem", "TanStack Query", "The Graph", "Moralis", "Solidity"],
    chains: ["Base", "Ethereum", "BSC", "Arbitrum"],
    url: null,
  },
  {
    index: "02",
    name: "Algo Trading System",
    type: "Systems / Trading",
    description:
      "Autonomous trading system for HyperLiquid perpetual futures, and the MVP prototype for a future ClawOps Trading Companion. Trade via natural language through Telegram, or let it run: every 4 hours it scores RSI, funding, and momentum signals alongside a DBRCI breakout scanner, then decides whether to act. Full execution layer with leverage, GTC limit orders, fill polling, and TP/SL bracket management.",
    highlights: ["Natural language trading via Telegram", "Autonomous 4-hour signal cycle", "Full execution layer on HyperLiquid", "ClawOps Trading Companion prototype"],
    tech: ["Python", "HyperLiquid SDK", "cron", "Hetzner VPS", "Telegram Bot API"],
    chains: ["HyperLiquid"],
    url: null,
  },
  {
    index: "03",
    name: "ClawOps",
    type: "SaaS / AI",
    description:
      "Commercial SaaS AI assistant platform built on OpenClaw. Each customer gets a personal Telegram bot on a dedicated Hetzner VPS, live in minutes. The Companions platform is the real differentiator — installable AI personality layers with domain-specific knowledge, QMD-indexed persistent memory, their own data stores, third-party API integrations, and dedicated visual dashboard UIs. First companion: Entertainment Buddy (alpha), tracking taste profiles, artists, movies, gig history, and SoundCloud sets with smart recommendations.",
    highlights: ["Companions: installable AI skill layers", "End-to-end automated provisioning", "Smart model switching across 600+ models", "Entertainment Buddy companion in alpha"],
    tech: ["React", "Vite", "Convex", "TypeScript", "Stripe", "Hetzner API", "OpenRouter", "Telegram Bot API", "QMD"],
    chains: [],
    url: "https://clawops.io",
  },
]

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={cn(
        "border border-zinc-200 bg-white p-8 lg:p-10",
        inView
          ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
          : "opacity-0"
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        {/* Left */}
        <div>
          <div className="flex items-start gap-4 mb-5">
            <span className="font-mono text-xs text-zinc-300 mt-1 shrink-0">{project.index}</span>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h3 className="font-display font-bold text-zinc-900 text-lg">{project.name}</h3>
                <span className="font-mono text-[10px] text-chart-5 border border-chart-5/40 px-2 py-0.5 tracking-widest uppercase rounded-sm">
                  {project.type}
                </span>
              </div>
            </div>
          </div>

          <p className="font-sans text-zinc-500 leading-relaxed text-sm mb-6 max-w-xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="font-mono text-[11px] text-zinc-400 bg-zinc-100 px-2.5 py-1 tracking-wide">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — highlights */}
        <div className="lg:border-l lg:border-zinc-100 lg:pl-8">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-300 mb-4">Highlights</p>
          <ul className="space-y-3 mb-6">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="text-chart-5 mt-1 text-xs shrink-0">▸</span>
                <span className="font-sans text-sm text-zinc-500">{h}</span>
              </li>
            ))}
          </ul>

          {project.chains.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.chains.map((c) => (
                <span key={c} className="font-mono text-[10px] text-zinc-400 bg-zinc-100 px-2 py-1 tracking-wide">
                  {c}
                </span>
              ))}
            </div>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 font-mono text-xs text-chart-5 hover:opacity-70 tracking-wide transition-opacity"
            >
              Visit site ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function Projects() {
  const { ref: headingRef, inView: headingInView } = useInView(0.3)

  return (
    <section id="projects" className="bg-stone-50 px-8 py-28">
      <div className="mx-auto max-w-4xl">
        <div
          ref={headingRef}
          className={cn(
            "mb-14",
            headingInView
              ? "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
              : "opacity-0"
          )}
        >
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-zinc-400 mb-6">
            <EncryptedText text="03: Projects" revealDelayMs={80} flipDelayMs={40} charset="@#%*=+-:." />
          </p>
          <h2
            className="font-display font-bold text-zinc-900 leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Things I've built<br />and shipped.
          </h2>
        </div>

        <div className="space-y-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.index} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
