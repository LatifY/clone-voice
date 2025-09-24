-- ==========================================
-- Credit Transactions Table
-- ==========================================
-- Bu tablo kredi işlemlerinin geçmişini tutar
-- (opsiyonel ama önerilen - audit trail için)

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Pozitif = ekleme, negatif = çıkarma
  transaction_type TEXT NOT NULL, -- 'purchase', 'usage', 'adjustment', 'refund', etc.
  operation_type TEXT NOT NULL, -- 'paddle_checkout', 'voice_clone', 'admin_adjustment', etc.
  description TEXT, -- Detaylı açıklama
  previous_balance INTEGER NOT NULL DEFAULT 0, -- İşlem öncesi bakiye
  new_balance INTEGER NOT NULL DEFAULT 0, -- İşlem sonrası bakiye
  metadata JSONB, -- Ek veriler (transaction_id, session_id, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id 
  ON credit_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at 
  ON credit_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_type 
  ON credit_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created 
  ON credit_transactions(user_id, created_at DESC);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own transactions
CREATE POLICY "Users can view own credit transactions" 
  ON credit_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Only the system/RPC can insert transactions
CREATE POLICY "System can insert credit transactions" 
  ON credit_transactions FOR INSERT 
  WITH CHECK (true); -- RPC function handles validation

-- No direct updates/deletes (audit trail protection)
CREATE POLICY "No direct updates to credit transactions" 
  ON credit_transactions FOR UPDATE 
  USING (false);

CREATE POLICY "No direct deletes of credit transactions" 
  ON credit_transactions FOR DELETE 
  USING (false);

-- ==========================================
-- Updated_at trigger
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_credit_transactions_updated_at 
  BEFORE UPDATE ON credit_transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Grant permissions
-- ==========================================
-- Users can read their own transactions
GRANT SELECT ON credit_transactions TO authenticated;

-- System functions can insert
GRANT INSERT ON credit_transactions TO authenticated;

-- No direct update/delete permissions
REVOKE UPDATE, DELETE ON credit_transactions FROM authenticated, anon;

-- ==========================================
-- Example queries
-- ==========================================
-- Get user's transaction history:
-- SELECT * FROM credit_transactions 
-- WHERE user_id = auth.uid() 
-- ORDER BY created_at DESC 
-- LIMIT 50;

-- Get total credits purchased by a user:
-- SELECT COALESCE(SUM(amount), 0) as total_purchased
-- FROM credit_transactions 
-- WHERE user_id = auth.uid() 
-- AND transaction_type = 'purchase';

-- Get monthly credit usage:
-- SELECT 
--   DATE_TRUNC('month', created_at) as month,
--   SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as credits_added,
--   SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as credits_used
-- FROM credit_transactions 
-- WHERE user_id = auth.uid()
-- GROUP BY month 
-- ORDER BY month DESC;