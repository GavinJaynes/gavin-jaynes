import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

const links = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
]

function scrollTo(href: string) {
  const el = document.querySelector(href)
  el?.scrollIntoView({ behavior: "smooth" })
}

export function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-20 flex items-center justify-between px-4 py-4 lg:px-12 lg:py-8">
      {/* Logo + desktop nav */}
      <div className="flex items-center gap-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
          className="font-display text-xl leading-none font-bold tracking-tight text-zinc-900"
        >
          GJ
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="font-sans text-sm text-copy-subtle transition-colors hover:text-zinc-900"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop CTA */}
      <Button
        variant="outline"
        size="sm"
        className="hidden rounded-none border-zinc-300 bg-transparent font-mono text-xs tracking-widest text-zinc-500 uppercase hover:border-zinc-600 hover:bg-transparent hover:text-zinc-900 md:flex"
        asChild
      >
        <a href="mailto:gavin.jaynes@gmail.com">Get in touch ↗</a>
      </Button>

      {/* Mobile — hamburger + Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-500 hover:bg-transparent hover:text-zinc-900 md:hidden"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} aria-hidden />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          aria-describedby={undefined}
          className="flex w-72 flex-col border-zinc-800 bg-zinc-950 pt-16"
        >
          <SheetTitle className="sr-only">Site navigation</SheetTitle>
          <nav className="flex flex-col gap-1">
            {links.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => {
                  scrollTo(href)
                  setOpen(false)
                }}
                className="px-4 py-3 text-left font-display text-2xl font-bold text-white/60 transition-colors hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto px-4 pb-8">
            <a
              href="mailto:gavin.jaynes@gmail.com"
              className="font-mono text-xs tracking-widest text-copy-subtle-inverse uppercase transition-colors hover:text-white"
            >
              gavin.jaynes@gmail.com ↗
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
