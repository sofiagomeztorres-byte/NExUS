'use client'

import { useState, useRef } from 'react'
import { useNexus } from '@/lib/context'
import { Card } from '@/components/Card'
import { KnowledgeBaseItem } from '@/lib/types'

type Section = 'general' | 'visual' | 'strategic' | 'personality' | 'knowledge'

// ── Visual Universe Constants ─────────────────────────────────────────────
const VIS_BG_OPTIONS = [
  { id: 'light',  icon: '☀️', label: 'Claro' },
  { id: 'dark',   icon: '🌙', label: 'Oscuro' },
  { id: 'white',  icon: '🤍', label: 'Blanco' },
  { id: 'gray',   icon: '☁️', label: 'Gris' },
  { id: 'cream',  icon: '🥂', label: 'Crema' },
  { id: 'custom', icon: '🎨', label: 'Custom' },
] as const

const VIS_PERSONALITY_TAGS = [
  'Moderna','Premium','Elegante','Minimalista','Tecnológica',
  'Corporativa','Creativa','Inspiradora','Cercana','Exclusiva','Lujo','Sofisticada',
]

const VIS_FONT_STYLES = [
  { id: 'modern',    label: 'Moderna',     family: "'Inter', sans-serif" },
  { id: 'elegant',   label: 'Elegante',    family: "'Cormorant Garamond', serif" },
  { id: 'minimal',   label: 'Minimalista', family: "'DM Sans', sans-serif" },
  { id: 'corporate', label: 'Corporativa', family: "'Montserrat', sans-serif" },
  { id: 'creative',  label: 'Creativa',    family: "'Playfair Display', serif" },
  { id: 'editorial', label: 'Editorial',   family: "'Cormorant Garamond', serif" },
] as const

const VIS_BORDER_STYLES = [
  { id: 'pill',    label: 'Muy redond.', radius: '999px' },
  { id: 'rounded', label: 'Redondeados', radius: '20px'  },
  { id: 'medium',  label: 'Equilibrado', radius: '12px'  },
  { id: 'subtle',  label: 'Rectos',      radius: '6px'   },
  { id: 'sharp',   label: 'Corporate',   radius: '2px'   },
] as const

const VIS_ICON_STYLES = [
  { id: 'modern',    label: 'Modernos',    preview: '◉' },
  { id: 'premium',   label: 'Premium',     preview: '◆' },
  { id: 'minimal',   label: 'Minimalistas',preview: '○' },
  { id: 'corporate', label: 'Corporativos',preview: '■' },
  { id: 'creative',  label: 'Creativos',   preview: '✦' },
] as const

const VIS_BG_PREVIEW: Record<string, { pageBg: string; cardBg: string; cardBorder: string; textColor: string; textSub: string }> = {
  light:  { pageBg: '#FAFAFA', cardBg: 'rgba(255,255,255,0.95)', cardBorder: '#EEE9F5',               textColor: '#2A1A4A', textSub: 'rgba(42,26,74,0.5)'   },
  dark:   { pageBg: '#08080E', cardBg: 'rgba(255,255,255,0.06)', cardBorder: 'rgba(255,255,255,0.1)',  textColor: '#F5F3F8', textSub: 'rgba(245,243,248,0.5)' },
  white:  { pageBg: '#FFFFFF', cardBg: 'rgba(246,246,250,0.95)', cardBorder: 'rgba(0,0,0,0.07)',       textColor: '#1A1A2E', textSub: 'rgba(26,26,46,0.5)'   },
  gray:   { pageBg: '#F0EEF5', cardBg: 'rgba(255,255,255,0.92)', cardBorder: 'rgba(120,110,145,0.15)', textColor: '#2A2040', textSub: 'rgba(42,32,64,0.5)'   },
  cream:  { pageBg: '#F5EDE0', cardBg: 'rgba(255,252,246,0.93)', cardBorder: 'rgba(180,140,100,0.2)',  textColor: '#2A1A0A', textSub: 'rgba(42,26,10,0.5)'   },
  custom: { pageBg: '#FAFAFA', cardBg: 'rgba(255,255,255,0.9)',  cardBorder: '#EEE9F5',               textColor: '#2A1A4A', textSub: 'rgba(42,26,74,0.5)'   },
}

function getFontFamily(id: string): string {
  return VIS_FONT_STYLES.find(f => f.id === id)?.family ?? "'Inter', sans-serif"
}
function getBorderRadius(id: string): string {
  return VIS_BORDER_STYLES.find(b => b.id === id)?.radius ?? '12px'
}

const TONE_OPTIONS = [
  { id: 'Profesional', emoji: '💼', desc: 'Serio y confiable' },
  { id: 'Cercana', emoji: '🤝', desc: 'Amigable y personal' },
  { id: 'Educativa', emoji: '📚', desc: 'Informa y enseña' },
  { id: 'Inspiradora', emoji: '🔥', desc: 'Motiva y emociona' },
  { id: 'Experta', emoji: '🎯', desc: 'Técnica y precisa' },
  { id: 'Divertida', emoji: '✨', desc: 'Entretenida y vibrante' },
]

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'general',     label: 'General',     icon: '📋' },
  { id: 'visual',      label: 'Visual',      icon: '🎨' },
  { id: 'strategic',   label: 'Estrategia',  icon: '🎯' },
  { id: 'personality', label: 'Personalidad',icon: '✨' },
  { id: 'knowledge',   label: 'Bóveda',      icon: '🔐' },
]

const KB_TYPES: { id: KnowledgeBaseItem['type']; label: string; icon: string; accept: string }[] = [
  { id: 'pdf',      label: 'PDF',      icon: '📄', accept: '.pdf' },
  { id: 'document', label: 'Doc',      icon: '📝', accept: '.doc,.docx,.txt' },
  { id: 'video',    label: 'Video',    icon: '🎬', accept: 'video/*' },
  { id: 'audio',    label: 'Audio',    icon: '🎵', accept: 'audio/*' },
  { id: 'url',      label: 'URL',      icon: '🔗', accept: '' },
]

export function BrandConfig() {
  const { user, updateBrand, addKnowledgeItem, deleteKnowledgeItem } = useNexus()
  const [section, setSection] = useState<Section>('general')
  const [kbType, setKbType] = useState<KnowledgeBaseItem['type']>('pdf')
  const [kbName, setKbName] = useState('')
  const [kbUrl, setKbUrl] = useState('')
  const [kbFileData, setKbFileData] = useState<{ name: string; size: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const brand = user.brands.find(b => b.id === user.currentBrandId)
  if (!brand) return null

  const up = (updates: Parameters<typeof updateBrand>[1]) =>
    updateBrand(brand.id, updates)

  const handleKbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!kbName) setKbName(f.name.replace(/\.[^.]+$/, ''))
    setKbFileData({ name: f.name, size: f.size })
  }

  const handleSaveKbItem = () => {
    if (!kbName.trim()) return
    addKnowledgeItem(brand.id, {
      name: kbName.trim(),
      type: kbType,
      url: kbType === 'url' ? kbUrl : kbFileData?.name,
    })
    setKbName(''); setKbUrl(''); setKbFileData(null)
  }

  const inputClass = "w-full px-3 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
  const inputStyle = { background: '#F9F8FC', border: '1px solid #EEE9F5' }
  const textareaClass = "w-full px-3 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none resize-none h-20"
  const labelClass = "block text-[11px] font-bold text-[#2A1A4A]/50 uppercase tracking-wider mb-1.5"

  return (
    <div className="space-y-5 pb-6">
      {/* Brand Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{brand.logo}</span>
        <div>
          <h2 className="font-serif text-[20px] text-[#2A1A4A]">{brand.name}</h2>
          <p className="text-[12px] text-[#2A1A4A]/45">{brand.industry}</p>
        </div>
        {/* Brand color accent */}
        <div className="ml-auto flex gap-1.5">
          <div className="w-4 h-4 rounded-full border border-white/50" style={{ background: brand.visualIdentity.primaryColor }} />
          <div className="w-4 h-4 rounded-full border border-white/50" style={{ background: brand.visualIdentity.secondaryColor }} />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className="whitespace-nowrap px-3 py-2 rounded-[10px] text-[12px] font-semibold transition-all flex-shrink-0"
            style={{
              background: section === s.id ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
              border: section === s.id ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
              color: section === s.id ? '#B8862A' : '#2A1A4A',
            }}
          >{s.icon} {s.label}</button>
        ))}
      </div>

      {/* ── GENERAL ── */}
      {section === 'general' && (
        <div className="space-y-4">
          <div><label className={labelClass}>Nombre</label>
            <input className={inputClass} style={inputStyle}
              defaultValue={brand.name}
              onChange={e => up({ name: e.target.value })}
            /></div>
          <div><label className={labelClass}>Logo (emoji)</label>
            <input className={inputClass} style={inputStyle} maxLength={2}
              defaultValue={brand.logo}
              onChange={e => up({ logo: e.target.value })}
            /></div>
          <div><label className={labelClass}>Descripción</label>
            <textarea className={textareaClass} style={inputStyle}
              defaultValue={brand.description}
              onChange={e => up({ description: e.target.value })}
            /></div>
          <div><label className={labelClass}>Industria</label>
            <input className={inputClass} style={inputStyle}
              defaultValue={brand.industry}
              onChange={e => up({ industry: e.target.value })}
            /></div>
          <div><label className={labelClass}>Sitio Web</label>
            <input className={inputClass} style={inputStyle} type="url"
              defaultValue={brand.website}
              onChange={e => up({ website: e.target.value })}
            /></div>
          <div><label className={labelClass}>Instagram</label>
            <input className={inputClass} style={inputStyle} placeholder="@usuario"
              defaultValue={brand.socialMediaLinks.instagram}
              onChange={e => up({ socialMediaLinks: { ...brand.socialMediaLinks, instagram: e.target.value } })}
            /></div>
          <div><label className={labelClass}>TikTok</label>
            <input className={inputClass} style={inputStyle} placeholder="@usuario"
              defaultValue={brand.socialMediaLinks.tiktok}
              onChange={e => up({ socialMediaLinks: { ...brand.socialMediaLinks, tiktok: e.target.value } })}
            /></div>
          <div><label className={labelClass}>YouTube</label>
            <input className={inputClass} style={inputStyle} placeholder="@canal"
              defaultValue={brand.socialMediaLinks.youtube}
              onChange={e => up({ socialMediaLinks: { ...brand.socialMediaLinks, youtube: e.target.value } })}
            /></div>
        </div>
      )}

      {/* ── 🎨 UNIVERSO VISUAL ── */}
      {section === 'visual' && (() => {
        const vi = brand.visualIdentity
        const bgS = vi.backgroundStyle ?? 'light'
        const prev = VIS_BG_PREVIEW[bgS] ?? VIS_BG_PREVIEW.light
        const prevBg = bgS === 'custom' && vi.customBgColor ? vi.customBgColor : prev.pageBg
        const fontFamily = getFontFamily(vi.fontStyle ?? 'modern')
        const radius = getBorderRadius(vi.borderRadius ?? 'medium')
        const personalities = (vi.visualPersonality ?? '').split(',').filter(Boolean)

        const upVI = (patch: Partial<typeof vi>) =>
          up({ visualIdentity: { ...vi, ...patch } })

        const chip = (active: boolean) => ({
          padding: '6px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          background: active ? 'rgba(226,182,89,0.15)' : '#F9F8FC',
          border: `1.5px solid ${active ? 'rgba(226,182,89,0.6)' : '#EEE9F5'}`,
          color: active ? '#B8862A' : 'rgba(42,26,74,0.55)',
          cursor: 'pointer' as const,
        })

        return (
          <div className="space-y-5">

            {/* LIVE PREVIEW */}
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1.5px solid rgba(226,182,89,0.3)' }}>
              <div style={{ background: prevBg, padding: '10px 12px', transition: 'background 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: vi.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{brand.logo}</div>
                  <span style={{ fontFamily, fontSize: 12, fontWeight: 600, color: prev.textColor }}>{brand.name}</span>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
                    {[vi.primaryColor, vi.secondaryColor, vi.successColor ?? '#22c55e'].map((c, i) => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                </div>
                <div style={{ background: prev.cardBg, border: `1px solid ${prev.cardBorder}`, borderRadius: 8, padding: '8px 10px', marginBottom: 6 }}>
                  <p style={{ fontFamily, fontSize: 11, fontWeight: 600, color: prev.textColor, marginBottom: 3 }}>Dashboard</p>
                  <p style={{ fontFamily, fontSize: 10, color: prev.textSub, marginBottom: 6 }}>Resumen de actividad</p>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ flex: 1, padding: '5px 8px', background: vi.primaryColor, borderRadius: radius, textAlign: 'center' as const }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', fontFamily }}>Principal</span>
                    </div>
                    <div style={{ flex: 1, padding: '5px 8px', background: `${vi.secondaryColor}22`, border: `1px solid ${vi.secondaryColor}`, borderRadius: radius, textAlign: 'center' as const }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: vi.secondaryColor, fontFamily }}>Secundario</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: 'rgba(226,182,89,0.06)', padding: '4px 12px', borderTop: '1px solid rgba(226,182,89,0.2)' }}>
                <p style={{ fontSize: 9, color: 'rgba(184,134,42,0.9)', letterSpacing: '0.08em' }}>VISTA PREVIA EN TIEMPO REAL</p>
              </div>
            </div>

            {/* 1. FONDO */}
            <div>
              <p className={labelClass}>1. Fondo</p>
              <div className="grid grid-cols-3 gap-2">
                {VIS_BG_OPTIONS.map(b => {
                  const active = bgS === b.id
                  return (
                    <button key={b.id} onClick={() => upVI({ backgroundStyle: b.id as typeof vi.backgroundStyle })}
                      className="p-2.5 rounded-[10px] text-center transition-all"
                      style={{ background: active ? 'rgba(226,182,89,0.12)' : '#F9F8FC', border: `1.5px solid ${active ? 'rgba(226,182,89,0.6)' : '#EEE9F5'}` }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>{b.icon}</div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: active ? '#B8862A' : 'rgba(42,26,74,0.55)' }}>{b.label}</p>
                    </button>
                  )
                })}
              </div>
              {bgS === 'custom' && (
                <div className="flex items-center gap-3 mt-2 p-2.5 rounded-[10px]" style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}>
                  <label className="cursor-pointer relative flex-shrink-0">
                    <input type="color" value={vi.customBgColor ?? '#f0f0f0'}
                      onChange={e => upVI({ customBgColor: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: vi.customBgColor ?? '#f0f0f0', border: '2px solid rgba(42,26,74,0.15)' }} />
                  </label>
                  <span className="text-[12px] font-mono" style={{ color: 'rgba(42,26,74,0.55)' }}>{vi.customBgColor ?? '#f0f0f0'}</span>
                </div>
              )}
            </div>

            {/* 2. PERSONALIDAD */}
            <div>
              <p className={labelClass}>2. Estilo de marca (varios)</p>
              <div className="flex flex-wrap gap-1.5">
                {VIS_PERSONALITY_TAGS.map(tag => {
                  const active = personalities.includes(tag)
                  return (
                    <button key={tag} style={chip(active)}
                      onClick={() => {
                        const next = active
                          ? personalities.filter(x => x !== tag)
                          : [...personalities, tag]
                        upVI({ visualPersonality: next.join(',') })
                      }}>
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. TIPOGRAFÍA */}
            <div>
              <p className={labelClass}>3. Tipografía</p>
              <div className="grid grid-cols-2 gap-2">
                {VIS_FONT_STYLES.map(f => {
                  const active = (vi.fontStyle ?? 'modern') === f.id
                  return (
                    <button key={f.id}
                      onClick={() => upVI({ fontStyle: f.id as typeof vi.fontStyle })}
                      className="flex items-center gap-2 p-2.5 rounded-[10px] text-left transition-all"
                      style={{ background: active ? 'rgba(226,182,89,0.12)' : '#F9F8FC', border: `1.5px solid ${active ? 'rgba(226,182,89,0.6)' : '#EEE9F5'}` }}>
                      <span style={{ fontSize: 20, fontFamily: f.family, color: active ? vi.primaryColor : '#2A1A4A', fontWeight: 500, width: 24, textAlign: 'center', flexShrink: 0 }}>Aa</span>
                      <p style={{ fontSize: 11, fontWeight: 600, color: active ? '#B8862A' : 'rgba(42,26,74,0.7)' }}>{f.label}</p>
                      {active && <span className="ml-auto text-[#E2B659] text-xs">✦</span>}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. BORDES */}
            <div>
              <p className={labelClass}>4. Bordes</p>
              <div className="flex gap-2">
                {VIS_BORDER_STYLES.map(b => {
                  const active = (vi.borderRadius ?? 'medium') === b.id
                  return (
                    <button key={b.id}
                      onClick={() => upVI({ borderRadius: b.id as typeof vi.borderRadius })}
                      className="flex-1 flex flex-col items-center gap-1.5 py-2.5 transition-all"
                      style={{ background: active ? 'rgba(226,182,89,0.12)' : '#F9F8FC', border: `1.5px solid ${active ? 'rgba(226,182,89,0.6)' : '#EEE9F5'}`, borderRadius: 10 }}>
                      <div style={{ width: 20, height: 20, background: active ? vi.primaryColor : '#EADCF9', borderRadius: b.radius }} />
                      <p style={{ fontSize: 9, fontWeight: 600, color: active ? '#B8862A' : 'rgba(42,26,74,0.5)' }}>{b.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 5. ICONOS */}
            <div>
              <p className={labelClass}>5. Iconos</p>
              <div className="flex gap-2">
                {VIS_ICON_STYLES.map(ic => {
                  const active = (vi.iconStyle ?? 'modern') === ic.id
                  return (
                    <button key={ic.id}
                      onClick={() => upVI({ iconStyle: ic.id })}
                      className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-[10px] transition-all"
                      style={{ background: active ? 'rgba(226,182,89,0.12)' : '#F9F8FC', border: `1.5px solid ${active ? 'rgba(226,182,89,0.6)' : '#EEE9F5'}` }}>
                      <span style={{ fontSize: 18, color: active ? vi.primaryColor : '#EADCF9' }}>{ic.preview}</span>
                      <p style={{ fontSize: 9, fontWeight: 600, color: active ? '#B8862A' : 'rgba(42,26,74,0.5)' }}>{ic.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 6. COLORES */}
            <div>
              <p className={labelClass}>6. Colores</p>
              {([
                ['primaryColor',   'Principal'],
                ['secondaryColor', 'Secundario'],
                ['successColor',   'Éxito'],
                ['warningColor',   'Advertencia'],
                ['priorityColor',  'Prioridad'],
              ] as const).map(([field, label]) => {
                const val = (vi[field] ?? '#888888').toLowerCase()
                return (
                  <div key={field} className="flex items-center gap-3 mb-2 p-2.5 rounded-[10px]"
                    style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}>
                    <label className="cursor-pointer relative flex-shrink-0">
                      <input type="color" value={val}
                        onChange={e => upVI({ [field]: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: val, boxShadow: `0 0 8px ${val}60`, border: '2px solid rgba(255,255,255,0.6)' }} />
                    </label>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(42,26,74,0.7)', marginBottom: 1 }}>{label}</p>
                      <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(42,26,74,0.4)' }}>{val}</p>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        )
      })()}

      {/* ── STRATEGIC ── */}
      {section === 'strategic' && (
        <div className="space-y-4">
          {[
            ['businessFocus', '¿Qué hace el negocio?'],
            ['productsServices', 'Productos / Servicios'],
            ['idealCustomer', 'Cliente Ideal'],
            ['problemSolved', 'Problema que resuelve'],
            ['mainPromise', 'Promesa Principal'],
            ['differentiator', 'Diferenciador Único'],
          ].map(([field, label]) => (
            <div key={field}>
              <label className={labelClass}>{label}</label>
              <textarea className={textareaClass} style={inputStyle}
                defaultValue={brand.strategicInfo[field as keyof typeof brand.strategicInfo]}
                onChange={e => up({ strategicInfo: { ...brand.strategicInfo, [field]: e.target.value } })}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── PERSONALITY ── */}
      {section === 'personality' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Tono de Comunicación</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {TONE_OPTIONS.map(t => {
                const isActive = brand.personality.communicationTone === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => up({ personality: { ...brand.personality, communicationTone: t.id } })}
                    className="flex items-center gap-2.5 p-3 rounded-[10px] text-left transition-all"
                    style={{
                      background: isActive ? 'rgba(226,182,89,0.15)' : '#F9F8FC',
                      border: isActive ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                    }}
                  >
                    <span className="text-lg flex-shrink-0">{t.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#2A1A4A]">{t.id}</p>
                      <p className="text-[10px] text-[#2A1A4A]/45">{t.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          <div><label className={labelClass}>Palabras Frecuentes</label>
            <textarea className={textareaClass} style={inputStyle}
              placeholder="Separadas por coma"
              defaultValue={brand.personality.frequentWords.join(', ')}
              onChange={e => up({ personality: { ...brand.personality, frequentWords: e.target.value.split(',').map(w => w.trim()).filter(Boolean) } })}
            /></div>
          <div><label className={labelClass}>Palabras Prohibidas</label>
            <textarea className={textareaClass} style={inputStyle}
              placeholder="Separadas por coma"
              defaultValue={brand.personality.forbiddenWords.join(', ')}
              onChange={e => up({ personality: { ...brand.personality, forbiddenWords: e.target.value.split(',').map(w => w.trim()).filter(Boolean) } })}
            /></div>
        </div>
      )}

      {/* ── KNOWLEDGE BASE ── */}
      {section === 'knowledge' && (
        <div className="space-y-5">
          <div
            className="p-4 rounded-[14px]"
            style={{ background: 'rgba(226,182,89,0.06)', border: '1.5px solid rgba(226,182,89,0.2)' }}
          >
            <p className="text-[11px] font-bold text-[#B8862A] uppercase tracking-widest mb-1">🔐 Bóveda de Conocimiento</p>
            <p className="text-[12px] text-[#2A1A4A]/55 leading-relaxed">
              Los documentos que subas aquí alimentarán el conocimiento de la IA sobre {brand.name}. Todo está aislado por marca.
            </p>
          </div>

          {/* Add Item */}
          <div className="space-y-3">
            <div className="flex gap-1.5 overflow-x-auto">
              {KB_TYPES.map(t => (
                <button key={t.id}
                  onClick={() => { setKbType(t.id); setKbFileData(null) }}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] flex-shrink-0"
                  style={{
                    background: kbType === t.id ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                    border: kbType === t.id ? '1px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                  }}
                >{t.icon} {t.label}</button>
              ))}
            </div>

            {kbType !== 'url' && (
              <>
                <input ref={fileRef} type="file"
                  accept={KB_TYPES.find(t => t.id === kbType)?.accept}
                  onChange={handleKbFile} className="hidden"
                />
                <button onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all"
                  style={{
                    background: kbFileData ? 'rgba(123,207,184,0.08)' : '#F9F8FC',
                    border: kbFileData ? '1px solid rgba(123,207,184,0.4)' : '1.5px dashed #EEE9F5',
                  }}
                >
                  <span className="text-xl">{KB_TYPES.find(t => t.id === kbType)?.icon}</span>
                  <span className="text-[13px] text-[#2A1A4A]/60">
                    {kbFileData ? kbFileData.name : 'Seleccionar archivo'}
                  </span>
                </button>
              </>
            )}

            {kbType === 'url' && (
              <input className={inputClass} style={inputStyle} type="url"
                placeholder="https://"
                value={kbUrl} onChange={e => setKbUrl(e.target.value)}
              />
            )}

            <input className={inputClass} style={inputStyle}
              placeholder="Nombre del documento"
              value={kbName} onChange={e => setKbName(e.target.value)}
            />

            <button onClick={handleSaveKbItem}
              disabled={!kbName.trim()}
              className="w-full py-3 rounded-[10px] font-bold text-[14px] text-[#2A1A4A]"
              style={{
                background: kbName.trim() ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                border: kbName.trim() ? '1px solid rgba(226,182,89,0.4)' : '1px solid #EEE9F5',
              }}
            >+ Agregar a Bóveda</button>
          </div>

          {/* Knowledge Items List */}
          {(brand.knowledgeBase ?? []).length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">
                {brand.knowledgeBase.length} documento{brand.knowledgeBase.length !== 1 ? 's' : ''}
              </p>
              {brand.knowledgeBase.map(item => (
                <div key={item.id}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-[12px]"
                  style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                >
                  <span className="text-xl">{KB_TYPES.find(t => t.id === item.type)?.icon ?? '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#2A1A4A] font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-[#2A1A4A]/40">
                      {new Date(item.uploadedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <button onClick={() => deleteKnowledgeItem(brand.id, item.id)}
                    className="text-[12px] text-[#2A1A4A]/20 hover:text-red-400"
                  >✕</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-[#2A1A4A]/35 text-center py-4">
              La bóveda está vacía
            </p>
          )}
        </div>
      )}
    </div>
  )
}
