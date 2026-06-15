'use client'

import { useState } from 'react'
import { useNexus } from '@/lib/context'
import { NexusSymbol } from '@/components/NexusSymbol'

interface BrandSelectorProps {
  onSelect: () => void
  onNoBrands?: () => void   // go back to onboarding to create first brand
}

export function BrandSelector({ onSelect, onNoBrands }: BrandSelectorProps) {
  const { user, updateUserState, switchBrand } = useNexus()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [rememberChoice, setRememberChoice] = useState(false)

  const handleSelectBrand = (brandId: string) => {
    switchBrand(brandId)
    updateUserState({ rememberLastBrand: rememberChoice })
    onSelect()
  }

  return (
    <div
      className="min-h-screen flex flex-col px-6 pt-10 pb-10 max-w-[430px] mx-auto"
      style={{ background: '#FAFAFA' }}
    >
      {/* Header with logo symbol */}
      <div className="mb-8 flex flex-col items-center text-center">
        <NexusSymbol size={64} glowing />
        <div className="mt-4 mb-1 w-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(226,182,89,0.6), transparent)' }} />
        <h1 className="font-serif text-[26px] leading-tight text-[#2A1A4A] mt-3">
          ¿Con qué marca<br />trabajas hoy?
        </h1>
        <p className="text-[13px] mt-2 leading-relaxed" style={{ color: 'rgba(42,26,74,0.45)' }}>
          Cada marca tiene su propio universo de datos.
        </p>
      </div>

      {/* Empty state — no brands yet */}
      {user.brands.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(214,188,250,0.15)', border: '1.5px dashed rgba(214,188,250,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>+</div>
          <div className="text-center">
            <p className="font-serif text-[18px] text-[#2A1A4A] mb-1">Sin marcas todavía</p>
            <p className="text-[13px] text-[#2A1A4A]/45">Crea tu primera marca para comenzar</p>
          </div>
          {onNoBrands && (
            <button
              onClick={onNoBrands}
              className="px-6 py-3 rounded-[12px] font-bold text-[14px]"
              style={{ background: 'linear-gradient(135deg, #E2B659, #FFB84D)', color: '#1A0F30' }}
            >Crear primera marca ✦</button>
          )}
        </div>
      )}

      {/* Brand Cards */}
      <div className="space-y-3 flex-1">
        {user.brands.map((brand, index) => (
          <button
            key={brand.id}
            onClick={() => handleSelectBrand(brand.id)}
            onMouseEnter={() => setHoveredId(brand.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="w-full text-left transition-all duration-200 active:scale-[0.98]"
            style={{
              animationDelay: `${index * 80}ms`,
              animation: 'silkIn 400ms cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {/* Brand card — node-inspired from logo DNA */}
            <div
              className="p-4 rounded-[18px] jewel-card"
              style={{
                border: hoveredId === brand.id
                  ? '1.5px solid rgba(214,188,250,0.6)'
                  : '1px solid rgba(238,233,245,0.8)',
                boxShadow: hoveredId === brand.id
                  ? '0 0 0 1px rgba(214,188,250,0.2), 0 8px 28px rgba(42,26,74,0.08)'
                  : '0 2px 12px rgba(42,26,74,0.04)',
                transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div className="flex items-center gap-4">
                {/* Brand node — mirrors logo lavender nodes */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: hoveredId === brand.id
                        ? 'radial-gradient(circle at 35% 30%, #F2ECFF 0%, #D6BCFA 45%, #B099D4 100%)'
                        : 'radial-gradient(circle at 35% 30%, rgba(242,236,255,0.8) 0%, rgba(214,188,250,0.4) 60%, rgba(176,153,212,0.3) 100%)',
                      boxShadow: hoveredId === brand.id
                        ? '0 0 0 2px rgba(214,188,250,0.5), 0 4px 14px rgba(182,146,255,0.25), inset 0 1px 0 rgba(255,255,255,0.5)'
                        : '0 0 0 1px rgba(214,188,250,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
                    }}
                  >
                    {brand.logo}
                  </div>
                  {/* Golden nucleus dot when active */}
                  {hoveredId === brand.id && (
                    <div
                      className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 35% 30%, #FFF5CC, #E2B659)',
                        boxShadow: '0 0 6px rgba(226,182,89,0.6), 0 0 0 1.5px rgba(226,182,89,0.3)',
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[18px] text-[#2A1A4A] leading-tight">{brand.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'rgba(42,26,74,0.45)' }}>{brand.industry}</p>
                  {brand.description && (
                    <p className="text-[11px] mt-1.5 leading-relaxed line-clamp-2" style={{ color: 'rgba(42,26,74,0.35)' }}>
                      {brand.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[14px] transition-all"
                  style={{
                    background: hoveredId === brand.id ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                    color: hoveredId === brand.id ? '#B8862A' : 'rgba(42,26,74,0.25)',
                    border: `1px solid ${hoveredId === brand.id ? 'rgba(226,182,89,0.4)' : '#EEE9F5'}`,
                  }}
                >→</div>
              </div>

              {/* Brand Color Accent Bar */}
              <div
                className="mt-3 h-0.5 rounded-full w-full"
                style={{
                  background: `linear-gradient(90deg, ${brand.visualIdentity?.primaryColor ?? '#E2B659'}55, transparent)`,
                  opacity: hoveredId === brand.id ? 1 : 0.4,
                }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Remember Choice Toggle */}
      <div className="mt-8 mb-6">
        <button
          onClick={() => setRememberChoice(!rememberChoice)}
          className="flex items-center gap-3 w-full"
        >
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: rememberChoice ? 'rgba(226,182,89,0.25)' : 'transparent',
              border: rememberChoice ? '1.5px solid rgba(226,182,89,0.7)' : '1.5px solid #EEE9F5',
              color: '#B8862A',
              fontSize: 11,
            }}
          >
            {rememberChoice ? '✓' : ''}
          </div>
          <span className="text-[13px]" style={{ color: 'rgba(42,26,74,0.5)' }}>
            Recordar esta elección al volver
          </span>
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-[11px]" style={{ color: 'rgba(42,26,74,0.3)' }}>
        Puedes cambiar de marca en cualquier momento
      </p>
    </div>
  )
}
