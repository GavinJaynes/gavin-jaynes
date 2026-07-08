import { Hero } from "@/components/Hero"
import { Work } from "@/components/Work"
import { Projects } from "@/components/Projects"
import { About } from "@/components/About"
import { Showcase } from "@/components/Showcase"
import { Contact } from "@/components/Contact"
import { Resume } from "@/components/Resume"

export function App() {
  if (window.location.pathname === "/resume") {
    return <Resume />
  }

  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Projects />
      <Showcase />
      <Contact />
    </main>
  )
}

export default App
