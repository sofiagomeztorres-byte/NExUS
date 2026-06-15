'use client'

import { useState } from 'react'
import { Brand } from '@/lib/types'

interface BrandSetupWizardProps {
  onComplete: (brand: Omit<Brand, 'id' | 'createdAt'>) => void
  onSkip?: () => void
  initialData?: Partial<Omit<Brand, 'id' | 'createdAt'>>
  submitLabel?: string
}

const TONE_OPTIONS = [
  { value: 'Profesional', icon: '💼', desc: 'Serio, experto, confiable' },
  { value: 'Cercana', icon: '🤝', desc: 'Cálida, humana, amigable' },
  { value: 'Educativa', icon: '📚', desc: 'Didáctica, clara, formativa' },
  { value: 'Inspiradora', icon: '🔥', desc: 'Motivadora, aspiracional' },
  { value: 'Experta', icon: '🎯', desc: 'Técnica, autoritaria' },
  { value: 'Divertida', icon: '✨', desc: 'Ligera, casual, entretenida' },
]

const BG_OPTIONS = [
  { id: 'light',  icon: '☀️', label: 'Claro' },
  { id: 'dark',   icon: '🌙', label: 'Oscuro' },
  { id: 'white',  icon: '🤍', label: 'Blanco' },
  { id: 'gray',   icon: '☁️', label: 'Gris Suave' },
  { id: 'cream',  icon: '🥂', label: 'Crema' },
  { id: 'custom', icon: '🎨', label: 'Custom' },
] as const

const PERSONALITY_TAGS = [
  'Moderna','Premium','Elegante','Minimalista','Tecnológica',
  'Corporativa','Creativa','Inspiradora','Cercana','Exclusiva','Lujo','Sofisticada',
]

const FONT_STYLES = [
  { id: 'modern',    label: 'Moderna',    sample: 'Aa', family: "'Inter', sans-serif" },
  { id: 'elegant',   label: 'Elegante',   sample: 'Aa', family: "'Cormorant Garamond', serif" },
  { id: 'minimal',   label: 'Minimalista',sample: 'Aa', family: "'DM Sans', sans-serif" },
  { id: 'corporate', label: 'Corporativa',sample: 'Aa', family: "'Montserrat', sans-serif" },
  { id: 'creative',  label: 'Creativa',   sample: 'Aa', family: "'Playfair Display', serif" },
  { id: 'editorial', label: 'Editorial',  sample: 'Aa', family: "'Cormorant Garamond', serif" },
] as const

const BORDER_STYLES = [
  { id: 'pill',    label: 'Muy redond.', radius: '999px' },
  { id: 'rounded', label: 'Redondeados', radius: '20px' },
  { id: 'medium',  label: 'Equilibrado', radius: '12px' },
  { id: 'subtle',  label: 'Rectos',      radius: '6px'  },
  { id: 'sharp',   label: 'Corporate',   radius: '2px'  },
] as const

const ICON_STYLES = [
  { id: 'modern',    label: 'Modernos',    preview: '◉' },
  { id: 'premium',   label: 'Premium',     preview: '◆' },
  { id: 'minimal',   label: 'Minimalistas',preview: '○' },
  { id: 'corporate', label: 'Corporativos',preview: '■' },
  { id: 'creative',  label: 'Creativos',   preview: '✦' },
] as const

// BG preset for live preview (lightweight — no full theme.ts dependency)
const BG_PREVIEW: Record<string, { pageBg: string; cardBg: string; cardBorder: string; textColor: string; textSub: string }> = {
  light: { pageBg: '#FAFAFA', cardBg: 'rgba(255,255,255,0.95)', cardBorder: '#EEE9F5',               textColor: '#2A1A4A',  textSub: 'rgba(42,26,74,0.5)' },
  dark:  { pageBg: '#08080E', cardBg: 'rgba(255,255,255,0.06)', cardBorder: 'rgba(255,255,255,0.1)',  textColor: '#F5F3F8',  textSub: 'rgba(245,243,248,0.5)' },
  white: { pageBg: '#FFFFFF', cardBg: 'rgba(246,246,250,0.95)', cardBorder: 'rgba(0,0,0,0.07)',       textColor: '#1A1A2E',  textSub: 'rgba(26,26,46,0.5)' },
  gray:  { pageBg: '#F0EEF5', cardBg: 'rgba(255,255,255,0.92)', cardBorder: 'rgba(120,110,145,0.15)', textColor: '#2A2040',  textSub: 'rgba(42,32,64,0.5)' },
  cream: { pageBg: '#F5EDE0', cardBg: 'rgba(255,252,246,0.93)', cardBorder: 'rgba(180,140,100,0.2)',  textColor: '#2A1A0A',  textSub: 'rgba(42,26,10,0.5)' },
  custom:{ pageBg: '#FAFAFA', cardBg: 'rgba(255,255,255,0.9)',  cardBorder: '#EEE9F5',               textColor: '#2A1A4A',  textSub: 'rgba(42,26,74,0.5)' },
}

const INDUSTRY_SUGGESTIONS = [
  'Coaching', 'Consultoría', 'E-commerce', 'Moda', 'Bienestar',
  'Viajes', 'Educación', 'Marketing', 'Fotografía', 'Gastronomía',
]

const BRAND_TEMPLATES: { name: string; icon: string; data: Partial<Omit<Brand, 'id' | 'createdAt'>> }[] = [
  {
    name: 'Agencia de Viajes',
    icon: '✈️',
    data: {
      logo: '✈️', industry: 'Travel & Tourism',
      visualIdentity: { primaryColor: '#006994', secondaryColor: '#FFB84D', accentColor: '#FFB84D', typography: 'Cormorant Garamond', style: 'Luxury' },
      personality: { communicationTone: 'Inspiradora', frequentWords: ['journey', 'discovery', 'exclusive', 'curated'], forbiddenWords: ['cheap', 'budget'] },
      strategicInfo: { businessFocus: '', productsServices: 'Paquetes de viaje personalizados, tours exclusivos', idealCustomer: '', problemSolved: 'Planificar viajes únicos sin estrés', mainPromise: 'Viajes inolvidables y personalizados', differentiator: 'Servicio de conserjería 24/7' },
    },
  },
  {
    name: 'Bienestar & Salud',
    icon: '🌱',
    data: {
      logo: '🌱', industry: 'Health & Wellness',
      visualIdentity: { primaryColor: '#2D6A4F', secondaryColor: '#95D5B2', accentColor: '#E2B659', typography: 'Inter', style: 'Modern' },
      personality: { communicationTone: 'Inspiradora', frequentWords: ['wellness', 'balance', 'natural', 'holistic'], forbiddenWords: ['cure', 'miracle'] },
      strategicInfo: { businessFocus: '', productsServices: '', idealCustomer: '', problemSolved: '', mainPromise: '', differentiator: '' },
    },
  },
  {
    name: 'Creador de Contenido',
    icon: '🎥',
    data: {
      logo: '🎥', industry: 'Content Creation',
      visualIdentity: { primaryColor: '#7B2D8B', secondaryColor: '#FF6B6B', accentColor: '#E2B659', typography: 'Inter', style: 'Bold' },
      personality: { communicationTone: 'Cercana', frequentWords: ['authentic', 'behind the scenes', 'real talk'], forbiddenWords: ['fake', 'scripted'] },
      strategicInfo: { businessFocus: '', productsServices: '', idealCustomer: '', problemSolved: '', mainPromise: '', differentiator: '' },
    },
  },
  {
    name: 'Negocio Local',
    icon: '🏢',
    data: {
      logo: '🏢', industry: 'Local Business',
      visualIdentity: { primaryColor: '#2A1A4A', secondaryColor: '#E2B659', accentColor: '#E2B659', typography: 'Inter', style: 'Modern' },
      personality: { communicationTone: 'Cercana', frequentWords: [], forbiddenWords: [] },
      strategicInfo: { businessFocus: '', productsServices: '', idealCustomer: '', problemSolved: '', mainPromise: '', differentiator: '' },
    },
  },
  {
    name: 'E-commerce',
    icon: '🛒',
    data: {
      logo: '🛒', industry: 'E-commerce',
      visualIdentity: { primaryColor: '#1A1A2E', secondaryColor: '#E94560', accentColor: '#E2B659', typography: 'Inter', style: 'Bold' },
      personality: { communicationTone: 'Cercana', frequentWords: ['new arrival', 'limited edition', 'exclusive'], forbiddenWords: [] },
      strategicInfo: { businessFocus: '', productsServices: '', idealCustomer: '', problemSolved: '', mainPromise: 'Productos de calidad con entrega rápida', differentiator: '' },
    },
  },
]

// ─── Label ───────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,243,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>
      {children}
    </p>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({ value, onChange, placeholder, type = 'text', multiline = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; multiline?: boolean
}) {
  const style: React.CSSProperties = {
    width: '100%', padding: '13px 15px', borderRadius: 12, fontSize: 15,
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,243,248,0.1)',
    color: '#F5F3F8', outline: 'none', resize: 'none' as const,
  }
  if (multiline) return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{ ...style, lineHeight: 1.5 }}
      className="placeholder:text-[rgba(245,243,248,0.25)]"
    />
  )
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={style}
      className="placeholder:text-[rgba(245,243,248,0.25)]"
    />
  )
}

export function BrandSetupWizard({ onComplete, onSkip, initialData, submitLabel = 'Crear Marca ✦' }: BrandSetupWizardProps) {
  const [step, setStep] = useState(0) // 0 = template picker, 1-5 = setup steps
  const totalSteps = 5

  // Step 1: General
  const [logo, setLogo] = useState(initialData?.logo ?? '✨')
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [industry, setIndustry] = useState(initialData?.industry ?? '')
  const [website, setWebsite] = useState(initialData?.website ?? '')

  // Step 2: Cliente Ideal
  const [targetAudience, setTargetAudience] = useState(initialData?.strategicInfo?.idealCustomer ?? '')
  const [clientProblem, setClientProblem] = useState(initialData?.strategicInfo?.problemSolved ?? '')
  const [clientGoal, setClientGoal] = useState(initialData?.strategicInfo?.mainPromise ?? '')

  // Step 3: Tu Negocio
  const [productsServices, setProductsServices] = useState(initialData?.strategicInfo?.productsServices ?? '')
  const [differentiator, setDifferentiator] = useState(initialData?.strategicInfo?.differentiator ?? '')

  // Step 4: Comunicación
  const [tone, setTone] = useState(initialData?.personality?.communicationTone ?? '')
  const [frequentWordsInput, setFrequentWordsInput] = useState(initialData?.personality?.frequentWords?.join(', ') ?? '')
  const [forbiddenWordsInput, setForbiddenWordsInput] = useState(initialData?.personality?.forbiddenWords?.join(', ') ?? '')

  // Step 5: Visual Universe
  const [primaryColor,   setPrimaryColor]   = useState((initialData?.visualIdentity?.primaryColor   ?? '#6b3fa0').toLowerCase())
  const [secondaryColor, setSecondaryColor] = useState((initialData?.visualIdentity?.secondaryColor ?? '#e2b659').toLowerCase())
  const [successColor,   setSuccessColor]   = useState((initialData?.visualIdentity?.successColor   ?? '#22c55e').toLowerCase())
  const [warningColor,   setWarningColor]   = useState((initialData?.visualIdentity?.warningColor   ?? '#f59e0b').toLowerCase())
  const [priorityColor,  setPriorityColor]  = useState((initialData?.visualIdentity?.priorityColor  ?? '#ef4444').toLowerCase())
  const [bgStyle,        setBgStyle]        = useState(initialData?.visualIdentity?.backgroundStyle ?? 'light')
  const [customBgColor,  setCustomBgColor]  = useState(initialData?.visualIdentity?.customBgColor   ?? '#f0f0f0')
  const [personalities,  setPersonalities]  = useState<string[]>(
    initialData?.visualIdentity?.visualPersonality
      ? initialData.visualIdentity.visualPersonality.split(',').filter(Boolean)
      : []
  )
  const [fontStyleChoice, setFontStyleChoice] = useState(initialData?.visualIdentity?.fontStyle ?? 'modern')
  const [borderChoice,    setBorderChoice]    = useState(initialData?.visualIdentity?.borderRadius ?? 'medium')
  const [iconChoice,      setIconChoice]      = useState(initialData?.visualIdentity?.iconStyle   ?? 'modern')

  const applyTemplate = (t: (typeof BRAND_TEMPLATES)[0]) => {
    if (t.data.logo) setLogo(t.data.logo)
    if (t.data.industry) setIndustry(t.data.industry)
    if (t.data.visualIdentity?.primaryColor) setPrimaryColor(t.data.visualIdentity.primaryColor)
    if (t.data.visualIdentity?.secondaryColor) setSecondaryColor(t.data.visualIdentity.secondaryColor)
    // style is now fontStyle — skip since applyTemplate data doesn't have fontStyle
    if (t.data.personality?.communicationTone) setTone(t.data.personality.communicationTone)
    if (t.data.personality?.frequentWords) setFrequentWordsInput(t.data.personality.frequentWords.join(', '))
    if (t.data.strategicInfo?.productsServices) setProductsServices(t.data.strategicInfo.productsServices)
    if (t.data.strategicInfo?.mainPromise) setClientGoal(t.data.strategicInfo.mainPromise)
    if (t.data.strategicInfo?.differentiator) setDifferentiator(t.data.strategicInfo.differentiator)
    if (t.data.strategicInfo?.problemSolved) setClientProblem(t.data.strategicInfo.problemSolved)
    setStep(1)
  }

  const handleComplete = () => {
    const brand: Omit<Brand, 'id' | 'createdAt'> = {
      logo, name: name.trim(), description, industry, website,
      socialMediaLinks: initialData?.socialMediaLinks ?? {},
      visualIdentity: {
        primaryColor,
        secondaryColor,
        accentColor: secondaryColor,
        successColor,
        warningColor,
        priorityColor,
        backgroundStyle: bgStyle as 'light' | 'dark' | 'white' | 'gray' | 'cream' | 'custom',
        customBgColor: bgStyle === 'custom' ? customBgColor : undefined,
        typography: FONT_STYLES.find(f => f.id === fontStyleChoice)?.family ?? 'Inter',
        fontStyle: fontStyleChoice as 'modern' | 'elegant' | 'minimal' | 'corporate' | 'creative' | 'editorial',
        style: fontStyleChoice,
        borderRadius: borderChoice as 'sharp' | 'subtle' | 'medium' | 'rounded' | 'pill',
        density: 'comfortable',
        iconStyle: iconChoice,
        visualPersonality: personalities.join(','),
      },
      strategicInfo: {
        businessFocus: productsServices,
        productsServices, idealCustomer: targetAudience,
        problemSolved: clientProblem, mainPromise: clientGoal,
        differentiator,
      },
      personality: {
        communicationTone: tone,
        frequentWords: frequentWordsInput.split(',').map(w => w.trim()).filter(Boolean),
        forbiddenWords: forbiddenWordsInput.split(',').map(w => w.trim()).filter(Boolean),
      },
      knowledgeBase: initialData?.knowledgeBase ?? [],
      importantLinks: initialData?.importantLinks ?? [],
    }
    onComplete(brand)
  }

  const canProceed = step === 1 ? name.trim().length > 0 : true

  const bg = '#08080E'
  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,243,248,0.08)', borderRadius: 14, padding: '14px 16px' }

  // ── STEP 0: Template Picker ──
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: bg, maxWidth: 430, margin: '0 auto' }}>
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="px-6 pt-14 pb-6">
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: '#F5F3F8', marginBottom: 6 }}>
              Nueva Marca
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(245,243,248,0.4)', lineHeight: 1.5 }}>
              Empieza desde cero o usa una plantilla.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8">
            {/* From scratch */}
            <button
              onClick={() => setStep(1)}
              className="w-full text-left mb-6 transition-all active:scale-[0.98]"
              style={{ ...card, borderColor: 'rgba(226,182,89,0.3)', background: 'rgba(226,182,89,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(226,182,89,0.1)' }}>✦</div>
                <div>
                  <p style={{ fontWeight: 600, color: '#E2B659', fontSize: 15 }}>Crear desde cero</p>
                  <p style={{ fontSize: 12, color: 'rgba(245,243,248,0.35)', marginTop: 2 }}>Configura cada detalle tú misma</p>
                </div>
              </div>
            </button>

            {/* Templates */}
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,243,248,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Plantillas
            </p>
            <div className="space-y-2">
              {BRAND_TEMPLATES.map(t => (
                <button
                  key={t.name}
                  onClick={() => applyTemplate(t)}
                  className="w-full text-left transition-all active:scale-[0.98]"
                  style={card}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>{t.icon}</div>
                    <div>
                      <p style={{ fontWeight: 600, color: '#F5F3F8', fontSize: 15 }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: 'rgba(245,243,248,0.35)', marginTop: 2 }}>Tono + colores + palabras clave precargados</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(245,243,248,0.25)', fontSize: 16 }}>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {onSkip && (
            <div className="px-6 pb-10">
              <button onClick={onSkip} style={{ width: '100%', textAlign: 'center', fontSize: 13, color: 'rgba(245,243,248,0.3)', padding: '10px 0' }}>
                Saltar — agregaré mi marca después
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── STEPS 1–5 ──
  const stepTitles = ['Información General', 'Cliente Ideal', 'Tu Negocio', 'Comunicación', 'Diseña tu Universo Visual']
  const stepIcons = ['🏷', '👤', '💡', '💬', '🎨']

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: bg, maxWidth: 430, margin: '0 auto' }}>
      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <div className="px-6 pt-12 pb-5 flex-shrink-0">
          {/* Step dots */}
          <div className="flex items-center gap-1.5 mb-5">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} style={{
                height: 3, borderRadius: 2, transition: 'all 0.3s',
                flex: i + 1 === step ? 2 : 1,
                background: i + 1 < step ? '#E2B659' : i + 1 === step ? 'rgba(226,182,89,0.8)' : 'rgba(255,255,255,0.1)',
              }} />
            ))}
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 20 }}>{stepIcons[step - 1]}</span>
            <p style={{ fontSize: 12, color: 'rgba(226,182,89,0.7)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Paso {step} de {totalSteps}
            </p>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#F5F3F8' }}>
            {stepTitles[step - 1]}
          </h2>
        </div>

        {/* Content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div style={{ paddingBottom: 16 }}>

            {/* ── STEP 1: Información General ── */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Logo + Name */}
                <div className="flex gap-3">
                  <div style={{ flexShrink: 0 }}>
                    <Label>Ícono</Label>
                    <input
                      type="text" maxLength={2} value={logo} onChange={e => setLogo(e.target.value)}
                      style={{ width: 56, height: 52, textAlign: 'center', fontSize: 24, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,243,248,0.1)', color: '#F5F3F8', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>Nombre de la marca *</Label>
                    <Input value={name} onChange={setName} placeholder="Ej: Paola Coaching" />
                  </div>
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Input value={description} onChange={setDescription} placeholder="¿Qué hace esta marca en una oración?" multiline />
                </div>

                <div>
                  <Label>Industria</Label>
                  <Input value={industry} onChange={setIndustry} placeholder="Ej: Coaching · Moda · Viajes" />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {INDUSTRY_SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => setIndustry(s)}
                        style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: industry === s ? 'rgba(226,182,89,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${industry === s ? 'rgba(226,182,89,0.5)' : 'rgba(255,255,255,0.08)'}`, color: industry === s ? '#E2B659' : 'rgba(245,243,248,0.45)' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Sitio Web</Label>
                  <Input value={website} onChange={setWebsite} placeholder="https://tumarca.com" type="url" />
                </div>
              </div>
            )}

            {/* ── STEP 2: Cliente Ideal ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div style={{ ...card, marginBottom: 4 }}>
                  <p style={{ fontSize: 13, color: 'rgba(245,243,248,0.45)', lineHeight: 1.5 }}>
                    Describe a la persona que más se beneficia de lo que ofreces. Cuanto más específica, mejor te ayudará NExUS.
                  </p>
                </div>

                <div>
                  <Label>¿Quién es tu cliente ideal?</Label>
                  <Input value={targetAudience} onChange={setTargetAudience}
                    placeholder="Ej: Mujeres de 30–45 años, emprendedoras que quieren escalar su negocio online sin perder el equilibrio personal."
                    multiline />
                </div>

                <div>
                  <Label>Problema principal que resuelves</Label>
                  <Input value={clientProblem} onChange={setClientProblem}
                    placeholder="Ej: No saben cómo atraer clientes de forma constante sin depender de referidos."
                    multiline />
                </div>

                <div>
                  <Label>Objetivo principal de tu cliente</Label>
                  <Input value={clientGoal} onChange={setClientGoal}
                    placeholder="Ej: Tener un negocio estable que les dé libertad financiera y de tiempo."
                    multiline />
                </div>
              </div>
            )}

            {/* ── STEP 3: Tu Negocio ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>¿Qué vendes o ofreces?</Label>
                  <Input value={productsServices} onChange={setProductsServices}
                    placeholder="Ej: Programas de coaching 1:1, cursos online, mentoría grupal mensual."
                    multiline />
                </div>

                <div>
                  <Label>¿Qué te hace diferente?</Label>
                  <Input value={differentiator} onChange={setDifferentiator}
                    placeholder="Ej: Metodología propia de 90 días con resultados medibles desde la primera semana."
                    multiline />
                </div>
              </div>
            )}

            {/* ── STEP 4: Comunicación ── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <Label>Tono de comunicación</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {TONE_OPTIONS.map(t => (
                      <button key={t.value} onClick={() => setTone(t.value)}
                        className="text-left transition-all active:scale-95"
                        style={{ padding: '12px 14px', borderRadius: 12, background: tone === t.value ? 'rgba(226,182,89,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${tone === t.value ? 'rgba(226,182,89,0.6)' : 'rgba(255,255,255,0.07)'}` }}>
                        <p style={{ fontSize: 18, marginBottom: 3 }}>{t.icon}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: tone === t.value ? '#E2B659' : '#F5F3F8' }}>{t.value}</p>
                        <p style={{ fontSize: 11, color: 'rgba(245,243,248,0.35)', marginTop: 1 }}>{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Palabras frecuentes (separadas por coma)</Label>
                  <Input value={frequentWordsInput} onChange={setFrequentWordsInput}
                    placeholder="Ej: transformación, claridad, resultados, sistema" />
                </div>

                <div>
                  <Label>Palabras prohibidas (separadas por coma)</Label>
                  <Input value={forbiddenWordsInput} onChange={setForbiddenWordsInput}
                    placeholder="Ej: barato, fácil, rápido, mágico" />
                </div>
              </div>
            )}

            {/* ── STEP 5: Diseña tu Universo Visual ── */}
            {step === 5 && (() => {
              const prev = BG_PREVIEW[bgStyle] ?? BG_PREVIEW.light
              const prevBg = bgStyle === 'custom' ? customBgColor : prev.pageBg
              const fontFamily = FONT_STYLES.find(f => f.id === fontStyleChoice)?.family ?? "'Inter', sans-serif"
              const borderRadius = BORDER_STYLES.find(b => b.id === borderChoice)?.radius ?? '12px'

              return (
                <div className="space-y-5">

                  {/* ── LIVE PREVIEW ── */}
                  <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid rgba(226,182,89,0.3)' }}>
                    <div style={{ background: prevBg, padding: '12px 14px', transition: 'background 0.4s' }}>
                      {/* Mini header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{logo}</div>
                        <span style={{ fontFamily, fontSize: 13, fontWeight: 600, color: prev.textColor }}>{name || 'Tu Marca'}</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                          {[primaryColor, secondaryColor, successColor].map((c, i) => (
                            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                          ))}
                        </div>
                      </div>
                      {/* Mini card */}
                      <div style={{ background: prev.cardBg, border: `1px solid ${prev.cardBorder}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                        <p style={{ fontFamily, fontSize: 12, fontWeight: 600, color: prev.textColor, marginBottom: 4 }}>Dashboard</p>
                        <p style={{ fontFamily, fontSize: 11, color: prev.textSub, marginBottom: 8 }}>Resumen de actividad</p>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <div style={{ flex: 1, padding: '6px 10px', background: primaryColor, borderRadius, textAlign: 'center' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', fontFamily }}>Principal</span>
                          </div>
                          <div style={{ flex: 1, padding: '6px 10px', background: `${secondaryColor}22`, border: `1px solid ${secondaryColor}`, borderRadius, textAlign: 'center' }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: secondaryColor, fontFamily }}>Sec.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(226,182,89,0.06)', padding: '6px 14px', borderTop: '1px solid rgba(226,182,89,0.2)' }}>
                      <p style={{ fontSize: 10, color: 'rgba(226,182,89,0.8)', letterSpacing: '0.08em' }}>VISTA PREVIA EN TIEMPO REAL</p>
                    </div>
                  </div>

                  {/* ── 1. FONDO ── */}
                  <div>
                    <Label>1. Estilo de fondo</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {BG_OPTIONS.map(b => (
                        <button key={b.id} onClick={() => setBgStyle(b.id)}
                          style={{ padding: '10px 6px', borderRadius: 10, textAlign: 'center', background: bgStyle === b.id ? 'rgba(226,182,89,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${bgStyle === b.id ? 'rgba(226,182,89,0.6)' : 'rgba(255,255,255,0.08)'}` }}>
                          <div style={{ fontSize: 18, marginBottom: 3 }}>{b.icon}</div>
                          <p style={{ fontSize: 11, fontWeight: 600, color: bgStyle === b.id ? '#E2B659' : 'rgba(245,243,248,0.6)' }}>{b.label}</p>
                        </button>
                      ))}
                    </div>
                    {bgStyle === 'custom' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,243,248,0.1)' }}>
                        <label style={{ cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                          <input type="color" value={customBgColor} onChange={e => setCustomBgColor(e.target.value)}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: customBgColor, border: '2px solid rgba(255,255,255,0.2)' }} />
                        </label>
                        <span style={{ fontSize: 13, color: 'rgba(245,243,248,0.6)', fontFamily: 'monospace' }}>{customBgColor}</span>
                      </div>
                    )}
                  </div>

                  {/* ── 2. PERSONALIDAD ── */}
                  <div>
                    <Label>2. Estilo de marca (puedes elegir varios)</Label>
                    <div className="flex flex-wrap gap-2">
                      {PERSONALITY_TAGS.map(tag => {
                        const active = personalities.includes(tag)
                        return (
                          <button key={tag}
                            onClick={() => setPersonalities(p => active ? p.filter(x => x !== tag) : [...p, tag])}
                            style={{ padding: '6px 13px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: active ? 'rgba(226,182,89,0.15)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${active ? 'rgba(226,182,89,0.6)' : 'rgba(255,255,255,0.08)'}`, color: active ? '#E2B659' : 'rgba(245,243,248,0.5)' }}>
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* ── 3. TIPOGRAFÍA ── */}
                  <div>
                    <Label>3. Tipografía</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {FONT_STYLES.map(f => (
                        <button key={f.id} onClick={() => setFontStyleChoice(f.id)}
                          style={{ padding: '10px 12px', borderRadius: 10, textAlign: 'left', background: fontStyleChoice === f.id ? 'rgba(226,182,89,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${fontStyleChoice === f.id ? 'rgba(226,182,89,0.6)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 22, fontFamily: f.family, color: fontStyleChoice === f.id ? '#E2B659' : '#F5F3F8', fontWeight: 500, width: 28, flexShrink: 0 }}>{f.sample}</span>
                          <p style={{ fontSize: 12, fontWeight: 600, color: fontStyleChoice === f.id ? '#E2B659' : 'rgba(245,243,248,0.7)' }}>{f.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── 4. BORDES ── */}
                  <div>
                    <Label>4. Bordes</Label>
                    <div className="flex gap-2">
                      {BORDER_STYLES.map(b => (
                        <button key={b.id} onClick={() => setBorderChoice(b.id)}
                          style={{ flex: 1, padding: '8px 4px', borderRadius: 10, textAlign: 'center', background: borderChoice === b.id ? 'rgba(226,182,89,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${borderChoice === b.id ? 'rgba(226,182,89,0.6)' : 'rgba(255,255,255,0.08)'}` }}>
                          <div style={{ width: 20, height: 20, background: borderChoice === b.id ? primaryColor : 'rgba(214,188,250,0.4)', borderRadius: b.radius, margin: '0 auto 4px' }} />
                          <p style={{ fontSize: 9, fontWeight: 600, color: borderChoice === b.id ? '#E2B659' : 'rgba(245,243,248,0.5)' }}>{b.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── 5. ICONOS ── */}
                  <div>
                    <Label>5. Iconos</Label>
                    <div className="flex gap-2">
                      {ICON_STYLES.map(ic => (
                        <button key={ic.id} onClick={() => setIconChoice(ic.id)}
                          style={{ flex: 1, padding: '8px 4px', borderRadius: 10, textAlign: 'center', background: iconChoice === ic.id ? 'rgba(226,182,89,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${iconChoice === ic.id ? 'rgba(226,182,89,0.6)' : 'rgba(255,255,255,0.08)'}` }}>
                          <span style={{ fontSize: 18, color: iconChoice === ic.id ? primaryColor : 'rgba(214,188,250,0.5)', display: 'block', marginBottom: 3 }}>{ic.preview}</span>
                          <p style={{ fontSize: 9, fontWeight: 600, color: iconChoice === ic.id ? '#E2B659' : 'rgba(245,243,248,0.5)' }}>{ic.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── 6. COLORES ── */}
                  <div>
                    <Label>6. Colores</Label>
                    {([
                      ['Principal',   primaryColor,  setPrimaryColor],
                      ['Secundario',  secondaryColor, setSecondaryColor],
                      ['Éxito',       successColor,  setSuccessColor],
                      ['Advertencia', warningColor,  setWarningColor],
                      ['Prioridad',   priorityColor, setPriorityColor],
                    ] as [string, string, (v: string) => void][]).map(([label, value, setter]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,243,248,0.08)', marginBottom: 6 }}>
                        <label style={{ cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                          <input type="color" value={value} onChange={e => setter(e.target.value)}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: value, border: '2px solid rgba(255,255,255,0.2)', boxShadow: `0 0 8px ${value}60` }} />
                        </label>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(245,243,248,0.7)', marginBottom: 1 }}>{label}</p>
                          <p style={{ fontSize: 11, color: 'rgba(245,243,248,0.35)', fontFamily: 'monospace' }}>{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )
            })()}
          </div>
        </div>

        {/* Footer navigation */}
        <div className="px-6 pb-10 pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {step < totalSteps ? (
            <div className="flex gap-3">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)}
                  style={{ flex: 1, padding: '15px 0', borderRadius: 14, fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,243,248,0.6)' }}>
                  ← Anterior
                </button>
              )}
              <button
                onClick={() => canProceed && setStep(s => s + 1)}
                style={{ flex: 3, padding: '15px 0', borderRadius: 14, fontSize: 15, fontWeight: 700, background: canProceed ? 'linear-gradient(135deg, #E2B659, #B8862A)' : 'rgba(255,255,255,0.06)', border: 'none', color: canProceed ? '#08080E' : 'rgba(245,243,248,0.2)', cursor: canProceed ? 'pointer' : 'not-allowed', letterSpacing: '0.02em' }}>
                {step === 1 && !name.trim() ? 'Nombre requerido' : 'Siguiente →'}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setStep(s => s - 1)}
                style={{ flex: 1, padding: '15px 0', borderRadius: 14, fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(245,243,248,0.6)' }}>
                ← Anterior
              </button>
              <button onClick={handleComplete}
                style={{ flex: 3, padding: '15px 0', borderRadius: 14, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #E2B659, #B8862A)', border: 'none', color: '#08080E', letterSpacing: '0.02em' }}>
                {submitLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
