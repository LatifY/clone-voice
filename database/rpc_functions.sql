-- ==============================================
-- CloneVoice RPC Functions
-- Paddle Payment Integration & Credit Management
-- ==============================================

-- 1. Update user credits function (Core credit management)
CREATE OR REPLACE FUNCTION update_user_credits(
  user_uuid UUID,
  credit_amount INTEGER,
  transaction_type VARCHAR(20),
  operation_type VARCHAR(50),
  purchase_id UUID DEFAULT NULL,
  description_text TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  result JSON;
BEGIN
  -- Validate input parameters
  IF user_uuid IS NULL THEN
    SELECT json_build_object(
      'success', false,
      'error', 'User ID is required'
    ) INTO result;
    RETURN result;
  END IF;

  IF credit_amount = 0 THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Credit amount cannot be zero'
    ) INTO result;
    RETURN result;
  END IF;

  IF transaction_type NOT IN ('purchase', 'usage', 'bonus', 'refund', 'admin') THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Invalid transaction type'
    ) INTO result;
    RETURN result;
  END IF;

  -- Get current user profile
  SELECT * INTO user_profile
  FROM profiles 
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    SELECT json_build_object(
      'success', false,
      'error', 'User profile not found'
    ) INTO result;
    RETURN result;
  END IF;

  -- Check for insufficient credits on usage/deduction
  IF credit_amount < 0 AND (user_profile.credits + credit_amount) < 0 THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'current_credits', user_profile.credits,
      'requested_amount', ABS(credit_amount)
    ) INTO result;
    RETURN result;
  END IF;

  -- Update user credits
  UPDATE profiles 
  SET credits = credits + credit_amount
  WHERE user_id = user_uuid;

  -- Create credit transaction record
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
    purchase_id,
    COALESCE(description_text, operation_type || ' transaction')
  );

  -- Get updated credits
  SELECT credits INTO user_profile.credits
  FROM profiles 
  WHERE user_id = user_uuid;

  -- Return success response
  SELECT json_build_object(
    'success', true,
    'credits_changed', credit_amount,
    'new_balance', user_profile.credits,
    'transaction_type', transaction_type,
    'operation_type', operation_type,
    'message', 'Credits updated successfully'
  ) INTO result;
  
  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Database error: ' || SQLERRM,
      'error_code', SQLSTATE
    ) INTO result;
    RETURN result;
END;
$$;

-- 2. Process Paddle purchase function
CREATE OR REPLACE FUNCTION process_paddle_purchase(
  checkout_id TEXT,
  user_uuid UUID,
  credits_amount INTEGER,
  package_name TEXT,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  paddle_transaction_id TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  purchase_record RECORD;
  credit_result JSON;
  new_purchase_id UUID;
  paddle_order_id TEXT;
  result JSON;
BEGIN
  -- Validate inputs
  IF checkout_id IS NULL OR LENGTH(checkout_id) < 5 THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Invalid Paddle checkout ID'
    ) INTO result;
    RETURN result;
  END IF;

  IF user_uuid IS NULL THEN
    SELECT json_build_object(
      'success', false,
      'error', 'User ID is required'
    ) INTO result;
    RETURN result;
  END IF;

  IF credits_amount <= 0 OR credits_amount > 10000 THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Invalid credits amount (must be 1-10000)'
    ) INTO result;
    RETURN result;
  END IF;

  -- Create Paddle order ID
  paddle_order_id := 'paddle_' || checkout_id;

  -- Check if purchase already exists
  SELECT * INTO purchase_record
  FROM purchases 
  WHERE paddle_order_id = paddle_order_id
    AND user_id = user_uuid 
    AND status = 'completed';
  
  -- If purchase already processed, return existing data
  IF FOUND THEN
    SELECT json_build_object(
      'success', true,
      'credits', purchase_record.credits_purchased,
      'package_name', purchase_record.package_name,
      'amount_paid', purchase_record.amount_paid,
      'already_processed', true,
      'paddle_order_id', purchase_record.paddle_order_id,
      'message', 'Purchase already processed - credits were already added'
    ) INTO result;
    RETURN result;
  END IF;
  
  -- Create purchase record first
  INSERT INTO purchases (
    user_id,
    paddle_order_id,
    paddle_variant_id,
    paddle_transaction_id,
    package_name,
    credits_purchased,
    amount_paid,
    currency,
    status,
    payment_method
  ) VALUES (
    user_uuid,
    paddle_order_id,
    COALESCE(paddle_transaction_id, 'paddle_' || EXTRACT(EPOCH FROM NOW())::TEXT),
    paddle_transaction_id,
    package_name,
    credits_amount,
    amount_paid,
    'USD',
    'completed',
    'paddle'
  ) RETURNING id INTO new_purchase_id;
  
  -- Add credits to user profile
  SELECT update_user_credits(
    user_uuid,
    credits_amount,
    'purchase',
    'paddle_checkout',
    new_purchase_id,
    'Paddle purchase: ' || package_name || ' package (' || credits_amount || ' credits)'
  ) INTO credit_result;

  -- Check if credit update was successful
  IF (credit_result->>'success')::boolean = false THEN
    -- Rollback purchase record if credit addition failed
    DELETE FROM purchases WHERE id = new_purchase_id;
    RETURN credit_result;
  END IF;

  -- Return success response
  SELECT json_build_object(
    'success', true,
    'credits', credits_amount,
    'package_name', package_name,
    'amount_paid', amount_paid,
    'paddle_checkout_id', checkout_id,
    'paddle_transaction_id', paddle_transaction_id,
    'paddle_order_id', paddle_order_id,
    'purchase_id', new_purchase_id,
    'new_balance', (credit_result->>'new_balance')::integer,
    'message', 'Purchase completed successfully - credits added to your account!'
  ) INTO result;
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Purchase processing failed: ' || SQLERRM,
      'error_code', SQLSTATE,
      'checkout_id', checkout_id
    ) INTO result;
    RETURN result;
END;
$$;

-- 3. Get user credit balance and history
CREATE OR REPLACE FUNCTION get_user_credits_info(
  user_uuid UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  credit_history JSON;
  purchase_history JSON;
  result JSON;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile
  FROM profiles 
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    SELECT json_build_object(
      'success', false,
      'error', 'User profile not found'
    ) INTO result;
    RETURN result;
  END IF;

  -- Get recent credit transactions (last 20)
  SELECT json_agg(
    json_build_object(
      'id', id,
      'transaction_type', transaction_type,
      'credits_amount', credits_amount,
      'operation_type', operation_type,
      'description', description,
      'created_at', created_at
    ) ORDER BY created_at DESC
  ) INTO credit_history
  FROM (
    SELECT * FROM credit_transactions 
    WHERE user_id = user_uuid 
    ORDER BY created_at DESC 
    LIMIT 20
  ) recent_transactions;

  -- Get purchase history
  SELECT json_agg(
    json_build_object(
      'id', id,
      'package_name', package_name,
      'credits_purchased', credits_purchased,
      'amount_paid', amount_paid,
      'currency', currency,
      'status', status,
      'payment_method', payment_method,
      'created_at', created_at
    ) ORDER BY created_at DESC
  ) INTO purchase_history
  FROM purchases 
  WHERE user_id = user_uuid 
  ORDER BY created_at DESC;

  -- Return comprehensive user info
  SELECT json_build_object(
    'success', true,
    'user_id', user_uuid,
    'current_credits', user_profile.credits,
    'display_name', user_profile.display_name,
    'created_at', user_profile.created_at,
    'credit_history', COALESCE(credit_history, '[]'::json),
    'purchase_history', COALESCE(purchase_history, '[]'::json)
  ) INTO result;
  
  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Failed to get user info: ' || SQLERRM
    ) INTO result;
    RETURN result;
END;
$$;

-- 4. Use credits for voice operations
CREATE OR REPLACE FUNCTION use_credits_for_operation(
  user_uuid UUID,
  operation_type VARCHAR(50),
  credits_required INTEGER,
  job_id UUID DEFAULT NULL,
  description_text TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  credit_result JSON;
  result JSON;
BEGIN
  -- Validate inputs
  IF credits_required <= 0 THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Credits required must be positive'
    ) INTO result;
    RETURN result;
  END IF;

  -- Get current user credits
  SELECT * INTO user_profile
  FROM profiles 
  WHERE user_id = user_uuid;
  
  IF NOT FOUND THEN
    SELECT json_build_object(
      'success', false,
      'error', 'User profile not found'
    ) INTO result;
    RETURN result;
  END IF;

  -- Check if user has enough credits
  IF user_profile.credits < credits_required THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Insufficient credits',
      'current_credits', user_profile.credits,
      'required_credits', credits_required,
      'shortfall', credits_required - user_profile.credits
    ) INTO result;
    RETURN result;
  END IF;

  -- Deduct credits (negative amount)
  SELECT update_user_credits(
    user_uuid,
    -credits_required,
    'usage',
    operation_type,
    job_id,
    COALESCE(description_text, operation_type || ' operation')
  ) INTO credit_result;

  -- Return the result from update_user_credits
  RETURN credit_result;

EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Failed to use credits: ' || SQLERRM
    ) INTO result;
    RETURN result;
END;
$$;

-- ==============================================
-- GRANT PERMISSIONS
-- ==============================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_user_credits(UUID, INTEGER, VARCHAR, VARCHAR, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION process_paddle_purchase(TEXT, UUID, INTEGER, TEXT, DECIMAL, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_credits_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION use_credits_for_operation(UUID, VARCHAR, INTEGER, UUID, TEXT) TO authenticated;

-- Grant permissions to service role for admin operations
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- 5. Create user profile with initial credits (for auth signup)
CREATE OR REPLACE FUNCTION create_user_profile(
  user_uuid UUID,
  display_name_text TEXT,
  initial_credits INTEGER DEFAULT 10
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_profile RECORD;
  result JSON;
BEGIN
  -- Check if profile already exists
  SELECT * INTO existing_profile
  FROM profiles 
  WHERE user_id = user_uuid;
  
  IF FOUND THEN
    SELECT json_build_object(
      'success', true,
      'profile_id', existing_profile.id,
      'user_id', existing_profile.user_id,
      'display_name', existing_profile.display_name,
      'credits', existing_profile.credits,
      'already_exists', true,
      'message', 'Profile already exists'
    ) INTO result;
    RETURN result;
  END IF;

  -- Create new profile
  INSERT INTO profiles (
    user_id,
    display_name,
    credits
  ) VALUES (
    user_uuid,
    display_name_text,
    initial_credits
  );

  -- Add initial credits transaction record if credits > 0
  IF initial_credits > 0 THEN
    INSERT INTO credit_transactions (
      user_id,
      transaction_type,
      credits_amount,
      operation_type,
      description
    ) VALUES (
      user_uuid,
      'bonus',
      initial_credits,
      'signup_bonus',
      'Welcome bonus for new user registration'
    );
  END IF;

  -- Return success response
  SELECT json_build_object(
    'success', true,
    'user_id', user_uuid,
    'display_name', display_name_text,
    'initial_credits', initial_credits,
    'message', 'Profile created successfully!'
  ) INTO result;
  
  RETURN result;

EXCEPTION
  WHEN OTHERS THEN
    SELECT json_build_object(
      'success', false,
      'error', 'Failed to create profile: ' || SQLERRM,
      'error_code', SQLSTATE
    ) INTO result;
    RETURN result;
END;
$$;

-- Grant execute permission for profile creation
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, INTEGER) TO authenticated;