import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './components/pages'
import { SignIn, SignUp } from './components/auth'
import { GamepadCursor } from './components/GamepadCursor'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <GamepadCursor />
      </Router>
    </div>
  )
}

export default App
