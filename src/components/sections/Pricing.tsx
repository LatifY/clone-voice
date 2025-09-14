import React from 'react'
import { Card, CardBody, Button, Badge } from '../ui'

// SVG Icons
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const CreditIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979c.284.473.602 1.251.602 2.021 0 .967-.509 1.72-1.866 1.72S8.134 9.967 8.134 9c0-.77.318-1.548.602-2.021zM7.206 14c-.513 0-.862-.325-.862-.725 0-.617.492-1.754 1.146-2.463C7.776 10.52 8.326 10.5 10 10.5c1.674 0 2.224.02 2.51.312.654.709 1.146 1.846 1.146 2.463 0 .4-.349.725-.862.725H7.206z" clipRule="evenodd" />
  </svg>
)

const AIIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

export const Pricing: React.FC = () => {
  const creditPackages = [
    {
      name: "Starter",
      credits: 25,
      price: "5",
      description: "Perfect for trying our AI voice cloning",
      popular: false,
      pricePerClone: 1.00,
      features: [
        "25 AI credits",
        "5 voice clones",
        "High-quality audio output",
        "Commercial use license",
        "Email support"
      ]
    },
    {
      name: "Standard",
      credits: 100,
      price: "18",
      description: "Best value for regular voice cloning",
      popular: false,
      pricePerClone: 0.90,
      features: [
        "100 AI credits",
        "20 voice clones",
        "High-quality audio output", 
        "Commercial use license",
        "Email support"
      ]
    },
    {
      name: "Popular",
      credits: 250,
      price: "40",
      description: "Most popular choice for creators",
      popular: true,
      pricePerClone: 0.80,
      features: [
        "250 AI credits",
        "50 voice clones)",
        "High-quality audio output", 
        "Commercial use license",
        "Email support"
      ]
    },
    {
      name: "Professional",
      credits: 500,
      price: "70",
      description: "Maximum savings for heavy usage",
      popular: false,
      pricePerClone: 0.70,
      features: [
        "500 AI credits",
        "100 voice clones",
        "High-quality audio output", 
        "Commercial use license",
        "Email support"
      ]
    }
  ]

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-gray-950 relative overflow-hidden border-b-4 border-gray-900">
      {/* Top gradient transition from Examples */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
      
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/6 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/6 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              AI Credit
              <span className="block mt-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Packages
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Buy credits once, use anytime. Each voice clone costs 5 credits. 
            <br />All packages include high-quality audio and commercial use license!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {creditPackages.map((pack, index) => (
            <Card
              key={index}
              className={`relative ${
                pack.popular
                  ? 'ring-2 ring-white/30 shadow-2xl bg-white/10'
                  : 'hover:bg-white/5'
              }`}
              hover={!pack.popular}
              variant="glass"
            >
              {pack.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <Badge variant="primary" size="md" className="font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardBody className="pt-6">
                <div className="text-center space-y-6">
                  {/* Pack Header */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">{pack.name}</h3>
                    <p className="text-gray-300 h-10">{pack.description}</p>
                  </div>

                  {/* Price */}
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-white">${pack.price}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-2 px-4">
                      <CreditIcon />
                      <span className="text-lg font-semibold text-white font-mono">{pack.credits} Credits</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-400">≈ {Math.floor(pack.credits / 5)} voice clones</p>
                      <p className="text-xs text-green-400 font-medium">${pack.pricePerClone.toFixed(2)} per voice clone</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 text-left">
                    {pack.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckIcon />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    variant={pack.popular ? "primary" : "glass"}
                    size="lg"
                    className="w-full"
                    onClick={() => console.log(`Selected pack: ${pack.name}`)}
                  >
                    Buy {pack.credits} Credits
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Free Credits Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
                <AIIcon />
              </div>
              <h3 className="text-2xl font-bold">Welcome Bonus!</h3>
            </div>
            <p className="text-xl mb-4">Get 10 free AI credits when you create your account</p>
            <p className="text-lg text-gray-300">That's 5 voice clones to get you started - completely free!</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-gray-300">
            Credits never expire and can be used for any voice cloning operation.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckIcon />
              <span>Credits never expire</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckIcon />
              <span>Instant credit delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient transition to Contact */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-950/50 pointer-events-none"></div>
    </section>
  )
}
