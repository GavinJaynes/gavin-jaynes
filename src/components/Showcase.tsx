import { useEffect, useRef, useState } from "react"
import { useInView } from "@/hooks/useInView"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"

const shots = [
  { src: "/onchain-ui-homepage.png", alt: "onchain-ui, Homepage" },
  { src: "/clawops-screenshot-1.png", alt: "ClawOps, Smart model switching" },
  { src: "/indx-screenshot-1.jpg", alt: "INDX, Top Performers dashboard" },
  { src: "/indx-screenshot-3.jpg", alt: "INDX, Mobile app" },
  { src: "/clawops-screenshot-2.png", alt: "ClawOps, Every frontier model" },
  {
    src: "/crypto-genesis-screenshot-1.jpg",
    alt: "Crypto Genesis, Wallet app",
  },
  { src: "/indx-screenshot-2.jpg", alt: "INDX, Crypto Traded Funds listing" },
  { src: "/indx-screenshot-4.jpg", alt: "INDX, Index detail view" },
]

// Doubled for seamless marquee loop
const doubled = [...shots, ...shots]

export function Showcase() {
  const { ref, inView } = useInView(0.1)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  // Track which slide is snapped into view on mobile
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const slide = el.firstElementChild as HTMLElement | null
        if (!slide) return
        const step =
          slide.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0")
        setActive(Math.round(el.scrollLeft / step))
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="overflow-hidden bg-zinc-950 pt-20 pb-24">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-track[data-paused="true"] {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: none;
          }
        }
        .snap-scroller {
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .snap-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Label */}
      <div
        ref={ref}
        className={cn(
          "mb-10 flex items-end justify-between gap-6 px-8",
          inView
            ? "animate-in duration-700 fill-mode-both fade-in slide-in-from-bottom-3"
            : "opacity-0"
        )}
      >
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.25em] text-chart-1 uppercase">
            <EncryptedText
              text="Selected shots"
              revealDelayMs={80}
              flipDelayMs={40}
              charset="@#%*=+-:."
            />
          </p>
          <p className="font-sans text-sm text-copy-subtle-inverse">
            All built and designed by me.
          </p>
        </div>
        {!prefersReducedMotion && (
          <button
            type="button"
            aria-pressed={marqueePaused}
            onClick={() => setMarqueePaused((paused) => !paused)}
            className="hidden shrink-0 border border-zinc-700 px-3 py-2 font-mono text-[10px] tracking-widest text-copy-subtle-inverse uppercase transition-colors hover:border-chart-1 hover:text-chart-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chart-1 md:inline-flex"
          >
            <span aria-hidden>{marqueePaused ? "▶" : "Ⅱ"}</span>
            <span className="ml-2">
              {marqueePaused ? "Play shots" : "Pause shots"}
            </span>
          </button>
        )}
      </div>

      {/* Mobile: one-at-a-time scroll-snap carousel */}
      <div className="md:hidden">
        <div
          ref={scrollerRef}
          className="snap-scroller flex snap-x snap-mandatory scroll-px-8 gap-4 overflow-x-auto px-8"
          aria-label="Selected shots carousel"
        >
          {shots.map((shot) => (
            <figure
              key={shot.src}
              className="w-full flex-none snap-start snap-always"
            >
              <img
                src={shot.src}
                alt={shot.alt}
                draggable={false}
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] w-full rounded-sm bg-zinc-900 object-cover select-none"
              />
              <figcaption className="mt-3 font-mono text-[11px] tracking-wider text-copy-subtle-inverse uppercase">
                {shot.alt}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Position dots */}
        <div
          className="mt-5 flex items-center justify-center gap-2"
          aria-hidden="true"
        >
          {shots.map((shot, i) => (
            <span
              key={shot.src}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-5 bg-chart-1" : "w-1.5 bg-zinc-700"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop: marquee strip */}
      <div className="relative hidden md:block">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-zinc-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-zinc-950 to-transparent" />

        <div
          className="marquee-track flex w-max gap-4"
          data-paused={marqueePaused || prefersReducedMotion ? "true" : "false"}
        >
          {doubled.map((shot, i) => (
            <img
              key={i}
              src={shot.src}
              alt={i < shots.length ? shot.alt : ""}
              aria-hidden={i >= shots.length ? true : undefined}
              draggable={false}
              loading="lazy"
              decoding="async"
              className="h-72 w-auto flex-none rounded-sm object-cover select-none"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
