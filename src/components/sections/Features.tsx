import React from 'react'
import { Card, CardBody } from '../ui'

// SVG Icons
const MicIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
)

const AIIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M14.447 3.027a1 1 0 01.527 1.316L11.024 18a1 1 0 11-1.844-.632L13.131 3.711a1 1 0 011.316-.684zM7.071 6.929a1 1 0 010 1.414L4.414 11l2.657 2.657a1 1 0 11-1.414 1.414l-3.364-3.364a1 1 0 010-1.414l3.364-3.364a1 1 0 011.414 0zm9.858 0a1 1 0 011.414 0l3.364 3.364a1 1 0 010 1.414l-3.364 3.364a1 1 0 11-1.414-1.414L19.586 11l-2.657-2.657a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

const CreditIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const LightningIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const GiftIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
)

export const Features: React.FC = () => {
  const features = [
    {
      icon: <MicIcon />,
      title: "15-Second AI Cloning",
      description: "Clone any voice with just 15 seconds of audio. Our advanced AI creates perfect voice replicas using cutting-edge neural networks.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <AIIcon />,
      title: "Advanced AI Technology",
      description: "State-of-the-art neural networks ensure natural-sounding speech with perfect intonation and emotion.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <CreditIcon />,
      title: "Pay-Per-Use Credits",
      description: "Fair pricing model - pay only for what you use. 5 credits per voice clone. Buy more credits for better rates!",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <LightningIcon />,
      title: "Lightning Fast AI",
      description: "Generate voice clips in seconds using our optimized AI models. Real-time processing for instant results.",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: <GiftIcon />,
      title: "Free to Start",
      description: "Get 10 free credits on signup - that's 2 voice clones to test our AI technology with no commitment.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <ShieldIcon />,
      title: "Commercial License Included",
      description: "All voice clones come with full commercial use rights. Use generated audio for any business purpose without restrictions.",
      color: "from-green-500 to-green-600"
    }
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden border-b-4 border-gray-900">
      {/* Top gradient transition from Hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
      
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              AI-Powered Features for
              <span className="block mt-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Perfect Voice Cloning
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience cutting-edge AI voice synthesis with a simple credit system. 
            No subscriptions, just pay for what you use.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="group">
              <CardBody className="p-8 text-center space-y-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold transition-transform duration-300 group-hover:scale-110">50K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold transition-transform duration-300 group-hover:scale-110">1M+</div>
              <div className="text-gray-300">Voice Clones Created</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold transition-transform duration-300 group-hover:scale-110">99.8%</div>
              <div className="text-gray-300">Uptime Guarantee</div>
            </div>
            <div className="space-y-2 group">
              <div className="text-3xl md:text-4xl font-bold transition-transform duration-300 group-hover:scale-110">24/7</div>
              <div className="text-gray-300">Support Available</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient transition to Examples */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-900/50 pointer-events-none"></div>
    </section>
  )
}
