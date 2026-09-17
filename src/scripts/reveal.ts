import { prefersReducedMotion, whenInView } from "@/scripts/in-view"

const items = document.querySelectorAll<HTMLElement>("[data-reveal]")

// The hidden-until-revealed CSS is gated on this flag, so a script that never
// runs — blocked, errored, or disabled — leaves every section visible.
if (items.length && !prefersReducedMotion()) {
  document.documentElement.setAttribute("data-reveal-ready", "")
  for (const item of items) {
    whenInView(item, (element) => element.setAttribute("data-revealed", ""))
  }
}
