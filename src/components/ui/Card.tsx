import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  bordered?: boolean
  variant?: 'default' | 'glass' | 'dark'
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  bordered = true,
  variant = 'glass'
}) => {
  const baseClasses = 'rounded-2xl shadow-lg transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-white border border-gray-100',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl',
    dark: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800'
  }
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-[1.02] hover:bg-white/10 hover:border-white/20' : ''
  const borderClasses = bordered ? '' : 'border-0'
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${borderClasses} ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 pb-4 ${className}`}>
      {children}
    </div>
  )
}

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 pt-2 ${className}`}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`p-6 pt-2 border-t border-white/10 ${className}`}>
      {children}
    </div>
  )
}
