'use client'

import { useState, useEffect } from 'react'
import { toastStore, type Toast } from '@/lib/toast'

const TOAST_ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

const TOAST_COLORS = {
  success: {
    bg: 'rgba(123,207,184,0.1)',
    border: 'rgba(123,207,184,0.4)',
    icon: '#7BCFB8',
    text: '#2A1A4A',
  },
  error: {
    bg: 'rgba(220,74,101,0.1)',
    border: 'rgba(220,74,101,0.4)',
    icon: '#DC4A65',
    text: '#2A1A4A',
  },
  info: {
    bg: 'rgba(226,182,89,0.1)',
    border: 'rgba(226,182,89,0.4)',
    icon: '#E2B659',
    text: '#2A1A4A',
  },
  warning: {
    bg: 'rgba(255,152,0,0.1)',
    border: 'rgba(255,152,0,0.4)',
    icon: '#FF9800',
    text: '#2A1A4A',
  },
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts)
    setToasts(toastStore.getToasts())
    return unsubscribe
  }, [])

  const removeToast = (id: string) => {
    toastStore.removeToast(id)
  }

  return (
    <div className="fixed bottom-4 right-4 z-[200] max-w-[320px] space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const colors = TOAST_COLORS[toast.type]

  return (
    <div
      className="p-4 rounded-[12px] flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Icon */}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
        style={{ background: colors.icon, color: 'white' }}
      >
        {TOAST_ICONS[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: colors.text }}>
          {toast.title}
        </p>
        {toast.description && (
          <p className="text-[12px] mt-0.5" style={{ color: `${colors.text}99` }}>
            {toast.description}
          </p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick()
              onClose()
            }}
            className="text-[11px] font-semibold mt-2 underline"
            style={{ color: colors.icon }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="text-[#2A1A4A]/30 hover:text-[#2A1A4A]/60 flex-shrink-0 text-[16px] leading-none"
      >
        ✕
      </button>
    </div>
  )
}
