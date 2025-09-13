import type { AuthError } from '@supabase/supabase-js'

// Auth error messages for better UX
export const getAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) return ''

  switch (error.message) {
    case 'Invalid login credentials':
      return 'Email or password is incorrect. Please try again.'
    case 'Email not confirmed':
      return 'You need to verify your email address. Please check your inbox.'
    case 'User already registered':
      return 'This email address is already registered. Please try signing in.'
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters.'
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.'
    case 'Email rate limit exceeded':
      return 'Too many attempts. Please wait a moment before trying again.'
    case 'For security purposes, you can only request this after 60 seconds':
      return 'For security reasons, you can try this operation again after 60 seconds.'
    default:
      // Return original error for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth error:', error)
        return error.message
      }
      return 'An error occurred. Please try again.'
  }
}

// Validation helpers
export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email address is required'
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  
  // Block temporary email providers
  const tempEmailProviders = [
    '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com',
    'temp-mail.org', 'throwaway.email', 'getnada.com', 'maildrop.cc',
    'tempail.com', 'sharklasers.com', 'grr.la', 'spam4.me', 'tempmail.lol',
    'dispostable.com', 'mohmal.com', 'tmpmail.net', 'minuteinbox.com'
  ]
  
  const domain = email.split('@')[1]?.toLowerCase()
  if (tempEmailProviders.some(provider => domain?.includes(provider))) {
    return 'Temporary email addresses are not accepted. Please use a permanent email address.'
  }
  
  return null
}

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export const validateName = (name: string, fieldName: string): string | null => {
  if (!name.trim()) return `${fieldName} is required`
  if (name.trim().length < 2) return `${fieldName} must be at least 2 characters`
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/.test(name)) {
    return `${fieldName} can only contain letters`
  }
  return null
}

// Password strength checker
export interface PasswordRequirement {
  text: string
  met: boolean
}

export const getPasswordRequirements = (password: string): PasswordRequirement[] => {
  return [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'At least one lowercase letter', met: /[a-z]/.test(password) },
    { text: 'At least one number', met: /\d/.test(password) },
    { text: 'At least one special character', met: /[^A-Za-z0-9]/.test(password) },
  ]
}

export const getPasswordStrength = (password: string): { score: number; text: string; color: string } => {
  const requirements = getPasswordRequirements(password)
  const metCount = requirements.filter(req => req.met).length
  
  if (password.length === 0) {
    return { score: 0, text: '', color: 'gray' }
  }
  
  if (metCount <= 2) {
    return { score: 25, text: 'Weak', color: 'red' }
  } else if (metCount === 3) {
    return { score: 50, text: 'Fair', color: 'yellow' }
  } else if (metCount === 4) {
    return { score: 75, text: 'Good', color: 'blue' }
  } else {
    return { score: 100, text: 'Strong', color: 'green' }
  }
}

// Loading state management
export const createLoadingState = () => {
  return {
    signIn: false,
    signUp: false,
    google: false,
    github: false,
    resetPassword: false,
  }
}

export type LoadingState = ReturnType<typeof createLoadingState>

// Form data types
export interface SignInFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}