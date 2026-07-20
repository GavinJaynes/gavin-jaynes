import { useEffect, useRef } from "react"

// Density ramp, light → dark. Index 0 (space) draws nothing.
const CHARSET = " .:-=+*#%@"
const SCRAMBLE = ":-=+*#%@"
const CELL_W = 7
const CELL_H = 12
const BG = "#fafaf9" // stone-50
const FONT = `${CELL_H}px ui-monospace, SFMono-Regular, Menlo, monospace`
// zinc-300 → zinc-900, picked by character density
const SHADES = ["#d4d4d8", "#a1a1aa", "#52525b", "#18181b"]

// Deterministic per-(cell, time-bucket) pseudo-random — keeps flicker
// stable within a bucket instead of strobing at 60fps
function hash(i: number, t: number) {
  let h = (i * 374761393 + t * 668265263) | 0
  h = (h ^ (h >> 13)) * 1274126177
  return ((h ^ (h >> 16)) >>> 0) / 4294967296
}

function shadeFor(ci: number) {
  return SHADES[ci <= 2 ? 0 : ci <= 4 ? 1 : ci <= 6 ? 2 : 3]
}

// X-ray hover: entering the photo expands a scramble-edged wipe from the
// cursor until the whole image "de-renders" into ASCII sampled from its own
// pixels; leaving collapses it back. The cursor keeps a local physics field —
// fast movement shoves nearby characters, which spring back into place.
export function AsciiLens({ src, active }: { src: string; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = 0
    let H = 0
    let cols = 0
    let rows = 0
    let cells: Uint8Array | null = null
    // per-cell [offsetX, offsetY, velX, velY] — characters get shoved by
    // cursor velocity and spring back into place
    let motion: Float32Array | null = null
    // fully-resolved ASCII pre-rendered once; per-frame we only redraw
    // cells that are displaced or flickering on top of it
    let staticLayer: HTMLCanvasElement | null = null
    let raf = 0
    let running = false

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let radius = 0
    let targetRadius = 0
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const img = new Image()
    img.src = src

    // Sample the image into a character grid matching object-cover/object-top
    const build = () => {
      const rect = canvas.getBoundingClientRect()
      W = rect.width
      H = rect.height
      if (!W || !H || !img.naturalWidth) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(W / CELL_W)
      rows = Math.ceil(H / CELL_H)

      const off = document.createElement("canvas")
      off.width = cols
      off.height = rows
      const octx = off.getContext("2d")
      if (!octx) return

      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight)
      const sw = W / scale
      const sh = H / scale
      const sx = (img.naturalWidth - sw) / 2
      octx.drawImage(img, sx, 0, sw, sh, 0, 0, cols, rows)
      const data = octx.getImageData(0, 0, cols, rows).data

      cells = new Uint8Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) {
        const lum =
          (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
        cells[i] = Math.min(
          CHARSET.length - 1,
          Math.round((1 - lum) * (CHARSET.length - 1) * 1.15),
        )
      }
      motion = new Float32Array(cols * rows * 4)

      staticLayer = document.createElement("canvas")
      staticLayer.width = canvas.width
      staticLayer.height = canvas.height
      const sctx = staticLayer.getContext("2d")
      if (!sctx) return
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
    }

    img.onload = build
    if (img.complete) build()

    const ro = new ResizeObserver(build)
    ro.observe(canvas)

    const draw = () => {
      const prevX = pointer.x
      const prevY = pointer.y
      pointer.x += (pointer.tx - pointer.x) * 0.2
      pointer.y += (pointer.ty - pointer.y) * 0.2
      radius += (targetRadius - radius) * (reduceMotion ? 1 : 0.14)
      const cvx = pointer.x - prevX
      const cvy = pointer.y - prevY
      const speed = Math.hypot(cvx, cvy)

      // physics: shove cells near a fast-moving cursor, spring everything back.
      // Reach is fixed and local — independent of how far the wipe has expanded
      if (motion) {
        const reach = Math.min(160, Math.max(90, Math.min(W, H) * 0.22))
        const applying = !reduceMotion && radius > 2 && speed > 0.3
        for (let i = 0; i < cols * rows; i++) {
          const o = i * 4
          let ox = motion[o]
          let oy = motion[o + 1]
          let vx = motion[o + 2]
          let vy = motion[o + 3]
          const moving = ox * ox + oy * oy + vx * vx + vy * vy > 0.001
          if (!moving && !applying) continue
          const cx = (i % cols) * CELL_W + CELL_W / 2
          const cy = ((i / cols) | 0) * CELL_H + CELL_H / 2
          if (applying) {
            const dx = cx - pointer.x
            const dy = cy - pointer.y
            const d = Math.hypot(dx, dy)
            if (d < reach && d > 0.001) {
              const fall = 1 - d / reach
              const k = Math.min(speed, 40) * 0.06 * fall * fall
              vx += (dx / d) * k + cvx * 0.03 * fall
              vy += (dy / d) * k + cvy * 0.03 * fall
            } else if (!moving) continue
          }
          vx += -ox * 0.06
          vy += -oy * 0.06
          vx *= 0.9
          vy *= 0.9
          ox += vx
          oy += vy
          motion[o] = ox
          motion[o + 1] = oy
          motion[o + 2] = vx
          motion[o + 3] = vy
        }
      }

      ctx.clearRect(0, 0, W, H)

      if (radius > 2 && cells) {
        const px = pointer.x
        const py = pointer.y
        const r = radius
        const far = Math.hypot(Math.max(px, W - px), Math.max(py, H - py))
        const coverR = r * 0.7
        const full = coverR >= far
        const ringStart = coverR - CELL_H * 1.5

        if (full) {
          ctx.fillStyle = BG
          ctx.fillRect(0, 0, W, H)
        } else {
          // stone-50 disc hides the photo under the wipe
          const grad = ctx.createRadialGradient(px, py, 0, px, py, r)
          grad.addColorStop(0, "rgba(250,250,249,1)")
          grad.addColorStop(0.72, "rgba(250,250,249,1)")
          grad.addColorStop(1, "rgba(250,250,249,0)")
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
        }

        if (staticLayer) {
          if (!full) {
            ctx.save()
            ctx.beginPath()
            ctx.arc(px, py, Math.max(coverR, 0), 0, Math.PI * 2)
            ctx.clip()
          }
          ctx.drawImage(staticLayer, 0, 0, W, H)
          if (!full) ctx.restore()
        }

        ctx.font = FONT
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const tb = Math.floor(performance.now() / 70)

        // transition ring: scrambled characters resolving at the wipe front
        if (!full) {
          const c0 = Math.max(0, Math.floor((px - r) / CELL_W))
          const c1 = Math.min(cols - 1, Math.ceil((px + r) / CELL_W))
          const r0 = Math.max(0, Math.floor((py - r) / CELL_H))
          const r1 = Math.min(rows - 1, Math.ceil((py + r) / CELL_H))

          for (let row = r0; row <= r1; row++) {
            const cy = row * CELL_H + CELL_H / 2
            for (let col = c0; col <= c1; col++) {
              const i = row * cols + col
              const ci = cells[i]
              if (ci === 0) continue
              const cx = col * CELL_W + CELL_W / 2
              const d = Math.hypot(cx - px, cy - py)
              if (d < ringStart || d > r) continue

              // cells straddling the clip edge: erase the clipped static
              // glyph (this zone is over the opaque disc) and redraw whole
              if (d <= coverR) {
                ctx.globalAlpha = 1
                ctx.fillStyle = BG
                ctx.fillRect(cx - CELL_W / 2, cy - CELL_H / 2, CELL_W, CELL_H)
              }

              const edge = d / r
              let ch: string
              if (ci === 1) {
                ch = "."
              } else if (
                edge > 0.7 ? hash(i, tb) < ((edge - 0.7) / 0.3) * 0.9 : hash(i, tb) > 0.99
              ) {
                ch = SCRAMBLE[Math.floor(hash(i, tb * 31 + 7) * SCRAMBLE.length)]
              } else {
                ch = CHARSET[ci]
              }

              ctx.globalAlpha = edge < 0.7 ? 1 : (1 - edge) / 0.3
              ctx.fillStyle = shadeFor(ci)
              const o = i * 4
              ctx.fillText(
                ch,
                cx + (motion ? motion[o] : 0),
                cy + (motion ? motion[o + 1] : 0),
              )
            }
          }
        }

        // displaced + flickering cells redrawn over the resolved static layer
        if (motion) {
          ctx.globalAlpha = 1
          for (let i = 0; i < cols * rows; i++) {
            const ci = cells[i]
            if (ci === 0) continue
            const o = i * 4
            const ox = motion[o]
            const oy = motion[o + 1]
            const moving = ox * ox + oy * oy > 0.09
            const flicker = !reduceMotion && ci > 1 && hash(i, tb) > 0.993
            if (!moving && !flicker) continue
            const cx = (i % cols) * CELL_W + CELL_W / 2
            const cy = ((i / cols) | 0) * CELL_H + CELL_H / 2
            if (!full && Math.hypot(cx - px, cy - py) > ringStart) continue
            ctx.fillStyle = BG
            ctx.fillRect(cx - CELL_W / 2, cy - CELL_H / 2, CELL_W, CELL_H)
            const ch =
              flicker && !moving
                ? SCRAMBLE[Math.floor(hash(i, tb * 31 + 7) * SCRAMBLE.length)]
                : ci === 1
                  ? "."
                  : CHARSET[ci]
            ctx.fillStyle = shadeFor(ci)
            ctx.fillText(ch, cx + ox, cy + oy)
          }
        }
        ctx.globalAlpha = 1
      }

      if (radius < 0.5 && targetRadius === 0) {
        running = false
        return
      }
      raf = requestAnimationFrame(draw)
    }

    const ensureLoop = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(draw)
      }
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.tx = e.clientX - rect.left
      pointer.ty = e.clientY - rect.top
      // expand until the opaque core covers the farthest corner
      const far = Math.hypot(
        Math.max(pointer.tx, W - pointer.tx),
        Math.max(pointer.ty, H - pointer.ty),
      )
      targetRadius = far * 1.5
      ensureLoop()
    }
    const onEnter = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      // snap so the wipe opens at the pointer instead of flying across
      pointer.x = pointer.tx = e.clientX - rect.left
      pointer.y = pointer.ty = e.clientY - rect.top
      onMove(e)
    }
    const onLeave = () => {
      targetRadius = 0
      ensureLoop()
    }
    // a mouse that clicks is still hovering — only collapse when a touch lifts
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave()
    }

    canvas.addEventListener("pointerenter", onEnter)
    canvas.addEventListener("pointerdown", onEnter)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      img.onload = null
      canvas.removeEventListener("pointerenter", onEnter)
      canvas.removeEventListener("pointerdown", onEnter)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onLeave)
    }
  }, [active, src])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 z-10 h-full w-full select-none"
      style={{ touchAction: "pan-y" }}
    />
  )
}
