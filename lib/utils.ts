export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getCurrentMonth(): { month: number; year: number; days: number } {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return { month, year, days: daysInMonth }
}

export function getFirstDayOfMonth(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).getDay()
}

export function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
