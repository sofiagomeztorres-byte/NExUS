'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import {
  UserState, Brand, Task, CalendarEvent, LibraryFile, Group,
  Goal, AnalyticsEntry, SmartSchedule, KnowledgeBaseItem, ImportantLink,
} from './types'
import { computeTheme, type BrandTheme } from './theme'
import { supabase, supabaseConfigured } from './supabase'

// ─── UUID helper ─────────────────────────────────────────────────────────────
function uuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

// ─── Context Shape ────────────────────────────────────────────────────────────
interface NexusContextType {
  loaded: boolean
  user: UserState
  updateUserState: (updates: Partial<UserState>) => void
  logout: () => Promise<void>
  loadUserData: (userId: string) => Promise<void>
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => string
  updateBrand: (brandId: string, updates: Partial<Brand>) => void
  switchBrand: (brandId: string) => void
  deleteBrand: (brandId: string) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  getTasks: (brandId: string) => Task[]
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => string
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void
  deleteCalendarEvent: (eventId: string) => void
  getCalendarEvents: (brandId: string, date?: string) => CalendarEvent[]
  saveSmartSchedule: (schedule: Omit<SmartSchedule, 'id' | 'createdAt'>) => string
  getSmartSchedule: (brandId: string, date: string) => SmartSchedule | null
  addLibraryFile: (file: Omit<LibraryFile, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateLibraryFile: (fileId: string, updates: Partial<LibraryFile>) => void
  deleteLibraryFile: (fileId: string) => void
  getLibraryFiles: (brandId: string) => LibraryFile[]
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => string
  updateGroup: (groupId: string, updates: Partial<Group>) => void
  deleteGroup: (groupId: string) => void
  getGroups: (brandId: string) => Group[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateGoal: (goalId: string, updates: Partial<Goal>) => void
  deleteGoal: (goalId: string) => void
  getGoals: (brandId: string) => Goal[]
  addAnalyticsEntry: (entry: Omit<AnalyticsEntry, 'id' | 'createdAt'>) => string
  updateAnalyticsEntry: (entryId: string, updates: Partial<AnalyticsEntry>) => void
  deleteAnalyticsEntry: (entryId: string) => void
  getAnalyticsEntries: (brandId: string) => AnalyticsEntry[]
  addKnowledgeItem: (brandId: string, item: Omit<KnowledgeBaseItem, 'id' | 'uploadedAt'>) => void
  deleteKnowledgeItem: (brandId: string, itemId: string) => void
  brandTheme: BrandTheme
}

// ─── Row → App type mappers ───────────────────────────────────────────────────
type Row = Record<string, any>

function rowToBrand(r: Row): Brand {
  return {
    id: r.id,
    name: r.name ?? '',
    logo: r.logo ?? '🏢',
    description: r.description ?? '',
    industry: r.industry ?? '',
    website: r.website ?? '',
    socialMediaLinks: r.social_media_links ?? {},
    visualIdentity: r.visual_identity ?? { primaryColor: '#6B3FA0', secondaryColor: '#E2B659', accentColor: '#E2B659', typography: 'Inter', style: 'Modern' },
    strategicInfo: r.strategic_info ?? { businessFocus: '', productsServices: '', idealCustomer: '', problemSolved: '', mainPromise: '', differentiator: '' },
    personality: r.personality ?? { communicationTone: '', frequentWords: [], forbiddenWords: [] },
    knowledgeBase: r.knowledge_base ?? [],
    importantLinks: r.important_links ?? [],
    createdAt: r.created_at ?? new Date().toISOString(),
  }
}

function rowToTask(r: Row): Task {
  return {
    id: r.id, brandId: r.brand_id,
    title: r.title ?? '', description: r.description,
    priority: r.priority ?? 'medium', status: r.status ?? 'pending',
    dueDate: r.due_date, scheduledTime: r.scheduled_time,
    energyLevel: r.energy_level, tags: r.tags ?? [],
    createdAt: r.created_at ?? new Date().toISOString(),
    updatedAt: r.updated_at ?? new Date().toISOString(),
  }
}

function rowToCalendarEvent(r: Row): CalendarEvent {
  return {
    id: r.id, brandId: r.brand_id,
    title: r.title ?? '', startTime: r.start_time ?? '', endTime: r.end_time ?? '',
    date: r.date ?? '', type: r.type ?? 'scheduled',
    taskIds: r.task_ids ?? [], color: r.color,
    createdAt: r.created_at ?? new Date().toISOString(),
  }
}

function rowToSmartSchedule(r: Row): SmartSchedule {
  return {
    id: r.id, brandId: r.brand_id, date: r.date ?? '',
    dayStartTime: r.day_start_time ?? '08:00', mainGoal: r.main_goal ?? '',
    energyLevel: r.energy_level ?? 'happy', willRecord: r.will_record ?? false,
    mandatoryTasks: r.mandatory_tasks ?? [], generatedBlocks: r.generated_blocks ?? [],
    createdAt: r.created_at ?? new Date().toISOString(),
  }
}

function rowToLibraryFile(r: Row): LibraryFile {
  return {
    id: r.id, brandId: r.brand_id,
    name: r.name ?? '', description: r.description,
    type: r.type ?? 'url', url: r.url, filePath: r.file_path,
    fileSize: r.file_size, mimeType: r.mime_type, thumbnail: r.thumbnail,
    tags: r.tags ?? [], favorite: r.favorite ?? false, priority: r.priority ?? false,
    createdAt: r.created_at ?? new Date().toISOString(),
    updatedAt: r.updated_at ?? new Date().toISOString(),
  }
}

function rowToGroup(r: Row): Group {
  return {
    id: r.id, brandId: r.brand_id,
    name: r.name ?? '', type: r.type ?? 'custom',
    weekNumber: r.week_number, days: r.days ?? [], archived: r.archived ?? false,
    createdAt: r.created_at ?? new Date().toISOString(),
  }
}

function rowToGoal(r: Row): Goal {
  return {
    id: r.id, brandId: r.brand_id,
    title: r.title ?? '', description: r.description,
    category: r.category ?? 'other', priority: r.priority ?? 'medium',
    status: r.status ?? 'active', targetDate: r.target_date,
    progress: r.progress ?? 0, milestones: r.milestones ?? [],
    createdAt: r.created_at ?? new Date().toISOString(),
    updatedAt: r.updated_at ?? new Date().toISOString(),
  }
}

function rowToAnalyticsEntry(r: Row): AnalyticsEntry {
  return {
    id: r.id, brandId: r.brand_id,
    title: r.title ?? '', platform: r.platform ?? 'instagram',
    contentType: r.content_type ?? 'video',
    fileUrl: r.file_url, filePath: r.file_path,
    metrics: r.metrics ?? {}, aiScore: r.ai_score, aiInsights: r.ai_insights,
    capturedAt: r.captured_at ?? '', createdAt: r.created_at ?? new Date().toISOString(),
  }
}

// ─── App type → DB row mappers ────────────────────────────────────────────────
function brandToRow(b: Brand, userId: string) {
  return {
    id: b.id, user_id: userId,
    name: b.name, logo: b.logo, description: b.description,
    industry: b.industry, website: b.website,
    social_media_links: b.socialMediaLinks,
    visual_identity: b.visualIdentity,
    strategic_info: b.strategicInfo,
    personality: b.personality,
    knowledge_base: b.knowledgeBase,
    important_links: b.importantLinks,
  }
}

function taskToRow(t: Task, userId: string) {
  return {
    id: t.id, user_id: userId, brand_id: t.brandId,
    title: t.title, description: t.description,
    priority: t.priority, status: t.status,
    due_date: t.dueDate, scheduled_time: t.scheduledTime,
    energy_level: t.energyLevel, tags: t.tags,
    created_at: t.createdAt, updated_at: t.updatedAt,
  }
}

function eventToRow(e: CalendarEvent, userId: string) {
  return {
    id: e.id, user_id: userId, brand_id: e.brandId,
    title: e.title, start_time: e.startTime, end_time: e.endTime,
    date: e.date, type: e.type, task_ids: e.taskIds, color: e.color,
    created_at: e.createdAt,
  }
}

function scheduleToRow(s: SmartSchedule, userId: string) {
  return {
    id: s.id, user_id: userId, brand_id: s.brandId,
    date: s.date, day_start_time: s.dayStartTime, main_goal: s.mainGoal,
    energy_level: s.energyLevel, will_record: s.willRecord,
    mandatory_tasks: s.mandatoryTasks, generated_blocks: s.generatedBlocks,
    created_at: s.createdAt,
  }
}

function fileToRow(f: LibraryFile, userId: string) {
  return {
    id: f.id, user_id: userId, brand_id: f.brandId,
    name: f.name, description: f.description, type: f.type,
    url: f.url, file_path: f.filePath, file_size: f.fileSize,
    mime_type: f.mimeType, thumbnail: f.thumbnail,
    tags: f.tags, favorite: f.favorite, priority: f.priority,
    created_at: f.createdAt, updated_at: f.updatedAt,
  }
}

function groupToRow(g: Group, userId: string) {
  return {
    id: g.id, user_id: userId, brand_id: g.brandId,
    name: g.name, type: g.type, week_number: g.weekNumber,
    days: g.days, archived: g.archived, created_at: g.createdAt,
  }
}

function goalToRow(g: Goal, userId: string) {
  return {
    id: g.id, user_id: userId, brand_id: g.brandId,
    title: g.title, description: g.description,
    category: g.category, priority: g.priority, status: g.status,
    target_date: g.targetDate, progress: g.progress, milestones: g.milestones,
    created_at: g.createdAt, updated_at: g.updatedAt,
  }
}

function analyticsToRow(a: AnalyticsEntry, userId: string) {
  return {
    id: a.id, user_id: userId, brand_id: a.brandId,
    title: a.title, platform: a.platform, content_type: a.contentType,
    file_url: a.fileUrl, file_path: a.filePath, metrics: a.metrics,
    ai_score: a.aiScore, ai_insights: a.aiInsights,
    captured_at: a.capturedAt, created_at: a.createdAt,
  }
}

// ─── Brand merge helper (normalises visual identity defaults) ─────────────────
function mergeBrands(rawBrands: Brand[]): Brand[] {
  return rawBrands.map((b: Brand) => ({
    ...b,
    knowledgeBase: b.knowledgeBase ?? [],
    importantLinks: b.importantLinks ?? [],
    visualIdentity: {
      ...b.visualIdentity,
      primaryColor:      (b.visualIdentity?.primaryColor   ?? '#6B3FA0').toLowerCase(),
      secondaryColor:    (b.visualIdentity?.secondaryColor ?? '#E2B659').toLowerCase(),
      accentColor:       (b.visualIdentity?.accentColor    ?? b.visualIdentity?.secondaryColor ?? '#E2B659').toLowerCase(),
      successColor:      (b.visualIdentity?.successColor   ?? '#22C55E').toLowerCase(),
      warningColor:      (b.visualIdentity?.warningColor   ?? '#F59E0B').toLowerCase(),
      priorityColor:     (b.visualIdentity?.priorityColor  ?? '#EF4444').toLowerCase(),
      backgroundStyle:   b.visualIdentity?.backgroundStyle ?? 'light',
      customBgColor:     b.visualIdentity?.customBgColor,
      typography:        b.visualIdentity?.typography      ?? 'Inter',
      fontFamily:        b.visualIdentity?.fontFamily      ?? 'inter',
      fontStyle:         b.visualIdentity?.fontStyle,
      style:             b.visualIdentity?.style           ?? 'Modern',
      borderRadius:      b.visualIdentity?.borderRadius    ?? 'medium',
      density:           b.visualIdentity?.density         ?? 'comfortable',
      iconStyle:         b.visualIdentity?.iconStyle       ?? 'modern',
      visualPersonality: b.visualIdentity?.visualPersonality ?? 'modern',
    },
    strategicInfo: {
      businessFocus: b.strategicInfo?.businessFocus ?? '',
      productsServices: b.strategicInfo?.productsServices ?? '',
      idealCustomer: b.strategicInfo?.idealCustomer ?? '',
      problemSolved: b.strategicInfo?.problemSolved ?? '',
      mainPromise: b.strategicInfo?.mainPromise ?? '',
      differentiator: b.strategicInfo?.differentiator ?? '',
    },
    personality: {
      communicationTone: b.personality?.communicationTone ?? '',
      frequentWords: b.personality?.frequentWords ?? [],
      forbiddenWords: b.personality?.forbiddenWords ?? [],
    },
  }))
}

// ─── Initial state ─────────────────────────────────────────────────────────────
const INITIAL_USER: UserState = {
  userId: '', name: '', email: '', brands: [], currentBrandId: '',
  onboardingComplete: false, rememberLastBrand: false,
  hasSeenBrandIntro: false, isAuthenticated: false,
  miDiaState: { energyLevel: null, mainPriority: null, focusedTasks: [] },
}

const NexusContext = createContext<NexusContextType | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────────────────────────
export function NexusProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserState>(INITIAL_USER)
  const [tasks, setTasks] = useState<Task[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [schedules, setSchedules] = useState<SmartSchedule[]>([])
  const [files, setFiles] = useState<LibraryFile[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const userIdRef = useRef('')

  // ── Sync profile fields to Supabase ──
  function syncProfile(u: UserState) {
    if (!u.userId) return
    supabase.from('profiles').upsert(
      {
        id: u.userId,
        name: u.name,
        email: u.email,
        current_brand_id: u.currentBrandId || null,
        onboarding_complete: u.onboardingComplete,
        remember_last_brand: u.rememberLastBrand,
        has_seen_brand_intro: u.hasSeenBrandIntro,
        mi_dia_state: u.miDiaState,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    ).then(({ error }) => {
      if (error) console.error('[NExUS] Profile sync error:', error.code, error.message)
    })
  }

  // ── Load all user data from Supabase ──
  async function loadFromSupabase(userId: string) {
    userIdRef.current = userId
    try {
      const [
        { data: profile, error: profileErr },
        { data: brandsData, error: brandsErr },
        { data: tasksData },
        { data: eventsData },
        { data: schedulesData },
        { data: filesData },
        { data: groupsData },
        { data: goalsData },
        { data: analyticsData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('brands').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('tasks').select('*').eq('user_id', userId),
        supabase.from('calendar_events').select('*').eq('user_id', userId),
        supabase.from('smart_schedules').select('*').eq('user_id', userId),
        supabase.from('library_files').select('*').eq('user_id', userId),
        supabase.from('groups').select('*').eq('user_id', userId),
        supabase.from('goals').select('*').eq('user_id', userId),
        supabase.from('analytics_entries').select('*').eq('user_id', userId),
      ])

      if (profileErr) console.error('[NExUS] Profile load error:', profileErr.code, profileErr.message)
      if (brandsErr) console.error('[NExUS] Brands load error:', brandsErr.code, brandsErr.message)

      // If profile row doesn't exist yet (trigger may have failed), create it now
      if (!profile && profileErr?.code === 'PGRST116') {
        const { data: sessionData } = await supabase.auth.getSession()
        const meta = sessionData.session?.user?.user_metadata ?? {}
        const email = sessionData.session?.user?.email ?? ''
        const { error: createErr } = await supabase.from('profiles').upsert({
          id: userId,
          name: meta.name ?? '',
          email,
        })
        if (createErr) console.error('[NExUS] Profile create error:', createErr.message)
      }

      const brands = mergeBrands((brandsData ?? []).map(rowToBrand))

      setUser({
        userId,
        name: profile?.name ?? '',
        email: profile?.email ?? '',
        brands,
        currentBrandId: profile?.current_brand_id ?? brands[0]?.id ?? '',
        onboardingComplete: profile?.onboarding_complete ?? false,
        rememberLastBrand: profile?.remember_last_brand ?? false,
        hasSeenBrandIntro: profile?.has_seen_brand_intro ?? false,
        isAuthenticated: true,
        miDiaState: (profile?.mi_dia_state as UserState['miDiaState']) ?? { energyLevel: null, mainPriority: null, focusedTasks: [] },
      })
      setTasks((tasksData ?? []).map(rowToTask))
      setEvents((eventsData ?? []).map(rowToCalendarEvent))
      setSchedules((schedulesData ?? []).map(rowToSmartSchedule))
      setFiles((filesData ?? []).map(rowToLibraryFile))
      setGroups((groupsData ?? []).map(rowToGroup))
      setGoals((goalsData ?? []).map(rowToGoal))
      setAnalytics((analyticsData ?? []).map(rowToAnalyticsEntry))
    } catch (err) {
      console.error('[NExUS] Load error:', err)
    }
  }

  function resetState() {
    userIdRef.current = ''
    setUser(INITIAL_USER)
    setTasks([])
    setEvents([])
    setSchedules([])
    setFiles([])
    setGroups([])
    setGoals([])
    setAnalytics([])
  }

  // ── Init: restore session on mount ──
  useEffect(() => {
    if (!supabaseConfigured) {
      // No Supabase credentials — show welcome screen immediately
      setLoaded(true)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      if (session?.user) {
        await loadFromSupabase(session.user.id)
      }
      if (mounted) setLoaded(true)
    }).catch(() => {
      if (mounted) setLoaded(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (!mounted) return
      if (event === 'SIGNED_OUT') {
        resetState()
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value: NexusContextType = {
    loaded,
    user,
    updateUserState: (updates) => {
      setUser(prev => {
        const next = { ...prev, ...updates }
        syncProfile(next)
        return next
      })
    },
    logout: async () => {
      await supabase.auth.signOut()
      resetState()
    },
    loadUserData: async (userId: string) => {
      await loadFromSupabase(userId)
      setLoaded(true)
    },

    // ── Brands ──
    addBrand: (brand) => {
      const id = uuid()
      const newBrand: Brand = {
        ...brand, id,
        createdAt: new Date().toISOString(),
        knowledgeBase: brand.knowledgeBase ?? [],
        importantLinks: brand.importantLinks ?? [],
      }
      setUser(p => {
        const next = { ...p, brands: [...p.brands, newBrand], currentBrandId: id }
        // Sync new brand to Supabase
        supabase.from('brands').insert(brandToRow(newBrand, p.userId))
          .then(({ error }) => { if (error) console.error('[NExUS] addBrand:', error.message) })
        // Sync current_brand_id to profile
        if (p.userId) {
          supabase.from('profiles').update({ current_brand_id: id }).eq('id', p.userId)
            .then(({ error }) => { if (error) console.error('[NExUS] profile currentBrand:', error.message) })
        }
        return next
      })
      return id
    },
    updateBrand: (brandId, updates) => {
      setUser(p => {
        const updated = p.brands.map(b => b.id === brandId ? { ...b, ...updates } : b)
        const brand = updated.find(b => b.id === brandId)
        if (brand && p.userId) {
          supabase.from('brands').update(brandToRow(brand, p.userId)).eq('id', brandId)
            .then(({ error }) => { if (error) console.error('[NExUS] updateBrand:', error.message) })
        }
        return { ...p, brands: updated }
      })
    },
    switchBrand: (brandId) => {
      setUser(p => {
        if (p.userId) {
          supabase.from('profiles').update({ current_brand_id: brandId }).eq('id', p.userId)
            .then(({ error }) => { if (error) console.error('[NExUS] switchBrand:', error.message) })
        }
        return { ...p, currentBrandId: brandId }
      })
    },
    deleteBrand: (brandId) => {
      setUser(p => {
        if (p.userId) {
          supabase.from('brands').delete().eq('id', brandId).eq('user_id', p.userId)
            .then(({ error }) => { if (error) console.error('[NExUS] deleteBrand:', error.message) })
        }
        const remaining = p.brands.filter(b => b.id !== brandId)
        const nextId = p.currentBrandId === brandId
          ? (remaining[0]?.id ?? '')
          : p.currentBrandId
        if (p.userId && nextId !== p.currentBrandId) {
          supabase.from('profiles').update({ current_brand_id: nextId || null }).eq('id', p.userId)
            .then(({ error }) => { if (error) console.error('[NExUS] deleteBrand profile:', error.message) })
        }
        return { ...p, brands: remaining, currentBrandId: nextId }
      })
    },

    // ── Tasks ──
    addTask: (task) => {
      const id = uuid()
      const now = new Date().toISOString()
      const newTask: Task = { ...task, id, createdAt: now, updatedAt: now }
      setTasks(p => [...p, newTask])
      supabase.from('tasks').insert(taskToRow(newTask, userIdRef.current))
        .then(({ error }) => { if (error) console.error('[NExUS] addTask:', error.message) })
      return id
    },
    updateTask: (id, updates) => {
      const now = new Date().toISOString()
      setTasks(p => p.map(t => {
        if (t.id !== id) return t
        const updated = { ...t, ...updates, updatedAt: now }
        supabase.from('tasks').update(taskToRow(updated, userIdRef.current)).eq('id', id)
          .then(({ error }) => { if (error) console.error('[NExUS] updateTask:', error.message) })
        return updated
      }))
    },
    deleteTask: (id) => {
      setTasks(p => p.filter(t => t.id !== id))
      supabase.from('tasks').delete().eq('id', id).eq('user_id', userIdRef.current)
        .then(({ error }) => { if (error) console.error('[NExUS] deleteTask:', error.message) })
    },
    getTasks: (brandId) => tasks.filter(t => t.brandId === brandId),

    // ── Calendar ──
    addCalendarEvent: (ev) => {
      const id = uuid()
      const newEv: CalendarEvent = { ...ev, id, createdAt: new Date().toISOString() }
      setEvents(p => [...p, newEv])
      supabase.from('calendar_events').insert(eventToRow(newEv, userIdRef.current))
        .then(({ error }) => { if (error) console.error('[NExUS] addEvent:', error.message) })
      return id
    },
    updateCalendarEvent: (id, updates) => {
      setEvents(p => p.map(e => {
        if (e.id !== id) return e
        const updated = { ...e, ...updates }
        supabase.from('calendar_events').update(eventToRow(updated, userIdRef.current)).eq('id', id)
          .then(({ error }) => { if (error) console.error('[NExUS] updateEvent:', error.message) })
        return updated
      }))
    },
    deleteCalendarEvent: (id) => {
      setEvents(p => p.filter(e => e.id !== id))
      supabase.from('calendar_events').delete().eq('id', id).eq('user_id', userIdRef.current)
        .then(({ error }) => { if (error) console.error('[NExUS] deleteEvent:', error.message) })
    },
    getCalendarEvents: (brandId, date) =>
      events.filter(e => e.brandId === brandId && (!date || e.date === date)),

    // ── Smart Schedule ──
    saveSmartSchedule: (sched) => {
      const id = uuid()
      const newS: SmartSchedule = { ...sched, id, createdAt: new Date().toISOString() }
      setSchedules(p => {
        const filtered = p.filter(s => !(s.brandId === sched.brandId && s.date === sched.date))
        return [...filtered, newS]
      })
      supabase.from('smart_schedules')
        .upsert(scheduleToRow(newS, userIdRef.current), { onConflict: 'brand_id,date' })
        .then(({ error }) => { if (error) console.error('[NExUS] saveSchedule:', error.message) })
      return id
    },
    getSmartSchedule: (brandId, date) =>
      schedules.find(s => s.brandId === brandId && s.date === date) ?? null,

    // ── Library ──
    addLibraryFile: (file) => {
      const id = uuid()
      const now = new Date().toISOString()
      const newFile: LibraryFile = { ...file, id, createdAt: now, updatedAt: now }
      setFiles(p => [...p, newFile])
      supabase.from('library_files').insert(fileToRow(newFile, userIdRef.current))
        .then(({ error }) => { if (error) console.error('[NExUS] addFile:', error.message) })
      return id
    },
    updateLibraryFile: (id, updates) => {
      const now = new Date().toISOString()
      setFiles(p => p.map(f => {
        if (f.id !== id) return f
        const updated = { ...f, ...updates, updatedAt: now }
        supabase.from('library_files').update(fileToRow(updated, userIdRef.current)).eq('id', id)
          .then(({ error }) => { if (error) console.error('[NExUS] updateFile:', error.message) })
        return updated
      }))
    },
    deleteLibraryFile: (id) => {
      setFiles(p => p.filter(f => f.id !== id))
      supabase.from('library_files').delete().eq('id', id).eq('user_id', userIdRef.current)
        .then(({ error }) => { if (error) console.error('[NExUS] deleteFile:', error.message) })
    },
    getLibraryFiles: (brandId) => files.filter(f => f.brandId === brandId),

    // ── Groups ──
    addGroup: (group) => {
      const id = uuid()
      const newGroup: Group = { ...group, id, createdAt: new Date().toISOString() }
      setGroups(p => [...p, newGroup])
      supabase.from('groups').insert(groupToRow(newGroup, userIdRef.current))
        .then(({ error }) => { if (error) console.error('[NExUS] addGroup:', error.message) })
      return id
    },
    updateGroup: (id, updates) => {
      setGroups(p => p.map(g => {
        if (g.id !== id) return g
        const updated = { ...g, ...updates }
        supabase.from('groups').update(groupToRow(updated, userIdRef.current)).eq('id', id)
          .then(({ error }) => { if (error) console.error('[NExUS] updateGroup:', error.message) })
        return updated
      }))
    },
    deleteGroup: (id) => {
      setGroups(p => p.filter(g => g.id !== id))
      supabase.from('groups').delete().eq('id', id).eq('user_id', userIdRef.current)
        .then(({ error }) => { if (error) console.error('[NExUS] deleteGroup:', error.message) })
    },
    getGroups: (brandId) => groups.filter(g => g.brandId === brandId),

    // ── Goals ──
    addGoal: (goal) => {
      const id = uuid()
      const now = new Date().toISOString()
      const newGoal: Goal = { ...goal, id, createdAt: now, updatedAt: now }
      setGoals(p => [...p, newGoal])
      supabase.from('goals').insert(goalToRow(newGoal, userIdRef.current))
        .then(({ error }) => { if (error) console.error('[NExUS] addGoal:', error.message) })
      return id
    },
    updateGoal: (id, updates) => {
      const now = new Date().toISOString()
      setGoals(p => p.map(g => {
        if (g.id !== id) return g
        const updated = { ...g, ...updates, updatedAt: now }
        supabase.from('goals').update(goalToRow(updated, userIdRef.current)).eq('id', id)
          .then(({ error }) => { if (error) console.error('[NExUS] updateGoal:', error.message) })
        return updated
      }))
    },
    deleteGoal: (id) => {
      setGoals(p => p.filter(g => g.id !== id))
      supabase.from('goals').delete().eq('id', id).eq('user_id', userIdRef.current)
        .then(({ error }) => { if (error) console.error('[NExUS] deleteGoal:', error.message) })
    },
    getGoals: (brandId) => goals.filter(g => g.brandId === brandId),

    // ── Analytics ──
    addAnalyticsEntry: (entry) => {
      const id = uuid()
      const newEntry: AnalyticsEntry = { ...entry, id, createdAt: new Date().toISOString() }
      setAnalytics(p => [...p, newEntry])
      supabase.from('analytics_entries').insert(analyticsToRow(newEntry, userIdRef.current))
        .then(({ error }) => { if (error) console.error('[NExUS] addAnalytics:', error.message) })
      return id
    },
    updateAnalyticsEntry: (id, updates) => {
      setAnalytics(p => p.map(a => {
        if (a.id !== id) return a
        const updated = { ...a, ...updates }
        supabase.from('analytics_entries').update(analyticsToRow(updated, userIdRef.current)).eq('id', id)
          .then(({ error }) => { if (error) console.error('[NExUS] updateAnalytics:', error.message) })
        return updated
      }))
    },
    deleteAnalyticsEntry: (id) => {
      setAnalytics(p => p.filter(a => a.id !== id))
      supabase.from('analytics_entries').delete().eq('id', id).eq('user_id', userIdRef.current)
        .then(({ error }) => { if (error) console.error('[NExUS] deleteAnalytics:', error.message) })
    },
    getAnalyticsEntries: (brandId) => analytics.filter(a => a.brandId === brandId),

    // ── Knowledge Base (stored as JSONB inside brand row) ──
    addKnowledgeItem: (brandId, item) => {
      const newItem: KnowledgeBaseItem = {
        ...item, id: uuid(), uploadedAt: new Date().toISOString(),
      }
      setUser(p => {
        const updated = p.brands.map(b => {
          if (b.id !== brandId) return b
          const next = { ...b, knowledgeBase: [...(b.knowledgeBase ?? []), newItem] }
          supabase.from('brands').update({ knowledge_base: next.knowledgeBase }).eq('id', brandId)
            .then(({ error }) => { if (error) console.error('[NExUS] addKnowledge:', error.message) })
          return next
        })
        return { ...p, brands: updated }
      })
    },
    deleteKnowledgeItem: (brandId, itemId) => {
      setUser(p => {
        const updated = p.brands.map(b => {
          if (b.id !== brandId) return b
          const next = { ...b, knowledgeBase: (b.knowledgeBase ?? []).filter(i => i.id !== itemId) }
          supabase.from('brands').update({ knowledge_base: next.knowledgeBase }).eq('id', brandId)
            .then(({ error }) => { if (error) console.error('[NExUS] deleteKnowledge:', error.message) })
          return next
        })
        return { ...p, brands: updated }
      })
    },

    brandTheme: computeTheme(user.brands.find(b => b.id === user.currentBrandId)),
  }

  return <NexusContext.Provider value={value}>{children}</NexusContext.Provider>
}

export function useNexus() {
  const ctx = useContext(NexusContext)
  if (!ctx) throw new Error('useNexus must be used within a NexusProvider')
  return ctx
}
