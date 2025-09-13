import React, { useState } from 'react'
import { Card, CardBody, Button } from '../ui'

// SVG Icons
const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 3000)
  }

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "How many seconds of audio do I need to clone a voice?",
      answer: "Just 15 seconds of clear audio is enough for our AI to create a high-quality voice clone. For best results, use audio with minimal background noise."
    },
    {
      question: "Can I use cloned voices for commercial purposes?",
      answer: "Yes! All voice clones come with full commercial use rights. You can use generated audio for any business purpose without restrictions."
    },
    {
      question: "How much does voice cloning cost?",
      answer: "Each voice clone costs 5 credits. You get 10 free credits when you sign up, which means 2 free voice clones to start!"
    },
    {
      question: "How long does it take to clone a voice?",
      answer: "Voice cloning is instant! Our AI processes your audio and generates the clone in just a few seconds using our optimized models."
    },
    {
      question: "What audio formats do you support?",
      answer: "We support most common audio formats including MP3, WAV, M4A, and WebM. The system automatically handles format conversion."
    },
    {
      question: "Do credits expire?",
      answer: "No, credits never expire! Buy once and use them whenever you need to clone voices. There are no time limits or restrictions."
    }
  ]

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden border-b-4 border-gray-900">
      {/* Top gradient transition from Pricing */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-950/50 to-transparent pointer-events-none"></div>
      
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Get In Touch
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Questions about AI voice cloning? Need help with your account? 
            We're here to help you get the most out of CloneVoice.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Send us a message</h3>
              <p className="text-gray-300">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <Card variant="glass">
              <CardBody className="p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all text-white placeholder-gray-400"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all text-white placeholder-gray-400"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all text-white"
                      >
                        <option value="" className="bg-gray-900 text-white">Select a topic</option>
                        <option value="technical" className="bg-gray-900 text-white">Technical Support</option>
                        <option value="billing" className="bg-gray-900 text-white">Billing & Credits</option>
                        <option value="feature" className="bg-gray-900 text-white">Feature Request</option>
                        <option value="business" className="bg-gray-900 text-white">Business Inquiry</option>
                        <option value="other" className="bg-gray-900 text-white">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all resize-none text-white placeholder-gray-400"
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 text-lg bg-white text-black hover:bg-gray-100 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckIcon />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                    <p className="text-gray-300">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* FAQ */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} variant="glass">
                    <CardBody className="p-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full text-left p-2 flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl"
                      >
                        <h4 className="text-lg font-semibold text-white font-body">
                          {faq.question}
                        </h4>
                        <div className={`transform transition-transform duration-300 text-gray-400 ${
                          openFAQ === index ? 'rotate-180' : ''
                        }`}>
                          <ChevronDownIcon />
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-2">
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-gray-300 font-body leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-lg text-gray-300 mb-6">
              Join our Discord community and chat with other creators using AI voice cloning
            </p>
            <Button 
              size="lg"
              variant="primary"
              className="px-8 py-4 text-lg font-semibold"
            >
              Join Discord Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}