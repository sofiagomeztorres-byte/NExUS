'use client'

import React from 'react'

export function PremiumBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 430 932"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.15 }}
    >
      {/* Isometric Wireframe Grid */}
      <defs>
        <linearGradient id="wireframeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EADCF9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2A1A4A" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Left Side Isometric Structure */}
      <g className="wireframe-left">
        {/* Main Box */}
        <line x1="30" y1="200" x2="80" y2="170" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.4" />
        <line x1="80" y1="170" x2="130" y2="200" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.4" />
        <line x1="130" y1="200" x2="80" y2="230" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.4" />
        <line x1="80" y1="230" x2="30" y2="200" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.4" />

        {/* Wireframe UI Cards */}
        <rect x="20" y="280" width="80" height="60" fill="none" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="295" x2="100" y2="295" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.2" />
        <line x1="20" y1="310" x2="100" y2="310" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.2" />

        {/* Stacked Cards */}
        <rect x="25" y="370" width="70" height="50" fill="none" stroke="#EADCF9" strokeWidth="0.5" opacity="0.3" />
        <rect x="30" y="375" width="70" height="50" fill="none" stroke="#EADCF9" strokeWidth="0.5" opacity="0.2" />
      </g>

      {/* Right Side Isometric Structure */}
      <g className="wireframe-right">
        {/* Dashboard Mockup */}
        <rect x="320" y="200" width="90" height="100" fill="none" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.3" />
        <line x1="320" y1="220" x2="410" y2="220" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.2" />
        <circle cx="350" cy="260" r="8" fill="none" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.2" />
        <circle cx="380" cy="260" r="8" fill="none" stroke="#2A1A4A" strokeWidth="0.5" opacity="0.2" />

        {/* Chart Lines */}
        <polyline points="330,280 345,270 360,280 375,265 390,275" fill="none" stroke="#EADCF9" strokeWidth="0.5" opacity="0.3" />
      </g>

      {/* Bottom Section Wireframes */}
      <g className="wireframe-bottom" opacity="0.2">
        <rect x="40" y="650" width="60" height="40" fill="none" stroke="#2A1A4A" strokeWidth="0.5" />
        <rect x="130" y="670" width="60" height="35" fill="none" stroke="#2A1A4A" strokeWidth="0.5" />
        <rect x="220" y="660" width="60" height="40" fill="none" stroke="#2A1A4A" strokeWidth="0.5" />
        <rect x="310" y="680" width="60" height="35" fill="none" stroke="#2A1A4A" strokeWidth="0.5" />
      </g>

      {/* Decorative Connection Lines */}
      <g className="connection-lines" stroke="url(#wireframeGradient)" strokeWidth="0.5" opacity="0.15">
        <line x1="80" y1="170" x2="215" y2="400" />
        <line x1="365" y1="250" x2="215" y2="400" />
        <line x1="80" y1="230" x2="215" y2="400" />
      </g>
    </svg>
  )
}
