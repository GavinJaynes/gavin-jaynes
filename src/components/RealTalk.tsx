import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"

const stats = [
  {
    value: "$1M+",
    label: "Protocol revenue",
    context: "Brewlabs + INDX",
  },
  {
    value: "4",
    label: "EVM chains shipped",
    context: "Base · ETH · BSC · Arbitrum",
  },
  {
    value: "~$50K",
    label: "TVL at peak",
    context: "On-chain index protocol",
  },
  {
    value: "10+",
    label: "Years in production",
    context: "Frontend engineering",
  },
]

function StatCard({ value, label, context, index }: (typeof stats)[0] & { index: number }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={cn(
        "border-t border-zinc-800 pt-6",
        inView
          ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
          : "opacity-0"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <p className="font-display font-bold text-white" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
        {value}
      </p>
      <p className="font-sans text-sm text-white/80 mt-1">{label}</p>
      <p className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase mt-1">{context}</p>
    </div>
  )
}

export function RealTalk() {
  const { ref: headingRef, inView: headingInView } = useInView(0.3)
  const { ref: liveRef, inView: liveInView } = useInView()
  const { ref: closingRef, inView: closingInView } = useInView()

  return (
    <section className="bg-zinc-950 px-8 py-28">
      <div className="mx-auto max-w-4xl">
        {/* Label + heading */}
        <div
          ref={headingRef}
          className={cn(
            "mb-16",
            headingInView
              ? "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
              : "opacity-0"
          )}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-chart-1 uppercase mb-6">
            Real Talk
          </p>
          <h2
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Okay, fine.<br />Some numbers do matter.
          </h2>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>

        {/* Live stat — treated differently */}
        <div
          ref={liveRef}
          className={cn(
            "border border-zinc-800 bg-zinc-900 p-6 lg:p-8",
            liveInView
              ? "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
              : "opacity-0"
          )}
        >
          <div className="flex items-start gap-6">
            <div className="flex items-center gap-2 shrink-0 pt-1">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-chart-1" />
              </span>
              <span className="font-mono text-xs text-chart-1 tracking-widest uppercase">Live</span>
            </div>
            <div>
              <p className="font-sans font-medium text-white text-base lg:text-lg">
                Algorithmic trading system — running right now.
              </p>
              <p className="font-sans text-zinc-400 text-sm mt-1 leading-relaxed">
                Perpetual futures on HyperLiquid. Real capital. Real risk management. Not a side project.
              </p>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <p
          ref={closingRef}
          className={cn(
            "font-sans text-sm text-zinc-600 italic mt-8",
            closingInView
              ? "animate-in fade-in duration-700 delay-200 fill-mode-both"
              : "opacity-0"
          )}
        >
          The experience is real. The code is in production. Ready for the next one.
        </p>
      </div>
    </section>
  )
}
