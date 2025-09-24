-- ==========================================
-- update_user_credits RPC Function
-- ==========================================
-- Bu function kullanıcı kredilerini güvenli şekilde günceller
-- ve transaction history tablosuna kayıt ekler

CREATE OR REPLACE FUNCTION update_user_credits(
  user_uuid UUID,
  credit_amount INTEGER,
  transaction_type TEXT DEFAULT 'purchase',
  operation_type TEXT DEFAULT 'system',
  description_text TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits INTEGER := 0;
  new_credits INTEGER := 0;
  profile_exists BOOLEAN := FALSE;
  result JSON;
BEGIN
  -- Input validation
  IF user_uuid IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'user_uuid cannot be null',
      'error_code', 'INVALID_USER_ID'
    );
  END IF;

  IF credit_amount IS NULL OR credit_amount = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'credit_amount must be a non-zero integer',
      'error_code', 'INVALID_CREDIT_AMOUNT'
    );
  END IF;

  -- Check if profile exists and get current credits
  SELECT 
    COALESCE(credits, 0),
    TRUE
  INTO 
    current_credits,
    profile_exists
  FROM profiles 
  WHERE id = user_uuid;

  -- If profile doesn't exist, create it
  IF NOT profile_exists THEN
    INSERT INTO profiles (id, credits, created_at, updated_at)
    VALUES (user_uuid, 0, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    current_credits := 0;
    
    RAISE NOTICE 'Created new profile for user: %', user_uuid;
  END IF;

  -- Calculate new credit amount
  new_credits := current_credits + credit_amount;

  -- Prevent negative credits (unless it's an admin operation)
  IF new_credits < 0 AND operation_type != 'admin_adjustment' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient credits. Current: ' || current_credits || ', Requested: ' || credit_amount,
      'error_code', 'INSUFFICIENT_CREDITS',
      'current_credits', current_credits,
      'requested_amount', credit_amount
    );
  END IF;

  -- Update profile with new credits
  UPDATE profiles 
  SET 
    credits = new_credits,
    updated_at = NOW()
  WHERE id = user_uuid;

  -- Check if update was successful
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to update profile',
      'error_code', 'UPDATE_FAILED'
    );
  END IF;

  -- Insert transaction history (if table exists)
  BEGIN
    INSERT INTO credit_transactions (
      user_id,
      amount,
      transaction_type,
      operation_type,
      description,
      previous_balance,
      new_balance,
      created_at
    ) VALUES (
      user_uuid,
      credit_amount,
      transaction_type,
      operation_type,
      COALESCE(description_text, transaction_type || ' - ' || credit_amount || ' credits'),
      current_credits,
      new_credits,
      NOW()
    );
  EXCEPTION 
    WHEN undefined_table THEN
      -- Table doesn't exist, skip transaction logging
      RAISE NOTICE 'credit_transactions table does not exist, skipping transaction log';
    WHEN OTHERS THEN
      -- Log error but don't fail the main operation
      RAISE NOTICE 'Failed to insert transaction log: %', SQLERRM;
  END;

  -- Build success response
  result := json_build_object(
    'success', true,
    'message', 'Credits updated successfully',
    'user_id', user_uuid,
    'previous_credits', current_credits,
    'credit_change', credit_amount,
    'new_credits', new_credits,
    'transaction_type', transaction_type,
    'operation_type', operation_type,
    'timestamp', NOW()
  );

  RAISE NOTICE 'Credits updated for user %: % -> % (change: %)', 
    user_uuid, current_credits, new_credits, credit_amount;

  RETURN result;

EXCEPTION 
  WHEN OTHERS THEN
    -- Return error details
    RETURN json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'error_code', 'DATABASE_ERROR',
      'sqlstate', SQLSTATE
    );
END;
$$;

-- ==========================================
-- Grant permissions
-- ==========================================
-- Authenticated users can call this function
GRANT EXECUTE ON FUNCTION update_user_credits TO authenticated;

-- Anon users cannot call this function (for security)
REVOKE EXECUTE ON FUNCTION update_user_credits FROM anon;

-- ==========================================
-- Example usage comments
-- ==========================================
-- Purchase credits:
-- SELECT update_user_credits(
--   'user-uuid-here'::UUID, 
--   100, 
--   'purchase', 
--   'paddle_checkout',
--   'Paddle purchase: Starter Package (100 credits)'
-- );

-- Consume credits:
-- SELECT update_user_credits(
--   'user-uuid-here'::UUID, 
--   -5, 
--   'usage', 
--   'voice_clone',
--   'Voice cloning generation'
-- );

-- Admin adjustment:
-- SELECT update_user_credits(
--   'user-uuid-here'::UUID, 
--   -10, 
--   'adjustment', 
--   'admin_adjustment',
--   'Admin credit adjustment for refund'
-- );