'use client'

import { useEffect, useState } from 'react'
import { NExUSLogo } from '@/components/NExUSLogo'
import { NexusSymbol } from '@/components/NexusSymbol'

interface WelcomeScreenProps {
  onLogin: () => void
  onRegister: () => void
}

export function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)

  // Sequence the appearance of elements
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200)   // logo appears
    const t2 = setTimeout(() => setPhase(2), 1400)  // tagline appears
    const t3 = setTimeout(() => setPhase(3), 2200)  // buttons appear
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-between overflow-hidden"
      style={{ background: '#08080E', maxWidth: 430, margin: '0 auto' }}
    >
      {/* Background — ambient gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(226,182,89,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Floating particles */}
      {phase >= 1 && (
        <>
          <div className="absolute" style={{ top: '35%', left: '18%', width: 3, height: 3, borderRadius: '50%', background: 'rgba(226,182,89,0.5)', animation: 'particleDrift 6s ease-out infinite' }} />
          <div className="absolute" style={{ top: '45%', right: '22%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(214,188,250,0.4)', animation: 'particleDrift2 8s ease-out 1s infinite' }} />
          <div className="absolute" style={{ top: '55%', left: '30%', width: 2, height: 2, borderRadius: '50%', background: 'rgba(226,182,89,0.3)', animation: 'particleDrift 10s ease-out 2s infinite' }} />
          <div className="absolute" style={{ top: '40%', right: '35%', width: 1.5, height: 1.5, borderRadius: '50%', background: 'rgba(214,188,250,0.5)', animation: 'particleDrift2 7s ease-out 3s infinite' }} />
        </>
      )}

      {/* ── TOP SPACER ── */}
      <div className="flex-1" />

      {/* ── CENTER CONTENT ── */}
      <div className="flex flex-col items-center px-8 w-full" style={{ gap: 0 }}>

        {/* Logo Symbol */}
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.85)',
            transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            marginBottom: 16,
          }}
        >
          {phase >= 1 && (
            <NexusSymbol
              size={100}
              glowing
            />
          )}
        </div>

        {/* Logo Wordmark */}
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.6s ease 0.4s',
            marginBottom: 36,
          }}
        >
          {phase >= 1 && <NExUSLogo size="lg" animate theme="dark" />}
        </div>

        {/* Divider */}
        <div
          style={{
            width: phase >= 2 ? 40 : 0,
            height: 1,
            background: 'rgba(226,182,89,0.5)',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            marginBottom: 28,
          }}
        />

        {/* Main tagline */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontWeight: 400,
              color: '#F5F3F8',
              lineHeight: 1.3,
              letterSpacing: '0.01em',
            }}
          >
            Organiza todo tu negocio<br />desde un solo lugar.
          </p>
        </div>

        {/* Secondary tagline */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
            textAlign: 'center',
            marginBottom: 56,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: 'rgba(245,243,248,0.45)',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}
          >
            NExUS transforma metas en acciones, marcas en sistemas<br />y caos en claridad.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className="w-full"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {/* Primary: Crear Cuenta */}
          <button
            onClick={onRegister}
            className="btn-gold w-full rounded-[14px] text-[16px]"
            style={{ padding: '16px 0', letterSpacing: '0.02em' }}
          >
            Crear Cuenta
          </button>

          {/* Secondary: Iniciar Sesión */}
          <button
            onClick={onLogin}
            className="btn-ghost-dark w-full rounded-[14px] text-[16px]"
            style={{ padding: '16px 0', letterSpacing: '0.02em' }}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* ── BOTTOM ── */}
      <div className="flex-1" />
      <div
        style={{
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.6s ease 0.3s',
          paddingBottom: 36,
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 11, color: 'rgba(245,243,248,0.15)', letterSpacing: '0.12em' }}>
          CREADO POR SOFIA GÓMEZ
        </p>
      </div>
    </div>
  )
}
