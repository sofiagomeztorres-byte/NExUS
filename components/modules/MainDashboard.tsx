'use client'

import { useState } from 'react'
import { useNexus } from '@/lib/context'
import { CommandPalette } from '@/components/CommandPalette'
import { NExUSLogo } from '@/components/NExUSLogo'
import { NexusSymbol } from '@/components/NexusSymbol'
import { NexusHub } from '@/components/NexusHub'
import { MiDia } from './MiDia'
import { Calendar } from './Calendar'
import { Library } from './Library'
import { Goals } from './Goals'
import { Analytics } from './Analytics'
import { BrandConfig } from './BrandConfig'
import { BrandSetupWizard } from './BrandSetupWizard'

type ViewType = 'mi-dia' | 'calendar' | 'library' | 'goals' | 'analytics' | 'brand'

const NAV_ITEMS: { id: ViewType; label: string; icon: string }[] = [
  { id: 'mi-dia',    label: 'Mi Día',      icon: '📋' },
  { id: 'calendar',  label: 'Agenda',      icon: '📅' },
  { id: 'library',   label: 'Biblioteca',  icon: '📁' },
  { id: 'goals',     label: 'Metas',       icon: '🎯' },
  { id: 'analytics', label: 'Analytics',   icon: '📊' },
  { id: 'brand',     label: 'Marca',       icon: '⚙️' },
]

interface MainDashboardProps {
  onChangeBrand: () => void
  onLogout: () => void
}

export function MainDashboard({ onChangeBrand, onLogout }: MainDashboardProps) {
  const { user, switchBrand, addBrand, deleteBrand, brandTheme } = useNexus()
  const [activeView, setActiveView] = useState<ViewType>('mi-dia')
  const [showBrandMenu, setShowBrandMenu] = useState(false)
  const [showHub, setShowHub] = useState(false)
  const [showBrandSetup, setShowBrandSetup] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const currentBrand = user.brands.find(b => b.id === user.currentBrandId)

  const brandPrimary   = brandTheme.vars['--brand-primary']   ?? '#6B3FA0'
  const brandSecondary = brandTheme.vars['--brand-secondary'] ?? '#E2B659'
  const brandAccent    = brandTheme.vars['--brand-accent']    ?? '#E2B659'

  return (
    <>
      <CommandPalette />
      <NexusHub
        open={showHub}
        onClose={() => setShowHub(false)}
        onNavigate={(v) => setActiveView(v as ViewType)}
      />
      <div
        className="min-h-screen max-w-[430px] mx-auto flex flex-col"
        data-brand-theme={brandTheme.mode}
        style={{
          background: 'var(--page-bg)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--brand-font)',
          ...brandTheme.vars,
        } as React.CSSProperties}
      >

      {/* ── HEADER ── */}
      <div
        className="sticky top-0 z-40 px-4 pt-3 pb-3"
        style={{
          background: 'var(--surface-bg)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Brand Selector */}
          <button
            onClick={() => setShowBrandMenu(!showBrandMenu)}
            className="flex items-center gap-2.5 py-1 px-3 rounded-[10px] transition-all active:scale-95"
            style={{ background: showBrandMenu ? 'rgba(234,220,249,0.4)' : 'transparent' }}
          >
            <span className="text-2xl">{currentBrand?.logo}</span>
            <div className="text-left">
              <p className="font-serif text-[16px] leading-tight" style={{ color: 'var(--text-primary)' }}>{currentBrand?.name}</p>
              <p className="text-[11px] leading-tight" style={{ color: 'var(--text-secondary)' }}>Hola, {user.name} ↓</p>
            </div>
          </button>

          {/* NExUS Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: brandAccent, boxShadow: `0 0 5px ${brandAccent}99` }} />
            <NExUSLogo size="sm" theme="light" />
          </div>
        </div>
      </div>

      {/* ── BRAND MENU DRAWER ── */}
      {showBrandMenu && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(42,26,74,0.4)', backdropFilter: 'blur(4px)' }}
          onMouseDown={e => { if (e.target === e.currentTarget) { setShowBrandMenu(false); setConfirmDelete(null) } }}
        >
          <div
            className="max-w-[430px] mx-auto w-full rounded-t-[24px] p-5 pb-10"
            style={{ background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-[#EEE9F5] mx-auto mb-5" />

            {/* Go to Brand Selector screen */}
            <button
              onClick={() => { setShowBrandMenu(false); onChangeBrand() }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] mb-4"
              style={{ background: 'rgba(226,182,89,0.08)', border: '1px solid rgba(226,182,89,0.25)' }}
            >
              <span className="text-[12px] font-bold" style={{ color: '#B8862A' }}>
                ← Cambiar espacio de trabajo
              </span>
            </button>

            <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)' }}>Cambio rápido</p>

            <div className="space-y-2 mb-4">
              {user.brands.map(brand => (
                <div key={brand.id}>
                  {confirmDelete === brand.id ? (
                    /* Inline delete confirmation */
                    <div
                      className="flex items-center gap-2 p-3 rounded-[12px]"
                      style={{ background: 'rgba(220,74,101,0.08)', border: '1.5px solid rgba(220,74,101,0.3)' }}
                    >
                      <span className="text-xl">{brand.logo}</span>
                      <p className="text-[13px] flex-1" style={{ color: '#DC4A65' }}>
                        ¿Eliminar <strong>{brand.name}</strong>?
                      </p>
                      <button
                        onClick={() => { deleteBrand(brand.id); setConfirmDelete(null) }}
                        className="px-3 py-1.5 rounded-[8px] text-[12px] font-bold transition-all active:scale-95"
                        style={{ background: '#DC4A65', color: '#fff' }}
                      >Sí</button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all active:scale-95"
                        style={{ background: 'var(--input-bg)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}
                      >No</button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-3 p-3 rounded-[12px] transition-all"
                      style={{
                        background: brand.id === user.currentBrandId ? `${brandPrimary}18` : 'var(--input-bg)',
                        border: brand.id === user.currentBrandId ? `1.5px solid ${brandPrimary}40` : '1px solid transparent',
                      }}
                    >
                      <button
                        className="flex items-center gap-3 flex-1 text-left"
                        onClick={() => { switchBrand(brand.id); setShowBrandMenu(false) }}
                      >
                        <span className="text-2xl">{brand.logo}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{brand.name}</p>
                          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{brand.industry}</p>
                        </div>
                        {brand.id === user.currentBrandId && (
                          <span style={{ color: '#E2B659' }}>✦</span>
                        )}
                      </button>
                      {user.brands.length > 1 && (
                        <button
                          onClick={() => setConfirmDelete(brand.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90 flex-shrink-0"
                          style={{ color: 'rgba(220,74,101,0.5)', background: 'rgba(220,74,101,0.07)' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M2 3.5h9M4.5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M5 6v3.5M7.5 6v3.5M2.5 3.5l.5 7a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1l.5-7"
                              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Brand Button */}
            <button
              onClick={() => { setShowBrandMenu(false); setShowBrandSetup(true) }}
              className="w-full flex items-center gap-3 p-3 rounded-[12px]"
              style={{
                border: '1.5px dashed rgba(226,182,89,0.5)',
                background: 'rgba(226,182,89,0.06)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(226,182,89,0.12)' }}
              >+</div>
              <p className="font-semibold text-[14px]" style={{ color: '#B8862A' }}>Agregar Nueva Marca</p>
            </button>

            {/* Logout Button */}
            <button
              onClick={() => { setShowBrandMenu(false); onLogout() }}
              className="w-full flex items-center gap-3 p-3 rounded-[12px] mt-2"
              style={{
                border: '1px solid rgba(220,74,101,0.2)',
                background: 'rgba(220,74,101,0.06)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(220,74,101,0.1)' }}
              >↩</div>
              <p className="font-semibold text-[14px]" style={{ color: '#DC4A65' }}>Cerrar Sesión</p>
            </button>
          </div>
        </div>
      )}

      {/* ── BRAND SETUP WIZARD ── */}
      {showBrandSetup && (
        <BrandSetupWizard
          onComplete={(brand) => {
            addBrand(brand)
            setShowBrandSetup(false)
            setActiveView('brand')
          }}
          onSkip={() => setShowBrandSetup(false)}
        />
      )}

      {/* ── CONTENT ── */}
      <div className="flex-1 px-4 pt-4 pb-28" style={{ color: 'var(--text-primary)' }}>
        {activeView === 'mi-dia'    && <MiDia />}
        {activeView === 'calendar'  && <Calendar />}
        {activeView === 'library'   && <Library />}
        {activeView === 'goals'     && <Goals />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'brand'     && <BrandConfig />}
      </div>

      {/* ── ORBITAL BOTTOM NAVIGATION ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-30"
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(28px)',
          borderTop: '1px solid var(--nav-border)',
          boxShadow: brandTheme.isDark
            ? '0 -4px 24px rgba(0,0,0,0.3)'
            : '0 -4px 24px rgba(42,26,74,0.06)',
        }}
      >
        {/* Arc connector line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(226,182,89,0.25) 30%, rgba(214,188,250,0.4) 50%, rgba(226,182,89,0.25) 70%, transparent 100%)',
        }} />

        <div className="flex items-center px-2 pt-1 pb-2" style={{ height: 64 }}>
          {/* LEFT 3 */}
          {NAV_ITEMS.slice(0, 3).map(item => {
            const active = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-[10px] transition-all active:scale-95"
              >
                {/* Node indicator */}
                <div className="relative">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] transition-all duration-200"
                    style={{
                      background: active ? `${brandPrimary}22` : 'transparent',
                      boxShadow: active
                        ? `0 0 0 1px ${brandPrimary}44, 0 0 8px ${brandPrimary}33, inset 0 1px 0 rgba(255,255,255,0.4)`
                        : 'none',
                    }}
                  >
                    {item.icon}
                  </div>
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: brandAccent }} />
                  )}
                </div>
                <span
                  className="text-[8px] font-semibold leading-none"
                  style={{ color: active ? brandPrimary : 'rgba(42,26,74,0.38)' }}
                >{item.label}</span>
              </button>
            )
          })}

          {/* CENTER: NExUS Hub Button */}
          {/* Outer div handles the upward float so active:scale works cleanly on the button */}
          <div className="flex-shrink-0 mx-1" style={{ transform: 'translateY(-6px)' }}>
            <button
              onClick={() => setShowHub(true)}
              className="relative transition-all active:scale-[0.96]"
              style={{
                width: 56, height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 38% 32%, #2D1460, #12082E)',
                boxShadow: '0 0 0 2px rgba(226,182,89,0.5), 0 0 18px rgba(226,182,89,0.22), 0 4px 20px rgba(0,0,0,0.35)',
              }}
            >
              <NexusSymbol size={40} glowing />
              {/* Persistent gold pulse ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  border: '1.5px solid rgba(226,182,89,0.5)',
                  boxShadow: '0 0 10px rgba(226,182,89,0.2), inset 0 0 6px rgba(226,182,89,0.06)',
                  animation: 'nucleusPulse 2.5s ease-in-out infinite',
                }}
              />
            </button>
          </div>

          {/* RIGHT 3 */}
          {NAV_ITEMS.slice(3, 6).map(item => {
            const active = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-[10px] transition-all active:scale-95"
              >
                <div className="relative">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[15px] transition-all duration-200"
                    style={{
                      background: active ? `${brandPrimary}22` : 'transparent',
                      boxShadow: active
                        ? `0 0 0 1px ${brandPrimary}44, 0 0 8px ${brandPrimary}33, inset 0 1px 0 rgba(255,255,255,0.4)`
                        : 'none',
                    }}
                  >
                    {item.icon}
                  </div>
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: brandAccent }} />
                  )}
                </div>
                <span
                  className="text-[8px] font-semibold leading-none"
                  style={{ color: active ? brandPrimary : 'rgba(42,26,74,0.38)' }}
                >{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
    </>
  )
}
