import { useCallback, useEffect, useRef, useState } from "react"
import { Nav } from "@/components/Nav"
import { Button } from "@/components/ui/button"
import { EncryptedText } from "@/components/ui/encrypted-text"

const ALL_STATS = [
  { value: "5,657", label: "Slack messages replied to" },
  { value: "7,456", label: "Hours in meetings" },
  { value: "672", label: "Sprint plannings survived" },
  { value: "∞", label: "console.logs deleted" },
  { value: "1.4M", label: "Lines of code (net negative)" },
  { value: "847", label: "PRs reviewed on a Friday" },
  { value: "3am", label: "Mainnet launch time" },
  { value: "0", label: "Designs accepted first pass" },
  { value: "404", label: "Bugs marked won't fix" },
  { value: "12", label: "Rebrands survived" },
]

const ASCII_ART = `...............................................::--:................................................
...........................................:-=*#**%%+--:............................................
.........................................:-+#%@@@@@@%%%##*=.........................................
......................................:--+#%%#%%@%%@@@@@%**=........................................
......................................-=*%@%%%@@@@%@@@@@@@@%##=:....................................
.....................................:=*#%%%%%#*++++**#%@@@%#+*+-...................................
.....................................:+#%%#+--::::::---=+#%@@%%#=...................................
.....................................-%%%*-::::::::::----=+#%%%#*-..................................
.....................................=%%*=:::::::::::----==+#%#+-:..................................
....................................-#%#*-::::::::::::---==+*%@%+:..................................
...................................:+%@%+-::--==-::::::-==+++#@#-...................................
....................................=%%*-:::::----::--=++++++#%=....................................
....................................-+#*-:--=*##**=:-*#*****+*+:....................................
...................................:--==::::--====-:-=***+***+*=....................................
....................................--=-:::::::::::::=+++===++*-....................................
....................................:-=--::::::::::::=++==-=+++:....................................
.....................................--=-::::::::-===*#*+===++-.....................................
......................................:---::::--=+*###%%#*+++=:.....................................
.......................................:=--::-++++++++*###***-......................................
.......................................:++=---=-:::=+++++**#+:......................................
.......................................:+#*===--::-=+*++*###-.......................................
.......................................:-=**++*====+++*#%%*-........................................
.......................................----+*###*######%%+:.........................................
.....................................---::--=++*###%##%%#=..........................................
...................................:-==-:::--========*##*+-:........................................
.....................................-=-:::---------=+****+=--::....................................
.......................................:::----------=+***#+------:::................................
..........................................:-----====+=+*##+--:---:::::::............................
...........................:...:.....:........:-=***==**=--::::::::::::::::.........................
.............................:........::...........::::::::::::::::::::::::::.......................
..........................::..:::.......:..............::::::::::::::.:::.::-:......................
...........................::..:::......::.........:...::::::::::::::..::..:::......................
............................::..::.......::....::...:...::::::::.:::::.::..:::-.....................
`

function pickTwo<T>(arr: T[]): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2)
}

const PATCH_COLS = 60
const PATCH_ROWS = 82
const PATCH_TOTAL = PATCH_COLS * PATCH_ROWS

// Characters that feel like ASCII art noise
const ASCII_CHARSET = ":-=+*#%@"

function randomAsciiChar() {
  return ASCII_CHARSET[Math.floor(Math.random() * ASCII_CHARSET.length)]
}

// Animates random chars resolving into the real ASCII art face
function AsciiReveal({ onComplete, visible }: { onComplete: () => void; visible: boolean }) {
  const preRef = useRef<HTMLPreElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const chars = ASCII_ART.split("")

    // Start scrambled — dots are background so leave them, only scramble face chars
    const display = chars.map(c => (c === "\n" || c === " " || c === ".") ? c : randomAsciiChar())

    // Only reveal actual face characters — dots stay as-is throughout
    const revealable: number[] = []
    chars.forEach((c, i) => {
      if (c !== "\n" && c !== " " && c !== ".") revealable.push(i)
    })

    // Fisher-Yates shuffle for random reveal order
    for (let i = revealable.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[revealable[i], revealable[j]] = [revealable[j], revealable[i]]
    }

    let revealedCount = 0
    const REVEAL_PER_FRAME = 28   // ~2s reveal at 60fps for ~3400 chars
    let lastFlipTime = 0
    const FLIP_INTERVAL = 40      // ms between random flips of unrevealed chars
    let rafId: number

    const tick = (now: number) => {
      // Lock in the next batch of real characters
      const end = Math.min(revealedCount + REVEAL_PER_FRAME, revealable.length)
      for (let i = revealedCount; i < end; i++) {
        const idx = revealable[i]
        display[idx] = chars[idx]
      }
      revealedCount = end

      // Keep unrevealed chars flipping
      if (now - lastFlipTime >= FLIP_INTERVAL) {
        for (let i = revealedCount; i < revealable.length; i++) {
          display[revealable[i]] = randomAsciiChar()
        }
        lastFlipTime = now
      }

      // Direct DOM update — zero React re-renders
      if (preRef.current) {
        preRef.current.textContent = display.join("")
      }

      if (revealedCount >= revealable.length) {
        onCompleteRef.current()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, []) // intentionally runs once on mount

  return (
    <pre
      ref={preRef}
      aria-hidden
      className={`absolute top-0 left-1/2 -translate-x-1/2 h-full overflow-hidden font-mono text-zinc-400 leading-[1.15] select-none pointer-events-none transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ fontSize: "max(1.74cqw, 2.5dvh)" }}
    />
  )
}

// Tiny pixel-dissolve glitch — direct DOM manipulation, no React re-renders
function AsciiGlitch({ active }: { active: boolean }) {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const activateCell = (i: number) => {
    const el = cellRefs.current[i]
    if (!el) return
    const existing = timers.current.get(i)
    if (existing) clearTimeout(existing)
    el.style.opacity = String(0.2 + Math.random() * 0.3)
    timers.current.set(i, setTimeout(() => {
      if (cellRefs.current[i]) cellRefs.current[i]!.style.opacity = "0"
      timers.current.delete(i)
    }, 400))
  }

  const handlePointer = (x: number, y: number) => {
    for (let i = 0; i < PATCH_TOTAL; i++) {
      const col = i % PATCH_COLS
      const row = Math.floor(i / PATCH_COLS)
      const cx = (col + 0.5) / PATCH_COLS
      const cy = (row + 0.5) / PATCH_ROWS
      const dist = Math.sqrt((cx - x) ** 2 + (cy - y) ** 2)
      if (dist < 0.18 && Math.random() > 0.94) activateCell(i)
    }
  }

  useEffect(() => () => { timers.current.forEach(clearTimeout) }, [])

  if (!active) return null

  return (
    <div
      aria-hidden
      className="absolute inset-0 select-none z-10"
      style={{ display: "grid", gridTemplateColumns: `repeat(${PATCH_COLS}, 1fr)`, gridTemplateRows: `repeat(${PATCH_ROWS}, 1fr)` }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        handlePointer((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)
      }}
      onTouchMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const t = e.touches[0]
        handlePointer((t.clientX - r.left) / r.width, (t.clientY - r.top) / r.height)
      }}
    >
      {Array.from({ length: PATCH_TOTAL }, (_, i) => (
        <div
          key={i}
          ref={el => { cellRefs.current[i] = el }}
          className="bg-stone-50"
          style={{ opacity: 0, transition: "opacity 350ms ease-out" }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [asciiComplete, setAsciiComplete] = useState(false)
  const [stats] = useState(() => pickTwo(ALL_STATS))

  // Image reveals only after both conditions are met:
  // the ASCII animation has finished AND the image has loaded
  const showImage = imageLoaded && asciiComplete

  const handleAsciiComplete = useCallback(() => setAsciiComplete(true), [])

  return (
    <section className="flex min-h-svh flex-col overflow-hidden bg-stone-50">
      <Nav />

      {/* ── Mobile layout ── */}
      <div className="flex flex-1 flex-col justify-between lg:hidden">

        {/* Hello + tagline */}
        <div className="px-6 pt-2 pb-2">
          <div
            className="font-display font-bold leading-none tracking-tight text-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            style={{ fontSize: "clamp(4rem, 19vw, 7rem)" }}
          >
            <EncryptedText text="Hello" revealDelayMs={120} flipDelayMs={40} charset="@#%*=+-:." />
          </div>
          <h1 className="font-sans mt-1.5 max-w-xs text-sm leading-snug text-zinc-900 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
            Building the systems behind DeFi, agentic trading and autonomous software.
          </h1>
          <p className="font-sans mt-2 max-w-xs text-sm leading-snug text-zinc-400 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both">
            Frontend engineer. Product builder. Based remotely, available anywhere.
          </p>
        </div>

        {/* Image */}
        <div className="relative flex-1 min-h-0 overflow-hidden [container-type:inline-size]">
          <AsciiReveal onComplete={handleAsciiComplete} visible={!showImage} />
          <img
            src="/me.png"
            alt="Gavin Jaynes"
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter,opacity] duration-1000 ${showImage ? "grayscale-0 opacity-100" : "grayscale opacity-0"}`}
          />
          <AsciiGlitch active={showImage} />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 animate-in fade-in duration-700 delay-500 fill-mode-both">
          <a
            href="#projects"
            className="flex items-center justify-center bg-zinc-900 py-5 font-mono text-xs tracking-widest text-white uppercase hover:bg-zinc-700 transition-colors"
          >
            View work
          </a>
          <button
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center bg-stone-200 py-5 font-mono text-xs tracking-widest text-zinc-600 uppercase hover:bg-stone-300 transition-colors"
          >
            About me
          </button>
        </div>
      </div>

      {/* ── Desktop layout ── */}
      <div className="relative hidden flex-1 lg:flex lg:flex-row">

        {/* Sidebar labels */}
        <div className="absolute bottom-0 left-5 top-0 flex flex-col items-center justify-between py-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-300 uppercase [writing-mode:vertical-rl] rotate-180">
            Frontend · DeFi · Systems
          </span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-300 uppercase [writing-mode:vertical-rl] rotate-180">
            2026
          </span>
        </div>
        <div className="absolute bottom-0 left-14 top-0 w-px bg-zinc-200" />

        {/* Left content */}
        <div className="flex flex-1 flex-col justify-between pl-24 pr-12 py-10">
          {/* Stats */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-150 fill-mode-both">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-zinc-900">{value}</p>
                  <p className="font-mono mt-1 text-[10px] tracking-[0.2em] text-zinc-400 uppercase">{label}</p>
                </div>
              ))}
            </div>
            <p className="font-mono mt-5 text-[10px] tracking-[0.2em] text-zinc-400">
              * figures unaudited
            </p>
          </div>

          {/* Hello + tagline */}
          <div className="my-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            <div
              className="font-display font-bold leading-none tracking-tight text-zinc-900"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7.5rem)" }}
            >
              <EncryptedText text="Hello" revealDelayMs={120} flipDelayMs={40} charset="@#%*=+-:." />
            </div>
            <h1 className="font-sans mt-6 max-w-lg text-3xl leading-tight text-zinc-900 xl:text-4xl">
              Building the systems behind
              <br />
              DeFi, agentic trading and
              <br />
              autonomous software.
            </h1>
            <p className="font-sans mt-5 max-w-sm text-lg leading-relaxed text-zinc-400">
              Frontend engineer. Product builder. Based remotely, available anywhere.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-5 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-700 fill-mode-both">
            <Button
              className="rounded-none bg-zinc-900 font-mono text-xs tracking-widest text-white uppercase hover:bg-zinc-700"
              asChild
            >
              <a href="#projects">View work</a>
            </Button>
            <button
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
              className="font-mono text-xs tracking-widest text-zinc-400 uppercase transition-colors hover:text-zinc-700"
            >
              About me
            </button>
          </div>
        </div>

        {/* Right photo */}
        <div className="relative w-[46%] flex-none overflow-hidden [container-type:inline-size]">
          <AsciiReveal onComplete={handleAsciiComplete} visible={!showImage} />
          <img
            src="/me.png"
            alt="Gavin Jaynes"
            onLoad={() => setImageLoaded(true)}
            className={`h-full w-full object-cover object-top transition-[filter,opacity] duration-1000 ${showImage ? "grayscale-0 opacity-100" : "grayscale opacity-0"}`}
          />
          <AsciiGlitch active={showImage} />
          <div className="absolute inset-y-0 left-0 z-20 w-32 bg-linear-to-r from-stone-50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
