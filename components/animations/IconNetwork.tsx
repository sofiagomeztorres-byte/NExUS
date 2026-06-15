'use client'

import React from 'react'

interface IconNodeProps {
  id: string
  icon: React.ReactNode
  angle: number
  distance: number
  delay: number
  color: string
  glowColor: string
}

const IconNode: React.FC<IconNodeProps> = ({ id, icon, angle, distance, delay, color, glowColor }) => {
  const rad = (angle * Math.PI) / 180
  const x = 215 + distance * Math.cos(rad)
  const y = 400 + distance * Math.sin(rad)

  return (
    <g
      key={id}
      className="icon-node"
      style={{
        animation: `orbitIn 1.2s ease-out ${delay}s both`,
      }}
    >
      {/* Glow Circle */}
      <circle
        cx={x}
        cy={y}
        r="32"
        fill={glowColor}
        opacity="0.3"
        className="glow-circle"
        style={{
          filter: `drop-shadow(0 0 12px ${color})`,
          animation: `pulse 2s ease-in-out ${delay}s infinite`,
        }}
      />

      {/* Icon Background Circle */}
      <circle
        cx={x}
        cy={y}
        r="28"
        fill={color}
        opacity="0.95"
        style={{
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Border Ring */}
      <circle
        cx={x}
        cy={y}
        r="28"
        fill="none"
        stroke={glowColor}
        strokeWidth="1.5"
        opacity="0.6"
        className="icon-ring"
        style={{
          animation: `spinRing 3s linear ${delay}s infinite`,
        }}
      />

      {/* Icon SVG Content */}
      <g
        style={{
          transform: `translate(${x}px, ${y}px)`,
          fontSize: '24px',
        }}
      >
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          className="icon-emoji"
        >
          {icon}
        </text>
      </g>
    </g>
  )
}

export function IconNetwork() {
  // 12 iconos en círculo alrededor del centro
  const icons: Omit<IconNodeProps, 'delay'>[] = [
    { id: '1', icon: '✓', angle: 0, distance: 90, color: '#E2B659', glowColor: '#FFD700' },
    { id: '2', icon: '🎯', angle: 30, distance: 90, color: '#EADCF9', glowColor: '#F0E6FF' },
    { id: '3', icon: '📊', angle: 60, distance: 90, color: '#C9A3FF', glowColor: '#E6D9FF' },
    { id: '4', icon: '⚙️', angle: 90, distance: 90, color: '#9D88D4', glowColor: '#B5A3E0' },
    { id: '5', icon: '🔍', angle: 120, distance: 90, color: '#7B6FBE', glowColor: '#9E96D4' },
    { id: '6', icon: '💡', angle: 150, distance: 90, color: '#E2B659', glowColor: '#FFD700' },
    { id: '7', icon: '📈', angle: 180, distance: 90, color: '#EADCF9', glowColor: '#F0E6FF' },
    { id: '8', icon: '🚀', angle: 210, distance: 90, color: '#C9A3FF', glowColor: '#E6D9FF' },
    { id: '9', icon: '🔄', angle: 240, distance: 90, color: '#9D88D4', glowColor: '#B5A3E0' },
    { id: '10', icon: '📱', angle: 270, distance: 90, color: '#7B6FBE', glowColor: '#9E96D4' },
    { id: '11', icon: '🎨', angle: 300, distance: 90, color: '#E2B659', glowColor: '#FFD700' },
    { id: '12', icon: '🌟', angle: 330, distance: 90, color: '#EADCF9', glowColor: '#F0E6FF' },
  ]

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 430 932"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradients for connection lines */}
        <linearGradient id="connectionGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2B659" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EADCF9" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="connectionGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EADCF9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C9A3FF" stopOpacity="0.3" />
        </linearGradient>

        {/* Glow filters */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Central core gradient */}
        <radialGradient id="coreGradient">
          <stop offset="0%" stopColor="#E2B659" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#EADCF9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2A1A4A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Core Light */}
      <circle
        cx="215"
        cy="400"
        r="120"
        fill="url(#coreGradient)"
        className="core-light"
        style={{
          animation: 'coreGlow 3s ease-in-out infinite',
        }}
      />

      {/* Connection Lines (animadas) */}
      <g className="connection-network" opacity="0.6">
        {/* Center to all icons - alternating pattern */}
        <g className="lines-group-1">
          <line x1="215" y1="400" x2="305" y2="310" stroke="url(#connectionGrad1)" strokeWidth="2" />
          <line x1="215" y1="400" x2="267" y2="253" stroke="url(#connectionGrad2)" strokeWidth="2" />
          <line x1="215" y1="400" x2="163" y2="253" stroke="url(#connectionGrad1)" strokeWidth="2" />
          <line x1="215" y1="400" x2="125" y2="310" stroke="url(#connectionGrad2)" strokeWidth="2" />
        </g>

        {/* Cross connections between opposite icons */}
        <g className="lines-group-2" opacity="0.4">
          <line x1="305" y1="310" x2="125" y2="490" stroke="url(#connectionGrad1)" strokeWidth="1.5" />
          <line x1="267" y1="253" x2="163" y2="547" stroke="url(#connectionGrad2)" strokeWidth="1.5" />
          <line x1="163" y1="253" x2="267" y2="547" stroke="url(#connectionGrad1)" strokeWidth="1.5" />
          <line x1="125" y1="310" x2="305" y2="490" stroke="url(#connectionGrad2)" strokeWidth="1.5" />
        </g>
      </g>

      {/* Icon Nodes */}
      {icons.map((iconData, index) => (
        <IconNode
          key={iconData.id}
          {...iconData}
          delay={0.5 + index * 0.08}
        />
      ))}

      {/* Particle dots along connections */}
      <g className="particle-dots" opacity="0.7">
        {/* Along radial lines */}
        <circle cx="240" cy="345" r="2" fill="#E2B659" className="particle" style={{ animation: 'float 3s ease-in-out 0.2s infinite' }} />
        <circle cx="255" cy="320" r="2" fill="#EADCF9" className="particle" style={{ animation: 'float 3s ease-in-out 0.4s infinite' }} />
        <circle cx="265" cy="350" r="2" fill="#C9A3FF" className="particle" style={{ animation: 'float 3s ease-in-out 0.6s infinite' }} />
        <circle cx="240" cy="455" r="2" fill="#E2B659" className="particle" style={{ animation: 'float 3s ease-in-out 0.8s infinite' }} />
        <circle cx="190" cy="430" r="2" fill="#EADCF9" className="particle" style={{ animation: 'float 3s ease-in-out 1s infinite' }} />
        <circle cx="170" cy="380" r="2" fill="#C9A3FF" className="particle" style={{ animation: 'float 3s ease-in-out 1.2s infinite' }} />
      </g>
    </svg>
  )
}
