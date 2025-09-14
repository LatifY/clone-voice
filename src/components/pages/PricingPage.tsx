import React from 'react'
import { Navbar, Pricing, Footer } from '../sections'

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navbar />
      <main className="">
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}