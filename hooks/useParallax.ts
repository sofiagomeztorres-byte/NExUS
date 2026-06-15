'use client'

import { useEffect, useRef, useState } from 'react'

export function useParallax(strength: number = 12) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const smooth = (target: { x: number; y: number }, current: { x: number; y: number }) => ({
      x: current.x + (target.x - current.x) * 0.08,
      y: current.y + (target.y - current.y) * 0.08,
    })

    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Opposite direction for depth illusion
      target = {
        x: -((e.clientX - cx) / rect.width) * strength,
        y: -((e.clientY - cy) / rect.height) * strength,
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      target = {
        x: -((touch.clientX - cx) / rect.width) * strength,
        y: -((touch.clientY - cy) / rect.height) * strength,
      }
    }

    const onLeave = () => {
      target = { x: 0, y: 0 }
    }

    const tick = () => {
      current = smooth(target, current)
      if (Math.abs(current.x - target.x) > 0.01 || Math.abs(current.y - target.y) > 0.01) {
        setOffset({ x: current.x, y: current.y })
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return { containerRef, offset }
}
