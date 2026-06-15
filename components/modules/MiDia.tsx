'use client'

import { useState } from 'react'
import { useNexus } from '@/lib/context'
import { Card } from '@/components/Card'
import { Task } from '@/lib/types'

type EnergyLevel = 'fire' | 'happy' | 'tired' | 'overwhelmed' | null

const ENERGY_LEVELS: { id: Exclude<EnergyLevel, null>; emoji: string; label: string; dim: boolean }[] = [
  { id: 'fire',        emoji: '🔥', label: 'En Fuego',  dim: false },
  { id: 'happy',       emoji: '😊', label: 'Energizada', dim: false },
  { id: 'tired',       emoji: '😴', label: 'Cansada',   dim: true  },
  { id: 'overwhelmed', emoji: '😵', label: 'Abrumada',  dim: true  },
]

const PRIORITY_LABELS: Record<Task['priority'], string> = {
  high: 'Alta', medium: 'Media', low: 'Baja',
}

export function MiDia() {
  const { user, updateUserState, getTasks, addTask, updateTask, deleteTask } = useNexus()
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium')

  const energyLevel = user.miDiaState.energyLevel
  const allTasks = getTasks(user.currentBrandId)
  const pendingTasks = allTasks.filter(t => t.status !== 'completed')
  const completedToday = allTasks.filter(t => t.status === 'completed')

  const isOverwhelmed = energyLevel === 'overwhelmed'
  const focusedTasks = isOverwhelmed
    ? [...pendingTasks].sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }).slice(0, 3)
    : pendingTasks

  const handleSetEnergy = (level: Exclude<EnergyLevel, null>) => {
    updateUserState({ miDiaState: { ...user.miDiaState, energyLevel: level } })
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    addTask({
      brandId: user.currentBrandId,
      title: newTaskTitle.trim(),
      status: 'pending',
      priority: newTaskPriority,
      tags: [],
    })
    setNewTaskTitle('')
    setNewTaskPriority('medium')
    setShowNewTask(false)
  }

  const handleCompleteTask = (taskId: string, currentStatus: Task['status']) => {
    if (currentStatus === 'completed') {
      updateTask(taskId, { status: 'pending' })
    } else {
      updateTask(taskId, { status: 'completed' })
    }
  }

  const currentBrand = user.brands.find(b => b.id === user.currentBrandId)

  return (
    <div className="space-y-5 pb-6">
      {/* Brand accent line */}
      <div
        className="h-0.5 rounded-full w-12"
        style={{ background: `linear-gradient(90deg, ${currentBrand?.visualIdentity?.primaryColor ?? '#E2B659'}, rgba(226,182,89,0.3))` }}
      />

      {/* Greeting */}
      <div>
        <h2 className="font-serif text-[24px] text-[#2A1A4A] leading-tight">
          Hola, {user.name} ✦
        </h2>
        <p className="text-[13px] text-[#2A1A4A]/50 mt-0.5">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Energy Matrix — Lavender nodes from logo DNA */}
      <div>
        <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest mb-3">
          ¿Cómo estás hoy?
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ENERGY_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => handleSetEnergy(level.id)}
              className="py-3 rounded-[14px] flex flex-col items-center gap-1 transition-all active:scale-95"
              style={{
                background: energyLevel === level.id
                  ? 'radial-gradient(circle at 35% 30%, #F2ECFF 0%, #D6BCFA 55%, #B099D4 100%)'
                  : '#F9F8FC',
                border: energyLevel === level.id
                  ? '1.5px solid rgba(214,188,250,0.6)'
                  : '1px solid #EEE9F5',
                boxShadow: energyLevel === level.id
                  ? '0 0 0 1px rgba(214,188,250,0.3), 0 4px 16px rgba(182,146,255,0.2), inset 0 1px 0 rgba(255,255,255,0.5)'
                  : 'none',
              }}
            >
              <span className="text-[26px]">{level.emoji}</span>
              <span className="text-[9px] font-semibold text-[#2A1A4A]/60 text-center leading-tight">
                {level.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Anchor — Golden Nucleus treatment */}
      {user.miDiaState.mainPriority && (
        <div
          className="p-4 rounded-[16px] relative overflow-hidden nucleus-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(255,245,180,0.12) 0%, rgba(226,182,89,0.08) 100%)',
            border: '1.5px solid rgba(226,182,89,0.4)',
            boxShadow: '0 0 0 1px rgba(226,182,89,0.15), 0 4px 20px rgba(226,182,89,0.12)',
          }}
        >
          {/* Background glow spot (like the gold sphere) */}
          <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(226,182,89,0.2) 0%, transparent 70%)',
          }} />
          <div className="flex items-start gap-3">
            {/* Golden nucleus dot */}
            <div className="mt-0.5 w-6 h-6 rounded-full flex-shrink-0" style={{
              background: 'radial-gradient(circle at 35% 30%, #FFF5CC 0%, #E2B659 50%, #C49430 100%)',
              boxShadow: '0 0 0 2px rgba(226,182,89,0.2), 0 2px 8px rgba(226,182,89,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
            }} />
            <div>
              <p className="text-[10px] font-bold text-[#B8862A]/80 uppercase tracking-widest mb-1">
                Prioridad del día
              </p>
              <p className="font-serif text-[17px] text-[#2A1A4A] leading-snug">
                {user.miDiaState.mainPriority}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      {allTasks.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Pendientes', value: pendingTasks.length, color: '#EADCF9' },
            { label: 'Completadas', value: completedToday.length, color: 'rgba(123,207,184,0.3)' },
            { label: 'Total', value: allTasks.length, color: '#F9F8FC' },
          ].map(stat => (
            <div key={stat.label}
              className="rounded-[10px] p-3 text-center"
              style={{ background: stat.color, border: '1px solid rgba(238,233,245,0.8)' }}
            >
              <p className="font-serif text-[22px] text-[#2A1A4A] leading-none">{stat.value}</p>
              <p className="text-[10px] text-[#2A1A4A]/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">
            Tareas de hoy
          </p>
          {pendingTasks.length > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#EADCF9', color: '#2A1A4A' }}
            >{pendingTasks.length}</span>
          )}
        </div>

        {/* Overwhelmed Focus Banner */}
        {isOverwhelmed && pendingTasks.length > 0 && (
          <div
            className="p-3.5 rounded-[14px] flex items-start gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(234,220,249,0.4) 0%, rgba(214,188,250,0.2) 100%)',
              border: '1.5px solid rgba(214,188,250,0.5)',
            }}
          >
            <span className="text-xl">🎯</span>
            <div>
              <p className="text-[12px] font-bold text-[#7B4FBB]">Modo enfocado</p>
              <p className="text-[11px] text-[#2A1A4A]/55 leading-relaxed mt-0.5">
                Solo tus {Math.min(3, pendingTasks.length)} tareas más importantes. Una a la vez.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingTasks.length === 0 && !showNewTask && (
          <div
            className="flex flex-col items-center py-10 gap-3 rounded-[14px]"
            style={{ border: '1px dashed #EEE9F5', background: '#FAFAFA' }}
          >
            <span className="text-3xl">✓</span>
            <p className="text-[13px] text-[#2A1A4A]/40">
              {completedToday.length > 0
                ? `¡Todas las tareas completadas!`
                : 'Sin tareas — ¡crea una para empezar!'}
            </p>
          </div>
        )}

        {/* Pending Tasks */}
        <div className="space-y-2">
          {focusedTasks.map(task => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3.5 rounded-[12px] transition-all"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid #EEE9F5',
                boxShadow: '0 1px 6px rgba(0,0,0,0.02)',
              }}
            >
              {/* Task node — mirrors logo DNA */}
              <button
                onClick={() => handleCompleteTask(task.id, task.status)}
                className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all"
                style={{
                  background: 'radial-gradient(circle at 35% 28%, rgba(242,236,255,0.6) 0%, rgba(214,188,250,0.15) 100%)',
                  border: '1.5px solid rgba(214,188,250,0.5)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#2A1A4A] leading-snug">{task.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: task.priority === 'high'
                        ? 'rgba(226,182,89,0.2)'
                        : task.priority === 'medium'
                        ? 'rgba(234,220,249,0.6)'
                        : '#F9F8FC',
                      color: task.priority === 'high' ? '#B8862A' : '#2A1A4A',
                      border: task.priority === 'high' ? '1px solid rgba(226,182,89,0.3)' : '1px solid #EEE9F5',
                    }}
                  >{PRIORITY_LABELS[task.priority]}</span>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-[#2A1A4A]/20 hover:text-red-400 text-[13px] flex-shrink-0"
              >✕</button>
            </div>
          ))}
        </div>

        {/* Overwhelmed: hidden tasks hint */}
        {isOverwhelmed && pendingTasks.length > 3 && (
          <p className="text-center text-[11px] text-[#2A1A4A]/35 py-1">
            +{pendingTasks.length - 3} tarea{pendingTasks.length - 3 !== 1 ? 's' : ''} oculta{pendingTasks.length - 3 !== 1 ? 's' : ''} — enfócate en las de arriba primero
          </p>
        )}

        {/* Completed Tasks (collapsed) */}
        {completedToday.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {completedToday.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] opacity-50"
                style={{ background: '#F9F8FC' }}
              >
                <button
                  onClick={() => handleCompleteTask(task.id, task.status)}
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] text-white"
                  style={{ background: '#7BCFB8' }}
                >✓</button>
                <p className="text-[13px] text-[#2A1A4A] line-through flex-1">{task.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Task */}
      {showNewTask && (
        <div
          className="p-4 rounded-[14px] space-y-3"
          style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
        >
          <input
            type="text" placeholder="¿Qué necesitas hacer?"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddTask() }}
            className="w-full px-3 py-2.5 rounded-[8px] text-[14px] text-[#2A1A4A] outline-none"
            style={{ background: '#ffffff', border: '1px solid #EEE9F5' }}
            autoFocus
          />
          <div className="flex gap-2">
            {(['high', 'medium', 'low'] as Task['priority'][]).map(p => (
              <button
                key={p}
                onClick={() => setNewTaskPriority(p)}
                className="flex-1 py-2 rounded-[8px] text-[11px] font-bold transition-all"
                style={{
                  background: newTaskPriority === p ? 'rgba(226,182,89,0.2)' : '#F9F8FC',
                  border: newTaskPriority === p ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                  color: newTaskPriority === p ? '#B8862A' : '#2A1A4A',
                }}
              >{PRIORITY_LABELS[p]}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="flex-1 py-2.5 rounded-[10px] font-bold text-[14px] text-[#2A1A4A]"
              style={{ background: 'rgba(226,182,89,0.2)', border: '1.5px solid rgba(226,182,89,0.5)' }}
            >Crear tarea</button>
            <button
              onClick={() => setShowNewTask(false)}
              className="px-4 py-2.5 rounded-[10px] text-[13px] text-[#2A1A4A]/50"
              style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
            >Cancelar</button>
          </div>
        </div>
      )}

      {!showNewTask && (
        <button
          onClick={() => setShowNewTask(true)}
          className="w-full py-3.5 rounded-[12px] font-bold text-[15px] text-[#2A1A4A] transition-all active:scale-95"
          style={{ background: 'rgba(226,182,89,0.12)', border: '1.5px solid rgba(226,182,89,0.4)' }}
        >
          ✦ Nueva Tarea
        </button>
      )}
    </div>
  )
}
