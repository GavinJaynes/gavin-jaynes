import {
  BG,
  CELL_H,
  CELL_W,
  CHARSET,
  FONT,
  type PortraitSource,
  buildStaticLayer,
  hash,
  loadPortraitSource,
  randomScrambleChar,
  sampleCells,
  shadeFor,
} from "@/components/ascii"

// X-ray hover: entering the photo expands a scramble-edged wipe from the
// cursor until the whole image "de-renders" into ASCII sampled from its own
// pixels; leaving collapses it back. The cursor keeps a local physics field —
// fast movement shoves nearby characters, which spring back into place.
export function setupLens(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  initialSource: PortraitSource,
  reduceMotion: boolean
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  let source = initialSource
  let width = 0
  let height = 0
  let columns = 0
  let rows = 0
  let cells: Uint8Array | null = null
  // per-cell [offsetX, offsetY, velocityX, velocityY] — characters get shoved
  // by cursor velocity and spring back into place
  let motion: Float32Array | null = null
  // fully-resolved ASCII pre-rendered once; per-frame we only redraw cells
  // that are displaced or flickering on top of it
  let staticLayer: HTMLCanvasElement | null = null
  let animationFrame = 0
  let running = false
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
  let radius = 0
  let targetRadius = 0

  const build = () => {
    const rect = canvas.getBoundingClientRect()
    width = rect.width
    height = rect.height
    if (!width || !height) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    columns = Math.ceil(width / CELL_W)
    rows = Math.ceil(height / CELL_H)
    cells = sampleCells(source, width, height, columns, rows)
    if (!cells) return
    motion = new Float32Array(columns * rows * 4)
    staticLayer = buildStaticLayer(
      cells,
      columns,
      rows,
      canvas.width,
      canvas.height,
      dpr
    )
  }

  build()

  // Crossing the `sizes` breakpoint swaps the file the <img> resolved to;
  // resample from the new one so the grid keeps the sharper source.
  const rebuild = async () => {
    const current = image.currentSrc || image.src
    if (current && current !== source.url) {
      const next = await loadPortraitSource(image)
      if (next) source = next
    }
    build()
  }

  const resizeObserver = new ResizeObserver(() => void rebuild())
  resizeObserver.observe(canvas)

  const draw = () => {
    const previousX = pointer.x
    const previousY = pointer.y
    pointer.x += (pointer.targetX - pointer.x) * 0.2
    pointer.y += (pointer.targetY - pointer.y) * 0.2
    radius += (targetRadius - radius) * (reduceMotion ? 1 : 0.14)
    const velocityX = pointer.x - previousX
    const velocityY = pointer.y - previousY
    const speed = Math.hypot(velocityX, velocityY)

    // physics: shove cells near a fast-moving cursor, spring everything back.
    // Reach is fixed and local — independent of how far the wipe has expanded
    if (motion) {
      const reach = Math.min(160, Math.max(90, Math.min(width, height) * 0.22))
      const applying = !reduceMotion && radius > 2 && speed > 0.3
      for (let index = 0; index < columns * rows; index++) {
        const offset = index * 4
        let x = motion[offset]
        let y = motion[offset + 1]
        let xVelocity = motion[offset + 2]
        let yVelocity = motion[offset + 3]
        const moving =
          x * x + y * y + xVelocity * xVelocity + yVelocity * yVelocity > 0.001
        if (!moving && !applying) continue

        const cellX = (index % columns) * CELL_W + CELL_W / 2
        const cellY = Math.floor(index / columns) * CELL_H + CELL_H / 2
        if (applying) {
          const deltaX = cellX - pointer.x
          const deltaY = cellY - pointer.y
          const distance = Math.hypot(deltaX, deltaY)
          if (distance < reach && distance > 0.001) {
            const falloff = 1 - distance / reach
            const force = Math.min(speed, 40) * 0.06 * falloff * falloff
            xVelocity +=
              (deltaX / distance) * force + velocityX * 0.03 * falloff
            yVelocity +=
              (deltaY / distance) * force + velocityY * 0.03 * falloff
          } else if (!moving) continue
        }

        xVelocity += -x * 0.06
        yVelocity += -y * 0.06
        xVelocity *= 0.9
        yVelocity *= 0.9
        x += xVelocity
        y += yVelocity
        motion[offset] = x
        motion[offset + 1] = y
        motion[offset + 2] = xVelocity
        motion[offset + 3] = yVelocity
      }
    }

    ctx.clearRect(0, 0, width, height)

    if (radius > 2 && cells) {
      const x = pointer.x
      const y = pointer.y
      const farthestCorner = Math.hypot(
        Math.max(x, width - x),
        Math.max(y, height - y)
      )
      const coverRadius = radius * 0.7
      const full = coverRadius >= farthestCorner
      const ringStart = coverRadius - CELL_H * 1.5

      if (full) {
        ctx.fillStyle = BG
        ctx.fillRect(0, 0, width, height)
      } else {
        // stone-50 disc hides the photo under the wipe
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, "rgba(250,250,249,1)")
        gradient.addColorStop(0.72, "rgba(250,250,249,1)")
        gradient.addColorStop(1, "rgba(250,250,249,0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      if (staticLayer) {
        if (!full) {
          ctx.save()
          ctx.beginPath()
          ctx.arc(x, y, Math.max(coverRadius, 0), 0, Math.PI * 2)
          ctx.clip()
        }
        ctx.drawImage(staticLayer, 0, 0, width, height)
        if (!full) ctx.restore()
      }

      ctx.font = FONT
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const timeBucket = Math.floor(performance.now() / 70)

      // transition ring: scrambled characters resolving at the wipe front
      if (!full) {
        const firstColumn = Math.max(0, Math.floor((x - radius) / CELL_W))
        const lastColumn = Math.min(
          columns - 1,
          Math.ceil((x + radius) / CELL_W)
        )
        const firstRow = Math.max(0, Math.floor((y - radius) / CELL_H))
        const lastRow = Math.min(rows - 1, Math.ceil((y + radius) / CELL_H))

        for (let row = firstRow; row <= lastRow; row++) {
          const cellY = row * CELL_H + CELL_H / 2
          for (let column = firstColumn; column <= lastColumn; column++) {
            const index = row * columns + column
            const cell = cells[index]
            if (cell === 0) continue
            const cellX = column * CELL_W + CELL_W / 2
            const distance = Math.hypot(cellX - x, cellY - y)
            if (distance < ringStart || distance > radius) continue

            // cells straddling the clip edge: erase the clipped static glyph
            // (this zone is over the opaque disc) and redraw it whole
            if (distance <= coverRadius) {
              ctx.globalAlpha = 1
              ctx.fillStyle = BG
              ctx.fillRect(
                cellX - CELL_W / 2,
                cellY - CELL_H / 2,
                CELL_W,
                CELL_H
              )
            }

            const edge = distance / radius
            let character: string
            if (cell === 1) {
              character = "."
            } else if (
              edge > 0.7
                ? hash(index, timeBucket) < ((edge - 0.7) / 0.3) * 0.9
                : hash(index, timeBucket) > 0.99
            ) {
              character = randomScrambleChar(index, timeBucket)
            } else {
              character = CHARSET[cell]
            }

            ctx.globalAlpha = edge < 0.7 ? 1 : (1 - edge) / 0.3
            ctx.fillStyle = shadeFor(cell)
            const offset = index * 4
            ctx.fillText(
              character,
              cellX + (motion ? motion[offset] : 0),
              cellY + (motion ? motion[offset + 1] : 0)
            )
          }
        }
      }

      // displaced + flickering cells redrawn over the resolved static layer
      if (motion) {
        ctx.globalAlpha = 1
        for (let index = 0; index < columns * rows; index++) {
          const cell = cells[index]
          if (cell === 0) continue
          const offset = index * 4
          const offsetX = motion[offset]
          const offsetY = motion[offset + 1]
          const moving = offsetX * offsetX + offsetY * offsetY > 0.09
          const flicker =
            !reduceMotion && cell > 1 && hash(index, timeBucket) > 0.993
          if (!moving && !flicker) continue
          const cellX = (index % columns) * CELL_W + CELL_W / 2
          const cellY = Math.floor(index / columns) * CELL_H + CELL_H / 2
          if (!full && Math.hypot(cellX - x, cellY - y) > ringStart) continue
          ctx.fillStyle = BG
          ctx.fillRect(cellX - CELL_W / 2, cellY - CELL_H / 2, CELL_W, CELL_H)
          const character =
            flicker && !moving
              ? randomScrambleChar(index, timeBucket)
              : cell === 1
                ? "."
                : CHARSET[cell]
          ctx.fillStyle = shadeFor(cell)
          ctx.fillText(character, cellX + offsetX, cellY + offsetY)
        }
      }

      ctx.globalAlpha = 1
    }

    if (radius < 0.5 && targetRadius === 0) {
      running = false
      return
    }
    animationFrame = requestAnimationFrame(draw)
  }

  const ensureLoop = () => {
    if (running) return
    running = true
    animationFrame = requestAnimationFrame(draw)
  }

  const move = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer.targetX = event.clientX - rect.left
    pointer.targetY = event.clientY - rect.top
    // expand until the opaque core covers the farthest corner
    const farthestCorner = Math.hypot(
      Math.max(pointer.targetX, width - pointer.targetX),
      Math.max(pointer.targetY, height - pointer.targetY)
    )
    targetRadius = farthestCorner * 1.5
    ensureLoop()
  }
  const enter = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    // snap so the wipe opens at the pointer instead of flying across
    pointer.x = pointer.targetX = event.clientX - rect.left
    pointer.y = pointer.targetY = event.clientY - rect.top
    move(event)
  }
  const leave = () => {
    targetRadius = 0
    ensureLoop()
  }
  // a mouse that clicks is still hovering — only collapse when a touch lifts
  const release = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") leave()
  }

  canvas.addEventListener("pointerenter", enter)
  canvas.addEventListener("pointerdown", enter)
  canvas.addEventListener("pointermove", move)
  canvas.addEventListener("pointerleave", leave)
  canvas.addEventListener("pointerup", release)
  canvas.addEventListener("pointercancel", leave)

  // A backgrounded tab stops painting, so collapse rather than resuming
  // mid-wipe against a pointer that has long since moved on.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") leave()
  })

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(animationFrame)
      running = false
      resizeObserver.disconnect()
    },
    { once: true }
  )
}
