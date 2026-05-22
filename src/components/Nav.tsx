import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
          className="font-display font-bold tracking-tight text-zinc-900 text-xl leading-none"
        >
          GJ
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollTo(href)}
              className="font-sans text-sm text-zinc-400 transition-colors hover:text-zinc-900"
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
        className="hidden md:flex rounded-none border-zinc-300 bg-transparent font-mono text-xs tracking-widest text-zinc-500 uppercase hover:border-zinc-600 hover:bg-transparent hover:text-zinc-900"
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
            className="md:hidden text-zinc-500 hover:text-zinc-900 hover:bg-transparent"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="bg-zinc-950 border-zinc-800 w-72 flex flex-col pt-16">
          <nav className="flex flex-col gap-1">
            {links.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => { scrollTo(href); setOpen(false) }}
                className="font-display text-left text-2xl font-bold text-white/60 hover:text-white py-3 px-4 transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pb-8 px-4">
            <a
              href="mailto:gavin.jaynes@gmail.com"
              className="font-mono text-xs tracking-widest text-zinc-600 uppercase hover:text-white transition-colors"
            >
              gavin.jaynes@gmail.com ↗
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
