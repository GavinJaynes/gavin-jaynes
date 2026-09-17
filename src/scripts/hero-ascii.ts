import {
  CELL_H,
  CELL_W,
  FONT,
  SHADES,
  type PortraitSource,
  buildStaticLayer,
  hash,
  loadPortraitSource,
  randomScrambleChar,
  sampleCells,
  shadeFor,
} from "@/components/ascii"

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

// The photo is only worth withholding for as long as the reveal is actually
// playing. If the canvas never gets a frame — a backgrounded tab, a stalled
// decode — hand the portrait over rather than leaving a blank panel.
const REVEAL_TIMEOUT_MS = 3000

// Load-in reveal: sparse noise while the portrait decodes, then a
// scramble-edged wipe expands from the center, resolving into the ASCII
// portrait sampled from the image's own pixels.
function runReveal(canvas: HTMLCanvasElement, source: PortraitSource) {
  return new Promise<void>((resolve) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      resolve()
      return
    }

    let width = 0
    let height = 0
    let columns = 0
    let rows = 0
    let dpr = 1
    let cells: Uint8Array | null = null
    let staticLayer: HTMLCanvasElement | null = null
    let noiseLayer: HTMLCanvasElement | null = null
    let noiseContext: CanvasRenderingContext2D | null = null
    let radius = 0
    let lastFrame = -1
    let animationFrame = 0
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeout)
      resolve()
    }
    const timeout = setTimeout(finish, REVEAL_TIMEOUT_MS)

    // Repaint the scramble layer: everything on `full`, else flip a subset.
    // Before the portrait is sampled, a fixed pseudo-random subset of cells
    // carries noise; after, the noise follows the portrait's real silhouette.
    const paintNoise = (full: boolean) => {
      if (!noiseContext) return
      const frame = Math.floor(performance.now() / 70)
      if (full) noiseContext.clearRect(0, 0, width, height)

      for (let index = 0; index < columns * rows; index++) {
        const cell = cells ? cells[index] : hash(index, 1) > 0.55 ? 3 : 0
        if (cell === 0) continue
        if (!full && (cell === 1 || hash(index, frame) > 0.3)) continue

        const x = (index % columns) * CELL_W + CELL_W / 2
        const y = Math.floor(index / columns) * CELL_H + CELL_H / 2
        if (!full) {
          noiseContext.clearRect(x - CELL_W / 2, y - CELL_H / 2, CELL_W, CELL_H)
        }
        noiseContext.fillStyle = cells ? shadeFor(cell) : SHADES[1]
        noiseContext.fillText(
          cell === 1 ? "." : randomScrambleChar(index, frame),
          x,
          y
        )
      }
    }

    const measure = () => {
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return false

      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.ceil(width / CELL_W)
      rows = Math.ceil(height / CELL_H)

      noiseLayer = document.createElement("canvas")
      noiseLayer.width = canvas.width
      noiseLayer.height = canvas.height
      noiseContext = noiseLayer.getContext("2d")
      if (noiseContext) {
        noiseContext.setTransform(dpr, 0, 0, dpr, 0, 0)
        noiseContext.font = FONT
        noiseContext.textAlign = "center"
        noiseContext.textBaseline = "middle"
      }

      cells = sampleCells(source, width, height, columns, rows)
      if (cells) {
        staticLayer = buildStaticLayer(
          cells,
          columns,
          rows,
          canvas.width,
          canvas.height,
          dpr
        )
      }
      paintNoise(true)
      return true
    }

    const tick = () => {
      if (!width && !measure()) {
        animationFrame = requestAnimationFrame(tick)
        return
      }

      const frame = Math.floor(performance.now() / 70)
      if (frame !== lastFrame) {
        paintNoise(false)
        lastFrame = frame
      }

      ctx.clearRect(0, 0, width, height)
      const centerX = width / 2
      const centerY = height / 2
      const farthestCorner = Math.hypot(centerX, centerY)

      if (cells && staticLayer && noiseLayer) {
        const targetRadius = (farthestCorner / 0.7) * 1.02
        radius += (targetRadius - radius) * 0.05
        const coverRadius = radius * 0.7

        // scrambled silhouette outside the resolve front
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, width, height)
        ctx.arc(
          centerX,
          centerY,
          Math.min(coverRadius, farthestCorner + 10),
          0,
          Math.PI * 2
        )
        ctx.clip("evenodd")
        ctx.drawImage(noiseLayer, 0, 0, width, height)
        ctx.restore()

        // resolved portrait inside
        ctx.save()
        ctx.beginPath()
        ctx.arc(centerX, centerY, coverRadius, 0, Math.PI * 2)
        ctx.clip()
        ctx.drawImage(staticLayer, 0, 0, width, height)
        ctx.restore()

        if (coverRadius >= farthestCorner) {
          finish()
          return
        }
      } else if (noiseLayer) {
        ctx.drawImage(noiseLayer, 0, 0, width, height)
      }

      animationFrame = requestAnimationFrame(tick)
    }

    animationFrame = requestAnimationFrame(tick)
  })
}

function setupPortrait(root: HTMLElement) {
  const image = root.querySelector<HTMLImageElement>("[data-portrait-image]")
  const reveal = root.querySelector<HTMLCanvasElement>("[data-ascii-reveal]")
  const lens = root.querySelector<HTMLCanvasElement>("[data-ascii-lens]")
  if (!image || !reveal) return

  const showPortrait = () => {
    clearTimeout(failsafe)
    image.classList.remove("opacity-0", "grayscale")
    reveal.classList.add("opacity-0")
  }

  // Whatever happens upstream — a slow network, a decode that never settles,
  // a canvas that cannot be measured — the photo is never withheld for long.
  const failsafe = setTimeout(showPortrait, REVEAL_TIMEOUT_MS * 2)

  const decoded =
    image.complete && image.naturalWidth > 0
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true })
          image.addEventListener("error", () => resolve(), { once: true })
        })

  void decoded
    .then(() => loadPortraitSource(image))
    .then(async (source) => {
      if (!source) {
        showPortrait()
        return
      }

      // rAF is frozen in a hidden tab, so the wipe would never advance;
      // reduced motion opts out of it entirely.
      const skip = reduceMotion || document.visibilityState === "hidden"
      if (!skip) await runReveal(reveal, source)
      showPortrait()

      if (!lens) return
      // The hover x-ray is never needed on first paint, so it is split out
      // of the entry bundle and pulled in once the browser is idle.
      const idle =
        window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 200))
      idle(() => {
        void import("@/scripts/ascii-lens").then(({ setupLens }) => {
          setupLens(lens, image, source, reduceMotion)
        })
      })
    })
}

document
  .querySelectorAll<HTMLElement>("[data-ascii-portrait]")
  .forEach(setupPortrait)
