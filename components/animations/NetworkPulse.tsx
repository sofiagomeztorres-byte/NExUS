'use client'

import { useEffect, useRef } from 'react'

interface NetworkPulseProps {
  parallaxRef: React.RefObject<HTMLDivElement>
}

export function NetworkPulse({ parallaxRef }: NetworkPulseProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 430 932"
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 2 }}
    >
      <defs>
        {/* Gold pulse gradient */}
        <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(226,182,89,0)" />
          <stop offset="40%" stopColor="rgba(226,182,89,0)" />
          <stop offset="50%" stopColor="rgba(226,182,89,0.9)" />
          <stop offset="60%" stopColor="rgba(255,220,100,1)" />
          <stop offset="70%" stopColor="rgba(226,182,89,0)" />
          <stop offset="100%" stopColor="rgba(226,182,89,0)" />
        </linearGradient>

        {/* Glow filter for pulse */}
        <filter id="pulseGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ─── UPPER GLOW — fills the gap between input and network ─── */}
      {/* Very faint top ring that bleeds into the lavender bg */}
      <ellipse cx="215" cy="430" rx="190" ry="50"
        fill="none" stroke="rgba(226,182,89,0.08)" strokeWidth="1" />
      <ellipse cx="215" cy="430" rx="190" ry="50"
        fill="none" stroke="rgba(226,182,89,0.5)" strokeWidth="1"
        strokeLinecap="round" filter="url(#pulseGlow)"
        style={{ strokeDasharray: '25 1170', animation: 'orbitPulse1 6s linear 0.5s infinite' }}
      />
      {/* Soft radial glow from center — creates depth in gap area */}
      <ellipse cx="215" cy="490" rx="70" ry="25"
        fill="rgba(226,182,89,0.04)" />

      {/* ─── ORBITAL ELLIPSES — main rings (repositioned to match image) ─── */}
      {/* Outer orbit */}
      <ellipse cx="215" cy="530" rx="155" ry="100"
        fill="none" stroke="rgba(226,182,89,0.15)" strokeWidth="1.5" />
      <ellipse cx="215" cy="530" rx="155" ry="100"
        fill="none" stroke="rgba(226,182,89,0.85)" strokeWidth="2"
        strokeLinecap="round" filter="url(#pulseGlow)"
        style={{ strokeDasharray: '30 970', animation: 'orbitPulse1 4s linear infinite' }}
      />

      {/* Inner orbit */}
      <ellipse cx="215" cy="530" rx="95" ry="60"
        fill="none" stroke="rgba(226,182,89,0.10)" strokeWidth="1" />
      <ellipse cx="215" cy="530" rx="95" ry="60"
        fill="none" stroke="rgba(255,215,80,0.8)" strokeWidth="1.5"
        strokeLinecap="round" filter="url(#pulseGlow)"
        style={{ strokeDasharray: '20 600', animation: 'orbitPulse2 3s linear 1.5s infinite' }}
      />

      {/* ─── RADIAL LINES from center ─── */}
      <line x1="215" y1="485" x2="215" y2="390" stroke="rgba(226,182,89,0.12)" strokeWidth="1" />
      <line x1="215" y1="485" x2="215" y2="390"
        stroke="rgba(226,182,89,0.9)" strokeWidth="1.5" strokeLinecap="round"
        filter="url(#pulseGlow)"
        style={{ strokeDasharray: '12 95', animation: 'linePulse1 2.5s linear 0.2s infinite' }}
      />
      <line x1="252" y1="525" x2="370" y2="510" stroke="rgba(226,182,89,0.12)" strokeWidth="1" />
      <line x1="252" y1="525" x2="370" y2="510"
        stroke="rgba(226,182,89,0.9)" strokeWidth="1.5" strokeLinecap="round"
        filter="url(#pulseGlow)"
        style={{ strokeDasharray: '12 120', animation: 'linePulse2 2.8s linear 0.8s infinite' }}
      />
      <line x1="215" y1="575" x2="250" y2="650" stroke="rgba(226,182,89,0.12)" strokeWidth="1" />
      <line x1="215" y1="575" x2="250" y2="650"
        stroke="rgba(226,182,89,0.9)" strokeWidth="1.5" strokeLinecap="round"
        filter="url(#pulseGlow)"
        style={{ strokeDasharray: '10 80', animation: 'linePulse3 2.2s linear 1.2s infinite' }}
      />
      <line x1="178" y1="525" x2="60" y2="530" stroke="rgba(226,182,89,0.12)" strokeWidth="1" />
      <line x1="178" y1="525" x2="60" y2="530"
        stroke="rgba(226,182,89,0.9)" strokeWidth="1.5" strokeLinecap="round"
        filter="url(#pulseGlow)"
        style={{ strokeDasharray: '12 120', animation: 'linePulse4 2.6s linear 0.4s infinite' }}
      />
      <line x1="190" y1="493" x2="120" y2="415" stroke="rgba(226,182,89,0.10)" strokeWidth="1" />
      <line x1="190" y1="493" x2="120" y2="415"
        stroke="rgba(226,182,89,0.85)" strokeWidth="1.5" strokeLinecap="round"
        filter="url(#pulseGlow)"
        style={{ strokeDasharray: '10 100', animation: 'linePulse1 3s linear 1.8s infinite' }}
      />

      {/* ─── SPARK NODES ─── */}
      {[
        { cx: 215, cy: 390, d: '0s'   },
        { cx: 370, cy: 510, d: '0.4s' },
        { cx: 250, cy: 650, d: '0.8s' },
        { cx: 60,  cy: 530, d: '1.2s' },
        { cx: 120, cy: 415, d: '1.6s' },
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.cx} cy={node.cy} r="3" fill="rgba(226,182,89,0.5)"
            style={{ animation: `sparkPulse 2s ease-in-out ${node.d} infinite` }} />
          <circle cx={node.cx} cy={node.cy} r="6" fill="none"
            stroke="rgba(226,182,89,0.3)" strokeWidth="1"
            style={{ animation: `sparkRing 2s ease-out ${node.d} infinite` }} />
        </g>
      ))}
    </svg>
  )
}
