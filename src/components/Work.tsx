import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"

const roles = [
  {
    period: "2024 - Present",
    role: "Founder",
    company: "OpenClaw",
    description:
      "Built a commercial AI assistant platform from scratch: React, Convex, automated Hetzner VPS provisioning via SSH, Stripe subscriptions, and per-customer OpenRouter API keys with spending caps. Developed a novel multi-AI coordination pattern, two agents collaborating async via shared markdown files.",
  },
  {
    period: "2022 - 2024",
    role: "Co-founder & Lead Engineer",
    company: "Web3 Product Suite",
    description:
      "Co-founded and led engineering on a full DeFi product suite: swap, bridge, staking, yield farming, NFT platform, then spun out a standalone on-chain index protocol. Shipped across Base, Ethereum, BSC, and Arbitrum. $1M+ revenue generated, community in the thousands.",
  },
  {
    period: "2013 - 2022",
    role: "Frontend Engineer → Senior",
    company: "Enterprise & Agency",
    description:
      "Nine years across London agencies and Australian enterprise. Membership platforms, eCommerce, government-scale CMS. The foundation.",
  },
]

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
          ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
          : "opacity-0"
      )}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Dot */}
      <div className="absolute left-0 top-1.5 size-2.75 rounded-full bg-chart-1" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
        <div>
          <span className="font-sans font-semibold text-white text-lg">{role}</span>
          <span className="font-sans text-zinc-500 text-lg"> · {company}</span>
        </div>
        <span className="font-mono text-sm text-chart-1 shrink-0 sm:pt-0.5">{period}</span>
      </div>

      <p className="font-sans text-zinc-400 leading-relaxed text-sm max-w-2xl">
        {description}
      </p>
    </div>
  )
}

export function Work() {
  const { ref: headingRef, inView: headingInView } = useInView(0.3)

  return (
    <section id="work" className="bg-zinc-950 px-8 py-28">
      <div className="mx-auto max-w-4xl">
        {/* Section label + heading */}
        <div
          ref={headingRef}
          className={cn(
            "mb-20",
            headingInView
              ? "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
              : "opacity-0"
          )}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-chart-1 uppercase mb-6">
            <EncryptedText text="02: Selected Work" revealDelayMs={80} flipDelayMs={40} charset="@#%*=+-:." />
          </p>
          <h2
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            A decade of shipping interfaces people actually use.
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1.25 top-2 bottom-2 w-px bg-zinc-800" />
          <div className="space-y-14">
            {roles.map((role, i) => (
              <WorkEntry key={role.period} {...role} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
