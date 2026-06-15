'use client'

import { useState, useRef } from 'react'
import { useNexus } from '@/lib/context'
import { AnalyticsEntry, AnalyticsMetrics } from '@/lib/types'

const PLATFORM_OPTIONS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵' },
  { id: 'youtube', label: 'YouTube', icon: '▶️' },
  { id: 'twitter', label: 'Twitter/X', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'other', label: 'Otro', icon: '📊' },
] as const

const CONTENT_TYPES = [
  { id: 'reel', label: 'Reel', icon: '🎬' },
  { id: 'video', label: 'Video', icon: '📹' },
  { id: 'image', label: 'Imagen', icon: '🖼️' },
  { id: 'carousel', label: 'Carrusel', icon: '🗂️' },
  { id: 'story', label: 'Story', icon: '⭕' },
  { id: 'screenshot', label: 'Captura', icon: '📄' },
] as const

type UploadStep = 'list' | 'select-type' | 'upload-file' | 'add-metrics' | 'done'

export function Analytics() {
  const { user, getAnalyticsEntries, addAnalyticsEntry, deleteAnalyticsEntry } = useNexus()
  const [step, setStep] = useState<UploadStep>('list')
  const [platform, setPlatform] = useState<AnalyticsEntry['platform']>('instagram')
  const [contentType, setContentType] = useState<AnalyticsEntry['contentType']>('reel')
  const [title, setTitle] = useState('')
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({})
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const fileRef = useRef<HTMLInputElement>(null)

  const entries = getAnalyticsEntries(user.currentBrandId)
  const filteredEntries = filterPlatform === 'all'
    ? entries
    : entries.filter(e => e.platform === filterPlatform)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setFilePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!title.trim()) return
    addAnalyticsEntry({
      brandId: user.currentBrandId,
      title: title.trim(),
      platform,
      contentType,
      fileUrl: filePreview || undefined,
      filePath: fileName,
      metrics,
      aiScore: metrics.engagementRate
        ? Math.min(99, Math.round(metrics.engagementRate * 8 + 50))
        : (metrics.views && metrics.likes
          ? Math.min(99, Math.round((metrics.likes / metrics.views) * 1000 + 50))
          : undefined),
      capturedAt: new Date().toISOString(),
    })
    setTitle('')
    setFilePreview(null)
    setFileName('')
    setMetrics({})
    setStep('list')
  }

  // Calculate stats
  const totalViews = entries.reduce((sum, e) => sum + (e.metrics.views || 0), 0)
  const totalLikes = entries.reduce((sum, e) => sum + (e.metrics.likes || 0), 0)
  const avgEngagement = entries.length > 0
    ? (entries.reduce((sum, e) => sum + (e.metrics.engagementRate || 0), 0) / entries.length).toFixed(1)
    : 0
  const bestPerforming = entries.sort((a, b) =>
    (b.metrics.views || 0) - (a.metrics.views || 0)
  )[0]

  // Platform breakdown
  const platformStats = PLATFORM_OPTIONS.map(p => ({
    ...p,
    count: entries.filter(e => e.platform === p.id).length,
    totalViews: entries
      .filter(e => e.platform === p.id)
      .reduce((sum, e) => sum + (e.metrics.views || 0), 0),
  }))

  if (step === 'list') {
    return (
      <div className="space-y-5 pb-6">
        {/* Header */}
        <div>
          <h2 className="font-serif text-[22px] text-[#2A1A4A]">Analytics</h2>
          <p className="text-[13px] text-[#2A1A4A]/55 mt-0.5">
            Analiza el rendimiento de tu contenido
          </p>
        </div>

        {/* Stats Cards */}
        {entries.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-[12px]" style={{ background: 'rgba(226,182,89,0.08)', border: '1px solid rgba(226,182,89,0.2)' }}>
              <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase mb-1">Vistas Totales</p>
              <p className="font-serif text-[24px] text-[#2A1A4A]">{(totalViews / 1000).toFixed(1)}k</p>
            </div>
            <div className="p-4 rounded-[12px]" style={{ background: 'rgba(234,220,249,0.4)', border: '1px solid #EADCF9' }}>
              <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase mb-1">Engagement</p>
              <p className="font-serif text-[24px] text-[#2A1A4A]">{avgEngagement}%</p>
            </div>
            <div className="p-4 rounded-[12px]" style={{ background: 'rgba(123,207,184,0.15)', border: '1px solid rgba(123,207,184,0.3)' }}>
              <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase mb-1">Likes</p>
              <p className="font-serif text-[24px] text-[#2A1A4A]">{totalLikes}</p>
            </div>
            <div className="p-4 rounded-[12px]" style={{ background: 'rgba(201,163,255,0.15)', border: '1px solid rgba(201,163,255,0.3)' }}>
              <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase mb-1">Contenido</p>
              <p className="font-serif text-[24px] text-[#2A1A4A]">{entries.length}</p>
            </div>
          </div>
        )}

        {/* Platform Breakdown */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest mb-3">Rendimiento por Plataforma</p>
            {platformStats.filter(p => p.count > 0).map(p => (
              <div key={p.id}
                className="p-3 rounded-[10px] flex items-center justify-between"
                style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#2A1A4A]">{p.label}</p>
                    <p className="text-[11px] text-[#2A1A4A]/45">{p.count} contenido{p.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold" style={{ color: '#E2B659' }}>{(p.totalViews / 1000).toFixed(1)}k</p>
                  <p className="text-[10px] text-[#2A1A4A]/45">vistas</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter & List */}
        {entries.length > 0 && (
          <>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterPlatform('all')}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0"
                style={{
                  background: filterPlatform === 'all' ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                  border: filterPlatform === 'all' ? '1px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                }}
              >Todos</button>
              {platformStats.filter(p => p.count > 0).map(p => (
                <button key={p.id}
                  onClick={() => setFilterPlatform(p.id)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0"
                  style={{
                    background: filterPlatform === p.id ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                    border: filterPlatform === p.id ? '1px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                  }}
                >{p.icon} {p.label}</button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredEntries.map((entry, i) => {
                const platform = PLATFORM_OPTIONS.find(p => p.id === entry.platform)
                const contentType = CONTENT_TYPES.find(c => c.id === entry.contentType)
                return (
                  <div key={entry.id}
                    className="p-3.5 rounded-[12px] flex items-start gap-3"
                    style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid #EEE9F5', backdropFilter: 'blur(20px)' }}
                  >
                    {entry.fileUrl && (
                      <img src={entry.fileUrl} alt={entry.title} className="w-12 h-12 rounded-[8px] object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[14px] font-semibold text-[#2A1A4A]">{entry.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(226,182,89,0.2)', color: '#B8862A' }}>
                              {platform?.icon} {platform?.label}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F9F8FC', border: '1px solid #EEE9F5', color: '#2A1A4A' }}>
                              {contentType?.label}
                            </span>
                          </div>
                        </div>
                        {entry.aiScore && (
                          <div className="text-right flex-shrink-0">
                            <p className="text-[12px] font-bold" style={{ color: '#E2B659' }}>AI {entry.aiScore}%</p>
                            <p className="text-[9px] text-[#2A1A4A]/40">Score</p>
                          </div>
                        )}
                      </div>
                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {entry.metrics.views && (
                          <div className="text-[11px]">
                            <p className="font-semibold text-[#2A1A4A]">{(entry.metrics.views / 1000).toFixed(1)}k</p>
                            <p className="text-[#2A1A4A]/50">vistas</p>
                          </div>
                        )}
                        {entry.metrics.likes && (
                          <div className="text-[11px]">
                            <p className="font-semibold text-[#2A1A4A]">{entry.metrics.likes}</p>
                            <p className="text-[#2A1A4A]/50">likes</p>
                          </div>
                        )}
                        {entry.metrics.engagementRate && (
                          <div className="text-[11px]">
                            <p className="font-semibold text-[#2A1A4A]">{entry.metrics.engagementRate}%</p>
                            <p className="text-[#2A1A4A]/50">engagement</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAnalyticsEntry(entry.id)}
                      className="text-[#2A1A4A]/20 hover:text-red-400 text-[14px] flex-shrink-0"
                    >✕</button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(226,182,89,0.12)', border: '1.5px solid rgba(226,182,89,0.3)' }}>
              📊
            </div>
            <div className="text-center">
              <p className="font-serif text-[18px] text-[#2A1A4A] mb-1">Sin análisis aún</p>
              <p className="text-[13px] text-[#2A1A4A]/50">Sube contenido para analizar su rendimiento y descubrir qué funciona</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => setStep('select-type')}
          className="w-full py-3.5 rounded-[12px] font-bold text-[15px] text-white"
          style={{ background: 'linear-gradient(135deg, #E2B659, #FFB84D)' }}
        >
          ✦ Analizar Contenido
        </button>
      </div>
    )
  }

  // Upload workflow (select-type, upload-file, add-metrics)
  if (step === 'select-type') {
    return (
      <div className="space-y-5 pb-6">
        <button onClick={() => setStep('list')} className="text-[#2A1A4A]/50 text-lg">← Volver</button>
        <div>
          <h2 className="font-serif text-[20px] text-[#2A1A4A]">Selecciona Plataforma</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORM_OPTIONS.map(p => (
            <button key={p.id}
              onClick={() => { setPlatform(p.id as any); setStep('upload-file') }}
              className="p-4 rounded-[12px] flex flex-col items-center gap-2 transition-all"
              style={{
                background: platform === p.id ? 'rgba(226,182,89,0.15)' : '#F9F8FC',
                border: platform === p.id ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
              }}
            >
              <span className="text-2xl">{p.icon}</span>
              <span className="text-[11px] font-semibold text-center">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'upload-file') {
    return (
      <div className="space-y-5 pb-6">
        <button onClick={() => setStep('select-type')} className="text-[#2A1A4A]/50 text-lg">← Atrás</button>
        <div>
          <h2 className="font-serif text-[20px] text-[#2A1A4A]">Tipo de Contenido</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CONTENT_TYPES.map(c => (
            <button key={c.id}
              onClick={() => { setContentType(c.id as any); setStep('add-metrics') }}
              className="p-4 rounded-[12px] flex flex-col items-center gap-2 transition-all"
              style={{
                background: contentType === c.id ? 'rgba(226,182,89,0.15)' : '#F9F8FC',
                border: contentType === c.id ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
              }}
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[11px] font-semibold text-center">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // add-metrics
  return (
    <div className="space-y-5 pb-6">
      <button onClick={() => setStep('upload-file')} className="text-[#2A1A4A]/50 text-lg">← Atrás</button>
      <div>
        <h2 className="font-serif text-[20px] text-[#2A1A4A]">Detalles & Métricas</h2>
      </div>

      <input type="file" ref={fileRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*" />
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full flex items-center justify-center py-8 rounded-[14px] transition-all"
        style={{
          background: filePreview ? 'rgba(123,207,184,0.08)' : '#F9F8FC',
          border: filePreview ? '1.5px solid rgba(123,207,184,0.5)' : '1.5px dashed #EEE9F5',
        }}
      >
        {filePreview ? (
          <img src={filePreview} alt="preview" className="max-h-[150px] rounded-[8px]" />
        ) : (
          <span className="text-4xl">📸</span>
        )}
      </button>

      <input
        type="text"
        placeholder="Título del contenido"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
        style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-bold text-[#2A1A4A]/50 block mb-1">Vistas</label>
          <input
            type="number"
            value={metrics.views || ''}
            onChange={e => setMetrics({...metrics, views: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#2A1A4A]/50 block mb-1">Likes</label>
          <input
            type="number"
            value={metrics.likes || ''}
            onChange={e => setMetrics({...metrics, likes: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#2A1A4A]/50 block mb-1">Engagement %</label>
          <input
            type="number"
            value={metrics.engagementRate || ''}
            onChange={e => setMetrics({...metrics, engagementRate: parseFloat(e.target.value) || 0})}
            className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-[#2A1A4A]/50 block mb-1">Shares</label>
          <input
            type="number"
            value={metrics.shares || ''}
            onChange={e => setMetrics({...metrics, shares: parseInt(e.target.value) || 0})}
            className="w-full px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!title.trim()}
        className="w-full py-4 rounded-[12px] font-bold text-[16px] text-white"
        style={{
          background: title.trim() ? 'linear-gradient(135deg, #E2B659, #FFB84D)' : '#ccc',
        }}
      >
        Guardar Análisis ✓
      </button>
    </div>
  )
}
