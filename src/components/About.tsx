import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"
import type { SiteMode } from "@/lib/mode"

const points = [
  { label: "~15 years", detail: "Writing production code" },
  {
    label: "4 years",
    detail: "Deep in DeFi & Web3",
    frontend: { label: "4 years", detail: "Real-time, high-stakes systems (DeFi)" },
  },
  { label: "Enterprise scale", detail: "Squiz Matrix, engineered the CMS, not just sites on it" },
  { label: "AI engineering", detail: "Builds AI products and codes with AI daily, ships faster because of it" },
  { label: "Standards-driven", detail: "WCAG AAA, design systems, reusable components & craft" },
  { label: "Founder", detail: "ClawOps built end to end, product decisions, not just tickets" },
]

export function About({ mode }: { mode: SiteMode }) {
  const { ref: introRef, inView: introInView } = useInView(0.2)
  const { ref: pointsRef, inView: pointsInView } = useInView(0.2)

  return (
    <section id="about" className="bg-white px-8 py-28">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase mb-6">
          <EncryptedText text="01: About" revealDelayMs={80} flipDelayMs={40} charset="@#%*=+-:." />
        </p>

        {/* Intro — the emotional pitch */}
        <div
          ref={introRef}
          className={cn(
            "mb-16",
            introInView
              ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              : "opacity-0"
          )}
        >
          <p
            className="font-sans text-zinc-900 leading-relaxed mb-6"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}
          >
            A CV tells you where I've worked. It doesn't show you everything
            between the idea and the release: sprint planning, T-shirt sizing,
            the ticket that looked simple until you picked it up, and the days
            spent turning a complex system into an interface that feels obvious.
            The frustration. The breakthrough. The satisfaction when it all
            comes together: a versioned build moving cleanly through the release
            pipeline and out to thousands of users, a page transition that
            finally feels right, an API response shaped exactly the way it
            should be.
          </p>
          <p
            className="font-sans text-zinc-500 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
          >
            Before I wrote a line of code, I trained as a chef. It turned out to
            be less of a leap than you might think. Both demand preparation,
            precision, a willingness to keep improving, and a clear head when
            something goes wrong. Those lessons have stayed with me through
            fifteen years of building software. The tools have changed. The way
            I approach the work hasn't.
          </p>
        </div>

        {/* Key points grid */}
        <div
          ref={pointsRef}
          className={cn(
            "grid grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100",
            pointsInView
              ? "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
              : "opacity-0"
          )}
        >
          {points.map((point) => {
            const { label, detail } = mode === "frontend" && point.frontend ? point.frontend : point
            return (
              <div key={label} className="bg-white p-5">
                <p className="font-display font-bold text-zinc-900 text-sm">{label}</p>
                <p className="font-sans text-zinc-400 text-xs mt-1 leading-relaxed">{detail}</p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
