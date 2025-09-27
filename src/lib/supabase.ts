import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: { 'x-client-info': 'clonevoice' }
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token'
  }
});

export interface Profile {
  id: string
  user_id: string
  credits: number
  display_name: string | null
  created_at: string
}

export interface VoiceProfile {
  id: string
  user_id: string
  name: string
  source_type: 'upload' | 'record'
  audio_url: string
  duration_sec: number | null
  sample_rate_hz: number | null
  created_at: string
}

export interface TTSJob {
  id: string
  user_id: string
  voice_profile_id: string | null
  text: string
  exaggeration: number
  temperature: number
  cfg: number
  seed: number
  fal_request_id: string | null
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  result_audio_url: string | null
  characters: number
  credits_charged: number
  created_at: string
}

export interface S2SJob {
  id: string
  user_id: string
  source_audio_url: string
  target_voice_profile_id: string | null
  fal_request_id: string | null
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  result_audio_url: string | null
  source_duration_sec: number
  credits_charged: number
  created_at: string
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price_currency: string
  price_amount: number
  description: string | null
  is_active: boolean
  created_at: string
}
