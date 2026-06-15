'use client'

import { useEffect } from 'react'
import { getThemePreference, applyTheme } from '@/lib/theme'

export function ThemeInitializer() {
  useEffect(() => {
    const theme = getThemePreference()
    applyTheme(theme)

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('auto')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    return undefined
  }, [])

  return null
}
