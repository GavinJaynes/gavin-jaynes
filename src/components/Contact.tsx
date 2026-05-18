import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
const links = [
  { label: "Email", value: "gavin.jaynes@gmail.com", href: "mailto:gavin.jaynes@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/gavin-jaynes", href: "https://www.linkedin.com/in/gavin-jaynes-45a0192b/" },
  { label: "X / Twitter", value: "@gavinjaynes", href: "https://x.com/gavinjaynes" },
  { label: "GitHub", value: "github.com/GavinJaynes", href: "https://github.com/GavinJaynes" },
]

export function Contact() {
  const { ref, inView } = useInView(0.2)

  return (
    <section id="contact" className="bg-zinc-950 px-8 py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-4xl",
          inView
            ? "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            : "opacity-0"
        )}
      >
        <p className="font-mono text-xs tracking-[0.25em] text-chart-1 uppercase mb-6">
          03: Contact
        </p>

        <h2
          className="font-display font-bold text-white leading-none mb-16"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
        >
          Let's talk.
        </h2>

        <div className="grid sm:grid-cols-2 gap-px bg-zinc-800">
          {links.map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-1 bg-zinc-950 p-6 hover:bg-zinc-900 transition-colors"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600 group-hover:text-chart-1 transition-colors">
                {label}
              </span>
              <span className="font-sans text-white text-sm group-hover:text-chart-1 transition-colors">
                {value}
              </span>
            </a>
          ))}
        </div>

        <div className="flex items-center justify-between mt-16 pt-8 border-t border-zinc-800">
          <span className="font-mono text-xs text-zinc-700 tracking-widest uppercase">Gavin Jaynes</span>
          <span className="font-mono text-xs text-zinc-700 tracking-widest uppercase">Remote, Anywhere</span>
        </div>
      </div>
    </section>
  )
}
