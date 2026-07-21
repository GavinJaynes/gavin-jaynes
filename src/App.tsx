import { Hero } from "@/components/Hero"
import { Work } from "@/components/Work"
import { Projects } from "@/components/Projects"
import { About } from "@/components/About"
import { Showcase } from "@/components/Showcase"
import { Contact } from "@/components/Contact"
import { Resume } from "@/components/Resume"
import { getSiteMode } from "@/lib/mode"

export function App() {
  const mode = getSiteMode()

  if (window.location.pathname === "/resume") {
    return <Resume mode={mode} />
  }

  return (
    <main>
      <Hero mode={mode} />
      <About mode={mode} />
      <Work mode={mode} />
      <Projects mode={mode} />
      <Showcase />
      <Contact />
    </main>
  )
}

export default App
