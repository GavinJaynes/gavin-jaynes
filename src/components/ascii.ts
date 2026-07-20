// Shared ASCII-rendering pipeline for the hero: the intro reveal and the
// hover x-ray effect draw from the same sampled character grid so they read
// as one system.

// Density ramp, light → dark. Index 0 (space) draws nothing.
export const CHARSET = " .:-=+*#%@"
export const SCRAMBLE = ":-=+*#%@"
export const CELL_W = 7
export const CELL_H = 12
export const BG = "#fafaf9" // stone-50
export const FONT = `${CELL_H}px ui-monospace, SFMono-Regular, Menlo, monospace`
// zinc-300 → zinc-900, picked by character density
export const SHADES = ["#d4d4d8", "#a1a1aa", "#52525b", "#18181b"]

// Deterministic per-(cell, time-bucket) pseudo-random — keeps flicker
// stable within a bucket instead of strobing at 60fps
export function hash(i: number, t: number) {
  let h = (i * 374761393 + t * 668265263) | 0
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) >>> 0) / 4294967296
}

export function shadeFor(ci: number) {
  return SHADES[ci <= 2 ? 0 : ci <= 4 ? 1 : ci <= 6 ? 2 : 3]
}

export function randomScrambleChar(i: number, tb: number) {
  return SCRAMBLE[Math.floor(hash(i, tb * 31 + 7) * SCRAMBLE.length)]
}

// Sample an image into a character-density grid, replicating the display
// crop of `object-cover object-top` for a W×H container
export function sampleCells(
  img: HTMLImageElement,
  W: number,
  H: number,
  cols: number,
  rows: number,
): Uint8Array | null {
  const off = document.createElement("canvas")
  off.width = cols
  off.height = rows
  const octx = off.getContext("2d")
  if (!octx) return null

  const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
  const sw = W / scale
  const sh = H / scale
  const sx = (img.naturalWidth - sw) / 2
  octx.drawImage(img, sx, 0, sw, sh, 0, 0, cols, rows)
  const data = octx.getImageData(0, 0, cols, rows).data

  const cells = new Uint8Array(cols * rows)
  for (let i = 0; i < cols * rows; i++) {
    const lum =
      (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
    cells[i] = Math.min(CHARSET.length - 1, Math.round((1 - lum) * (CHARSET.length - 1) * 1.15))
  }
  return cells
}

// Pre-render the fully resolved glyphs once so per-frame work is a blit
export function buildStaticLayer(
  cells: Uint8Array,
  cols: number,
  rows: number,
  pixelW: number,
  pixelH: number,
  dpr: number,
): HTMLCanvasElement | null {
  const layer = document.createElement("canvas")
  layer.width = pixelW
  layer.height = pixelH
  const sctx = layer.getContext("2d")
  if (!sctx) return null
  sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  sctx.font = FONT
  sctx.textAlign = "center"
  sctx.textBaseline = "middle"
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const ci = cells[row * cols + col]
      if (ci === 0) continue
      sctx.fillStyle = shadeFor(ci)
      sctx.fillText(
        ci === 1 ? "." : CHARSET[ci],
        col * CELL_W + CELL_W / 2,
        row * CELL_H + CELL_H / 2,
      )
    }
  }
  return layer
}
