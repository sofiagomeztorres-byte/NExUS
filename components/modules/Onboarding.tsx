'use client'

import { useState } from 'react'
import { useNexus } from '@/lib/context'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { NetworkPulse } from '@/components/animations/NetworkPulse'
import { useParallax } from '@/hooks/useParallax'
import { BrandSetupWizard } from './BrandSetupWizard'

type OnboardingStep = 'welcome' | 'name' | 'brand-selection' | 'primary-goal' | 'completion'

/* ─────────────────────────────────────────────
   NAME SCREEN — standalone component so hooks
   are always called in the same order
───────────────────────────────────────────── */
function NameScreen({ onNext }: { onNext: () => void }) {
  const { user, updateUserState } = useNexus()
  const { containerRef, offset } = useParallax(10)

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: 'calc(100dvh - 72px)', maxWidth: '100%', background: '#EAE6F5' }}
    >
      {/* Background image with parallax — masked same as welcome */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/name-bg.jpg)',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 30%, black 40%, black 82%, transparent 90%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 30%, black 40%, black 82%, transparent 90%)',
          transform: `translate(${offset.x}px, ${offset.y}px) scale(1.05)`,
          transition: 'transform 0.05s linear',
          willChange: 'transform',
        }}
      />

      {/* SVG Pulse overlay — also parallaxes with slightly less movement */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${offset.x * 0.6}px, ${offset.y * 0.6}px)`,
          transition: 'transform 0.05s linear',
          willChange: 'transform',
        }}
      >
        <NetworkPulse parallaxRef={containerRef} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col px-4 pt-2 pb-8" style={{ minHeight: 'calc(100dvh - 72px)' }}>
        {/* Title */}
        <div className="animate-title mb-1">
          <h2 className="font-serif leading-tight" style={{ fontSize: 30, color: '#2A1A4A' }}>
            ¿Cuál es tu{' '}
            <span style={{ color: '#7B4FBE' }}>nombre?</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="animate-description flex items-center gap-2 mb-6">
          <span style={{ fontSize: 16 }}>👤</span>
          <p className="text-[14px] font-light" style={{ color: 'rgba(42,26,74,0.65)' }}>
            Así personalizaremos tu experiencia
          </p>
        </div>

        {/* Input with gold shimmer */}
        <div className="animate-button relative mb-6">
          <input
            type="text"
            defaultValue={user.name}
            placeholder="Tu nombre"
            className="w-full px-4 py-4 text-[16px] rounded-[12px] outline-none"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1.5px solid rgba(226,182,89,0.5)',
              color: '#2A1A4A',
              boxShadow: '0 2px 20px rgba(226,182,89,0.12), inset 0 0 0 0 transparent',
            }}
            onFocus={e => {
              e.currentTarget.style.border = '1.5px solid rgba(226,182,89,0.9)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(226,182,89,0.15), 0 2px 20px rgba(226,182,89,0.2)'
            }}
            onBlur={e => {
              e.currentTarget.style.border = '1.5px solid rgba(226,182,89,0.5)'
              e.currentTarget.style.boxShadow = '0 2px 20px rgba(226,182,89,0.12)'
            }}
            onChange={e => updateUserState({ name: e.target.value })}
          />
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 rounded-[12px] pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(226,182,89,0.08) 50%, transparent 100%)',
              backgroundSize: '400px 100%',
              animation: 'inputShimmer 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Spacer pushes button down */}
        <div className="flex-1" />

        {/* Continue button */}
        <button
          onClick={onNext}
          className="w-full font-sans font-bold tracking-wide"
          style={{
            padding: '18px 0',
            borderRadius: 12,
            fontSize: 17,
            color: '#ffffff',
            background: 'linear-gradient(135deg, #4A2080 0%, #2A1A4A 100%)',
            boxShadow: '0 4px 20px rgba(42,26,74,0.35)',
          }}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUserState, addBrand } = useNexus()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([])

  const totalSteps = 5
  const currentStepNumber = ['welcome', 'name', 'brand-selection', 'primary-goal', 'completion'].indexOf(step) + 1
  const progressPercent = (completedSteps.length / totalSteps) * 100

  const handleNext = (nextStep: OnboardingStep) => {
    setCompletedSteps([...completedSteps, step])
    setStep(nextStep)
  }

  const handleComplete = () => {
    updateUserState({ onboardingComplete: true })
    onComplete()
  }

  /* ─── WELCOME: full-bleed background image ─── */
  if (step === 'welcome') {
    return (
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: '100dvh', background: '#EAE6F5' }}
      >
        {/* Background image — masked to show ONLY the icon network zone (32%→88%) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/welcome-bg.jpg)',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 28%, black 38%, black 82%, transparent 90%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 28%, black 38%, black 82%, transparent 90%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col" style={{ minHeight: '100dvh' }}>
          {/* Progress bar */}
          <div className="animate-progress-bar px-4 pt-4 pb-1">
            <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(234,220,249,0.5)' }}>
              <div className="h-full rounded-full" style={{ width: '20%', background: '#6B3FA0' }} />
            </div>
            <p className="text-[13px] mt-[6px] font-sans" style={{ color: 'rgba(42,26,74,0.60)' }}>
              Paso 1 de 5
            </p>
          </div>

          {/* Title + description */}
          <div className="px-4 pt-2">
            <h1 className="animate-title font-serif leading-tight mb-3" style={{ fontSize: 26, color: '#2A1A4A' }}>
              Bienvenida a NExUS
            </h1>
            <p className="animate-description font-light leading-relaxed" style={{ fontSize: 15, color: 'rgba(42,26,74,0.72)', maxWidth: 320 }}>
              Tu centro de operaciones premium diseñado para transformar objetivos de negocio en acciones claras y organizadas cada día.
            </p>
          </div>

          {/* Spacer — lets the icon network show through */}
          <div className="flex-1" />

          {/* Button pinned to bottom */}
          <div className="animate-button px-4 pb-10 pt-4">
            <button
              onClick={() => handleNext('name')}
              className="w-full font-sans font-bold tracking-wide"
              style={{
                padding: '18px 0',
                borderRadius: 12,
                fontSize: 17,
                color: '#2A1A4A',
                background: 'rgba(234,220,249,0.92)',
              }}
            >
              Comenzar
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ─── Brand Setup Wizard (full-screen takeover) ─── */
  if (step === 'brand-selection') {
    return (
      <BrandSetupWizard
        onComplete={(brand) => {
          addBrand(brand)
          handleNext('primary-goal')
        }}
        onSkip={() => handleNext('primary-goal')}
      />
    )
  }

  /* ─── ALL OTHER STEPS: padded layout ─── */
  return (
    <div className="min-h-screen bg-nexus-white px-4 pt-4 pb-6 flex flex-col overflow-hidden">
      {/* Progress Bar */}
      <div className="mb-8 mt-2 animate-progress-bar">
        <div className="w-full h-1 bg-nexus-platinum rounded-full overflow-hidden">
          <div
            className="h-full bg-nexus-lavender transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-caption text-nexus-amethyst/60 mt-2">Paso {currentStepNumber} de {totalSteps}</p>
      </div>

      {/* Name Screen — Premium with parallax + pulse */}
      {step === 'name' && <NameScreen onNext={() => handleNext('brand-selection')} />}

      {/* Primary Goal Screen */}
      {step === 'primary-goal' && (
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="font-serif text-h1 text-nexus-amethyst mb-2">
            ¿Cuál es tu prioridad hoy?
          </h2>
          <p className="text-caption text-nexus-amethyst/60 mb-6">
            Define tu enfoque principal para estructurar tu jornada
          </p>
          <textarea
            placeholder="Ej: Lanzar campaña de Instagram para Paradise Travel"
            className="w-full px-4 py-3 mb-6 bg-nexus-ivory border border-nexus-platinum rounded-ios text-nexus-amethyst placeholder:text-nexus-amethyst/40 focus:border-nexus-gold focus:outline-none resize-none h-24"
            onChange={(e) => updateUserState({
              miDiaState: { ...user.miDiaState, mainPriority: e.target.value }
            })}
          />
          <div className="mt-auto">
            <Button onClick={() => handleNext('completion')} size="lg">
              Finalizar Configuración
            </Button>
          </div>
        </div>
      )}

      {/* Completion Screen */}
      {step === 'completion' && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">✨</p>
            <h2 className="font-serif text-h1 text-nexus-amethyst mb-4">
              ¡Todo listo, {user.name}!
            </h2>
            <p className="text-body text-nexus-amethyst/70 mb-8">
              Tu ecosistema de negocios está configurado. Ahora transformemos tus objetivos en acciones diarias claras.
            </p>
          </div>
          <Button onClick={handleComplete} size="lg">
            Elegir Mi Marca →
          </Button>
        </div>
      )}
    </div>
  )
}
