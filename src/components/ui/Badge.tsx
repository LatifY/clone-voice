import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full backdrop-blur-sm transition-all duration-300'
  
  const variantClasses = {
    primary: 'bg-white/20 text-white border border-white/30',
    secondary: 'bg-gray-800/50 text-gray-200 border border-gray-600/50',
    success: 'bg-green-500/20 text-green-200 border border-green-400/30',
    warning: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
    error: 'bg-red-500/20 text-red-200 border border-red-400/30',
    glass: 'bg-white/10 text-white border border-white/20 backdrop-blur-md'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}
