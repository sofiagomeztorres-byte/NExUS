'use client'

import { useId } from 'react'

interface NexusSymbolProps {
  size?: number
  className?: string
  glowing?: boolean
}

export function NexusSymbol({ size = 48, className = '', glowing = false }: NexusSymbolProps) {
  const reactId = useId()
  const id = `ns-${reactId.replace(/:/g, '')}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glowing ? {
        filter: 'drop-shadow(0 0 10px rgba(226,182,89,0.45)) drop-shadow(0 0 20px rgba(226,182,89,0.2))',
      } : undefined}
    >
      <defs>
        {/* Gold sphere — multiple layers for realistic convex look */}
        <radialGradient id={`${id}-gold`} cx="32%" cy="26%" r="68%">
          <stop offset="0%"   stopColor="#FFFBE0" />
          <stop offset="18%"  stopColor="#F5D97A" />
          <stop offset="45%"  stopColor="#E2B659" />
          <stop offset="72%"  stopColor="#C49430" />
          <stop offset="90%"  stopColor="#9B6E1A" />
          <stop offset="100%" stopColor="#6B4509" />
        </radialGradient>

        {/* Inner glow around sphere */}
        <radialGradient id={`${id}-sphere-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,235,130,0.35)" />
          <stop offset="100%" stopColor="rgba(226,182,89,0)" />
        </radialGradient>

        {/* Body purple gradient */}
        <linearGradient id={`${id}-body`} x1="15%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%"   stopColor="#4A2090" />
          <stop offset="50%"  stopColor="#2D1460" />
          <stop offset="100%" stopColor="#1A0A3E" />
        </linearGradient>

        {/* Body highlight */}
        <linearGradient id={`${id}-body-hi`} x1="20%" y1="0%" x2="80%" y2="60%">
          <stop offset="0%"   stopColor="rgba(180,130,255,0.35)" />
          <stop offset="100%" stopColor="rgba(180,130,255,0)" />
        </linearGradient>

        {/* Lavender node — 3D pearl */}
        <radialGradient id={`${id}-lav`} cx="30%" cy="25%" r="70%">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="20%"  stopColor="#EDE4FF" />
          <stop offset="55%"  stopColor="#D6BCFA" />
          <stop offset="80%"  stopColor="#B49AD8" />
          <stop offset="100%" stopColor="#8A6CB0" />
        </radialGradient>

        {/* Lavender node rim */}
        <radialGradient id={`${id}-lav-rim`} cx="50%" cy="50%" r="50%">
          <stop offset="70%"  stopColor="rgba(180,150,255,0)" />
          <stop offset="100%" stopColor="rgba(140,100,220,0.4)" />
        </radialGradient>

        {/* Arc gradient — gold with fade */}
        <linearGradient id={`${id}-arc1`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#E2B659" stopOpacity="0.5" />
          <stop offset="50%"  stopColor="#E2B659" stopOpacity="1" />
          <stop offset="100%" stopColor="#F5D97A" stopOpacity="0.8" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`${id}-node-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Center glow */}
        <filter id={`${id}-center-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── AMBIENT GLOW BEHIND EVERYTHING ── */}
      {glowing && (
        <circle cx="100" cy="100" r="55" fill="rgba(226,182,89,0.06)" />
      )}

      {/* ── ARMS: 5 bifurcating arcs, 10 lavender nodes ── */}

      {/* ARM 1 — top (0°) */}
      <path d="M100,72 C97,62 98,52 100,44" stroke={`url(#${id}-arc1)`} strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="100" y1="44" x2="72.6"  y2="24.8" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
      <line x1="100" y1="44" x2="127.4" y2="24.8" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />

      {/* ARM 2 — upper-right (72°) */}
      <path d="M126.6,91.3 C135,84 145,80 153.3,82.7" stroke={`url(#${id}-arc1)`} strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="153.3" y1="82.7" x2="163.0" y2="50.7"  stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
      <line x1="153.3" y1="82.7" x2="179.9" y2="102.8" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />

      {/* ARM 3 — lower-right (144°) */}
      <path d="M116.5,122.7 C124,132 130,140 132.9,145.3" stroke={`url(#${id}-arc1)`} strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="132.9" y1="145.3" x2="166.3" y2="144.7" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
      <line x1="132.9" y1="145.3" x2="122.1" y2="176.9" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />

      {/* ARM 4 — lower-left (216°) */}
      <path d="M83.5,122.7 C76,132 70,140 67.1,145.3" stroke={`url(#${id}-arc1)`} strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="67.1" y1="145.3" x2="33.7" y2="144.7" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
      <line x1="67.1" y1="145.3" x2="77.9" y2="176.9" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />

      {/* ARM 5 — upper-left (288°) */}
      <path d="M73.4,91.3 C65,84 55,80 46.7,82.7" stroke={`url(#${id}-arc1)`} strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="46.7" y1="82.7" x2="20.1" y2="102.8" stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />
      <line x1="46.7" y1="82.7" x2="37.0" y2="50.7"  stroke="#E2B659" strokeWidth="3.2" strokeLinecap="round" opacity="0.9" />

      {/* ── LAVENDER NODES (10) — with 3D pearl look ── */}
      {[
        [72.6, 24.8], [127.4, 24.8],
        [163.0, 50.7], [179.9, 102.8],
        [166.3, 144.7], [122.1, 176.9],
        [77.9, 176.9], [33.7, 144.7],
        [20.1, 102.8], [37.0, 50.7],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {/* Rim shadow */}
          <circle cx={cx} cy={cy} r="12.5" fill={`url(#${id}-lav-rim)`} />
          {/* Pearl body */}
          <circle cx={cx} cy={cy} r="11" fill={`url(#${id}-lav)`} filter={`url(#${id}-node-glow)`} />
          {/* Specular highlight */}
          <ellipse
            cx={cx - 3} cy={cy - 3.5}
            rx="3" ry="2.5"
            fill="rgba(255,255,255,0.55)"
            style={{ filter: 'blur(0.5px)' }}
          />
        </g>
      ))}

      {/* ── STAR BODY ── */}
      {/* Body shadow */}
      <polygon
        points="100,72 108.2,88.7 126.6,91.3 113.3,104.3 116.5,122.7 100,114 83.5,122.7 86.7,104.3 73.4,91.3 91.8,88.7"
        fill="rgba(0,0,0,0.3)"
        transform="translate(2,3)"
      />
      {/* Main body */}
      <polygon
        points="100,72 108.2,88.7 126.6,91.3 113.3,104.3 116.5,122.7 100,114 83.5,122.7 86.7,104.3 73.4,91.3 91.8,88.7"
        fill={`url(#${id}-body)`}
        stroke="rgba(160,100,255,0.2)"
        strokeWidth="0.75"
      />
      {/* Body highlight overlay */}
      <polygon
        points="100,72 108.2,88.7 126.6,91.3 113.3,104.3 116.5,122.7 100,114 83.5,122.7 86.7,104.3 73.4,91.3 91.8,88.7"
        fill={`url(#${id}-body-hi)`}
      />

      {/* ── GOLDEN NUCLEUS ── */}
      {/* Outer glow halo */}
      <circle cx="100" cy="100" r="32" fill={`url(#${id}-sphere-glow)`} />
      {/* Second glow ring */}
      <circle cx="100" cy="100" r="27" fill="rgba(255,235,130,0.12)" />
      {/* Sphere body */}
      <circle cx="100" cy="100" r="23" fill={`url(#${id}-gold)`} filter={`url(#${id}-center-glow)`} />
      {/* Sphere edge rim (dark) */}
      <circle cx="100" cy="100" r="23" fill="none" stroke="rgba(100,50,0,0.3)" strokeWidth="0.75" />
      {/* Primary specular highlight */}
      <ellipse cx="92" cy="90" rx="7" ry="5.5" fill="rgba(255,255,255,0.5)" style={{ filter: 'blur(1.5px)' }} />
      {/* Secondary micro highlight */}
      <ellipse cx="108" cy="107" rx="3" ry="2" fill="rgba(255,245,180,0.25)" style={{ filter: 'blur(1px)' }} />
    </svg>
  )
}
