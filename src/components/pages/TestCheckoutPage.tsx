import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { creditPackages, processTestPurchase } from '../../lib/paddle'

export const TestCheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null)
  
  const packageId = searchParams.get('package')
  const userId = searchParams.get('user')
  
  const selectedPackage = packageId ? creditPackages.find(pkg => pkg.id === packageId) : null
  
  useEffect(() => {
    if (!packageId || !userId || !selectedPackage) {
      navigate('/pricing')
    }
  }, [packageId, userId, selectedPackage, navigate])
  
  const handleTestPayment = async () => {
    if (!packageId || !userId) return
    
    setProcessing(true)
    try {
      const purchaseResult = await processTestPurchase(packageId, userId)
      setResult(purchaseResult)
    } catch (error) {
      setResult({ success: false, error: 'Test payment failed' })
    } finally {
      setProcessing(false)
    }
  }
  
  const handleCancel = () => {
    navigate('/pricing')
  }
  
  if (!selectedPackage) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <div className="text-center space-y-6">
          {/* Test Mode Banner */}
          <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-3">
            <p className="text-yellow-300 text-sm font-medium">
              🧪 TEST MODE - No Real Payment
            </p>
          </div>
          
          {/* Package Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Test Checkout</h2>
            <div className="bg-white/5 rounded-lg p-4 text-left">
              <p className="text-gray-300">Package: <span className="text-white font-semibold">{selectedPackage.name}</span></p>
              <p className="text-gray-300">Credits: <span className="text-white font-semibold">{selectedPackage.credits}</span></p>
              <p className="text-gray-300">Price: <span className="text-white font-semibold">${selectedPackage.price}</span></p>
            </div>
          </div>
          
          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-500/20 border-green-400/30 text-green-300'
                : 'bg-red-500/20 border-red-400/30 text-red-300'
            }`}>
              {result.success ? (
                <div className="space-y-2">
                  <p className="font-semibold">✅ Test Purchase Successful!</p>
                  <p className="text-sm">{selectedPackage.credits} credits added to your account</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold">❌ Test Purchase Failed</p>
                  <p className="text-sm">{result.error}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Actions */}
          {!result ? (
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleTestPayment}
                disabled={processing}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Complete Test Payment'
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigate('/pricing')}
            >
              Back to Pricing
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}