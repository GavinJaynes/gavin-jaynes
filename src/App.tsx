import { Hero } from "@/components/Hero"
import { Work } from "@/components/Work"
import { Projects } from "@/components/Projects"
import { About } from "@/components/About"
import { Contact } from "@/components/Contact"

export function App() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Projects />
      <Contact />
    </main>
  )
}

export default App
