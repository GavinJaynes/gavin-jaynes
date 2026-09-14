import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"
import type { SiteMode } from "@/lib/mode"

const baseLinks = [
  {
    label: "Email",
    value: "gavin.jaynes@gmail.com",
    href: "mailto:gavin.jaynes@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/gavin-jaynes",
    href: "https://www.linkedin.com/in/gavin-jaynes-45a0192b/",
  },
]

export function Contact({ mode }: { mode: SiteMode }) {
  const { ref, inView } = useInView(0.2)
  const twitterLink =
    mode === "frontend"
      ? {
          label: "X / Twitter",
          value: "@GavinJaynes",
          href: "https://x.com/GavinJaynes",
        }
      : {
          label: "X / Twitter",
          value: "@GarlicBl",
          href: "https://x.com/GarlicBl",
        }
  const links = [...baseLinks, twitterLink]

  return (
    <section id="contact" className="bg-zinc-950 px-8 py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-4xl",
          inView
            ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-4"
            : "opacity-0"
        )}
      >
        <p className="mb-6 font-mono text-xs tracking-[0.25em] text-chart-1 uppercase">
          <EncryptedText
            text="04: Contact"
            revealDelayMs={80}
            flipDelayMs={40}
            charset="@#%*=+-:."
          />
        </p>

        <h2
          className="mb-16 font-display leading-none font-bold text-white"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
        >
          <EncryptedText
            text="Let's talk."
            revealDelayMs={120}
            flipDelayMs={40}
            charset="@#%*=+-:."
          />
        </h2>

        <div className="grid gap-px bg-zinc-800 sm:grid-cols-3">
          {links.map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-1 bg-zinc-950 p-6 transition-colors hover:bg-zinc-900"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-copy-subtle-inverse uppercase transition-colors group-hover:text-chart-1">
                {label}
              </span>
              <span className="font-sans text-sm text-white transition-colors group-hover:text-chart-1">
                {value}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-zinc-800 pt-8">
          <span className="font-mono text-xs tracking-widest text-copy-subtle-inverse uppercase">
            Gavin Jaynes
          </span>
          <span className="font-mono text-xs tracking-widest text-copy-subtle-inverse uppercase">
            Brisbane, AU
          </span>
        </div>
      </div>
    </section>
  )
}
