Project Design Document: Voice Clone App (Text-to-Speech & Speech-to-Speech)

⸻

Amaç

Kullanıcının kendi sesini kaydedip veya bilgisayarından bir ses dosyası yükleyerek, bu sesi referans alıp:
- Text-to-Speech (TTS) ile metni klonlanmış sesle seslendirmek,
- Speech-to-Speech (S2S) ile bir ses- Not: fal.ai çağrısı backend tarafında yapılmaz, arka plan n8n'de yürür.

React App Direct Operations (Supabase Client):
- Job Status Polling: React Query/SWR ile tts_jobs, s2s_jobs tabloları
- Real-time Updates: Supabase Realtime subscription ile job status değişikliklerini anlık takip
- Voice Profile Management: CRUD operations doğrudan Supabase'e
- Authentication: @supabase/auth-helpers-react hooksedef sesle yeniden seslendirmek,
özelliklerini sunan, kredi bazlı (abonelik yok) profesyonel bir web uygulaması geliştirmek.

⸻

Kapsam ve Sayfalar

- / → Landing
- /sign-in → Giriş (Supabase Auth)
- /sign-up → Kayıt
- /credits → Kredi paketleri ve satın alma (Iyzico)
- /dashboard → Kullanıcı panosu (kredi bakiyesi, ses profilleri, işlemler)
- /clone-tts → Text-to-Speech (kendi sesini referans aNot: Bu belge, önceki dil öğrenme platformu dokümanının mimari mantığını koruyarak, yeni "voice clone" ürün kapsamına güncellenmiştir. R2/R3 ve çeviri/transkript akışları kaldırılmış, fal.ai TTS/S2S ve kredi bazlı mimariyle yeniden tasarlanmıştır. Arka plan işlemleri n8n ile orkestre edilir; React SPA + Supabase birincil katman, opsiyonel backend API güvenlik katmanı olarak konumlanmıştır.arak)
- /voice-convert → Speech-to-Speech (bir sesi başka sesle seslendirme)

Not: Bu belge uygulamanın mimarisini tanımlar; kod değişikliği kapsamında değildir.

⸻

Öne Çıkan Özellikler

1) Kimlik Doğrulama ve Profil
- Supabase Auth (email/password + OAuth)
- Kullanıcı profilinde kredi bakiyesi ve tercihler

2) Kredi Sistemi (Abonelik Yok)
- Iyzico ile kredi yükleme (Türkiye ve yurt dışı ödemeleri)
- Paket bazlı kredi satın alma; işlemler kredi tüketir
- Atomik kredi düşümü ve işlem kaydı

3) Ses Profilleri (Voice Profiles)
- Kullanıcı, referans sesini mikrofonla kaydedebilir veya dosya yükleyebilir
- Yüklenen örnekler Supabase Storage’ta tutulur; fal.ai TTS/S2S için URL sağlanır
- Birden çok ses profili (örn: “Ben – stüdyo”, “Ben – telefon”)

4) Text-to-Speech (fal-ai/chatterbox/text-to-speech)
- Girdi: text (+ opsiyonel audio_url referansı), exaggeration, temperature, cfg, seed
- Çıktı: fal media URL’i (ses)
- Ücretlendirme: $0.025 / 1000 karakter (fal.ai)

5) Speech-to-Speech (fal-ai/chatterbox/speech-to-speech)
- Girdi: source_audio_url (+ opsiyonel target_voice_audio_url)
- Çıktı: fal media URL’i (ses)
- Ücretlendirme: $0.015 / dakika (fal.ai)

6) Geçmiş ve İndirilebilir Çıktılar
- Çalıştırılan işler (jobs) listelenir; çıktı URL’leri saklanır
- İsteyen kullanıcı indirme yapabilir

7) Uygunluk ve Etik
- Kullanıcı beyanı/izin onayı (başkasının sesini izinsiz kullanmama)
- Şikayet ve silme talebi mekanizması (raporla)

⸻

Teknoloji Yığını

- React + TypeScript + Vite (SPA)
- Tailwind CSS
- React Router (client-side routing)
- Supabase: Auth, PostgreSQL, Storage
- Ödeme: Iyzico (kredi paketi), LemonSqueezy hazır ama pasif
- Ses Üretimi/Dönüşüm: fal.ai Chatterbox TTS & Speech-to-Speech (Queue API)
- Arka plan orkestrasyon: n8n (fal.ai çağrıları, polling, retry, DB güncellemeleri)
- Backend API: Express.js/Fastify (opsiyonel, güvenlik ve muhasebe katmanı için)
- Dağıtım: Netlify/Vercel (frontend), Railway/Render (backend API opsiyonel)

Notlar:
- React SPA doğrudan Supabase ile konuşur (auth, CRUD); hassas işlemler için opsiyonel backend API.
- Backend API (varsa) yalnızca güvenlik, yetkilendirme, kredi muhasebesi, job oluşturma ve n8n tetikleme yapar.
- fal.ai ile bekleme/polling/sonuç işleme n8n üzerinde yürütülür.
- R3/R2 obje depolama entegrasyonu şimdilik yok. Ses dosyaları için Supabase Storage yeterlidir.

⸻

Mimari Genel Akış

TTS (Metinden Sese – Kendi Sesinle)
1. Kullanıcı, /clone-tts sayfasında metin + ses profili seçer.
2. Next.js: kredi yeterliliğini tahmin eder; tts_jobs satırı oluşturur (status=IN_QUEUE).
3. Next.js: n8n Webhook’una job_id, user_id, type='tts', parametreler ile POST eder.
4. n8n: fal.ai TTS Queue API’yi çağırır; polling ile sonucu bekler.
5. n8n: sonuç URL’ini tts_jobs.result_audio_url’e yazar, status=COMPLETED; krediyi atomik düşer.
6. Kullanıcı, dashboard/geçmişten dinleyebilir/indirir.

S2S (Sesten Sese – Ses Dönüşümü)
1. Kullanıcı, /voice-convert sayfasında kaynak ses dosyasını yükler/seçer ve hedef ses profili belirler (opsiyonel).
2. Next.js: süreyi hesaplar; s2s_jobs satırı oluşturur (status=IN_QUEUE).
3. Next.js: n8n Webhook’una job_id, user_id, type='s2s', parametreler ile POST eder.
4. n8n: fal.ai S2S Queue API’yi çağırır; polling ile sonucu bekler.
5. n8n: sonuç URL’ini s2s_jobs.result_audio_url’e yazar, status=COMPLETED; krediyi atomik düşer.
6. Kullanıcı, dashboard/geçmişten dinleyebilir/indirir.

Notlar:
- Idempotency: job_id tekil; n8n retry durumlarında aynı job için kredi ikinci kez düşmemeli (Supabase RPC içinde idempotency_key=job_id).
- Başarısız/iptal durumda status=FAILED/CANCELLED; kredi düşülmez.

⸻

Arka Plan İşleri: n8n Orkestrasyonu

Rol paylaşımı
- React App + Supabase Client: kullanıcı auth, CRUD işlemleri, job kaydı (IN_QUEUE), kredi kontrolü, n8n tetikleme, real-time status tracking.
- Opsiyonel Backend API: hassas kredi muhasebesi, karmaşık iş mantığı, n8n webhook proxy (güvenlik katmanı).
- n8n: fal.ai çağrıları, polling/wait, retry/backoff, DB güncellemeleri (status/result), kredi düşümü (atomik), bildirim/telemetri.

n8n temel akış (tek workflow, tts/s2s ortak)
1) Trigger: Webhook (POST /process-voice-job)
   - Payload: { job_id, user_id, type: 'tts'|'s2s', params: {...} }
2) DB update: jobs status=IN_PROGRESS (Supabase REST veya Supabase node).
3) fal.ai Queue POST:
   - Endpoint: type='tts' → /fal-ai/chatterbox/text-to-speech
               type='s2s' → /fal-ai/chatterbox/speech-to-speech
   - Header: Authorization: Key {{ FAL_KEY }}
   - Body: params
4) Polling döngüsü:
   - Wait (örn. 5s → 10s → 20s: exponential backoff)
   - GET status_url; status COMPLETED/FAILED/CANCELLED kontrolü
5) Tamamlandı:
   - result_audio_url’i al; ilgili tabloya (tts_jobs/s2s_jobs) yaz; status=COMPLETED
   - credits_charged’ı hesapla ve Supabase RPC ile atomik düş (idempotency_key=job_id)
6) Hata/İptal:
   - status=FAILED/CANCELLED, error_message (opsiyonel), kredi düşme
7) Opsiyonel: Realtime bildirimi, email/Slack uyarıları, çıktı kopyalama (Storage).

n8n retry/backoff
- 429/5xx için jitter’lı retry (örn. 3 deneme, 1s/3s/7s).
- Global concurrency limiti ile fal.ai rate limitlerine saygı.

⸻

Veri Modeli (Supabase)

profiles
- id UUID PK references auth.users(id) ON DELETE CASCADE
- credits BIGINT DEFAULT 0
- display_name TEXT
- created_at TIMESTAMPTZ DEFAULT NOW()

voice_profiles
- id UUID PK DEFAULT gen_random_uuid()
- user_id UUID references auth.users(id) ON DELETE CASCADE
- name TEXT NOT NULL
- source_type TEXT CHECK (source_type IN ('upload','record')) NOT NULL
- audio_url TEXT NOT NULL -- Supabase Storage public URL
- duration_sec NUMERIC
- sample_rate_hz INTEGER
- created_at TIMESTAMPTZ DEFAULT NOW()

tts_jobs
- id UUID PK DEFAULT gen_random_uuid()
- user_id UUID references auth.users(id) ON DELETE CASCADE
- voice_profile_id UUID references voice_profiles(id)
- text TEXT NOT NULL
- exaggeration NUMERIC DEFAULT 0.25
- temperature NUMERIC DEFAULT 0.7
- cfg NUMERIC DEFAULT 0.5
- seed INTEGER DEFAULT 0
- fal_request_id TEXT
- status TEXT CHECK (status IN ('IN_QUEUE','IN_PROGRESS','COMPLETED','FAILED','CANCELLED')) DEFAULT 'IN_QUEUE'
- result_audio_url TEXT -- fal media URL
- characters INTEGER DEFAULT 0
- credits_charged BIGINT DEFAULT 0
- created_at TIMESTAMPTZ DEFAULT NOW()

s2s_jobs
- id UUID PK DEFAULT gen_random_uuid()
- user_id UUID references auth.users(id) ON DELETE CASCADE
- source_audio_url TEXT NOT NULL -- Supabase Storage public URL veya harici URL
- target_voice_profile_id UUID references voice_profiles(id)
- fal_request_id TEXT
- status TEXT CHECK (status IN ('IN_QUEUE','IN_PROGRESS','COMPLETED','FAILED','CANCELLED')) DEFAULT 'IN_QUEUE'
- result_audio_url TEXT -- fal media URL
- source_duration_sec NUMERIC DEFAULT 0
- credits_charged BIGINT DEFAULT 0
- created_at TIMESTAMPTZ DEFAULT NOW()

credit_packages
- id UUID PK DEFAULT gen_random_uuid()
- name TEXT NOT NULL
- credits INTEGER NOT NULL
- price_currency TEXT DEFAULT 'TRY' -- TRY, USD vb.
- price_amount DECIMAL(10,2) NOT NULL
- description TEXT
- is_active BOOLEAN DEFAULT true
- created_at TIMESTAMPTZ DEFAULT NOW()

credit_purchases
- id UUID PK DEFAULT gen_random_uuid()
- user_id UUID references auth.users(id) ON DELETE CASCADE
- package_id UUID references credit_packages(id)
- credits_purchased INTEGER NOT NULL
- amount_paid DECIMAL(10,2) NOT NULL
- currency TEXT DEFAULT 'TRY'
- payment_status TEXT DEFAULT 'pending' -- pending, completed, failed
- iyzico_payment_id TEXT
- created_at TIMESTAMPTZ DEFAULT NOW()

RLS: Tüm tablolar için user_id = auth.uid() eşitliğine göre erişim politikaları uygulanır. profiles tablosunda id = auth.uid().

Not: Kredi düşümü için bir PostgreSQL RPC (SQL function) ve unique idempotency anahtarı (job_id) önerilir.

⸻

Supabase Storage

- Bucket: voices (public)
    - uploads/{userId}/{uuid}.wav|mp3|m4a
- Bucket: outputs (public)
    - tts/{userId}/{jobId}.wav
    - s2s/{userId}/{jobId}.wav

Notlar:
- fal.ai çıktıları zaten public URL döndürür (v3.fal.media). İstenirse ayrıca outputs bucket’ına kopyalanabilir.
- Public erişim gerekiyorsa sadece okunabilir izin verilir; yazma işlemleri server-side yapılır.

⸻

Kredi Fiyatlandırma ve Muhasebe

Varsayılan (öneri – .env ile değiştirilebilir):
- TTS: 1.000 karakter = 5 kredi
- S2S: 1 dakika = 10 kredi

Hesaplama Kuralları:
- TTS: characters = text.length; credits = ceil((characters/1000) * TTS_CREDITS_PER_1K)
- S2S: duration_min = ceil(seconds/60); credits = duration_min * S2S_CREDITS_PER_MIN
- Kredi düşümü: İş başarıyla tamamlandığında n8n tarafından yapılır; iptal/başarısızlıkta düşülmez
- Her job kaydında credits_charged sütunu saklanır

Kenar Durumlar:
- Çok uzun metinler için max karakter limiti (örn. 8.000)
- Uzun seslerde max süre limiti (örn. 10 dk)
- Ücretlendirme değişiklikleri backwards-compatible olacak şekilde versioning ile yönetilir

⸻

fal.ai Entegrasyonu (Queue API)

Genel:
- Base URL: https://queue.fal.run
- Auth Header: Authorization: Key <FAL_KEY>
- İş akışı: POST → status_url ile polling → result GET
- Orkestrasyon: Bu çağrılar n8n içinde yapılır (React App doğrudan fal.ai çağırmaz).

TTS Endpoint
- POST /fal-ai/chatterbox/text-to-speech
- Body (özet):
    {
        text: string,              // zorunlu
        audio_url?: string,        // opsiyonel referans ses (voice_profile.audio_url)
        exaggeration?: number,     // [0..1], default 0.25
        temperature?: number,      // [0..2], default 0.7
        cfg?: number,              // [0.1..1], default 0.5
        seed?: number              // 0 = random
    }
- 200 cevabı: { status, request_id, status_url, response_url, cancel_url, ... }
- Sonuç GET: /fal-ai/chatterbox/text-to-speech/requests/{request_id} ⇒ result_audio_url (fal media)

S2S Endpoint
- POST /fal-ai/chatterbox/speech-to-speech
- Body (özet):
    {
        source_audio_url: string,         // zorunlu
        target_voice_audio_url?: string   // opsiyonel (voice_profile.audio_url)
    }
- 200 cevabı: { status, request_id, status_url, response_url, cancel_url, ... }
- Sonuç GET: /fal-ai/chatterbox/speech-to-speech/requests/{request_id} ⇒ result_audio_url (fal media)

Hata Yönetimi
- IN_QUEUE/IN_PROGRESS → polling (exponential backoff)
- FAILED → hata mesajı, krediler düşülmez
- CANCELLED → kullanıcı iptali → krediler düşülmez

⸻

API Tasarımı (React + Supabase + Opsiyonel Backend)

React App → Supabase Direct (çoğu işlem):
- Authentication: Supabase Auth hooks (@supabase/auth-helpers-react)
- CRUD: Supabase Client ile doğrudan voice_profiles, jobs tabloları
- Real-time: Supabase Realtime ile job status değişimlerini dinleme
- Storage: Supabase Storage ile ses dosyası upload/download

Opsiyonel Backend API Endpoints (güvenlik katmanı):

/api/voices/upload (POST – FormData)
- Girdi: file, name, source_type
- Süre ölçümü: sunucu tarafında basit decoder (örn. music-metadata) ile
- Çıktı: { voice_profile: { id, audio_url, duration_sec, ... } }

/api/tts/create (POST)
- Girdi: { text: string, voice_profile_id?: string, options?: { exaggeration?, temperature?, cfg?, seed? } }
- Akış: (1) kredi tahmini → (2) Supabase'e tts_jobs satırı (IN_QUEUE) → (3) n8n webhook tetikleme (job_id + params) → (4) { job_id, status: 'IN_QUEUE' } döndür
- Not: fal.ai çağrısı Next.js tarafında yapılmaz, arka plan n8n’de yürür.

/api/tts/status (GET)
- Input: { job_id }
- Output: { status, result_audio_url? }

/api/s2s/create (POST – FormData veya JSON url)
- Girdi: file veya { source_audio_url }, target_voice_profile_id?: string
- Akış: (1) süre ölçümü → (2) s2s_jobs satırı (IN_QUEUE) → (3) n8n webhook tetikleme (job_id + params) → (4) { job_id, status: 'IN_QUEUE' }

/api/s2s/status (GET)
- Input: { job_id }
- Output: { status, result_audio_url? }

/api/credits/packages (GET)
- Çıktı: { packages: [...] }

/api/credits/balance (GET)
- Çıktı: { credits: number, recentPurchases: [] }

/api/iyzico/create-checkout (POST)
- Girdi: { packageId, customerData }
- Çıktı: { checkoutFormContent | paymentPageUrl, token }

/api/iyzico/verify-payment (POST)
- Girdi: { token }
- Çıktı: { success, creditsAdded, newBalance }

Opsiyonel:
- /api/webhooks/job-updated (POST): n8n isterse job state değişimini buradan da bildirebilir (Next.js ek yan etkiler/telemetri çalıştırır). Normalde n8n doğrudan Supabase’e yazar.

⸻

Ön Uç (UI) Taslağı

Dashboard (/dashboard)
- Kredi bakiyesi (Navbar’da da göster)
- Ses profilleri listesi (ekle, sil, yeniden adlandır)
- Son işler (TTS/S2S) – durum/indir

Clone TTS (/clone-tts)
- Metin alanı, karakter sayacı ve maliyet göstergesi (kredi)
- Ses profili seçimi + hızlı önizleme
- Gelişmiş ayarlar: exaggeration, temperature, cfg, seed
- Gönder → durum → sonuç oynatıcı/indir

Voice Convert (/voice-convert)
- Kaynak ses yükleme veya URL girme
- Hedef ses profili seçimi (opsiyonel)
- Süre ve maliyet göstergesi (kredi)
- Gönder → durum → sonuç oynatıcı/indir

⸻

Güvenlik, Hukuk ve Uyum

- Ses sahipliği ve izin beyanı (checkbox): “Bu ses bana ait ya da kullanım iznim var.”
- Kötüye kullanım bildirim/raporlama uç noktası
- RLS politikaları; kullanıcı sadece kendi voice_profile ve job kayıtlarını görür
- API hız limiti ve boyut limitleri (örn. max 20MB, max 10dk)
- n8n Credentials: FAL_KEY ve Supabase Service Key yalnızca n8n’de saklanır (client’a sızdırılmaz).
- Idempotency: kredi düşümü Supabase RPC içinde idempotent (unique job_id).

⸻

Ortam Değişkenleri (.env)

Frontend (React):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_N8N_BASE_URL=https://your-n8n.example.com
- VITE_N8N_WEBHOOK_PATH_PROCESS=/webhook/process-voice-job
- VITE_TTS_CREDITS_PER_1K=5
- VITE_S2S_CREDITS_PER_MIN=10
- VITE_MAX_TTS_CHARS=8000
- VITE_MAX_S2S_MINUTES=10

Backend API (opsiyonel):
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- FAL_KEY
- IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL
- N8N_BASE_URL=https://your-n8n.example.com
- N8N_WEBHOOK_PATH_PROCESS=/webhook/process-voice-job

n8n ortam değişkenleri/credentials (n8n tarafında)
- FAL_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- OPTIONAL: SLACK_WEBHOOK_URL, SENTRY_DSN

⸻

Kalite Kriterleri ve İzleme

- Birim test: kredi hesaplama, RLS politikaları, basit API kontratları
- Gözlemler: hata oranları, ortalama bekleme (fal queue), ortalama maliyet/işlem
- Loglama: job status değişimleri, Iyzico ödeme webhooks, kredi hareketleri
- n8n: execution logs, error branch uyarıları (Slack/Email)

⸻

Gelecek İyileştirmeler

- Çoklu referans ses örneği birleştirme (en iyi kalite için)
- Sentez sonrası gürültü azaltma/normalizasyon pipeline’ı
- Toplu iş (batch) ve webhook tabanlı anlık durum güncellemesi
- Çoklu dil duyuruları ve KV locale dosyaları
- Kurumsal: ekip hesapları, rol bazlı yetki, faturalandırma PDF

⸻

n8n Workflow Örneği (basit)

Amaç: Tek workflow ile hem TTS hem S2S işleri yürütülür. Webhook ile tetiklenir, fal.ai çağrısı yapılır, bir kez polling yapılır (örnek basitlik için), DB güncellenir. Üretimde Wait+loop/backoff ekleyin.

Webhook beklenen payload (React App → n8n):
{
  "job_id": "uuid",
  "user_id": "uuid",
  "type": "tts" | "s2s",
  "params": {
    // TTS
    "text": "Merhaba...",
    "audio_url": "https://.../voices/...",
    "exaggeration": 0.25,
    "temperature": 0.7,
    "cfg": 0.5,
    "seed": 0
    // S2S
    // "source_audio_url": "https://.../voices/...",
    // "target_voice_audio_url": "https://.../voices/..."
  }
}

Basit workflow adımları
1) Webhook (POST /process-voice-job)
2) HTTP Request (PATCH) → Supabase REST: ilgili job status=IN_PROGRESS
3) HTTP Request (POST) → fal.ai Queue: endpoint type’a göre seçilir
4) Wait (5s)
5) HTTP Request (GET) → fal.ai status_url
6) IF status=COMPLETED:
   - HTTP Request (PATCH) → Supabase: result_audio_url, status=COMPLETED
   - HTTP Request (POST) → Supabase RPC: credits_deduct(job_id, user_id, amount)
7) ELSE:
   - HTTP Request (PATCH) → Supabase: status=FAILED

n8n JSON (örnek, sadeleştirilmiş – import edilebilir)
{
  "name": "process-voice-job",
  "nodes": [
    {
      "parameters": {
        "path": "process-voice-job",
        "options": {
          "responseCode": 200,
          "responseData": "json",
          "responseBody": "{\"ok\":true,\"received\":true}"
        }
      },
      "id": "Webhook",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [200, 300]
    },
    {
      "parameters": {
        "options": {},
        "values": {
          "string": [
            {
              "name": "endpoint",
              "value": "={{$json[\"type\"] === \"tts\" ? \"/fal-ai/chatterbox/text-to-speech\" : \"/fal-ai/chatterbox/speech-to-speech\"}}"
            }
          ]
        }
      },
      "id": "SetEndpoint",
      "name": "Set Endpoint",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [420, 300]
    },
    {
      "parameters": {
        "authentication": "genericCredentialType",
        "genericAuthType": "httpBasicAuth",
        "requestMethod": "PATCH",
        "url": "={{$env.SUPABASE_URL}}/rest/v1/{{$json[\"type\"] === \"tts\" ? \"tts_jobs\" : \"s2s_jobs\"}}?id=eq.{{$json[\"job_id\"]}}",
        "jsonParameters": true,
        "options": {},
        "sendBody": true,
        "bodyParametersJson": "{\"status\":\"IN_PROGRESS\"}",
        "headerParametersJson": "{\"apikey\":\"{{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Authorization\":\"Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Content-Type\":\"application/json\",\"Prefer\":\"return=representation\"}"
      },
      "id": "MarkInProgress",
      "name": "Mark IN_PROGRESS",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [640, 200],
      "credentials": {}
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "={{\"https://queue.fal.run\" + $json[\"endpoint\"]}}",
        "jsonParameters": true,
        "options": {},
        "sendBody": true,
        "bodyParametersJson": "={{$json[\"params\"]}}",
        "headerParametersJson": "{\"Authorization\":\"Key {{$env.FAL_KEY}}\",\"Content-Type\":\"application/json\"}"
      },
      "id": "FalQueuePost",
      "name": "fal.ai Queue POST",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [640, 420]
    },
    {
      "parameters": {
        "amount": 5,
        "unit": "seconds"
      },
      "id": "Wait",
      "name": "Wait 5s",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1,
      "position": [860, 420]
    },
    {
      "parameters": {
        "requestMethod": "GET",
        "url": "={{$json[\"status_url\"] || $node[\"fal.ai Queue POST\"].json[\"status_url\"]}}",
        "jsonParameters": true,
        "options": {},
        "headerParametersJson": "{\"Authorization\":\"Key {{$env.FAL_KEY}}\"}"
      },
      "id": "FalStatusGet",
      "name": "fal.ai Status GET",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1060, 420]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{$json[\"status\"]}}",
              "operation": "equal",
              "value2": "COMPLETED"
            }
          ]
        }
      },
      "id": "IfCompleted",
      "name": "IF COMPLETED?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [1260, 420]
    },
    {
      "parameters": {
        "requestMethod": "PATCH",
        "url": "={{$env.SUPABASE_URL}}/rest/v1/{{$json[\"type\"] === \"tts\" ? \"tts_jobs\" : \"s2s_jobs\"}}?id=eq.{{$json[\"job_id\"]}}",
        "jsonParameters": true,
        "options": {},
        "sendBody": true,
        "bodyParametersJson": "={\"status\":\"COMPLETED\",\"result_audio_url\":\"{{$json[\"result\"].audio_url || $json[\"audio_url\"] || $json[\"result_audio_url\"]}}\"}",
        "headerParametersJson": "{\"apikey\":\"{{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Authorization\":\"Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Content-Type\":\"application/json\",\"Prefer\":\"return=representation\"}"
      },
      "id": "SaveResult",
      "name": "Save Result",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1460, 340]
    },
    {
      "parameters": {
        "requestMethod": "POST",
        "url": "={{$env.SUPABASE_URL}}/rest/v1/rpc/credits_deduct",
        "jsonParameters": true,
        "options": {},
        "sendBody": true,
        "bodyParametersJson": "={\"p_user_id\":\"{{$json[\"user_id\"]}}\",\"p_job_id\":\"{{$json[\"job_id\"]}}\",\"p_type\":\"{{$json[\"type\"]}}\"}",
        "headerParametersJson": "{\"apikey\":\"{{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Authorization\":\"Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Content-Type\":\"application/json\"}"
      },
      "id": "DeductCredits",
      "name": "Deduct Credits (RPC)",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1660, 340]
    },
    {
      "parameters": {
        "requestMethod": "PATCH",
        "url": "={{$env.SUPABASE_URL}}/rest/v1/{{$json[\"type\"] === \"tts\" ? \"tts_jobs\" : \"s2s_jobs\"}}?id=eq.{{$json[\"job_id\"]}}",
        "jsonParameters": true,
        "options": {},
        "sendBody": true,
        "bodyParametersJson": "{\"status\":\"FAILED\"}",
        "headerParametersJson": "{\"apikey\":\"{{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Authorization\":\"Bearer {{$env.SUPABASE_SERVICE_ROLE_KEY}}\",\"Content-Type\":\"application/json\",\"Prefer\":\"return=representation\"}"
      },
      "id": "MarkFailed",
      "name": "Mark FAILED",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [1460, 520]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Set Endpoint",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Set Endpoint": {
      "main": [
        [
          {
            "node": "Mark IN_PROGRESS",
            "type": "main",
            "index": 0
          },
          {
            "node": "fal.ai Queue POST",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "fal.ai Queue POST": {
      "main": [
        [
          {
            "node": "Wait 5s",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Wait 5s": {
      "main": [
        [
          {
            "node": "fal.ai Status GET",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "fal.ai Status GET": {
      "main": [
        [
          {
            "node": "IF COMPLETED?",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "IF COMPLETED?": {
      "main": [
        [
          {
            "node": "Save Result",
            "type": "main",
            "index": 0
          }
        ],
        [
          {
            "node": "Mark FAILED",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Save Result": {
      "main": [
        [
          {
            "node": "Deduct Credits (RPC)",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}

Notlar:
- Bu JSON minimaldir; gerçek üretimde polling’i döngüye alın (IF→Wait→Status GET tekrar).
- credits_deduct RPC, job_id idempotency ile çift düşmeyi engellemeli.
- Supabase Service Role Key sadece n8n’de saklanır.

⸻

Ek: fal.ai Örnek İstek (özet)

TTS (POST /fal-ai/chatterbox/text-to-speech)
{
    "text": "Merhaba, bu benim klonlanmış sesim!",
    "audio_url": "https://.../voices/uploads/<user>/<uuid>.wav",
    "exaggeration": 0.25,
    "temperature": 0.7,
    "cfg": 0.5,
    "seed": 0
}

S2S (POST /fal-ai/chatterbox/speech-to-speech)
{
    "source_audio_url": "https://.../voices/uploads/<user>/<uuid>.wav",
    "target_voice_audio_url": "https://.../voices/uploads/<user>/<uuid>.wav"
}

Header: Authorization: Key <FAL_KEY>

Not: Bu belge, önceki dil öğrenme platformu dokümanının mimari mantığını koruyarak, yeni “voice clone” ürün kapsamına güncellenmiştir. R2/R3 ve çeviri/transkript akışları kaldırılmış, fal.ai TTS/S2S ve kredi bazlı mimariyle yeniden tasarlanmıştır. Arka plan işlemleri n8n ile orkestre edilir; Next.js güvenlik ve muhasebe katmanı