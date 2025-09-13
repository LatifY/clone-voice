import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './components/pages'
import { SignIn, SignUp } from './components/auth'
import { GamepadCursor } from './components/GamepadCursor'
import { AuthProvider } from './contexts'

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App
