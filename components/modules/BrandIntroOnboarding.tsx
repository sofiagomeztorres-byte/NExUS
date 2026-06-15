'use client'

import { useState } from 'react'
import { NExUSLogo } from '@/components/NExUSLogo'
import { NexusSymbol } from '@/components/NexusSymbol'

interface BrandIntroOnboardingProps {
  onComplete: () => void
}

const FEATURES = [
  { icon: '📅', title: 'Organiza tu día',         desc: 'Energía, prioridades y tareas en un solo lugar.' },
  { icon: '📚', title: 'Gestiona recursos',         desc: 'Videos, PDFs, URLs y notas de tu marca.' },
  { icon: '🎯', title: 'Alcanza metas',             desc: 'Define objetivos con hitos medibles.' },
  { icon: '💬', title: 'Administra grupos',          desc: 'Comunidades y semanas de contenido.' },
  { icon: '📊', title: 'Analiza contenido',          desc: 'Métricas reales de tus publicaciones.' },
  { icon: '⚙️', title: 'Marcas independientes',     desc: 'Cada marca con sus propios datos aislados.' },
]

export function BrandIntroOnboarding({ onComplete }: BrandIntroOnboardingProps) {
  const [screen, setScreen] = useState(1)

  const next = () => {
    if (screen < 5) setScreen(s => (s + 1) as 1|2|3|4|5)
    else onComplete()
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: '#08080E', maxWidth: 430, margin: '0 auto' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: screen === 1
          ? 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(226,182,89,0.06) 0%, transparent 70%)'
          : screen === 3
          ? 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(214,188,250,0.06) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 70% 40% at 50% 30%, rgba(226,182,89,0.04) 0%, transparent 70%)',
        transition: 'background 0.8s ease',
      }} />

      {/* Progress dots */}
      <div className="relative z-10 flex justify-center gap-2 pt-14 pb-6">
        {[1,2,3,4,5].map(i => (
          <div
            key={i}
            style={{
              width: i === screen ? 20 : 6,
              height: 4,
              borderRadius: 2,
              background: i === screen ? '#E2B659' : 'rgba(255,255,255,0.12)',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-7 overflow-hidden" key={screen}>

        {/* ── SCREEN 1 ── Welcome to NExUS */}
        {screen === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
            <div style={{ marginBottom: 16 }}>
              <NexusSymbol size={88} glowing />
            </div>
            <div style={{ marginBottom: 28 }}>
              <NExUSLogo size="md" animate theme="dark" />
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 34,
              fontWeight: 400,
              color: '#F5F3F8',
              lineHeight: 1.2,
              marginBottom: 14,
              letterSpacing: '0.01em',
            }}>
              Bienvenida a<br /><span style={{ color: '#F5F3F8' }}>NExUS.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(245,243,248,0.45)', lineHeight: 1.65, maxWidth: 280 }}>
              Tu Centro de Operaciones Multi-Marca.
            </p>
          </div>
        )}

        {/* ── SCREEN 2 ── Qué es NExUS */}
        {screen === 2 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(226,182,89,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              ¿Qué es NExUS?
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 500,
              color: '#F5F3F8',
              lineHeight: 1.3,
              marginBottom: 28,
              letterSpacing: '0.01em',
            }}>
              Un sistema operativo para tus marcas.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'NExUS fue creado para ayudar a emprendedores, creadores y dueños de negocios a organizar todo desde un único lugar.',
                'No es un CRM. No es un calendario. No es un gestor de tareas.',
              ].map((text, i) => (
                <p key={i} style={{
                  fontSize: 15,
                  color: i === 1 ? 'rgba(226,182,89,0.75)' : 'rgba(245,243,248,0.55)',
                  lineHeight: 1.65,
                  fontStyle: i === 1 ? 'italic' : 'normal',
                }}>
                  {text}
                </p>
              ))}
              <p style={{ fontSize: 15, color: 'rgba(245,243,248,0.55)', lineHeight: 1.65 }}>
                Es un <span style={{ color: '#F5F3F8', fontWeight: 600 }}>sistema operativo para tus marcas</span>.
              </p>
            </div>
          </div>
        )}

        {/* ── SCREEN 3 ── Qué puedes hacer */}
        {screen === 3 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(214,188,250,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              ¿Qué puedes hacer?
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontWeight: 500,
              color: '#F5F3F8',
              lineHeight: 1.3,
              marginBottom: 24,
            }}>
              Todo lo que necesitas,<br />en un solo lugar.
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: '14px 14px',
                    borderRadius: 14,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    animation: `cardReveal 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 70}ms both`,
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#F5F3F8', marginBottom: 4, lineHeight: 1.3 }}>{f.title}</p>
                  <p style={{ fontSize: 11, color: 'rgba(245,243,248,0.35)', lineHeight: 1.4 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SCREEN 4 ── Quién creó NExUS */}
        {screen === 4 && (
          <div className="flex-1 flex flex-col justify-center animate-fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(226,182,89,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              ¿Quién creó NExUS?
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 500,
              color: '#F5F3F8',
              lineHeight: 1.3,
              marginBottom: 28,
            }}>
              Nació de una<br />necesidad real.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 15, color: 'rgba(245,243,248,0.55)', lineHeight: 1.7 }}>
                Después de trabajar con múltiples negocios, marcas y proyectos al mismo tiempo, se hizo evidente que las herramientas existentes obligaban a dividir la información entre aplicaciones.
              </p>
              <p style={{ fontSize: 15, color: 'rgba(245,243,248,0.55)', lineHeight: 1.7 }}>
                NExUS fue diseñado para resolver ese problema.{' '}
                <span style={{ color: '#F5F3F8', fontWeight: 500 }}>Todo en un solo lugar.</span>
              </p>
            </div>

            {/* Founder card */}
            <div style={{
              marginTop: 32,
              padding: '16px 18px',
              borderRadius: 14,
              background: 'rgba(226,182,89,0.05)',
              border: '1px solid rgba(226,182,89,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(226,182,89,0.3), rgba(214,188,250,0.2))',
                border: '1px solid rgba(226,182,89,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>✦</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#F5F3F8', marginBottom: 2 }}>Paola</p>
                <p style={{ fontSize: 12, color: 'rgba(245,243,248,0.35)' }}>Fundadora de NExUS</p>
              </div>
            </div>
          </div>
        )}

        {/* ── SCREEN 5 ── Let's configure */}
        {screen === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
            {/* Logo symbol with glow */}
            <div style={{ marginBottom: 28 }}>
              <NexusSymbol size={90} glowing />
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 30,
              fontWeight: 500,
              color: '#F5F3F8',
              lineHeight: 1.25,
              marginBottom: 14,
              letterSpacing: '0.01em',
            }}>
              Vamos a configurar<br />tu espacio.
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(245,243,248,0.4)', lineHeight: 1.65, maxWidth: 280 }}>
              En unos minutos tendrás tu sistema operativo de marcas completamente listo.
            </p>
          </div>
        )}
      </div>

      {/* ── CTA button ── */}
      <div className="relative z-10 px-7 pb-12">
        <button
          onClick={next}
          className="btn-gold w-full rounded-[14px] text-[16px]"
          style={{ padding: '16px 0', letterSpacing: '0.02em' }}
        >
          {screen < 5 ? 'Continuar' : 'Comenzar ✦'}
        </button>

        {/* Skip on early screens */}
        {screen < 5 && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button
              onClick={onComplete}
              style={{ fontSize: 13, color: 'rgba(245,243,248,0.25)', letterSpacing: '0.03em' }}
            >
              Saltar introducción
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
