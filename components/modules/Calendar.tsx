'use client'

import { useState, useMemo } from 'react'
import { useNexus } from '@/lib/context'
import { Card } from '@/components/Card'
import { getCurrentMonth, getFirstDayOfMonth, formatTime } from '@/lib/utils'
import { SmartSchedule, ScheduleBlock } from '@/lib/types'

type CalendarTab = 'calendar' | 'schedule'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const WEEK_DAYS = ['D','L','M','X','J','V','S']

const BLOCK_COLORS: Record<ScheduleBlock['type'], string> = {
  'routine':   'rgba(234,220,249,0.6)',
  'deep-work': 'rgba(226,182,89,0.18)',
  'content':   'rgba(201,163,255,0.25)',
  'admin':     'rgba(249,248,252,1)',
  'break':     'rgba(123,207,184,0.2)',
}

const BLOCK_LABELS: Record<ScheduleBlock['type'], string> = {
  'routine':   'Rutina',
  'deep-work': 'Trabajo profundo ✦',
  'content':   'Contenido',
  'admin':     'Admin',
  'break':     'Descanso',
}

export function Calendar() {
  const { user, getCalendarEvents, addCalendarEvent, deleteCalendarEvent, saveSmartSchedule, getSmartSchedule } = useNexus()
  const [tab, setTab] = useState<CalendarTab>('calendar')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [eventForm, setEventForm] = useState<{ title: string; startTime: string; endTime: string; type: 'routine' | 'critical' }>({ title: '', startTime: '09:00', endTime: '10:00', type: 'routine' })

  // Smart Schedule state
  const [schedStep, setSchedStep] = useState<1|2|3>(1)
  const [schedForm, setSchedForm] = useState({
    dayStartTime: '08:00',
    mainGoal: '',
    energyLevel: 'happy' as SmartSchedule['energyLevel'],
    willRecord: false,
    mandatoryTasks: [''],
  })
  const [generatedSchedule, setGeneratedSchedule] = useState<ScheduleBlock[] | null>(null)

  const { month, year, days } = getCurrentMonth()
  const firstDay = getFirstDayOfMonth()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const calendarDays = useMemo(() => {
    const result: (number|null)[] = []
    for (let i = 0; i < firstDay; i++) result.push(null)
    for (let i = 1; i <= days; i++) result.push(i)
    return result
  }, [firstDay, days])

  const dateStr = (day: number) =>
    `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

  const selectedEvents = selectedDate ? getCalendarEvents(user.currentBrandId, selectedDate) : []
  const savedSchedule = selectedDate ? getSmartSchedule(user.currentBrandId, selectedDate) : null

  // Days that have events (for dots)
  const daysWithEvents = useMemo(() => {
    const evs = getCalendarEvents(user.currentBrandId)
    const set = new Set<string>()
    evs.forEach(e => set.add(e.date))
    return set
  }, [user.currentBrandId, getCalendarEvents])

  const handleAddEvent = () => {
    if (!eventForm.title.trim() || !selectedDate) return
    addCalendarEvent({
      brandId: user.currentBrandId,
      title: eventForm.title,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
      date: selectedDate,
      type: eventForm.type,
      taskIds: [],
    })
    setEventForm({ title: '', startTime: '09:00', endTime: '10:00', type: 'routine' })
    setShowEventForm(false)
  }

  // Generate a simple schedule from form inputs
  const handleGenerateSchedule = () => {
    const tasks = schedForm.mandatoryTasks.filter(t => t.trim())
    const blocks: ScheduleBlock[] = []
    let [h, m] = schedForm.dayStartTime.split(':').map(Number)

    const addBlock = (title: string, minutes: number, type: ScheduleBlock['type']) => {
      const start = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
      m += minutes
      h += Math.floor(m / 60); m = m % 60
      const end = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
      blocks.push({ startTime: start, endTime: end, title, type })
    }

    addBlock('Rutina matutina', 30, 'routine')

    if (schedForm.energyLevel === 'fire' || schedForm.energyLevel === 'happy') {
      if (schedForm.mainGoal) addBlock(schedForm.mainGoal, 90, 'deep-work')
      tasks.forEach(t => addBlock(t, 30, 'admin'))
      if (schedForm.willRecord) addBlock('Grabación de contenido', 60, 'content')
      addBlock('Descanso', 15, 'break')
      tasks.slice(1).forEach(t => addBlock(t, 30, 'admin'))
    } else {
      if (schedForm.mainGoal) addBlock(schedForm.mainGoal, 45, 'deep-work')
      addBlock('Descanso', 20, 'break')
      tasks.slice(0, 2).forEach(t => addBlock(t, 30, 'admin'))
      if (schedForm.willRecord) addBlock('Grabación (versión corta)', 30, 'content')
    }

    setGeneratedSchedule(blocks)
    setSchedStep(3)
  }

  const handleSaveSchedule = () => {
    if (!selectedDate || !generatedSchedule) return
    saveSmartSchedule({
      brandId: user.currentBrandId,
      date: selectedDate,
      dayStartTime: schedForm.dayStartTime,
      mainGoal: schedForm.mainGoal,
      energyLevel: schedForm.energyLevel,
      willRecord: schedForm.willRecord,
      mandatoryTasks: schedForm.mandatoryTasks.filter(t => t.trim()),
      generatedBlocks: generatedSchedule,
    })
    setGeneratedSchedule(null)
    setSchedStep(1)
    setTab('calendar')
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-[22px] text-[#2A1A4A]">{MONTH_NAMES[month]} {year}</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-[12px]" style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}>
        {([['calendar','📅 Calendario'],['schedule','⚡ Horario IA']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 py-2 rounded-[10px] text-[13px] font-semibold transition-all"
            style={{
              background: tab === id ? 'rgba(226,182,89,0.2)' : 'transparent',
              color: tab === id ? '#B8862A' : '#2A1A4A/50',
              border: tab === id ? '1px solid rgba(226,182,89,0.35)' : '1px solid transparent',
            }}
          >{label}</button>
        ))}
      </div>

      {/* ── CALENDAR TAB ── */}
      {tab === 'calendar' && (
        <>
          {/* Calendar Grid */}
          <div className="rounded-[14px] p-4" style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}>
            <div className="grid grid-cols-7 mb-2">
              {WEEK_DAYS.map(d => (
                <div key={d} className="text-center text-[11px] font-bold text-[#2A1A4A]/40 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={idx} />
                const ds = dateStr(day)
                const isToday = ds === todayStr
                const isSelected = ds === selectedDate
                const hasEvents = daysWithEvents.has(ds)
                return (
                  <button key={idx}
                    onClick={() => { setSelectedDate(ds); setShowEventForm(false) }}
                    className="aspect-square flex flex-col items-center justify-center rounded-[8px] transition-all relative"
                    style={{
                      background: isSelected ? 'rgba(226,182,89,0.25)' : isToday ? 'rgba(234,220,249,0.5)' : 'transparent',
                      border: isSelected ? '1.5px solid rgba(226,182,89,0.6)' : isToday ? '1.5px solid #EADCF9' : '1.5px solid transparent',
                      color: '#2A1A4A',
                      fontWeight: isToday ? '700' : '400',
                      fontSize: 13,
                    }}
                  >
                    {day}
                    {hasEvents && (
                      <span
                        className="absolute bottom-0.5 w-1 h-1 rounded-full"
                        style={{ background: isSelected ? '#E2B659' : '#EADCF9' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Date */}
          {selectedDate && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <button
                  onClick={() => setShowEventForm(!showEventForm)}
                  className="text-[12px] font-bold px-3 py-1.5 rounded-[8px]"
                  style={{ background: 'rgba(226,182,89,0.15)', color: '#B8862A' }}
                >+ Evento</button>
              </div>

              {/* Saved Smart Schedule */}
              {savedSchedule && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-[#B8862A]/70 uppercase tracking-widest">⚡ Horario generado</p>
                  {savedSchedule.generatedBlocks.map((block, i) => (
                    <div key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[10px]"
                      style={{ background: BLOCK_COLORS[block.type], border: '1px solid rgba(238,233,245,0.5)' }}
                    >
                      <span className="text-[11px] font-bold text-[#2A1A4A]/50 w-20 flex-shrink-0">
                        {formatTime(block.startTime)}
                      </span>
                      <span className="text-[13px] text-[#2A1A4A] flex-1">{block.title}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Events */}
              {selectedEvents.length === 0 && !showEventForm && !savedSchedule && (
                <p className="text-[13px] text-[#2A1A4A]/35 text-center py-4">Sin eventos este día</p>
              )}

              {selectedEvents.map(ev => (
                <div key={ev.id}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-[12px]"
                  style={{
                    background: ev.type === 'critical' ? 'rgba(226,182,89,0.1)' : 'rgba(255,255,255,0.85)',
                    border: ev.type === 'critical' ? '1.5px solid rgba(226,182,89,0.4)' : '1px solid #EEE9F5',
                  }}
                >
                  <div
                    className="w-1.5 h-8 rounded-full flex-shrink-0"
                    style={{ background: ev.type === 'critical' ? '#E2B659' : '#EADCF9' }}
                  />
                  <div className="flex-1">
                    <p className="text-[14px] text-[#2A1A4A] font-medium">{ev.title}</p>
                    <p className="text-[11px] text-[#2A1A4A]/45">
                      {formatTime(ev.startTime)} – {formatTime(ev.endTime)}
                    </p>
                  </div>
                  <button onClick={() => deleteCalendarEvent(ev.id)}
                    className="text-[12px] text-[#2A1A4A]/20 hover:text-red-400"
                  >✕</button>
                </div>
              ))}

              {/* Event Form */}
              {showEventForm && (
                <div className="p-4 rounded-[14px] space-y-3" style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}>
                  <input type="text" placeholder="Nombre del evento"
                    value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-[8px] text-[14px] outline-none"
                    style={{ background: '#fff', border: '1px solid #EEE9F5' }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="time" value={eventForm.startTime}
                      onChange={e => setEventForm(f => ({ ...f, startTime: e.target.value }))}
                      className="px-3 py-2 rounded-[8px] text-[13px] outline-none"
                      style={{ background: '#fff', border: '1px solid #EEE9F5' }}
                    />
                    <input type="time" value={eventForm.endTime}
                      onChange={e => setEventForm(f => ({ ...f, endTime: e.target.value }))}
                      className="px-3 py-2 rounded-[8px] text-[13px] outline-none"
                      style={{ background: '#fff', border: '1px solid #EEE9F5' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {(['routine','critical'] as const).map(t => (
                      <button key={t} onClick={() => setEventForm(f => ({ ...f, type: t }))}
                        className="flex-1 py-2 rounded-[8px] text-[12px] font-semibold"
                        style={{
                          background: eventForm.type === t ? (t === 'critical' ? 'rgba(226,182,89,0.2)' : 'rgba(234,220,249,0.5)') : '#fff',
                          border: eventForm.type === t ? (t === 'critical' ? '1px solid rgba(226,182,89,0.5)' : '1px solid #EADCF9') : '1px solid #EEE9F5',
                          color: '#2A1A4A',
                        }}
                      >{t === 'critical' ? '✦ Crítico' : 'Rutina'}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddEvent}
                      className="flex-1 py-2.5 rounded-[10px] font-bold text-[13px] text-[#2A1A4A]"
                      style={{ background: 'rgba(226,182,89,0.2)', border: '1px solid rgba(226,182,89,0.4)' }}
                    >Crear</button>
                    <button onClick={() => setShowEventForm(false)}
                      className="px-4 py-2.5 rounded-[10px] text-[13px]"
                      style={{ background: '#fff', border: '1px solid #EEE9F5', color: '#2A1A4A/50' }}
                    >Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!selectedDate && (
            <p className="text-center text-[13px] text-[#2A1A4A]/35 py-4">
              Selecciona un día para ver o crear eventos
            </p>
          )}
        </>
      )}

      {/* ── SMART SCHEDULE TAB ── */}
      {tab === 'schedule' && (
        <div className="space-y-5">
          {!selectedDate ? (
            <div
              className="flex flex-col items-center justify-center py-12 gap-3 rounded-[14px]"
              style={{ border: '1.5px dashed rgba(226,182,89,0.4)', background: 'rgba(226,182,89,0.04)' }}
            >
              <span className="text-4xl">📅</span>
              <p className="text-[14px] text-[#2A1A4A]/60 text-center">
                Selecciona un día en el Calendario para generar tu horario
              </p>
              <button onClick={() => setTab('calendar')}
                className="text-[13px] font-bold px-4 py-2 rounded-[10px]"
                style={{ background: 'rgba(226,182,89,0.15)', color: '#B8862A' }}
              >Ir al Calendario →</button>
            </div>
          ) : schedStep === 1 ? (
            <>
              <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">
                Paso 1 — Tu jornada
              </p>
              <div>
                <p className="text-[12px] text-[#2A1A4A]/60 mb-2">¿A qué hora empieza tu día?</p>
                <input type="time" value={schedForm.dayStartTime}
                  onChange={e => setSchedForm(f => ({ ...f, dayStartTime: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[10px] text-[15px] outline-none"
                  style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                />
              </div>
              <div>
                <p className="text-[12px] text-[#2A1A4A]/60 mb-2">¿Qué quieres lograr hoy?</p>
                <input type="text" placeholder="Meta principal del día"
                  value={schedForm.mainGoal}
                  onChange={e => setSchedForm(f => ({ ...f, mainGoal: e.target.value }))}
                  className="w-full px-4 py-3 rounded-[10px] text-[14px] outline-none"
                  style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                />
              </div>
              <div>
                <p className="text-[12px] text-[#2A1A4A]/60 mb-2">¿Cómo te sientes hoy?</p>
                <div className="grid grid-cols-2 gap-2">
                  {([['fire','🔥 En Fuego'],['happy','😊 Bien'],['tired','😴 Cansada'],['overwhelmed','😵 Abrumada']] as const).map(([id, label]) => (
                    <button key={id} onClick={() => setSchedForm(f => ({ ...f, energyLevel: id }))}
                      className="py-3 rounded-[10px] text-[13px] font-medium"
                      style={{
                        background: schedForm.energyLevel === id ? 'rgba(226,182,89,0.15)' : '#F9F8FC',
                        border: schedForm.energyLevel === id ? '1.5px solid rgba(226,182,89,0.5)' : '1px solid #EEE9F5',
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setSchedStep(2)}
                className="w-full py-4 rounded-[12px] font-bold text-[15px] text-[#2A1A4A]"
                style={{ background: 'rgba(226,182,89,0.2)', border: '1.5px solid rgba(226,182,89,0.5)' }}
              >Continuar →</button>
            </>
          ) : schedStep === 2 ? (
            <>
              <p className="text-[11px] font-bold text-[#2A1A4A]/40 uppercase tracking-widest">
                Paso 2 — Tus tareas
              </p>
              <div>
                <p className="text-[12px] text-[#2A1A4A]/60 mb-2">¿Vas a grabar contenido hoy?</p>
                <div className="flex gap-2">
                  {(['Sí','No'] as const).map(opt => (
                    <button key={opt} onClick={() => setSchedForm(f => ({ ...f, willRecord: opt === 'Sí' }))}
                      className="flex-1 py-3 rounded-[10px] text-[14px] font-medium"
                      style={{
                        background: (opt === 'Sí') === schedForm.willRecord ? 'rgba(234,220,249,0.5)' : '#F9F8FC',
                        border: (opt === 'Sí') === schedForm.willRecord ? '1.5px solid #EADCF9' : '1px solid #EEE9F5',
                      }}
                    >{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[12px] text-[#2A1A4A]/60 mb-2">Tareas obligatorias de hoy</p>
                <div className="space-y-2">
                  {schedForm.mandatoryTasks.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder={`Tarea ${i+1}`}
                        value={t} onChange={e => {
                          const ts = [...schedForm.mandatoryTasks]; ts[i] = e.target.value
                          setSchedForm(f => ({ ...f, mandatoryTasks: ts }))
                        }}
                        className="flex-1 px-3 py-2.5 rounded-[8px] text-[13px] outline-none"
                        style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                      />
                      {schedForm.mandatoryTasks.length > 1 && (
                        <button onClick={() => setSchedForm(f => ({ ...f, mandatoryTasks: f.mandatoryTasks.filter((_,j) => j !== i) }))}
                          className="text-[#2A1A4A]/30 px-2"
                        >✕</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setSchedForm(f => ({ ...f, mandatoryTasks: [...f.mandatoryTasks,''] }))}
                    className="text-[12px] text-[#2A1A4A]/40"
                  >+ Agregar tarea</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSchedStep(1)}
                  className="px-4 py-4 rounded-[12px] text-[14px]"
                  style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                >←</button>
                <button onClick={handleGenerateSchedule}
                  className="flex-1 py-4 rounded-[12px] font-bold text-[15px] text-white"
                  style={{ background: 'linear-gradient(135deg, #4A2080 0%, #2A1A4A 100%)' }}
                >⚡ Generar Horario</button>
              </div>
            </>
          ) : generatedSchedule ? (
            <>
              <p className="text-[11px] font-bold text-[#B8862A] uppercase tracking-widest">
                ⚡ Tu horario para hoy
              </p>
              <div className="space-y-2">
                {generatedSchedule.map((block, i) => (
                  <div key={i}
                    className="flex items-center gap-3 px-3.5 py-3 rounded-[12px]"
                    style={{ background: BLOCK_COLORS[block.type], border: '1px solid rgba(238,233,245,0.5)' }}
                  >
                    <div className="w-20 flex-shrink-0">
                      <p className="text-[11px] font-bold text-[#2A1A4A]/50">{formatTime(block.startTime)}</p>
                      <p className="text-[10px] text-[#2A1A4A]/35">{formatTime(block.endTime)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#2A1A4A]">{block.title}</p>
                      <p className="text-[10px] text-[#2A1A4A]/40">{BLOCK_LABELS[block.type]}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSchedStep(2)}
                  className="px-4 py-4 rounded-[12px] text-[14px]"
                  style={{ background: '#F9F8FC', border: '1px solid #EEE9F5' }}
                >← Editar</button>
                <button onClick={handleSaveSchedule}
                  className="flex-1 py-4 rounded-[12px] font-bold text-[15px] text-white"
                  style={{ background: 'linear-gradient(135deg, #4A2080 0%, #2A1A4A 100%)' }}
                >Guardar horario ✓</button>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
