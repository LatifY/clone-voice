import React from 'react'
import logo from "../../assets/img/logo.png";

// SVG Icons
const AIIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
  </svg>
)

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-black via-gray-950 to-black border-t border-white/10 relative overflow-hidden">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white">
                Clone Voice
              </span>
              <span className="text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white px-2 py-1 rounded-full font-medium">
                AI
              </span>
            </div>
            <p className="text-gray-300 max-w-md mx-auto">
              Simple AI voice cloning that just works. 
              Built for creators, by creators.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {/* Social */}
          <div className="flex justify-center gap-4">
            <a
              href="https://twitter.com/clonevoiceapp"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl flex items-center justify-center transition-all duration-300 group"
              aria-label="Twitter"
            >
              <TwitterIcon />
            </a>
            <a
              href="mailto:hello@clonevoice.app"
              className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 rounded-xl flex items-center justify-center transition-all duration-300 group"
              aria-label="Email"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              ❤️
              <span>and lots of</span>
              ☕
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-gray-500">
              <span>© 2025 clonevoice.app</span>
              <span className="hidden sm:block">•</span>
              <span>🚀 Built for the AI generation</span>
              <span className="hidden sm:block">•</span>
              <span>🔐 Your data stays private</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
