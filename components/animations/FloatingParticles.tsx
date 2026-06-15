'use client'

import React from 'react'

export function FloatingParticles() {
  const particles = [
    { id: 1, x: 80, y: 250, delay: 0, duration: 4 },
    { id: 2, x: 350, y: 320, delay: 0.5, duration: 5 },
    { id: 3, x: 120, y: 500, delay: 1, duration: 4.5 },
    { id: 4, x: 320, y: 450, delay: 0.2, duration: 5.5 },
    { id: 5, x: 200, y: 300, delay: 1.5, duration: 4.2 },
    { id: 6, x: 380, y: 550, delay: 0.8, duration: 5 },
    { id: 7, x: 60, y: 400, delay: 1.2, duration: 4.8 },
    { id: 8, x: 340, y: 280, delay: 0.3, duration: 5.3 },
    { id: 9, x: 150, y: 350, delay: 1.8, duration: 4.5 },
    { id: 10, x: 300, y: 380, delay: 0.6, duration: 5.1 },
  ]

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 430 932"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Star/spark particle */}
        <g id="spark-particle">
          <circle r="1" fill="#E2B659" opacity="0.8" />
          <circle r="1.5" fill="#E2B659" opacity="0.4" />
        </g>

        {/* Glow effect for particles */}
        <filter id="particle-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Floating light particles */}
      {particles.map((particle) => (
        <g key={particle.id} className="floating-particle">
          {/* Small star particle */}
          <circle
            cx={particle.x}
            cy={particle.y}
            r="2"
            fill="#E2B659"
            opacity="0.6"
            filter="url(#particle-glow)"
            style={{
              animation: `floatUp ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />

          {/* Larger glow ring */}
          <circle
            cx={particle.x}
            cy={particle.y}
            r="4"
            fill="none"
            stroke="#E2B659"
            strokeWidth="0.5"
            opacity="0.3"
            style={{
              animation: `expandRing ${particle.duration}s ease-out ${particle.delay}s infinite`,
            }}
          />
        </g>
      ))}

      {/* Additional subtle light streaks */}
      <g className="light-streaks" opacity="0.15">
        <line
          x1="100"
          y1="200"
          x2="250"
          y2="400"
          stroke="#EADCF9"
          strokeWidth="1"
          style={{
            animation: 'dash 3s ease-in-out 0.5s infinite',
          }}
        />
        <line
          x1="350"
          y1="300"
          x2="200"
          y2="450"
          stroke="#E2B659"
          strokeWidth="1"
          style={{
            animation: 'dash 3.5s ease-in-out 1s infinite',
          }}
        />
        <line
          x1="150"
          y1="550"
          x2="280"
          y2="350"
          stroke="#EADCF9"
          strokeWidth="1"
          style={{
            animation: 'dash 3.2s ease-in-out 0.3s infinite',
          }}
        />
      </g>
    </svg>
  )
}
