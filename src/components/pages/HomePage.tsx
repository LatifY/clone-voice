import React from 'react'
import { Navbar, Hero, Features, Examples, Pricing, Contact, Footer } from '../sections'

export const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Examples />
      <Pricing />
      <Contact />
      <Footer />
    </>
  )
}