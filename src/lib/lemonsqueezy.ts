import { supabase } from './supabase'

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  lemonSqueezyVariantId: string
  popular?: boolean
  description: string
}

export interface CheckoutResponse {
  success: boolean
  checkoutUrl?: string
  error?: string
}

export interface WebhookEvent {
  meta: {
    event_name: string
  }
  data: {
    id: string
    type: string
    attributes: {
      store_id: number
      customer_id: number
      order_number: number
      user_email: string
      user_name: string
      currency: string
      total: number
      total_formatted: string
      status: string
      created_at: string
      updated_at: string
      first_order_item: {
        id: number
        variant_id: number
        variant_name: string
        product_name: string
        price: number
      }
      order_items: Array<{
        id: number
        variant_id: number
        variant_name: string
        product_name: string
        price: number
      }>
    }
  }
}

// Credit packages configuration
export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 25,
    price: 5,
    lemonSqueezyVariantId: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_STARTER || '',
    description: 'Perfect for trying our AI voice cloning',
    popular: false
  },
  {
    id: 'standard',
    name: 'Standard',
    credits: 100,
    price: 18,
    lemonSqueezyVariantId: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_STANDARD || '',
    description: 'Best value for regular voice cloning',
    popular: false
  },
  {
    id: 'popular',
    name: 'Popular',
    credits: 250,
    price: 40,
    lemonSqueezyVariantId: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_POPULAR || '',
    description: 'Most popular choice for creators',
    popular: true
  },
  {
    id: 'professional',
    name: 'Professional',
    credits: 500,
    price: 70,
    lemonSqueezyVariantId: import.meta.env.VITE_LEMONSQUEEZY_VARIANT_PRO || '',
    description: 'Maximum savings for heavy usage',
    popular: false
  }
]

// Test mode check
const isTestMode = () => {
  return import.meta.env.VITE_TEST_MODE === 'true'
}

// Create checkout session
export const createCheckout = async (
  packageId: string, 
  userId: string, 
  userEmail: string
): Promise<CheckoutResponse> => {
  try {
    // Test mode - simulate successful purchase
    if (isTestMode()) {
      console.log('🧪 TEST MODE: Simulating checkout creation')
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return mock checkout URL
      return {
        success: true,
        checkoutUrl: `${window.location.origin}/test-checkout?package=${packageId}&user=${userId}`
      }
    }

    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId)
    if (!selectedPackage) {
      return {
        success: false,
        error: 'Invalid package selected'
      }
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/lemonsqueezy/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: selectedPackage.lemonSqueezyVariantId,
        packageId: packageId,
        userId: userId,
        userEmail: userEmail,
        credits: selectedPackage.credits,
        amount: selectedPackage.price
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create checkout'
      }
    }

    return {
      success: true,
      checkoutUrl: data.checkoutUrl
    }

  } catch (error) {
    console.error('Checkout creation error:', error)
    return {
      success: false,
      error: 'Network error occurred'
    }
  }
}

// Process test mode purchase
export const processTestPurchase = async (
  packageId: string, 
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId)
    if (!selectedPackage) {
      return { success: false, error: 'Invalid package' }
    }

    console.log(`🧪 TEST MODE: Processing purchase of ${selectedPackage.credits} credits for user ${userId}`)

    // Add credits to user profile
    const { error: updateError } = await supabase.rpc('update_user_credits', {
      user_uuid: userId,
      credit_amount: selectedPackage.credits,
      transaction_type: 'purchase',
      operation_type: 'test_purchase',
      description_text: `Test purchase: ${selectedPackage.name} package`
    })

    if (updateError) {
      console.error('Failed to update credits:', updateError)
      return { success: false, error: 'Failed to add credits' }
    }

    // Create test purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        lemonsqueezy_order_id: `test_${Date.now()}`,
        lemonsqueezy_variant_id: selectedPackage.lemonSqueezyVariantId,
        package_name: selectedPackage.name,
        credits_purchased: selectedPackage.credits,
        amount_paid: selectedPackage.price,
        currency: 'USD',
        status: 'completed',
        payment_method: 'test'
      })

    if (purchaseError) {
      console.error('Failed to create purchase record:', purchaseError)
      // Don't fail the transaction, credits were already added
    }

    return { success: true }

  } catch (error) {
    console.error('Test purchase error:', error)
    return { success: false, error: 'Failed to process test purchase' }
  }
}

// Validate webhook signature (LemonSqueezy webhook security)
export const validateWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    const crypto = require('crypto')
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(payload)
    const digest = hmac.digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(digest, 'hex')
    )
  } catch (error) {
    console.error('Webhook signature validation error:', error)
    return false
  }
}

// Process webhook (handle successful payments)
export const processWebhook = async (event: WebhookEvent): Promise<void> => {
  try {
    if (event.meta.event_name !== 'order_created') {
      console.log('Ignoring webhook event:', event.meta.event_name)
      return
    }

    const orderData = event.data.attributes
    const orderItem = orderData.first_order_item

    // Extract custom data from variant name or product name
    // LemonSqueezy allows custom data in checkout
    const variantId = orderItem.variant_id.toString()
    
    // Find the package by variant ID
    const purchasedPackage = creditPackages.find(
      pkg => pkg.lemonSqueezyVariantId === variantId
    )

    if (!purchasedPackage) {
      console.error('Unknown variant ID:', variantId)
      return
    }

    // Get user by email (you might want to use custom data instead)
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', orderData.user_email)
      .single()

    if (userError || !user) {
      console.error('User not found for email:', orderData.user_email)
      return
    }

    // Check if order already processed
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('lemonsqueezy_order_id', event.data.id)
      .single()

    if (existingPurchase) {
      console.log('Order already processed:', event.data.id)
      return
    }

    // Add credits to user
    const { error: creditsError } = await supabase.rpc('update_user_credits', {
      user_uuid: user.user_id,
      credit_amount: purchasedPackage.credits,
      transaction_type: 'purchase',
      operation_type: 'lemonsqueezy_purchase',
      description_text: `Purchase: ${purchasedPackage.name} package`
    })

    if (creditsError) {
      console.error('Failed to add credits:', creditsError)
      throw creditsError
    }

    // Create purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: user.user_id,
        lemonsqueezy_order_id: event.data.id,
        lemonsqueezy_variant_id: variantId,
        package_name: purchasedPackage.name,
        credits_purchased: purchasedPackage.credits,
        amount_paid: orderData.total / 100, // LemonSqueezy returns cents
        currency: orderData.currency,
        status: orderData.status,
        payment_method: 'lemonsqueezy'
      })

    if (purchaseError) {
      console.error('Failed to create purchase record:', purchaseError)
      throw purchaseError
    }

    console.log(`✅ Successfully processed purchase: ${purchasedPackage.credits} credits for user ${user.user_id}`)

  } catch (error) {
    console.error('Webhook processing error:', error)
    throw error
  }
}

// Get user's credit balance
export const getUserCredits = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Failed to get user credits:', error)
    return 0
  }

  return data?.credits || 0
}

// Deduct credits for usage
export const deductCredits = async (
  userId: string,
  amount: number,
  operationType: string,
  description?: string
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> => {
  try {
    // First check if user has enough credits
    const currentCredits = await getUserCredits(userId)
    
    if (currentCredits < amount) {
      return {
        success: false,
        error: `Insufficient credits. You have ${currentCredits} credits but need ${amount}.`
      }
    }

    // Deduct credits
    const { error } = await supabase.rpc('update_user_credits', {
      user_uuid: userId,
      credit_amount: -amount, // Negative to deduct
      transaction_type: 'usage',
      operation_type: operationType,
      description_text: description || `Used ${amount} credits for ${operationType}`
    })

    if (error) {
      console.error('Failed to deduct credits:', error)
      return { success: false, error: 'Failed to deduct credits' }
    }

    const remainingCredits = currentCredits - amount
    return { success: true, remainingCredits }

  } catch (error) {
    console.error('Credit deduction error:', error)
    return { success: false, error: 'Credit deduction failed' }
  }
}