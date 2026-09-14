"use client"
import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

type EncryptedTextProps = {
  text: string
  className?: string
  /**
   * Time in milliseconds between revealing each subsequent real character.
   * Lower is faster. Defaults to 50ms per character.
   */
  revealDelayMs?: number
  /** Optional custom character set to use for the gibberish effect. */
  charset?: string
  /**
   * Time in milliseconds between gibberish flips for unrevealed characters.
   * Lower is more jittery. Defaults to 50ms.
   */
  flipDelayMs?: number
  /** CSS class for styling the encrypted/scrambled characters */
  encryptedClassName?: string
  /** CSS class for styling the revealed characters */
  revealedClassName?: string
}

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?"

function generateRandomCharacter(charset: string): string {
  const index = Math.floor(Math.random() * charset.length)
  return charset.charAt(index)
}

function generateGibberishPreservingSpaces(
  original: string,
  charset: string
): string {
  if (!original) return ""
  let result = ""
  for (let i = 0; i < original.length; i += 1) {
    const ch = original[i]
    result += ch === " " ? " " : generateRandomCharacter(charset)
  }
  return result
}

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  className,
  revealDelayMs = 50,
  charset = DEFAULT_CHARSET,
  flipDelayMs = 50,
  encryptedClassName,
  revealedClassName,
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [isInView, setIsInView] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const [revealCount, setRevealCount] = useState<number>(0)
  const [displayText, setDisplayText] = useState<string>(() =>
    text ? generateGibberishPreservingSpaces(text, charset) : ""
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsInView(true)
        observer.disconnect()
      },
      { threshold: 0.15 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return

    const scrambleChars = (
      text ? generateGibberishPreservingSpaces(text, charset) : ""
    ).split("")
    const startTime = performance.now()
    let lastFlipTime = startTime
    let lastRevealCount = -1
    let animationFrame = 0

    let isCancelled = false

    const update = (now: number) => {
      if (isCancelled) return

      const elapsedMs = now - startTime
      const totalLength = text.length
      const currentRevealCount = Math.min(
        totalLength,
        Math.floor(elapsedMs / Math.max(1, revealDelayMs))
      )

      // Re-randomize unrevealed scramble characters on an interval
      const timeSinceLastFlip = now - lastFlipTime
      let didFlip = false
      if (timeSinceLastFlip >= Math.max(0, flipDelayMs)) {
        for (let index = 0; index < totalLength; index += 1) {
          if (index >= currentRevealCount) {
            if (text[index] !== " ") {
              scrambleChars[index] = generateRandomCharacter(charset)
            } else {
              scrambleChars[index] = " "
            }
          }
        }
        lastFlipTime = now
        didFlip = true
      }

      if (currentRevealCount !== lastRevealCount || didFlip) {
        setRevealCount(currentRevealCount)
        setDisplayText(
          text
            .split("")
            .map((char, index) =>
              index < currentRevealCount
                ? char
                : char === " "
                  ? " "
                  : (scrambleChars[index] ?? generateRandomCharacter(charset))
            )
            .join("")
        )
        lastRevealCount = currentRevealCount
      }

      if (currentRevealCount >= totalLength) {
        return
      }

      animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)

    return () => {
      isCancelled = true
      cancelAnimationFrame(animationFrame)
    }
  }, [
    isInView,
    text,
    revealDelayMs,
    charset,
    flipDelayMs,
    prefersReducedMotion,
  ])

  if (!text) return null

  return (
    <span ref={ref} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split("").map((char, index) => {
          const isRevealed = prefersReducedMotion || index < revealCount
          const displayChar = prefersReducedMotion
            ? char
            : (displayText[index] ?? char)

          return (
            <span
              key={index}
              className={cn(
                isRevealed ? revealedClassName : encryptedClassName
              )}
            >
              {displayChar}
            </span>
          )
        })}
      </span>
    </span>
  )
}
