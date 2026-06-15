// Theme system for NExUS
export type Theme = 'light' | 'dark' | 'auto'

export const THEMES = {
  light: {
    background: '#FAFAFA',
    surface: '#ffffff',
    text: '#2A1A4A',
    textSecondary: 'rgba(42,26,74,0.5)',
    textTertiary: 'rgba(42,26,74,0.35)',
    border: '#EEE9F5',
    accent: '#E2B659',
    accentSecondary: '#FFB84D',
    card: 'rgba(255,255,255,0.85)',
  },
  dark: {
    background: '#0F0815',
    surface: '#1A1520',
    text: '#F5F3F8',
    textSecondary: 'rgba(245,243,248,0.6)',
    textTertiary: 'rgba(245,243,248,0.4)',
    border: '#2D2435',
    accent: '#E2B659',
    accentSecondary: '#FFB84D',
    card: 'rgba(26,21,32,0.85)',
  },
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light'
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return

  const effectiveTheme = theme === 'auto' ? getSystemTheme() : theme
  const colors = THEMES[effectiveTheme]

  // Apply CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value)
  })

  // Apply class for dark mode
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function saveThemePreference(theme: Theme) {
  localStorage.setItem('nexus_theme', theme)
  applyTheme(theme)
}

export function getThemePreference(): Theme {
  if (typeof window === 'undefined') return 'light'
  return (localStorage.getItem('nexus_theme') as Theme) || 'auto'
}

// ─── Per-Brand Visual Theme System ────────────────────────────────────────

import type { Brand } from './types'

export interface BrandTheme {
  vars: Record<string, string>
  mode: 'light' | 'dark' | 'white' | 'gray' | 'cream' | 'custom'
  isDark: boolean
}

const FONT_MAP: Record<string, string> = {
  inter:      "'Inter', sans-serif",
  cormorant:  "'Cormorant Garamond', serif",
  playfair:   "'Playfair Display', serif",
  montserrat: "'Montserrat', sans-serif",
  'dm-sans':  "'DM Sans', sans-serif",
}

const FONT_STYLE_FAMILY: Record<string, string> = {
  modern:    'inter',
  elegant:   'cormorant',
  minimal:   'dm-sans',
  corporate: 'montserrat',
  creative:  'playfair',
  editorial: 'cormorant',
}

const RADIUS_MAP: Record<string, string> = {
  sharp:   '2px',
  subtle:  '6px',
  medium:  '12px',
  rounded: '20px',
  pill:    '999px',
}

const BG_PRESETS: Record<string, Record<string, string>> = {
  light: {
    '--page-bg':        '#FAFAFA',
    '--card-bg':        'rgba(255,255,255,0.9)',
    '--card-border':    '#EEE9F5',
    '--card-shadow':    '0 2px 8px rgba(0,0,0,0.02)',
    '--surface-bg':     'rgba(255,255,255,0.95)',
    '--surface-border': '#EEE9F5',
    '--input-bg':       '#F9F8FC',
    '--input-border':   '#EEE9F5',
    '--text-primary':   '#2A1A4A',
    '--text-secondary': 'rgba(42,26,74,0.55)',
    '--text-tertiary':  'rgba(42,26,74,0.32)',
    '--nav-bg':         'rgba(255,255,255,0.96)',
    '--nav-border':     'rgba(214,188,250,0.2)',
    '--divider':        'rgba(42,26,74,0.08)',
  },
  dark: {
    '--page-bg':        '#08080E',
    '--card-bg':        'rgba(255,255,255,0.05)',
    '--card-border':    'rgba(255,255,255,0.09)',
    '--card-shadow':    '0 2px 20px rgba(0,0,0,0.4)',
    '--surface-bg':     'rgba(12,10,20,0.97)',
    '--surface-border': 'rgba(255,255,255,0.07)',
    '--input-bg':       'rgba(255,255,255,0.07)',
    '--input-border':   'rgba(255,255,255,0.12)',
    '--text-primary':   '#F5F3F8',
    '--text-secondary': 'rgba(245,243,248,0.55)',
    '--text-tertiary':  'rgba(245,243,248,0.3)',
    '--nav-bg':         'rgba(8,8,14,0.97)',
    '--nav-border':     'rgba(255,255,255,0.06)',
    '--divider':        'rgba(255,255,255,0.07)',
  },
  white: {
    '--page-bg':        '#FFFFFF',
    '--card-bg':        'rgba(246,246,250,0.95)',
    '--card-border':    'rgba(0,0,0,0.07)',
    '--card-shadow':    '0 1px 4px rgba(0,0,0,0.04)',
    '--surface-bg':     'rgba(255,255,255,0.99)',
    '--surface-border': 'rgba(0,0,0,0.06)',
    '--input-bg':       '#F4F4F8',
    '--input-border':   'rgba(0,0,0,0.09)',
    '--text-primary':   '#1A1A2E',
    '--text-secondary': 'rgba(26,26,46,0.55)',
    '--text-tertiary':  'rgba(26,26,46,0.32)',
    '--nav-bg':         'rgba(255,255,255,0.99)',
    '--nav-border':     'rgba(0,0,0,0.06)',
    '--divider':        'rgba(0,0,0,0.06)',
  },
  gray: {
    '--page-bg':        '#F0EEF5',
    '--card-bg':        'rgba(255,255,255,0.92)',
    '--card-border':    'rgba(120,110,145,0.15)',
    '--card-shadow':    '0 2px 6px rgba(0,0,0,0.04)',
    '--surface-bg':     'rgba(240,238,245,0.97)',
    '--surface-border': 'rgba(120,110,145,0.12)',
    '--input-bg':       '#FFFFFF',
    '--input-border':   'rgba(120,110,145,0.2)',
    '--text-primary':   '#2A2040',
    '--text-secondary': 'rgba(42,32,64,0.55)',
    '--text-tertiary':  'rgba(42,32,64,0.32)',
    '--nav-bg':         'rgba(240,238,245,0.97)',
    '--nav-border':     'rgba(120,110,145,0.1)',
    '--divider':        'rgba(120,110,145,0.1)',
  },
  cream: {
    '--page-bg':        '#F5EDE0',
    '--card-bg':        'rgba(255,252,246,0.93)',
    '--card-border':    'rgba(180,140,100,0.2)',
    '--card-shadow':    '0 2px 8px rgba(100,70,30,0.06)',
    '--surface-bg':     'rgba(245,237,224,0.97)',
    '--surface-border': 'rgba(180,140,100,0.15)',
    '--input-bg':       'rgba(255,252,246,0.85)',
    '--input-border':   'rgba(180,140,100,0.22)',
    '--text-primary':   '#2A1A0A',
    '--text-secondary': 'rgba(42,26,10,0.55)',
    '--text-tertiary':  'rgba(42,26,10,0.32)',
    '--nav-bg':         'rgba(245,237,224,0.98)',
    '--nav-border':     'rgba(180,140,100,0.12)',
    '--divider':        'rgba(180,140,100,0.12)',
  },
}

export function computeTheme(brand: Brand | undefined): BrandTheme {
  const vi = brand?.visualIdentity
  const bgStyle = vi?.backgroundStyle ?? 'light'
  const preset = BG_PRESETS[bgStyle] ?? BG_PRESETS.light

  const resolvedFamily = vi?.fontStyle
    ? (FONT_STYLE_FAMILY[vi.fontStyle] ?? vi?.fontFamily ?? 'inter')
    : (vi?.fontFamily ?? 'inter')

  const vars: Record<string, string> = {
    '--brand-primary':   vi?.primaryColor   ?? '#6B3FA0',
    '--brand-secondary': vi?.secondaryColor ?? '#E2B659',
    '--brand-accent':    vi?.accentColor    ?? vi?.secondaryColor ?? '#E2B659',
    '--brand-success':   vi?.successColor   ?? '#22C55E',
    '--brand-warning':   vi?.warningColor   ?? '#F59E0B',
    '--brand-priority':  vi?.priorityColor  ?? '#EF4444',
    '--brand-font':      FONT_MAP[resolvedFamily] ?? "'Inter', sans-serif",
    '--brand-radius':    RADIUS_MAP[vi?.borderRadius ?? 'medium'] ?? '12px',
    ...preset,
  }

  if (bgStyle === 'custom' && vi?.customBgColor) {
    vars['--page-bg'] = vi.customBgColor
  }

  const validModes = ['light', 'dark', 'white', 'gray', 'cream', 'custom']
  const mode = validModes.includes(bgStyle) ? (bgStyle as BrandTheme['mode']) : 'light'

  return { vars, mode, isDark: mode === 'dark' }
}

export function getBgPreset(bgStyle: string): Record<string, string> {
  return BG_PRESETS[bgStyle] ?? BG_PRESETS.light
}
