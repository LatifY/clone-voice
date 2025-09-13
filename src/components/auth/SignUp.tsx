import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardBody, Button } from '../ui'
import { useAuth } from '../../contexts/AuthContext'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

export const SignUp: React.FC = () => {
  const { signUp, signInWithGoogle, signInWithGitHub, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  // Email validation - blocks temporary email providers
  const tempEmailProviders = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com',
    'temp-mail.org', 'throwaway.email', 'getnada.com', 'maildrop.cc',
    'tempail.com', 'sharklasers.com', 'grr.la', 'spam4.me', 'tempmail.lol',
    'dispostable.com', 'mohmal.com', 'tmpmail.net', 'minuteinbox.com'
  ]

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name.trim()) return `${fieldName} is required`
    if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`
    if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/.test(name)) return `${fieldName} can only contain letters`
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (tempEmailProviders.some(provider => domain?.includes(provider))) {
      return 'Temporary email addresses are not allowed. Please use a permanent email address.'
    }
    
    return undefined
  }

  const validatePassword = (password: string): { error?: string, requirements: Array<{text: string, met: boolean}> } => {
    const requirements = [
      { text: 'At least 8 characters', met: password.length >= 8 },
      { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
      { text: 'Contains number', met: /\d/.test(password) },
      { text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ]

    if (!password) return { error: 'Password is required', requirements }
    
    const unmetRequirements = requirements.filter(req => !req.met)
    if (unmetRequirements.length > 0) {
      return { 
        error: `Password must meet all requirements`, 
        requirements 
      }
    }

    return { requirements }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field-specific errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const newErrors: FormErrors = {}
    
    const firstNameError = validateName(formData.firstName, 'First name')
    if (firstNameError) newErrors.firstName = firstNameError
    
    const lastNameError = validateName(formData.lastName, 'Last name')
    if (lastNameError) newErrors.lastName = lastNameError
    
    const emailError = validateEmail(formData.email)
    if (emailError) newErrors.email = emailError
    
    const passwordValidation = validatePassword(formData.password)
    if (passwordValidation.error) newErrors.password = passwordValidation.error

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName
      })

      if (error) {
        console.error('SignUp error:', error)
        if (error.message.includes('User already registered')) {
          setErrors({ general: 'This email is already registered. Please try signing in.' })
        } else if (error.message.includes('Invalid email')) {
          setErrors({ email: 'Invalid email address' })
        } else if (error.message.includes('Password') || error.message.includes('password')) {
          setErrors({ password: 'Password is too weak. Please try a stronger password.' })
        } else if (error.message.includes('Email rate limit exceeded')) {
          setErrors({ general: 'Too many attempts. Please wait before trying again.' })
        } else {
          setErrors({ general: error.message || 'An error occurred during registration. Please try again.' })
        }
      } else {
        // Successful registration - redirect to home page
        navigate('/')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    }
    
    setIsSubmitting(false)
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    try {
      let error
      if (provider === 'google') {
        ({ error } = await signInWithGoogle())
      } else {
        ({ error } = await signInWithGitHub())
      }

      if (error) {
        setErrors({ general: `An error occurred while signing in with ${provider === 'google' ? 'Google' : 'GitHub'}.` })
      }
      // Başarılı olursa AuthContext navigate'i handle eder
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred during OAuth sign in.' })
    }
  }

  const passwordValidation = validatePassword(formData.password)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-4 text-gray-400 hover:text-white transition-colors">
            ← Back to Homepage
          </Link>
          <h2 className="text-4xl font-bold text-white mb-2">Join CloneVoice</h2>
          <p className="text-gray-300">Create your account and start cloning voices</p>
        </div>

        <Card variant="glass">
          <CardBody className="p-8 space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                variant="glass"
                size="lg"
                onClick={() => handleOAuthSignUp('google')}
                className="w-full flex items-center justify-center gap-3 font-medium"
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleOAuthSignUp('github')}
                className="w-full flex items-center justify-center gap-3 font-medium"
              >
                <GitHubIcon />
                Continue with GitHub
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/20 text-gray-400 backdrop-blur-sm rounded-full">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-white/50 transition-all text-white placeholder-gray-400 ${
                      errors.firstName 
                        ? 'border-red-400/50 focus:border-red-400/70' 
                        : 'border-white/20 focus:border-white/30'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-white/50 transition-all text-white placeholder-gray-400 ${
                      errors.lastName 
                        ? 'border-red-400/50 focus:border-red-400/70' 
                        : 'border-white/20 focus:border-white/30'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-white/50 transition-all text-white placeholder-gray-400 ${
                    errors.email 
                      ? 'border-red-400/50 focus:border-red-400/70' 
                      : 'border-white/20 focus:border-white/30'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-white/50 transition-all text-white placeholder-gray-400 ${
                      errors.password 
                        ? 'border-red-400/50 focus:border-red-400/70' 
                        : 'border-white/20 focus:border-white/30'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    {passwordValidation.requirements.map((req, index) => (
                      <div key={index} className={`flex items-center gap-2 text-xs ${req.met ? 'text-green-400' : 'text-gray-400'}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500/20 border border-green-400/30' : 'bg-gray-500/20 border border-gray-400/30'}`}>
                          {req.met && <CheckIcon />}
                        </div>
                        {req.text}
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-white/50 transition-all text-white placeholder-gray-400 ${
                      errors.confirmPassword 
                        ? 'border-red-400/50 focus:border-red-400/70' 
                        : 'border-white/20 focus:border-white/30'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl">
                  <p className="text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.general}
                  </p>
                </div>
              )}

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-1 text-white focus:ring-white/50 border-white/20 rounded bg-white/5 backdrop-blur-sm"
                />
                <label htmlFor="terms" className="ml-3 block text-sm text-gray-300">
                  I agree to the{' '}
                  <button type="button" className="text-white hover:text-gray-300 transition-colors font-medium">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-white hover:text-gray-300 transition-colors font-medium">
                    Privacy Policy
                  </button>
                </label>
              </div>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/signin" className="text-white font-medium hover:text-gray-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}