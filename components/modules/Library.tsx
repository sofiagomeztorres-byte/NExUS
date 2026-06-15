'use client'

import { useState, useRef } from 'react'
import { useNexus } from '@/lib/context'
import { Card } from '@/components/Card'
import { LibraryFile } from '@/lib/types'

type FileType = LibraryFile['type']
type SortBy = 'recent' | 'name' | 'type' | 'favorites'

const FILE_TYPES: { id: FileType; label: string; icon: string; accept: string }[] = [
  { id: 'image',    label: 'Imagen',    icon: '🖼️',  accept: 'image/*' },
  { id: 'video',    label: 'Video',     icon: '🎬',  accept: 'video/*' },
  { id: 'audio',    label: 'Audio',     icon: '🎵',  accept: 'audio/*' },
  { id: 'pdf',      label: 'Documento', icon: '📄',  accept: '.pdf,.doc,.docx,.txt' },
  { id: 'url',      label: 'URL',       icon: '🔗',  accept: '' },
  { id: 'note',     label: 'Nota',      icon: '📝',  accept: '' },
]

export function Library() {
  const { user, getLibraryFiles, addLibraryFile, updateLibraryFile, deleteLibraryFile } = useNexus()
  const [showAdd, setShowAdd] = useState(false)
  const [selectedType, setSelectedType] = useState<FileType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortBy>('recent')
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Add form state
  const [addType, setAddType] = useState<FileType>('image')
  const [addName, setAddName] = useState('')
  const [addDescription, setAddDescription] = useState('')
  const [addTags, setAddTags] = useState('')
  const [addUrl, setAddUrl] = useState('')
  const [addNote, setAddNote] = useState('')
  const [addPriority, setAddPriority] = useState(false)
  const [addFileData, setAddFileData] = useState<{ name: string; url: string; size: number; mime: string } | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

  const allFiles = getLibraryFiles(user.currentBrandId)
  const allTags = Array.from(new Set(allFiles.flatMap(f => f.tags)))

  // Filter & sort
  const filtered = allFiles
    .filter(f => selectedType === 'all' || f.type === selectedType)
    .filter(f => !selectedTag || f.tags.includes(selectedTag))
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()) || (f.description ?? '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'type') return a.type.localeCompare(b.type)
      if (sortBy === 'favorites') return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)
      return 0
    })

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!addName) setAddName(file.name.replace(/\.[^.]+$/, ''))
    const reader = new FileReader()
    reader.onload = ev => {
      setAddFileData({
        name: file.name,
        url: ev.target?.result as string,
        size: file.size,
        mime: file.type,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!addName.trim()) return
    const typeInfo = FILE_TYPES.find(t => t.id === addType)!
    addLibraryFile({
      brandId: user.currentBrandId,
      name: addName.trim(),
      description: addDescription.trim() || undefined,
      type: addType,
      url: addType === 'url' ? addUrl : addFileData?.url,
      filePath: addFileData?.name,
      fileSize: addFileData?.size,
      mimeType: addFileData?.mime,
      tags: addTags.split(',').map(t => t.trim()).filter(Boolean),
      favorite: false,
      priority: addPriority,
    })
    // reset
    setAddName(''); setAddDescription(''); setAddTags(''); setAddUrl('')
    setAddNote(''); setAddPriority(false); setAddFileData(null)
    setAddType('image'); setShowAdd(false)
  }

  const typeIcon = (type: FileType) => FILE_TYPES.find(t => t.id === type)?.icon ?? '📄'

  if (showAdd) {
    const currentTypeInfo = FILE_TYPES.find(t => t.id === addType)!
    return (
      <div className="space-y-5 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAdd(false)} className="text-[#2A1A4A]/50 text-xl">←</button>
          <h2 className="font-serif text-[20px] text-[#2A1A4A]">Agregar a Biblioteca</h2>
        </div>

        {/* File Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          {FILE_TYPES.map(ft => (
            <button key={ft.id}
              onClick={() => { setAddType(ft.id); setAddFileData(null) }}
              className="p-3 rounded-[10px] flex flex-col items-center gap-1 transition-all"
              style={{
                background: addType === ft.id ? 'rgba(226,182,89,0.15)' : '#F9F8FC',
                border: addType === ft.id ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
              }}
            >
              <span className="text-xl">{ft.icon}</span>
              <span className="text-[11px] text-[#2A1A4A]/70">{ft.label}</span>
            </button>
          ))}
        </div>

        {/* File Upload Zone */}
        {currentTypeInfo.accept && (
          <>
            <input
              ref={fileRef} type="file" accept={currentTypeInfo.accept}
              onChange={handleFileInput} className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-3 py-8 rounded-[14px] transition-all"
              style={{
                background: addFileData ? 'rgba(123,207,184,0.08)' : 'rgba(226,182,89,0.06)',
                border: addFileData ? '1.5px solid rgba(123,207,184,0.5)' : '1.5px dashed rgba(226,182,89,0.4)',
              }}
            >
              {addFileData ? (
                <>
                  <span className="text-3xl">{typeIcon(addType)}</span>
                  <p className="text-[13px] font-semibold text-[#2A1A4A]/70">{addFileData.name}</p>
                  <p className="text-[11px] text-[#2A1A4A]/40">
                    {(addFileData.size / 1024).toFixed(1)} KB · Toca para cambiar
                  </p>
                </>
              ) : (
                <>
                  <span className="text-4xl">{currentTypeInfo.icon}</span>
                  <p className="text-[14px] font-semibold text-[#2A1A4A]/60">
                    Toca para seleccionar {currentTypeInfo.label}
                  </p>
                  <p className="text-[12px] text-[#2A1A4A]/35">Se abrirá el selector de archivos</p>
                </>
              )}
            </button>
          </>
        )}

        {/* URL input */}
        {addType === 'url' && (
          <input
            type="url" placeholder="https://..."
            value={addUrl} onChange={e => setAddUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        )}

        {/* Note textarea */}
        {addType === 'note' && (
          <textarea
            placeholder="Escribe tu nota..."
            value={addNote} onChange={e => setAddNote(e.target.value)}
            className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none resize-none h-28"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        )}

        {/* Name */}
        <input
          type="text" placeholder="Nombre *"
          value={addName} onChange={e => setAddName(e.target.value)}
          className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
          style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
        />

        {/* Description */}
        <input
          type="text" placeholder="Descripción (opcional)"
          value={addDescription} onChange={e => setAddDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
          style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
        />

        {/* Tags */}
        <input
          type="text" placeholder="Etiquetas (ej: campaña, verano, reel)"
          value={addTags} onChange={e => setAddTags(e.target.value)}
          className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
          style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
        />

        {/* Priority */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setAddPriority(!addPriority)}
            className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] transition-all"
            style={{
              background: addPriority ? 'rgba(226,182,89,0.3)' : 'transparent',
              border: addPriority ? '1.5px solid rgba(226,182,89,0.7)' : '1.5px solid #EEE9F5',
              color: '#B8862A',
            }}
          >{addPriority ? '✓' : ''}</div>
          <span className="text-[13px] text-[#2A1A4A]/70">Marcar como prioritario ✦</span>
        </label>

        <button
          onClick={handleSave}
          disabled={!addName.trim()}
          className="w-full py-4 rounded-[12px] font-bold text-[16px] text-white"
          style={{
            background: addName.trim() ? 'linear-gradient(135deg, #4A2080 0%, #2A1A4A 100%)' : '#ccc',
          }}
        >Guardar en Biblioteca ✓</button>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-[22px] text-[#2A1A4A]">Biblioteca</h2>
          <p className="text-[13px] text-[#2A1A4A]/55 mt-0.5">
            {allFiles.length > 0 ? `${allFiles.length} archivo${allFiles.length !== 1 ? 's' : ''}` : 'Tu bóveda digital'}
          </p>
        </div>
        {allFiles.length > 0 && (
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-[10px] text-[13px] font-bold text-[#2A1A4A]"
            style={{ background: 'rgba(226,182,89,0.18)', border: '1px solid rgba(226,182,89,0.4)' }}
          >+ Agregar</button>
        )}
      </div>

      {/* Empty State */}
      {allFiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
            style={{ background: 'rgba(226,182,89,0.12)', border: '1.5px solid rgba(226,182,89,0.3)' }}
          >📁</div>
          <div className="text-center">
            <p className="font-serif text-[18px] text-[#2A1A4A] mb-1">Biblioteca vacía</p>
            <p className="text-[13px] text-[#2A1A4A]/50 max-w-[240px] leading-relaxed">
              Guarda videos, imágenes, documentos, audios, URLs y notas de tu marca
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            {FILE_TYPES.map(ft => (
              <button key={ft.id}
                onClick={() => { setAddType(ft.id); setShowAdd(true) }}
                className="p-3 rounded-[12px] flex flex-col items-center gap-1.5"
                style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
              >
                <span className="text-xl">{ft.icon}</span>
                <span className="text-[11px] text-[#2A1A4A]/60">{ft.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {allFiles.length > 0 && (
        <>
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2A1A4A]/30 text-[14px]">🔍</span>
            <input
              type="text" placeholder="Buscar archivos..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
              style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedType('all')}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0"
              style={{
                background: selectedType === 'all' ? '#EADCF9' : '#F9F8FC',
                border: selectedType === 'all' ? '1px solid #EADCF9' : '1px solid #EEE9F5',
                color: '#2A1A4A',
              }}
            >Todos</button>
            {FILE_TYPES.map(ft => (
              <button key={ft.id}
                onClick={() => setSelectedType(ft.id)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0"
                style={{
                  background: selectedType === ft.id ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                  border: selectedType === ft.id ? '1px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                  color: '#2A1A4A',
                }}
              >{ft.icon} {ft.label}</button>
            ))}
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allTags.map(tag => (
                <button key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] flex-shrink-0"
                  style={{
                    background: selectedTag === tag ? 'rgba(234,220,249,0.6)' : '#F9F8FC',
                    border: selectedTag === tag ? '1px solid #EADCF9' : '1px solid #EEE9F5',
                    color: '#2A1A4A',
                  }}
                >#{tag}</button>
              ))}
            </div>
          )}

          {/* File List */}
          <div className="space-y-2">
            {filtered.length === 0 && (
              <p className="text-center text-[13px] text-[#2A1A4A]/40 py-8">Sin resultados</p>
            )}
            {filtered.map(file => (
              <div
                key={file.id}
                className="flex items-start gap-3 p-3.5 rounded-[12px]"
                style={{
                  background: file.priority ? 'rgba(226,182,89,0.08)' : 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(20px)',
                  border: file.priority ? '1px solid rgba(226,182,89,0.3)' : '1px solid #EEE9F5',
                }}
              >
                {/* Icon / Thumbnail */}
                <div
                  className="w-12 h-12 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
                  style={{ background: '#F9F8FC' }}
                >
                  {(file.type === 'image' || file.type === 'video') && file.url
                    ? (file.type === 'image'
                        ? <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        : <span>{typeIcon(file.type)}</span>)
                    : typeIcon(file.type)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-[14px] font-semibold text-[#2A1A4A] truncate">{file.name}</p>
                    {file.priority && <span style={{ color: '#E2B659', fontSize: 12 }}>✦</span>}
                  </div>
                  {file.description && (
                    <p className="text-[11px] text-[#2A1A4A]/45 mt-0.5 line-clamp-1">{file.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: '#F9F8FC', border: '1px solid #EEE9F5', color: '#2A1A4A/60' }}
                    >{FILE_TYPES.find(t => t.id === file.type)?.label}</span>
                    {file.tags.slice(0, 2).map(tag => (
                      <span key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(234,220,249,0.4)', color: '#2A1A4A' }}
                      >#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => updateLibraryFile(file.id, { favorite: !file.favorite })}
                    className="text-[14px]"
                    style={{ color: file.favorite ? '#E2B659' : 'rgba(42,26,74,0.2)' }}
                  >★</button>
                  <button
                    onClick={() => deleteLibraryFile(file.id)}
                    className="text-[12px] text-[#2A1A4A]/20 hover:text-red-400"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
