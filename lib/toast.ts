export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Global toast store (simple event-based)
type ToastListener = (toasts: Toast[]) => void

class ToastStore {
  private toasts: Toast[] = []
  private listeners: ToastListener[] = []

  subscribe(listener: ToastListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  getToasts() {
    return this.toasts
  }

  addToast(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { ...toast, id }
    this.toasts = [...this.toasts, newToast]
    this.notifyListeners()

    if (toast.duration !== 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, toast.duration || 4000)
    }

    return id
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notifyListeners()
  }

  clearAll() {
    this.toasts = []
    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.toasts))
  }
}

export const toastStore = new ToastStore()

export const toast = {
  success: (title: string, description?: string) =>
    toastStore.addToast({ type: 'success', title, description }),
  error: (title: string, description?: string) =>
    toastStore.addToast({ type: 'error', title, description }),
  info: (title: string, description?: string) =>
    toastStore.addToast({ type: 'info', title, description }),
  warning: (title: string, description?: string) =>
    toastStore.addToast({ type: 'warning', title, description }),
}
