import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ai' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-sans font-bold rounded-ios transition-all duration-200 active:scale-95'

  const variantStyles = {
    primary: 'bg-nexus-lavender text-nexus-amethyst hover:bg-nexus-lavender/90',
    secondary: 'bg-nexus-ivory text-nexus-amethyst border border-nexus-platinum hover:bg-nexus-platinum/30',
    ai: 'bg-transparent border border-nexus-gold text-nexus-gold hover:bg-nexus-gold/5',
    ghost: 'bg-transparent text-nexus-amethyst hover:bg-nexus-ivory',
  }

  const sizeStyles = {
    sm: 'px-3 py-2 text-caption',
    md: 'px-4 py-3 text-body',
    lg: 'px-6 py-4 text-h2 w-full',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}
