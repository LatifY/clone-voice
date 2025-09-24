# 🍋 LemonSqueezy Integration Setup Guide

CloneVoice projende LemonSqueezy entegrasyonu başarıyla eklendi! İşte kurulum adımları:

## ✅ **Tamamlanan İşlemler**

### 1. 🗄️ **Supabase Tabloları Oluşturuldu**
Aşağıdaki SQL komutlarını Supabase Dashboard'da çalıştır:

```sql
-- 1. Purchases tablosu (ödeme geçmişi için)
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lemonsqueezy_order_id VARCHAR(255) UNIQUE NOT NULL,
  lemonsqueezy_variant_id VARCHAR(255) NOT NULL,
  package_name VARCHAR(100) NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'completed',
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Credit transactions tablosu (kredi hareketleri için)
CREATE TABLE credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'usage', 'bonus', 'refund'
  credits_amount INTEGER NOT NULL, -- pozitif: eklenen, negatif: kullanılan
  operation_type VARCHAR(50), -- 'voice_clone', 'tts', 's2s', 'signup_bonus', etc.
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Profiles tablosuna credits kolonu ekle (eğer yoksa)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- 4. İndeksler (performans için)
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_lemonsqueezy_order_id ON purchases(lemonsqueezy_order_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);

-- 5. RLS (Row Level Security) policies
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Purchases policies
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Credit transactions policies  
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Functions
CREATE OR REPLACE FUNCTION update_user_credits(
  user_uuid UUID,
  credit_amount INTEGER,
  transaction_type VARCHAR,
  operation_type VARCHAR DEFAULT NULL,
  purchase_uuid UUID DEFAULT NULL,
  description_text TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update profiles credits
  UPDATE profiles 
  SET credits = credits + credit_amount,
      updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Insert transaction record
  INSERT INTO credit_transactions (
    user_id, 
    transaction_type, 
    credits_amount, 
    operation_type, 
    purchase_id, 
    description
  ) VALUES (
    user_uuid,
    transaction_type,
    credit_amount,
    operation_type,
    purchase_uuid,
    description_text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. 🔑 **Environment Variables (.env)**
`.env` dosyanda şu değişkenleri doldur:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LemonSqueezy Configuration
VITE_LEMONSQUEEZY_STORE_ID=your_store_id
VITE_LEMONSQUEEZY_API_KEY=your_api_key
VITE_LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# LemonSqueezy Variant IDs (create these in your LemonSqueezy dashboard)
VITE_LEMONSQUEEZY_VARIANT_STARTER=your_starter_variant_id
VITE_LEMONSQUEEZY_VARIANT_STANDARD=your_standard_variant_id  
VITE_LEMONSQUEEZY_VARIANT_POPULAR=your_popular_variant_id
VITE_LEMONSQUEEZY_VARIANT_PRO=your_pro_variant_id

# Test Mode (set to true for development)
VITE_TEST_MODE=true

# API Configuration
VITE_API_URL=http://localhost:3000
```

### 3. 📦 **LemonSqueezy Dashboard Setup**

1. **LemonSqueezy**'de hesap aç: https://lemonsqueezy.com
2. **Store** oluştur
3. **Products** oluştur:
   - Starter Pack (25 credits) - $5
   - Standard Pack (100 credits) - $18  
   - Popular Pack (250 credits) - $40
   - Pro Pack (500 credits) - $70
4. Her product için **Variant ID**'leri kopyala ve `.env`'e ekle
5. **API Key** oluştur
6. **Webhook** ayarla (production'da backend URL'i kullan)

## 🔧 **Backend Kurulum Gerekli**

LemonSqueezy webhook'ları için backend gerekli. Örnek Node.js implementation:

```javascript
const express = require('express');
const app = express();

app.post('/api/lemonsqueezy/create-checkout', async (req, res) => {
  try {
    const { variantId, userId, userEmail, credits, amount } = req.body;
    
    const checkout = await lemonsqueezy.createCheckout({
      storeId: process.env.LEMONSQUEEZY_STORE_ID,
      variantId: variantId,
      checkoutOptions: {
        embed: false,
        media: false,
        logo: true
      },
      checkoutData: {
        email: userEmail,
        custom: {
          userId: userId,
          credits: credits
        }
      }
    });
    
    res.json({ checkoutUrl: checkout.data.attributes.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/lemonsqueezy/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-signature'];
    const payload = JSON.stringify(req.body);
    
    // Validate signature
    if (!validateWebhookSignature(payload, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Process webhook
    await processWebhook(req.body);
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🧪 **Test Mode Aktif**

Şu an `VITE_TEST_MODE=true` olduğu için:
- ✅ Gerçek ödeme yapılmaz
- ✅ Credits direkt hesaba eklenir  
- ✅ Test checkout sayfası açılır
- ✅ Test purchase records oluşur

## 🚀 **Kullanım**

1. **Geliştirme**: `VITE_TEST_MODE=true` → Test ödemeleri
2. **Production**: `VITE_TEST_MODE=false` → Gerçek LemonSqueezy checkout

## ✨ **Özellikler**

- 🎯 **Kredi Sistemi**: 5 credit = 1 voice clone
- 🎁 **Signup Bonus**: 10 free credits yeni kullanıcılara
- 💳 **Güvenli Ödeme**: LemonSqueezy hosted checkout
- 📊 **Kredi Takibi**: Transaction history ve balance
- 🔔 **Notifications**: Success/error toast messages
- 🧪 **Test Mode**: Development için simulated payments

## 🐛 **Debug**

Test mode'da console'u kontrol et:
```javascript
console.log('🧪 TEST MODE: Processing purchase...')
```

Gerçek payments için LemonSqueezy dashboard'da webhook logs'u kontrol et.

## 🎉 **Tamamlandı!**

- ✅ Pricing sayfası oluşturuldu (`/pricing`)
- ✅ Navbar'a "Buy Credits" butonu eklendi
- ✅ Test checkout flow hazır
- ✅ Credits sistem entegrasyonu tamamlandı
- ✅ Error handling ve notifications eklendi

**Sıradaki adım**: Backend API kurulumu ve LemonSqueezy dashboard configuration! 🚀