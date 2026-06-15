'use client'

import { useState } from 'react'
import { NexusSymbol } from './NexusSymbol'

interface NexusHubProps {
  open: boolean
  onClose: () => void
  onNavigate: (view: string) => void
}

const HUB_ACTIONS = [
  { id: 'mi-dia',    icon: '📅', label: 'Organizar mi día',   desc: 'Energía, tareas y prioridades' },
  { id: 'goals',     icon: '🎯', label: 'Crear meta',          desc: 'Define un nuevo objetivo' },
  { id: 'library',   icon: '📚', label: 'Buscar recurso',      desc: 'Explora tu biblioteca' },
  { id: 'analytics', icon: '📊', label: 'Analizar contenido',  desc: 'Mide tu rendimiento' },
  { id: 'calendar',  icon: '👥', label: 'Revisar agenda',      desc: 'Eventos y programación' },
  { id: 'mi-dia',    icon: '💡', label: 'Generar ideas',       desc: 'Brainstorm y creatividad' },
  { id: 'brand',     icon: '⚙️', label: 'Ir a una marca',     desc: 'Cambia de espacio de trabajo' },
]

export function NexusHub({ open, onClose, onNavigate }: NexusHubProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col justify-end"
      style={{ maxWidth: 430, margin: '0 auto', background: 'rgba(8,8,14,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-[28px] pb-10 overflow-hidden"
        style={{
          background: '#0F0B1A',
          border: '1px solid rgba(214,188,250,0.12)',
          borderBottom: 'none',
          boxShadow: '0 -8px 40px rgba(226,182,89,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Pull indicator */}
        <div className="flex justify-center pt-3 pb-0">
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center pt-5 pb-6 px-6">
          <NexusSymbol size={48} glowing />
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24, fontWeight: 500, color: '#F5F3F8', letterSpacing: '0.02em',
            }}>¿Qué quieres hacer hoy?</p>
            <p style={{ fontSize: 12, color: 'rgba(245,243,248,0.35)', marginTop: 3 }}>
              Centro de control NExUS
            </p>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{
          height: 1, marginBottom: 20,
          background: 'linear-gradient(90deg, transparent 0%, rgba(226,182,89,0.25) 30%, rgba(214,188,250,0.3) 50%, rgba(226,182,89,0.25) 70%, transparent 100%)',
        }} />

        {/* Action grid — first 4 in 2×2, last 3 in a row */}
        <div className="px-5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {HUB_ACTIONS.slice(0, 4).map((action, i) => (
              <button
                key={i}
                onClick={() => { onNavigate(action.id); onClose() }}
                className="flex items-center gap-2.5 p-3 rounded-[14px] text-left transition-all active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-8 h-8 rounded-[9px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(214,188,250,0.1)', border: '1px solid rgba(214,188,250,0.15)' }}
                >{action.icon}</div>
                <div className="min-w-0">
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#F5F3F8', lineHeight: 1.3 }}>{action.label}</p>
                  <p style={{ fontSize: 10, color: 'rgba(245,243,248,0.32)', marginTop: 1, lineHeight: 1.3 }}>{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {HUB_ACTIONS.slice(4).map((action, i) => (
              <button
                key={i}
                onClick={() => { onNavigate(action.id); onClose() }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-[14px] text-center transition-all active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center text-xl"
                  style={{ background: 'rgba(214,188,250,0.1)', border: '1px solid rgba(214,188,250,0.15)' }}
                >{action.icon}</div>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#F5F3F8', lineHeight: 1.3 }}>{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Gold CTA */}
        <div className="px-5 mt-5">
          <div
            className="flex items-center gap-3 p-3.5 rounded-[14px]"
            style={{
              background: 'rgba(226,182,89,0.06)',
              border: '1px solid rgba(226,182,89,0.2)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex-shrink-0"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #FFF5CC 0%, #E2B659 50%, #C49430 100%)',
                boxShadow: '0 0 8px rgba(226,182,89,0.3)',
              }}
            />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#E2B659' }}>NExUS IA</p>
              <p style={{ fontSize: 11, color: 'rgba(226,182,89,0.5)' }}>Próximamente — planificación inteligente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
