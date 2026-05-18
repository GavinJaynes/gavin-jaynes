import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"

const points = [
  { label: "~15 years", detail: "Writing production code" },
  { label: "4 years", detail: "Deep in DeFi & Web3" },
  { label: "Enterprise scale", detail: "Squiz Matrix, gov & higher-ed" },
  { label: "AI-augmented", detail: "Every day, not as a gimmick" },
  { label: "Standards-driven", detail: "Workflow, process & craft matter" },
  { label: "Seen it all", detail: "Flash, jQuery, TypeScript, the AI wave" },
]

export function About() {
  const { ref: introRef, inView: introInView } = useInView(0.2)
  const { ref: pointsRef, inView: pointsInView } = useInView(0.2)

  return (
    <section id="about" className="bg-white px-8 py-28">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase mb-6">
          About
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
            Anyone who has been at this a while knows it's about more than a CV.
            Real experience is built in the hours nobody sees: the problem you
            sat with for three days, the 2am breakthrough, back at it again by 6.
            The coffee. The frustration. And then the moment it works: a release
            pipeline rolling out to thousands, a transition that finally feels
            right, an API response shaped exactly the way it should be.
          </p>
          <p
            className="font-sans text-zinc-500 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}
          >
            Fifteen years means you've survived enough 'this changes everything'
            moments to have actual perspective on the current one. Flash died.
            jQuery got mocked. Angular happened twice. Every cycle has believers
            and casualties, I've made it through enough of them to know how to
            move rather than just react. AI is different in scale, not in kind.
            I use it every day. It makes me faster and more useful. That's the
            whole point.
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
          {points.map(({ label, detail }) => (
            <div key={label} className="bg-white p-5">
              <p className="font-display font-bold text-zinc-900 text-sm">{label}</p>
              <p className="font-sans text-zinc-400 text-xs mt-1 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>

        {/* Closing */}
        <p className="font-sans text-sm text-zinc-400 italic mt-10 max-w-xl leading-relaxed">
          I've done the enterprise thing. I know the rituals, the standups, the
          sprint reviews. I've also co-founded two startups, shipped DeFi
          products to thousands of users, and built a live trading system from
          scratch. I'm passionate about standards, workflow, and craft,
          and I'm ready for whatever's next.
        </p>
      </div>
    </section>
  )
}
