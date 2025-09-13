import { Navbar, Hero, Features, Examples, Pricing, Contact, Footer } from './components/sections'
import { GamepadCursor } from './components/GamepadCursor'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Examples />
      <Pricing />
      <Contact />
      <Footer />
      <GamepadCursor />
    </div>
  )
}

export default App
