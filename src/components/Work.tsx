import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"
import type { SiteMode } from "@/lib/mode"

const roles = [
  {
    period: "2026 - Present",
    role: "Founder",
    company: "ClawOps",
    description:
      "Built a commercial SaaS AI assistant platform on top of OpenClaw. A monorepo: React frontend, Convex backend, automated Hetzner VPS provisioning via SSH, Stripe subscriptions, and per-customer OpenRouter API keys with spending caps. The key differentiator is the Companions platform, with installable AI personality layers, persistent memory, their own data stores, API integrations, and visual dashboard UIs.",
  },
  {
    period: "2022 - 2025",
    role: "Co-founder & Lead Engineer",
    company: "Web3 Product Suite",
    description:
      "Co-founded and led engineering on a full DeFi product suite: swap, bridge, staking, yield farming, NFT platform, then spun out a standalone on-chain index protocol. Built on Next.js with SSR and mixed rendering strategies. Shipped across Base, Ethereum, BSC, and Arbitrum. $1M+ revenue generated, community in the thousands.",
    frontendDescription:
      "Co-founded and led engineering on a full product suite built on Next.js with SSR and mixed rendering strategies, built for real-time data and sub-second responsiveness under load, including swap, bridge, staking, yield farming, and an NFT platform, later spun out into a standalone on-chain index protocol in the DeFi space. Shipped across four chains, $1M+ revenue generated, community in the thousands.",
  },
  {
    period: "2013 - 2022",
    role: "Frontend Engineer → Senior",
    company: "Enterprise & Agency",
    description:
      "Nine years across London agencies and Australian enterprise. SSR-first delivery across Next.js, Nuxt, and Astro, test pipelines from unit to E2E, performance-critical government properties, and the component systems and discipline that come from building at institutional scale. The foundation.",
  },
]

const roleOrder: Record<SiteMode, string[]> = {
  web3: ["ClawOps", "Web3 Product Suite", "Enterprise & Agency"],
  frontend: ["Enterprise & Agency", "ClawOps", "Web3 Product Suite"],
  ai: ["ClawOps", "Web3 Product Suite", "Enterprise & Agency"],
}

function WorkEntry({
  period,
  role,
  company,
  description,
  index,
}: (typeof roles)[0] & { index: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={cn(
        "relative pl-10 transition-none",
        inView
          ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-4"
          : "opacity-0"
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Dot */}
      <div className="absolute top-1.5 left-0 size-2.75 rounded-full bg-chart-1" />

      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="font-sans text-lg font-semibold text-white">
            {role}
          </span>
          <span className="font-sans text-lg text-copy-subtle-inverse">
            {" "}
            · {company}
          </span>
        </div>
        <span className="shrink-0 font-mono text-sm text-chart-1 sm:pt-0.5">
          {period}
        </span>
      </div>

      <p className="max-w-2xl font-sans text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
    </div>
  )
}

export function Work({ mode }: { mode: SiteMode }) {
  const { ref: headingRef, inView: headingInView } = useInView(0.3)
  const orderedRoles = roleOrder[mode]
    .map((company) => roles.find((r) => r.company === company)!)
    .map((role) => ({
      ...role,
      description:
        mode === "frontend" && role.frontendDescription
          ? role.frontendDescription
          : role.description,
    }))

  return (
    <section id="work" className="bg-zinc-950 px-8 py-28">
      <div className="mx-auto max-w-4xl">
        {/* Section label + heading */}
        <div
          ref={headingRef}
          className={cn(
            "mb-20",
            headingInView
              ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-3"
              : "opacity-0"
          )}
        >
          <p className="mb-6 font-mono text-xs tracking-[0.25em] text-chart-1 uppercase">
            <EncryptedText
              text="02: Selected Work"
              revealDelayMs={80}
              flipDelayMs={40}
              charset="@#%*=+-:."
            />
          </p>
          <h2
            className="font-display leading-tight font-bold text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            A decade of shipping interfaces people actually use.
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute top-2 bottom-2 left-1.25 w-px bg-zinc-800" />
          <div className="space-y-14">
            {orderedRoles.map((role, i) => (
              <WorkEntry key={role.period} {...role} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
