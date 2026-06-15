// ─── Brand Configuration ───────────────────────────────────────────────────
export interface Brand {
  id: string
  name: string
  logo: string
  description: string
  industry: string
  website: string
  socialMediaLinks: {
    instagram?: string
    tiktok?: string
    youtube?: string
    twitter?: string
    linkedin?: string
  }
  visualIdentity: {
    // Colors
    primaryColor: string
    secondaryColor: string
    accentColor: string
    successColor?: string
    warningColor?: string
    priorityColor?: string
    // Background
    backgroundStyle?: 'light' | 'dark' | 'white' | 'gray' | 'cream' | 'custom'
    customBgColor?: string
    // Typography
    typography: string
    fontFamily?: 'inter' | 'cormorant' | 'playfair' | 'montserrat' | 'dm-sans'
    fontStyle?: 'modern' | 'elegant' | 'minimal' | 'corporate' | 'creative' | 'editorial'
    // Appearance
    style: string
    borderRadius?: 'sharp' | 'subtle' | 'medium' | 'rounded' | 'pill'
    density?: 'compact' | 'comfortable' | 'spacious'
    iconStyle?: string
    visualPersonality?: string
  }
  strategicInfo: {
    businessFocus: string
    productsServices: string
    idealCustomer: string
    problemSolved: string
    mainPromise: string
    differentiator: string
  }
  personality: {
    communicationTone: string
    frequentWords: string[]
    forbiddenWords: string[]
  }
  knowledgeBase: KnowledgeBaseItem[]
  importantLinks: ImportantLink[]
  createdAt: string
}

export interface KnowledgeBaseItem {
  id: string
  name: string
  type: 'pdf' | 'video' | 'audio' | 'document' | 'url'
  url?: string
  filePath?: string
  size?: number
  uploadedAt: string
}

export interface ImportantLink {
  id: string
  label: string
  url: string
}

// ─── Task Management ───────────────────────────────────────────────────────
export interface Task {
  id: string
  brandId: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed'
  dueDate?: string
  scheduledTime?: string
  energyLevel?: 'fire' | 'happy' | 'tired' | 'overwhelmed'
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ─── Calendar Events ───────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string
  brandId: string
  title: string
  startTime: string
  endTime: string
  date: string
  type: 'routine' | 'critical' | 'scheduled'
  taskIds: string[]
  color?: string
  createdAt: string
}

// ─── Smart Schedule ────────────────────────────────────────────────────────
export interface SmartSchedule {
  id: string
  brandId: string
  date: string
  dayStartTime: string
  mainGoal: string
  energyLevel: 'fire' | 'happy' | 'tired' | 'overwhelmed'
  willRecord: boolean
  mandatoryTasks: string[]
  generatedBlocks: ScheduleBlock[]
  createdAt: string
}

export interface ScheduleBlock {
  startTime: string
  endTime: string
  title: string
  type: 'routine' | 'deep-work' | 'content' | 'admin' | 'break'
  taskId?: string
}

// ─── Library & Groups ─────────────────────────────────────────────────────
export interface LibraryFile {
  id: string
  brandId: string
  name: string
  description?: string
  type: 'video' | 'image' | 'audio' | 'pdf' | 'url' | 'note'
  url?: string
  filePath?: string
  fileSize?: number
  mimeType?: string
  thumbnail?: string
  tags: string[]
  favorite: boolean
  priority: boolean
  createdAt: string
  updatedAt: string
}

export interface Group {
  id: string
  brandId: string
  name: string
  type: 'week' | 'custom'
  weekNumber?: number
  days: GroupDay[]
  archived: boolean
  createdAt: string
}

export interface GroupDay {
  dayNumber: number
  label: string
  tasks: string[]
  fileIds: string[]
  completed: boolean
  completedAt?: string
}

// ─── Goals / Metas ────────────────────────────────────────────────────────
export interface Goal {
  id: string
  brandId: string
  title: string
  description?: string
  category: 'revenue' | 'content' | 'growth' | 'product' | 'personal' | 'other'
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  targetDate?: string
  progress: number // 0–100
  milestones: Milestone[]
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: string
}

// ─── Analytics ───────────────────────────────────────────────────────────
export interface AnalyticsEntry {
  id: string
  brandId: string
  title: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'other'
  contentType: 'video' | 'image' | 'carousel' | 'screenshot' | 'reel' | 'story'
  fileUrl?: string
  filePath?: string
  metrics: AnalyticsMetrics
  aiScore?: number           // 0–100, filled when AI is connected
  aiInsights?: string[]      // AI-generated insights
  capturedAt: string
  createdAt: string
}

export interface AnalyticsMetrics {
  views?: number
  likes?: number
  comments?: number
  shares?: number
  saves?: number
  reach?: number
  impressions?: number
  engagementRate?: number
  clicks?: number
}

// ─── User State ───────────────────────────────────────────────────────────
export interface UserState {
  userId: string          // unique per account, never changes
  name: string
  email: string
  brands: Brand[]
  currentBrandId: string      // '' = no brand selected yet
  onboardingComplete: boolean
  rememberLastBrand: boolean  // if true, skip brand selector on return
  hasSeenBrandIntro: boolean  // show brand intro 5-screen only once
  isAuthenticated: boolean
  miDiaState: {
    energyLevel: 'fire' | 'happy' | 'tired' | 'overwhelmed' | null
    mainPriority: string | null
    focusedTasks: string[]
  }
}
