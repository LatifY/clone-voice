import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105 active:scale-95'
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl focus:ring-white/50 rounded-full backdrop-blur-sm',
    secondary: 'bg-gray-800/50 hover:bg-gray-700/60 text-white shadow-lg hover:shadow-xl focus:ring-gray-500/50 rounded-xl backdrop-blur-sm border border-gray-700/50',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white/30 rounded-xl backdrop-blur-sm hover:border-white/40',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10 focus:ring-white/30 rounded-xl backdrop-blur-sm',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl focus:ring-white/30 rounded-xl'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  )
}
