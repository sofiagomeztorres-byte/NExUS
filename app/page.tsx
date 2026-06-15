'use client'

import { useState, useEffect, useRef } from 'react'
import { useNexus } from '@/lib/context'
import { supabase } from '@/lib/supabase'
import { WelcomeScreen } from '@/components/modules/WelcomeScreen'
import { AuthScreen } from '@/components/modules/AuthScreen'
import { BrandIntroOnboarding } from '@/components/modules/BrandIntroOnboarding'
import { OnboardingFlow } from '@/components/modules/Onboarding'
import { BrandSelector } from '@/components/modules/BrandSelector'
import { MainDashboard } from '@/components/modules/MainDashboard'
import { BrandSetupWizard } from '@/components/modules/BrandSetupWizard'

type AppView =
  | 'loading'
  | 'welcome'
  | 'login'
  | 'register'
  | 'brand-intro'
  | 'onboarding'
  | 'brand-setup'
  | 'brand-select'
  | 'dashboard'

type ProfileSnap = {
  hasSeenBrandIntro?: boolean
  onboardingComplete?: boolean
  rememberLastBrand?: boolean
  currentBrandId?: string
  isAuthenticated?: boolean
}

function resolveAuthenticatedView(u: ProfileSnap): AppView {
  if (!u.hasSeenBrandIntro) return 'brand-intro'
  if (!u.onboardingComplete) return 'onboarding'
  if (u.rememberLastBrand && u.currentBrandId) return 'dashboard'
  return 'brand-select'
}

export default function Home() {
  const { loaded, user, updateUserState, logout, loadUserData, addBrand } = useNexus()
  const [view, setView] = useState<AppView>('loading')
  const initialized = useRef(false)

  // One-time routing decision after context loads from Supabase session
  useEffect(() => {
    if (!loaded) return
    if (initialized.current) return
    initialized.current = true

    if (!user.isAuthenticated) {
      setView('welcome')
    } else {
      setView(resolveAuthenticatedView(user))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  // ── Loading splash ──
  if (view === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center"
        style={{ background: '#08080E', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ opacity: 0.5, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: '#F5F3F8', letterSpacing: '0.1em' }}>
            N<span style={{ color: '#E2B659' }}>Ex</span>US
          </p>
          <div style={{ width: 24, height: 1, background: 'rgba(226,182,89,0.4)', borderRadius: 1, margin: '8px auto 0' }} />
        </div>
      </div>
    )
  }

  if (view === 'welcome') {
    return <WelcomeScreen onLogin={() => setView('login')} onRegister={() => setView('register')} />
  }

  if (view === 'login') {
    return (
      <AuthScreen
        mode="login"
        onToggleMode={() => setView('register')}
        onBack={() => setView('welcome')}
        onSuccess={async (name, email, userId) => {
          // Fetch profile for routing decision while data loads in background
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_complete, has_seen_brand_intro, remember_last_brand, current_brand_id')
            .eq('id', userId)
            .single()

          loadUserData(userId)

          setView(resolveAuthenticatedView({
            isAuthenticated: true,
            hasSeenBrandIntro: profile?.has_seen_brand_intro ?? false,
            onboardingComplete: profile?.onboarding_complete ?? false,
            rememberLastBrand: profile?.remember_last_brand ?? false,
            currentBrandId: profile?.current_brand_id ?? '',
          }))
        }}
      />
    )
  }

  if (view === 'register') {
    return (
      <AuthScreen
        mode="register"
        onToggleMode={() => setView('login')}
        onBack={() => setView('welcome')}
        onSuccess={(name, email, userId) => {
          // New user: profile was auto-created by DB trigger, data is empty
          loadUserData(userId)
          setView('brand-intro')
        }}
      />
    )
  }

  if (view === 'brand-intro') {
    return (
      <BrandIntroOnboarding
        onComplete={() => {
          updateUserState({ hasSeenBrandIntro: true })
          setView('onboarding')
        }}
      />
    )
  }

  if (view === 'onboarding') {
    return (
      <OnboardingFlow
        onComplete={() => setView('brand-select')}
      />
    )
  }

  if (view === 'brand-setup') {
    return (
      <BrandSetupWizard
        onComplete={(brand) => { addBrand(brand); setView('brand-select') }}
        onSkip={() => setView('brand-select')}
      />
    )
  }

  if (view === 'brand-select') {
    return (
      <BrandSelector
        onSelect={() => setView('dashboard')}
        onNoBrands={() => setView('brand-setup')}
      />
    )
  }

  return (
    <MainDashboard
      onChangeBrand={() => setView('brand-select')}
      onLogout={() => { logout(); setView('welcome') }}
    />
  )
}
