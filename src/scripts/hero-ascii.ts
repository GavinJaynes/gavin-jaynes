import {
  BG,
  CELL_H,
  CELL_W,
  CHARSET,
  FONT,
  SHADES,
  buildStaticLayer,
  hash,
  randomScrambleChar,
  sampleCells,
  shadeFor,
} from "@/components/ascii"

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

function setupReveal(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  onComplete: () => void
) {
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    onComplete()
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
  let failedMeasures = 0

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

  const buildPortrait = () => {
    if (!width || !image.complete || !image.naturalWidth || cells) return
    cells = sampleCells(image, width, height, columns, rows)
    if (!cells) return
    staticLayer = buildStaticLayer(
      cells,
      columns,
      rows,
      canvas.width,
      canvas.height,
      dpr
    )
    paintNoise(true)
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
    paintNoise(true)
    buildPortrait()
    return true
  }

  image.addEventListener("load", buildPortrait, { once: true })

  const tick = () => {
    if (!width && !measure()) {
      if (++failedMeasures <= 300) requestAnimationFrame(tick)
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
      radius += (targetRadius - radius) * (reduceMotion ? 1 : 0.05)
      const coverRadius = radius * 0.7

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

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, coverRadius, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(staticLayer, 0, 0, width, height)
      ctx.restore()

      if (coverRadius >= farthestCorner) {
        canvas.classList.add("opacity-0")
        onComplete()
        return
      }
    } else if (noiseLayer) {
      ctx.drawImage(noiseLayer, 0, 0, width, height)
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

function setupLens(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  let width = 0
  let height = 0
  let columns = 0
  let rows = 0
  let cells: Uint8Array | null = null
  let motion: Float32Array | null = null
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
    if (!width || !height || !image.naturalWidth) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    columns = Math.ceil(width / CELL_W)
    rows = Math.ceil(height / CELL_H)
    cells = sampleCells(image, width, height, columns, rows)
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
  const resizeObserver = new ResizeObserver(build)
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
            const character =
              cell === 1
                ? "."
                : edge > 0.7 &&
                    hash(index, timeBucket) < ((edge - 0.7) / 0.3) * 0.9
                  ? randomScrambleChar(index, timeBucket)
                  : CHARSET[cell]
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
    const farthestCorner = Math.hypot(
      Math.max(pointer.targetX, width - pointer.targetX),
      Math.max(pointer.targetY, height - pointer.targetY)
    )
    targetRadius = farthestCorner * 1.5
    ensureLoop()
  }
  const enter = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = pointer.targetX = event.clientX - rect.left
    pointer.y = pointer.targetY = event.clientY - rect.top
    move(event)
  }
  const leave = () => {
    targetRadius = 0
    ensureLoop()
  }

  canvas.addEventListener("pointerenter", enter)
  canvas.addEventListener("pointerdown", enter)
  canvas.addEventListener("pointermove", move)
  canvas.addEventListener("pointerleave", leave)
  canvas.addEventListener("pointerup", (event) => {
    if (event.pointerType !== "mouse") leave()
  })
  canvas.addEventListener("pointercancel", leave)

  window.addEventListener("pagehide", () => {
    cancelAnimationFrame(animationFrame)
    resizeObserver.disconnect()
  })
}

document
  .querySelectorAll<HTMLElement>("[data-ascii-portrait]")
  .forEach((root) => {
    const image = root.querySelector<HTMLImageElement>("[data-portrait-image]")
    const reveal = root.querySelector<HTMLCanvasElement>("[data-ascii-reveal]")
    const lens = root.querySelector<HTMLCanvasElement>("[data-ascii-lens]")
    if (!image || !reveal || !lens) return

    let imageLoaded = image.complete && image.naturalWidth > 0
    let revealComplete = false
    let lensReady = false

    const finish = () => {
      if (!imageLoaded || !revealComplete) return
      image.classList.remove("opacity-0", "grayscale")
      if (!lensReady) {
        lensReady = true
        setupLens(lens, image)
      }
    }

    image.addEventListener(
      "load",
      () => {
        imageLoaded = true
        finish()
      },
      { once: true }
    )
    setupReveal(reveal, image, () => {
      revealComplete = true
      finish()
    })
    finish()
  })
