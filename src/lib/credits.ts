// Credit calculation utilities

const TTS_CREDITS_PER_1K = Number(import.meta.env.VITE_TTS_CREDITS_PER_1K) || 5
const S2S_CREDITS_PER_MIN = Number(import.meta.env.VITE_S2S_CREDITS_PER_MIN) || 10
const MAX_TTS_CHARS = Number(import.meta.env.VITE_MAX_TTS_CHARS) || 8000
const MAX_S2S_MINUTES = Number(import.meta.env.VITE_MAX_S2S_MINUTES) || 10

export const calculateTTSCredits = (text: string): number => {
  const characters = text.length
  return Math.ceil((characters / 1000) * TTS_CREDITS_PER_1K)
}

export const calculateS2SCredits = (durationSeconds: number): number => {
  const durationMinutes = Math.ceil(durationSeconds / 60)
  return durationMinutes * S2S_CREDITS_PER_MIN
}

export const validateTTSInput = (text: string): { valid: boolean; error?: string } => {
  if (!text.trim()) {
    return { valid: false, error: 'Text cannot be empty' }
  }
  
  if (text.length > MAX_TTS_CHARS) {
    return { valid: false, error: `Text cannot exceed ${MAX_TTS_CHARS} characters` }
  }
  
  return { valid: true }
}

export const validateS2SInput = (durationSeconds: number): { valid: boolean; error?: string } => {
  const durationMinutes = durationSeconds / 60
  
  if (durationMinutes > MAX_S2S_MINUTES) {
    return { valid: false, error: `Audio cannot exceed ${MAX_S2S_MINUTES} minutes` }
  }
  
  return { valid: true }
}

export const formatCredits = (credits: number): string => {
  return credits.toLocaleString()
}

export const formatPrice = (amount: number, currency: string = 'TRY'): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
