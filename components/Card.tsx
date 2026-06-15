import { ReactNode } from 'react'
import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'glass' | 'plain' | 'gold' | 'lavender'
  onClick?: () => void
}

export function Card({
  children,
  className,
  variant = 'glass',
  onClick,
}: CardProps) {
  // glass + plain use CSS variables so they respond to brand theme
  const variantStyle: React.CSSProperties =
    variant === 'glass' || variant === 'plain'
      ? {
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          color: 'var(--text-primary)',
        }
      : {}

  const variantClass = {
    glass:    'rounded-ios',
    plain:    'rounded-ios',
    gold:     'bg-nexus-gold/10 border border-nexus-gold/30 rounded-ios',
    lavender: 'bg-nexus-lavender/20 border border-nexus-lavender rounded-ios',
  }[variant]

  return (
    <div
      onClick={onClick}
      className={cn('p-4', variantClass, className, onClick && 'cursor-pointer')}
      style={variantStyle}
    >
      {children}
    </div>
  )
}
