import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui'

const CheckIcon = () => (
  <svg className="w-24 h-24 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const VerifyEmailPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/404')
    }
  }, [user, navigate])

  const handleSignIn = () => {
    navigate('/signin')
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 backdrop-blur-sm bg-green-500/10 border border-green-400/20 rounded-full">
                <CheckIcon />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white font-heading">
                Email Verified
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Great! Your email has been successfully verified. You can now sign in to your account.
              </p>
            </div>

            <div className="pt-6 space-y-3">
              <Button 
                onClick={handleSignIn}
                variant="primary"
                className="w-full"
              >
                Sign In
              </Button>
              
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Back to Homepage
                </Button>
              </Link>
            </div>

            <div className="pt-4">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-300 text-sm">
                  Your account is now active. You can start using CloneVoice AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage