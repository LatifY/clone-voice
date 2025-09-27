// Paddle.js integration for CloneVoice credit system
import { useEffect } from 'react'
import { supabase } from './supabase'

// Types
export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  paddlePriceId: string
  popular?: boolean
  description: string
}

export interface CheckoutResponse {
  success: boolean
  error?: string
}

// Paddle instance management
let paddleInstance: any = null

export const initializePaddle = async () => {
  if (paddleInstance) return paddleInstance

  try {
    const paddleModule = await import('@paddle/paddle-js')
    const { initializePaddle: initPaddle } = paddleModule

    paddleInstance = await initPaddle({
      environment: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox',
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
      checkout: {
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en',
          allowLogout: false,
          showAddTaxId: false,
        }
      }
    })
    return paddleInstance
  } catch (error) {
    throw new Error('Paddle initialization failed')
  }
}

// Credit packages configuration
export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 25,
    price: 5,
    paddlePriceId: import.meta.env.VITE_PADDLE_PRICE_STARTER || 'pri_starter',
    description: 'Perfect for trying our AI voice cloning',
    popular: false
  },
  {
    id: 'standard',
    name: 'Standard',
    credits: 100,
    price: 18,
    paddlePriceId: import.meta.env.VITE_PADDLE_PRICE_STANDARD || 'pri_standard',
    description: 'Best value for regular voice cloning',
    popular: false
  },
  {
    id: 'popular',
    name: 'Popular',
    credits: 250,
    price: 40,
    paddlePriceId: import.meta.env.VITE_PADDLE_PRICE_POPULAR || 'pri_popular',
    description: 'Most popular choice for creators',
    popular: true
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 500,
    price: 70,
    paddlePriceId: import.meta.env.VITE_PADDLE_PRICE_PRO || 'pri_professional',
    description: 'Maximum savings for heavy usage',
    popular: false
  }
]

// Test mode check
const isTestMode = () => {
  return import.meta.env.VITE_TEST_MODE === 'true'
}

// Create Paddle checkout
export const createCheckout = async (
  packageId: string,
  userId: string,
  userEmail: string
): Promise<CheckoutResponse> => {

  
  try {
    if (isTestMode()) {
      const testUrl = `${window.location.origin}/test-checkout?package=${packageId}&user=${userId}`
      window.open(testUrl, '_blank', 'width=600,height=700,scrollbars=yes')
      return { success: true }
    }

    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId)
    if (!selectedPackage) {
      return { success: false, error: 'Invalid package selected' }
    }

    const paddle = await initializePaddle()

    const successUrl = `${window.location.origin}/purchase-success?credits=${selectedPackage.credits}&package=${packageId}&user=${userId}&timestamp=${Date.now()}&source=paddle`

    const checkoutOptions = {
      items: [{
        priceId: selectedPackage.paddlePriceId,
        quantity: 1
      }],
      customer: {
        email: userEmail,
        marketingConsent: false
      },
      customData: {
        user_id: userId,
        package_id: packageId,
        credits: selectedPackage.credits.toString(),
        platform: 'CloneVoice'
      },
      settings: {
        successUrl: successUrl,
        displayMode: 'redirect',
        theme: 'dark',
        locale: 'en',
        allowLogout: false,
        showAddTaxId: false,
      }
    }

    await paddle.Checkout.open(checkoutOptions)

    return { success: true }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Checkout failed'
    }
  }
}



// Process test mode purchase
let isProcessing = false;

export const processTestPurchase = async (
  packageId: string,
  userId: string
): Promise<{ success: boolean; error?: string; credits?: number }> => {
  // İşlem zaten devam ediyorsa engelleyelim
  //const paddle = await initializePaddle()

  if (isProcessing) {
    return { success: false, error: 'A purchase is already in progress' };
  }

  try {
    isProcessing = true;

    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId)
    if (!selectedPackage) {
      isProcessing = false;
      return { success: false, error: 'Invalid package' }
    }

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1));

    const update_data = {
      user_uuid: userId,
      credit_amount: selectedPackage.credits,
      transaction_type: 'test_purchase',
      metadata: {
        paddle_order_id: `test_${Date.now()}_${packageId}`,
        paddle_variant_id: selectedPackage.paddlePriceId,
        package_name: selectedPackage.name,
        credits_purchased: selectedPackage.credits,
        amount_paid: selectedPackage.price,
        currency: 'USD',
        payment_method: 'test_mode'
      }
    }
    console.log('Update Data:', update_data);
    console.log('Before RPC call:', Date.now());
    console.log('User ID:', userId);
    console.log('Package:', packageId);



    const rpcPromise = supabase.rpc('update_user_credits', update_data);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('RPC request timed out')), 5000)
    );

    const { data: result, error: updateError } = await Promise.race([
      rpcPromise,
      timeoutPromise
    ]).catch(err => ({ data: null, error: err }));


    console.log('After RPC call:', Date.now());
    console.log('Result:', result);
    console.log('Error:', updateError);

    if (updateError || !result?.success) {
      isProcessing = false;
      return {
        success: false,
        error: updateError?.message || result?.error || 'Failed to process purchase'
      }
    }

    // İşlem başarılı, yönlendirmeden önce state'i temizle
    isProcessing = false;

    // Purchase success sayfasına yönlendir
    const successUrl = `/purchase-success?credits=${selectedPackage.credits}&package=${packageId}&user=${userId}&timestamp=${Date.now()}&source=test`;
    // window.location.href = successUrl;

    return {
      success: true,
      credits: selectedPackage.credits
    }

  } catch (error) {
    // Hata durumunda state'i temizle
    isProcessing = false;
    return {
      success: false,
      error: 'Test purchase failed. Please try again.'
    }
  }
  finally {
    isProcessing = false; // kesin sıfırlanıyor
  }
}

// Setup Paddle event listeners (DEPRECATED in v4 - now handled in checkout options)
export const setupPaddleEventListeners = async () => {
  // Event listeners are now handled directly in checkout options
}

// Get user's credit balance
export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('user_id', userId)
      .single()

    if (error) {
      return 0
    }

    return data?.credits || 0
  } catch (error) {
    return 0
  }
}

// Deduct credits for usage
export const deductCredits = async (
  userId: string,
  amount: number,
  operationType: string,
  description?: string
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> => {
  try {
    const { data, error } = await supabase.rpc('use_credits_for_operation', {
      user_uuid: userId,
      operation_type: operationType,
      credits_required: amount,
      description_text: description || `Used ${amount} credits for ${operationType}`
    })

    if (error) {
      return { success: false, error: 'Failed to deduct credits' }
    }

    if (!data?.success) {
      return {
        success: false,
        error: data?.error || 'Insufficient credits'
      }
    }

    return {
      success: true,
      remainingCredits: data.new_balance
    }

  } catch (error) {
    return { success: false, error: 'Credit deduction failed' }
  }
}

// Validate Paddle webhook (for backend implementation)
export const validatePaddleWebhook = (
  _payload: string,
  _signature: string,
  _publicKey: string
): boolean => {
  try {
    // This would be implemented in the backend
    // For now, return true for development
    return true
  } catch (error) {
    return false
  }
}

// Process Paddle webhook (for backend implementation)
export const processPaddleWebhook = async (webhookData: any): Promise<void> => {
  try {
    const eventType = webhookData.event_type || webhookData.alert_name

    switch (eventType) {
      case 'transaction.completed':
      case 'subscription_payment_succeeded':
        const customData = webhookData.custom_data || {}
        const userId = customData.userId
        const credits = parseInt(customData.credits || '0')
        const packageId = customData.package_id

        if (userId && credits > 0) {
          await supabase.rpc('update_user_credits', {
            user_uuid: userId,
            credit_amount: credits,
            transaction_type: 'paddle_purchase',
            metadata: {
              paddle_transaction_id: webhookData.id,
              paddle_order_id: webhookData.order_id,
              package_id: packageId,
              amount_paid: webhookData.amount,
              currency: webhookData.currency,
              payment_method: 'paddle'
            }
          })
        }
        break

      case 'transaction.payment_failed':
        break

      default:
        break
    }

  } catch (error) {
    throw error
  }
}