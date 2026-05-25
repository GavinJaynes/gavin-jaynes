import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"
import { EncryptedText } from "@/components/ui/encrypted-text"

const shots = [
  { src: "/clawops-screenshot-1.png",        alt: "ClawOps — Smart model switching" },
  { src: "/indx-screenshot-1.jpg",           alt: "INDX — Top Performers dashboard" },
  { src: "/indx-screenshot-3.jpg",           alt: "INDX — Mobile app" },
  { src: "/clawops-screenshot-2.png",        alt: "ClawOps — Every frontier model" },
  { src: "/crypto-genesis-screenshot-1.jpg", alt: "Crypto Genesis — Wallet app" },
  { src: "/indx-screenshot-2.jpg",           alt: "INDX — Crypto Traded Funds listing" },
  { src: "/indx-screenshot-4.jpg",           alt: "INDX — Index detail view" },
]

// Doubled for seamless marquee loop
const doubled = [...shots, ...shots]

export function Showcase() {
  const { ref, inView } = useInView(0.1)

  return (
    <section className="bg-zinc-950 pt-20 pb-24 overflow-hidden">
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
      `}</style>

      {/* Label */}
      <div
        ref={ref}
        className={cn(
          "px-8 mb-10",
          inView
            ? "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
            : "opacity-0"
        )}
      >
        <p className="font-mono text-xs tracking-[0.25em] text-chart-1 uppercase mb-3">
          <EncryptedText text="Selected shots" revealDelayMs={80} flipDelayMs={40} charset="@#%*=+-:." />
        </p>
        <p className="font-sans text-zinc-500 text-sm">
          All built and designed by me.
        </p>
      </div>

      {/* Marquee strip */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-zinc-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-zinc-950 to-transparent" />

        <div className="marquee-track flex gap-4 w-max">
          {doubled.map((shot, i) => (
            <img
              key={i}
              src={shot.src}
              alt={shot.alt}
              draggable={false}
              className="h-72 w-auto flex-none rounded-sm object-cover select-none"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
