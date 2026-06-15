'use client'

import { useState, useEffect, useRef } from 'react'
import { useNexus } from '@/lib/context'

interface Command {
  id: string
  title: string
  description: string
  category: 'brand' | 'module' | 'action'
  icon: string
  onSelect: () => void
  keywords: string[]
}

export function CommandPalette() {
  const { user, switchBrand } = useNexus()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentCommands, setRecentCommands] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Build command list
  const commands: Command[] = [
    // Brands
    ...user.brands.map(b => ({
      id: `brand-${b.id}`,
      title: `Cambiar a ${b.name}`,
      description: b.industry,
      category: 'brand' as const,
      icon: b.logo,
      onSelect: () => {
        switchBrand(b.id)
        addRecentCommand(`brand-${b.id}`)
        setOpen(false)
      },
      keywords: [b.name.toLowerCase(), b.industry.toLowerCase()],
    })),
    // Modules
    {
      id: 'mod-midia',
      title: 'Mi Día',
      description: 'Gestiona tu jornada y tareas',
      category: 'module' as const,
      icon: '📋',
      onSelect: () => {
        const btn = document.querySelector('nav button:nth-child(1)') as HTMLButtonElement | null
        btn?.click()
        addRecentCommand('mod-midia')
        setOpen(false)
      },
      keywords: ['día', 'tareas', 'energía'],
    },
    {
      id: 'mod-calendar',
      title: 'Agenda',
      description: 'Calendario y eventos',
      category: 'module' as const,
      icon: '📅',
      onSelect: () => {
        const btn = document.querySelector('nav button:nth-child(2)') as HTMLButtonElement | null
        btn?.click()
        addRecentCommand('mod-calendar')
        setOpen(false)
      },
      keywords: ['calendario', 'eventos', 'horario'],
    },
    {
      id: 'mod-library',
      title: 'Biblioteca',
      description: 'Archivos y recursos',
      category: 'module' as const,
      icon: '📁',
      onSelect: () => {
        const btn = document.querySelector('nav button:nth-child(3)') as HTMLButtonElement | null
        btn?.click()
        addRecentCommand('mod-library')
        setOpen(false)
      },
      keywords: ['archivos', 'biblioteca', 'recursos'],
    },
    {
      id: 'mod-goals',
      title: 'Metas',
      description: 'Objetivos y metas',
      category: 'module' as const,
      icon: '🎯',
      onSelect: () => {
        const btn = document.querySelector('nav button:nth-child(4)') as HTMLButtonElement | null
        btn?.click()
        addRecentCommand('mod-goals')
        setOpen(false)
      },
      keywords: ['metas', 'objetivos', 'goals'],
    },
    {
      id: 'mod-analytics',
      title: 'Analytics',
      description: 'Análisis y métricas',
      category: 'module' as const,
      icon: '📊',
      onSelect: () => {
        const btn = document.querySelector('nav button:nth-child(5)') as HTMLButtonElement | null
        btn?.click()
        addRecentCommand('mod-analytics')
        setOpen(false)
      },
      keywords: ['analytics', 'métricas', 'rendimiento'],
    },
    {
      id: 'mod-config',
      title: 'Configuración',
      description: 'Configurar marca',
      category: 'module' as const,
      icon: '⚙️',
      onSelect: () => {
        const btn = document.querySelector('nav button:nth-child(6)') as HTMLButtonElement | null
        btn?.click()
        addRecentCommand('mod-config')
        setOpen(false)
      },
      keywords: ['configuración', 'marca', 'settings'],
    },
    // Actions
    {
      id: 'act-help',
      title: 'Ayuda',
      description: 'Ver atajos de teclado',
      category: 'action' as const,
      icon: '❓',
      onSelect: () => {
        alert('Atajos de teclado:\nCmd+K - Abrir Command Palette\nCmd+N - Nueva tarea\nCmd+M - Cambiar marca\nEsc - Cerrar paleta')
        setOpen(false)
      },
      keywords: ['help', 'ayuda', 'atajos', 'shortcuts'],
    },
    {
      id: 'act-theme',
      title: 'Dark Mode',
      description: 'Activar tema oscuro',
      category: 'action' as const,
      icon: '🌙',
      onSelect: () => {
        document.documentElement.classList.toggle('dark')
        addRecentCommand('act-theme')
        setOpen(false)
      },
      keywords: ['dark', 'mode', 'theme', 'oscuro'],
    },
  ]

  // Fuzzy search
  const filteredCommands = search
    ? commands.filter(cmd => {
        const query = search.toLowerCase()
        return (
          cmd.title.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query) ||
          cmd.keywords.some(k => k.includes(query))
        )
      })
    : commands.filter(c => recentCommands.includes(c.id)).reverse()

  const addRecentCommand = (id: string) => {
    setRecentCommands(prev => {
      const filtered = prev.filter(x => x !== id)
      return [id, ...filtered].slice(0, 5)
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!open)
        setSearch('')
      }
      if (open) {
        if (e.key === 'Escape') setOpen(false)
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(i => (i + 1) % filteredCommands.length)
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length)
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          filteredCommands[selectedIndex]?.onSelect()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, search, selectedIndex, filteredCommands])

  // Focus input when opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20"
      style={{ background: 'rgba(42,26,74,0.5)', backdropFilter: 'blur(10px)' }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[500px] rounded-[16px] overflow-hidden shadow-2xl"
        style={{ background: '#ffffff', border: '1px solid #EEE9F5' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className="px-5 py-4 border-b"
          style={{ borderColor: '#EEE9F5' }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: '#E2B659' }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder={search ? '' : 'Busca marcas, módulos, acciones...'}
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setSelectedIndex(0)
              }}
              className="flex-1 text-[15px] outline-none"
              style={{ background: 'transparent', color: '#2A1A4A' }}
            />
            <kbd className="text-[11px] px-2 py-1 rounded" style={{ background: '#F9F8FC', color: '#2A1A4A' }}>
              Esc
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[13px]" style={{ color: '#2A1A4A/50' }}>
                {search ? 'No encontrado' : 'Sin comandos recientes'}
              </p>
            </div>
          ) : (
            <>
              {/* Recent or Grouped by Category */}
              {!search && <p className="px-5 py-3 text-[11px] font-bold uppercase" style={{ color: '#2A1A4A/40' }}>Recientes</p>}

              {/* Group by category if searching */}
              {search ? (
                filteredCommands.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.onSelect()}
                    className="w-full px-5 py-3.5 flex items-center gap-3 transition-all border-b"
                    style={{
                      background: i === selectedIndex ? '#F9F8FC' : 'transparent',
                      borderColor: '#EEE9F5',
                      color: '#2A1A4A',
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="text-lg">{cmd.icon}</span>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-[14px] font-semibold">{cmd.title}</p>
                      <p className="text-[12px]" style={{ color: '#2A1A4A/50' }}>{cmd.description}</p>
                    </div>
                    <span
                      className="text-[10px] px-2 py-1 rounded flex-shrink-0"
                      style={{
                        background: cmd.category === 'brand' ? 'rgba(226,182,89,0.2)' : cmd.category === 'module' ? 'rgba(234,220,249,0.5)' : '#F9F8FC',
                        color: cmd.category === 'brand' ? '#B8862A' : '#2A1A4A',
                      }}
                    >
                      {cmd.category === 'brand' ? 'Marca' : cmd.category === 'module' ? 'Módulo' : 'Acción'}
                    </span>
                  </button>
                ))
              ) : (
                filteredCommands.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    onClick={() => cmd.onSelect()}
                    className="w-full px-5 py-3 flex items-center gap-3 transition-all border-b text-left"
                    style={{
                      background: i === selectedIndex ? '#F9F8FC' : 'transparent',
                      borderColor: '#EEE9F5',
                      color: '#2A1A4A',
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <span className="text-lg">{cmd.icon}</span>
                    <span className="text-[14px] font-semibold">{cmd.title}</span>
                  </button>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t text-[11px] flex justify-between"
          style={{ borderColor: '#EEE9F5', color: '#2A1A4A/40' }}
        >
          <span>↵ Enter para seleccionar</span>
          <span>↑ ↓ para navegar</span>
        </div>
      </div>
    </div>
  )
}
