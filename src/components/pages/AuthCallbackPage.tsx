import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui'

const CheckIcon = () => (
  <svg className="w-24 h-24 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ErrorIcon = () => (
  <svg className="w-24 h-24 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
)

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(true)

  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (user) {
      navigate('/')
      return
    }

    // Process the callback
    const timer = setTimeout(() => {
      setIsProcessing(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [user, navigate])

  const handleSignIn = () => {
    navigate('/signin')
  }

  if (isProcessing) {
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
                <div className="p-4 backdrop-blur-sm bg-purple-500/10 border border-purple-400/20 rounded-full">
                  <div className="w-24 h-24 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white font-heading">
                  Processing...
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Please wait while we verify your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error if there's an error
  if (error) {
    let errorMessage = 'An error occurred during email verification.'
    let errorTitle = 'Verification Failed'

    if (errorCode === 'otp_expired') {
      errorTitle = 'Link Expired'
      errorMessage = 'The verification link has expired. Please try signing up again to receive a new link.'
    } else if (error === 'access_denied') {
      errorTitle = 'Access Denied'
      errorMessage = 'The verification link is invalid or has already been used.'
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
                <div className="p-4 backdrop-blur-sm bg-red-500/10 border border-red-400/20 rounded-full">
                  <ErrorIcon />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-white font-heading">
                  {errorTitle}
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {errorMessage}
                </p>
                {errorDescription && (
                  <p className="text-gray-400 text-sm">
                    {decodeURIComponent(errorDescription)}
                  </p>
                )}
              </div>

              <div className="pt-6 space-y-3">
                <Link to="/signup">
                  <Button variant="primary" className="w-full">
                    Try Sign Up Again
                  </Button>
                </Link>
                
                <Button 
                  onClick={handleSignIn}
                  variant="outline"
                  className="w-full"
                >
                  Sign In Instead
                </Button>

                <Link to="/">
                  <Button variant="ghost" className="w-full">
                    Back to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success case (no error)
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

export default AuthCallbackPage