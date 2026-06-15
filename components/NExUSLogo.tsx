'use client'

interface NExUSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
  theme?: 'dark' | 'light'
}

const SIZES = {
  sm: { fontSize: 18, tracking: '0.06em' },
  md: { fontSize: 28, tracking: '0.08em' },
  lg: { fontSize: 44, tracking: '0.1em' },
  xl: { fontSize: 64, tracking: '0.12em' },
}

export function NExUSLogo({ size = 'md', animate = false, theme = 'dark' }: NExUSLogoProps) {
  const { fontSize, tracking } = SIZES[size]
  const baseColor = theme === 'dark' ? '#F5F3F8' : '#2A1A4A'

  return (
    <span
      className="inline-flex items-baseline select-none"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 600,
        fontSize,
        letterSpacing: tracking,
        lineHeight: 1,
      }}
    >
      {/* N */}
      <span
        className={animate ? 'logo-N' : ''}
        style={{ color: baseColor }}
      >N</span>

      {/* Ex — Liquid Gold */}
      <span
        className={animate ? 'logo-Ex' : ''}
        style={{
          color: '#E2B659',
          textShadow: animate ? undefined : '0 0 10px rgba(226,182,89,0.4)',
          position: 'relative',
        }}
      >Ex</span>

      {/* US */}
      <span
        className={animate ? 'logo-US' : ''}
        style={{ color: baseColor }}
      >US</span>
    </span>
  )
}
