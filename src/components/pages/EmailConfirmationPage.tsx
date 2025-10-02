import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const EmailIcon = () => (
  <svg className="w-24 h-24 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const EmailConfirmationPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/404')
    }
  }, [user, navigate])

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
              <div className="p-4 backdrop-blur-sm bg-purple-500/10 border border-purple-400/20 rounded-full">
                <EmailIcon />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white font-heading">
                Email Gönderildi
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Kayıt işleminizi tamamlamak için email adresinize bir doğrulama linki gönderdik.
              </p>
              <p className="text-gray-400 text-sm">
                Lütfen email kutunuzu kontrol edin ve doğrulama linkine tıklayın.
              </p>
            </div>

            <div className="pt-4">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-300 text-sm">
                  Email gelmedi mi? Spam klasörünüzü de kontrol etmeyi unutmayın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailConfirmationPage