'use client'

import { useState } from 'react'
import { useNexus } from '@/lib/context'
import { Card } from '@/components/Card'
import { Goal, Milestone } from '@/lib/types'
import { generateId } from '@/lib/utils'

const CATEGORIES: { id: Goal['category']; label: string; icon: string; color: string }[] = [
  { id: 'revenue',  label: 'Ingresos',   icon: '💰', color: '#E2B659' },
  { id: 'content',  label: 'Contenido',  icon: '🎬', color: '#C9A3FF' },
  { id: 'growth',   label: 'Crecimiento',icon: '📈', color: '#7BCFB8' },
  { id: 'product',  label: 'Producto',   icon: '🚀', color: '#F4A460' },
  { id: 'personal', label: 'Personal',   icon: '✨', color: '#EADCF9' },
  { id: 'other',    label: 'Otro',       icon: '🎯', color: '#EEE9F5' },
]

type GoalView = 'list' | 'new' | 'detail'

export function Goals() {
  const { user, getGoals, addGoal, updateGoal, deleteGoal } = useNexus()
  const [view, setView] = useState<GoalView>('list')
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState<Goal['category'] | 'all'>('all')

  // New goal form
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'revenue' as Goal['category'],
    priority: 'high' as Goal['priority'],
    targetDate: '',
    milestones: [''],
  })

  const goals = getGoals(user.currentBrandId)
  const filtered = filterCat === 'all' ? goals : goals.filter(g => g.category === filterCat)
  const active = filtered.filter(g => g.status === 'active')
  const completed = filtered.filter(g => g.status === 'completed')
  const selectedGoal = goals.find(g => g.id === selectedGoalId) ?? null

  const handleSaveGoal = () => {
    if (!form.title.trim()) return
    const milestones: Milestone[] = form.milestones
      .filter(m => m.trim())
      .map(m => ({ id: generateId(), title: m.trim(), completed: false }))
    addGoal({
      brandId: user.currentBrandId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      priority: form.priority,
      status: 'active',
      targetDate: form.targetDate || undefined,
      progress: 0,
      milestones,
    })
    setForm({ title: '', description: '', category: 'revenue', priority: 'high', targetDate: '', milestones: [''] })
    setView('list')
  }

  const toggleMilestone = (goal: Goal, milestoneId: string) => {
    const updated = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined } : m
    )
    const progress = updated.length > 0 ? Math.round((updated.filter(m => m.completed).length / updated.length) * 100) : 0
    updateGoal(goal.id, { milestones: updated, progress })
  }

  const progressColor = (p: number) => p >= 75 ? '#7BCFB8' : p >= 40 ? '#E2B659' : '#C9A3FF'

  // ── LIST ────────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="space-y-5 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-[22px] text-[#2A1A4A]">Metas</h2>
            <p className="text-[13px] text-[#2A1A4A]/55 mt-0.5">Objetivos que mueven tu negocio</p>
          </div>
          {goals.length > 0 && (
            <button
              onClick={() => setView('new')}
              className="px-4 py-2 rounded-[10px] text-[13px] font-bold text-[#2A1A4A]"
              style={{ background: 'rgba(226,182,89,0.18)', border: '1px solid rgba(226,182,89,0.4)' }}
            >
              + Meta
            </button>
          )}
        </div>

        {/* Category Filter */}
        {goals.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterCat('all')}
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-medium transition-all flex-shrink-0"
              style={{
                background: filterCat === 'all' ? '#EADCF9' : '#F9F8FC',
                border: filterCat === 'all' ? '1px solid #EADCF9' : '1px solid #EEE9F5',
                color: '#2A1A4A',
              }}
            >Todas</button>
            {CATEGORIES.map(c => (
              <button key={c.id}
                onClick={() => setFilterCat(c.id)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full text-[12px] font-medium transition-all flex-shrink-0"
                style={{
                  background: filterCat === c.id ? c.color + '30' : '#F9F8FC',
                  border: filterCat === c.id ? `1px solid ${c.color}` : '1px solid #EEE9F5',
                  color: '#2A1A4A',
                }}
              >{c.icon} {c.label}</button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'rgba(226,182,89,0.12)', border: '1.5px solid rgba(226,182,89,0.3)' }}
            >🎯</div>
            <div className="text-center">
              <p className="font-serif text-[18px] text-[#2A1A4A] mb-1">Sin metas todavía</p>
              <p className="text-[13px] text-[#2A1A4A]/50 max-w-[240px] leading-relaxed">
                Define objetivos claros para mantener el foco y medir tu progreso
              </p>
            </div>
            <button
              onClick={() => setView('new')}
              className="px-6 py-3 rounded-[12px] font-bold text-[15px] text-[#2A1A4A]"
              style={{ background: 'rgba(226,182,89,0.2)', border: '1.5px solid rgba(226,182,89,0.5)' }}
            >✦ Crear Primera Meta</button>
          </div>
        )}

        {/* Active Goals */}
        {active.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">Activas ({active.length})</p>
            {active.map(goal => {
              const cat = CATEGORIES.find(c => c.id === goal.category)
              return (
                <button key={goal.id} onClick={() => { setSelectedGoalId(goal.id); setView('detail') }} className="w-full text-left">
                  <Card variant="glass">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: (cat?.color ?? '#E2B659') + '25' }}
                      >{cat?.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-[14px] text-[#2A1A4A]">{goal.title}</p>
                          {goal.priority === 'high' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0"
                              style={{ background: 'rgba(226,182,89,0.2)', color: '#B8862A' }}>
                              Alta
                            </span>
                          )}
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-[#EEE9F5] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${goal.progress}%`, background: progressColor(goal.progress) }}
                            />
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: progressColor(goal.progress) }}>
                            {goal.progress}%
                          </span>
                        </div>
                        {goal.milestones.length > 0 && (
                          <p className="text-[11px] text-[#2A1A4A]/40 mt-1">
                            {goal.milestones.filter(m => m.completed).length}/{goal.milestones.length} hitos
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        )}

        {/* Completed Goals */}
        {completed.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">Completadas ({completed.length})</p>
            {completed.map(goal => (
              <Card key={goal.id} variant="plain">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{CATEGORIES.find(c => c.id === goal.category)?.icon}</span>
                  <p className="text-[13px] text-[#2A1A4A]/50 line-through flex-1">{goal.title}</p>
                  <button
                    onClick={() => updateGoal(goal.id, { status: 'active' })}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(234,220,249,0.5)', color: '#7B4FBB', border: '1px solid #EADCF9' }}
                  >Reactivar</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── NEW GOAL FORM ────────────────────────────────────────────────────
  if (view === 'new') {
    return (
      <div className="space-y-5 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-[#2A1A4A]/50 text-xl">←</button>
          <h2 className="font-serif text-[20px] text-[#2A1A4A]">Nueva Meta</h2>
        </div>

        <input
          type="text" placeholder="¿Qué quieres lograr?"
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full px-4 py-3 rounded-[10px] text-[15px] text-[#2A1A4A] outline-none"
          style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
        />

        <textarea
          placeholder="Descripción (opcional)"
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none resize-none h-20"
          style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
        />

        <div>
          <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase tracking-wider mb-2">Categoría</p>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map(c => (
              <button key={c.id}
                onClick={() => setForm(f => ({ ...f, category: c.id }))}
                className="p-2.5 rounded-[10px] flex flex-col items-center gap-1 text-center"
                style={{
                  background: form.category === c.id ? c.color + '25' : '#F9F8FC',
                  border: form.category === c.id ? `1.5px solid ${c.color}` : '1px solid #EEE9F5',
                }}
              >
                <span className="text-lg">{c.icon}</span>
                <span className="text-[10px] text-[#2A1A4A]/70">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase tracking-wider mb-2">Fecha objetivo</p>
          <input
            type="date" value={form.targetDate}
            onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
            className="w-full px-4 py-3 rounded-[10px] text-[14px] text-[#2A1A4A] outline-none"
            style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
          />
        </div>

        <div>
          <p className="text-[11px] font-bold text-[#2A1A4A]/50 uppercase tracking-wider mb-2">Hitos clave</p>
          <div className="space-y-2">
            {form.milestones.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text" placeholder={`Hito ${i + 1}`}
                  value={m} onChange={e => {
                    const ms = [...form.milestones]; ms[i] = e.target.value
                    setForm(f => ({ ...f, milestones: ms }))
                  }}
                  className="flex-1 px-3 py-2.5 rounded-[8px] text-[13px] text-[#2A1A4A] outline-none"
                  style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                />
                {form.milestones.length > 1 && (
                  <button
                    onClick={() => setForm(f => ({ ...f, milestones: f.milestones.filter((_, j) => j !== i) }))}
                    className="text-[#2A1A4A]/30 px-2"
                  >✕</button>
                )}
              </div>
            ))}
            <button
              onClick={() => setForm(f => ({ ...f, milestones: [...f.milestones, ''] }))}
              className="text-[12px] text-[#2A1A4A]/40 hover:text-[#2A1A4A]/70"
            >+ Agregar hito</button>
          </div>
        </div>

        <button
          onClick={handleSaveGoal}
          disabled={!form.title.trim()}
          className="w-full py-4 rounded-[12px] font-bold text-[16px] text-white"
          style={{ background: form.title.trim() ? 'linear-gradient(135deg, #4A2080 0%, #2A1A4A 100%)' : '#ccc' }}
        >Guardar Meta ✓</button>
      </div>
    )
  }

  // ── DETAIL ───────────────────────────────────────────────────────────
  if (view === 'detail' && selectedGoal) {
    const cat = CATEGORIES.find(c => c.id === selectedGoal.category)
    return (
      <div className="space-y-5 pb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="text-[#2A1A4A]/50 text-xl">←</button>
          <h2 className="font-serif text-[20px] text-[#2A1A4A] flex-1 truncate">{selectedGoal.title}</h2>
          <button
            onClick={() => { deleteGoal(selectedGoal.id); setView('list') }}
            className="text-[#2A1A4A]/30 text-sm"
          >Eliminar</button>
        </div>

        {/* Progress */}
        <Card variant={selectedGoal.progress === 100 ? 'gold' : 'glass'}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-[#2A1A4A]/60">Progreso</span>
            <span className="font-serif text-[28px] font-bold" style={{ color: progressColor(selectedGoal.progress) }}>
              {selectedGoal.progress}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#EEE9F5] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${selectedGoal.progress}%`, background: progressColor(selectedGoal.progress) }}
            />
          </div>
        </Card>

        {/* Milestones */}
        {selectedGoal.milestones.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">Hitos</p>
            {selectedGoal.milestones.map(m => (
              <button
                key={m.id}
                onClick={() => toggleMilestone(selectedGoal, m.id)}
                className="w-full flex items-center gap-3 p-3 rounded-[10px] text-left transition-all"
                style={{ background: m.completed ? 'rgba(123,207,184,0.12)' : '#F9F8FC', border: '1px solid #EEE9F5' }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px]"
                  style={{
                    background: m.completed ? '#7BCFB8' : 'transparent',
                    border: m.completed ? 'none' : '1.5px solid #EEE9F5',
                    color: 'white',
                  }}
                >{m.completed ? '✓' : ''}</div>
                <span className={`text-[14px] ${m.completed ? 'text-[#2A1A4A]/40 line-through' : 'text-[#2A1A4A]'}`}>
                  {m.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {selectedGoal.status === 'active' && selectedGoal.progress === 100 && (
            <button
              onClick={() => { updateGoal(selectedGoal.id, { status: 'completed' }); setView('list') }}
              className="flex-1 py-3 rounded-[10px] font-bold text-[14px] text-white"
              style={{ background: '#7BCFB8' }}
            >✓ Marcar como completada</button>
          )}
          {selectedGoal.status === 'active' && (
            <button
              onClick={() => { updateGoal(selectedGoal.id, { status: 'paused' }); setView('list') }}
              className="px-4 py-3 rounded-[10px] text-[13px] text-[#2A1A4A]/60"
              style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
            >Pausar</button>
          )}
          {selectedGoal.status === 'paused' && (
            <button
              onClick={() => updateGoal(selectedGoal.id, { status: 'active' })}
              className="flex-1 py-3 rounded-[10px] font-bold text-[14px] text-[#2A1A4A]"
              style={{ background: 'rgba(226,182,89,0.2)', border: '1px solid rgba(226,182,89,0.4)' }}
            >Reactivar</button>
          )}
        </div>
      </div>
    )
  }

  return null
}
