const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL
const N8N_WEBHOOK_PATH = import.meta.env.VITE_N8N_WEBHOOK_PATH_PROCESS

export interface N8NJobPayload {
  job_id: string
  user_id: string
  type: 'tts' | 's2s'
  params: TTSParams | S2SParams
}

export interface TTSParams {
  text: string
  audio_url?: string
  exaggeration?: number
  temperature?: number
  cfg?: number
  seed?: number
}

export interface S2SParams {
  source_audio_url: string
  target_voice_audio_url?: string
}

export const triggerN8NJob = async (payload: N8NJobPayload): Promise<void> => {
  const url = `${N8N_BASE_URL}${N8N_WEBHOOK_PATH}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`n8n webhook failed: ${response.statusText}`)
  }
}
