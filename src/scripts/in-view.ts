// One IntersectionObserver for the whole page. Components register an element
// with a callback; the element is unobserved the moment it fires, so every
// reveal is one-shot and the observer empties itself as the page is scrolled.

type InViewCallback = (element: Element) => void

const callbacks = new WeakMap<Element, InViewCallback>()

let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer?.unobserve(entry.target)
        const callback = callbacks.get(entry.target)
        callbacks.delete(entry.target)
        callback?.(entry.target)
      }
    },
    // Fire a little before the element's top edge reaches the fold, which is
    // where the reveal reads as "arriving" rather than "already there".
    { rootMargin: "0px 0px -10% 0px" }
  )
  return observer
}

export function whenInView(element: Element, callback: InViewCallback) {
  const active = getObserver()
  if (!active) {
    callback(element)
    return
  }
  callbacks.set(element, callback)
  active.observe(element)
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}
