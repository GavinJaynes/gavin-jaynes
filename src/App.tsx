import { Hero } from "@/components/Hero"
import { Work } from "@/components/Work"
import { Projects } from "@/components/Projects"
import { About } from "@/components/About"
import { Showcase } from "@/components/Showcase"
import { Contact } from "@/components/Contact"
import { Resume } from "@/components/Resume"
import { CoverLetter } from "@/components/CoverLetter"
import { getSiteMode } from "@/lib/mode"
import { coverLetters } from "@/lib/coverLetters"

export function App() {
  const mode = getSiteMode()
  const { pathname } = window.location

  if (pathname === "/resume") {
    return <Resume mode={mode} />
  }

  if (pathname === "/cover-letter" || pathname.startsWith("/cover-letter/")) {
    const slug = pathname === "/cover-letter" ? "nhvr" : pathname.split("/")[2]
    const letter = coverLetters[slug] ?? coverLetters.nhvr
    return <CoverLetter letter={letter} />
  }

  return (
    <main>
      <Hero mode={mode} />
      <About mode={mode} />
      <Work mode={mode} />
      <Projects mode={mode} />
      <Showcase />
      <Contact mode={mode} />
    </main>
  )
}

export default App
