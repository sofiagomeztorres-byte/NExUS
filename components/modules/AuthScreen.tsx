'use client'

import { useState } from 'react'
import { NExUSLogo } from '@/components/NExUSLogo'
import { supabase } from '@/lib/supabase'

interface AuthScreenProps {
  mode: 'login' | 'register'
  onToggleMode: () => void
  onSuccess: (name: string, email: string, userId: string) => void
  onBack: () => void
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function AuthScreen({ mode, onToggleMode, onSuccess, onBack }: AuthScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const clearError = () => { if (error) setError('') }

  const handleSubmit = async () => {
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    setLoading(true)

    if (mode === 'register') {
      if (!name.trim()) { setError('El nombre es requerido.'); setLoading(false); return }
      if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); setLoading(false); return }
      if (password !== confirmPassword) { setError('Las contraseñas no coinciden.'); setLoading(false); return }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: { data: { name: name.trim() } },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Ya existe una cuenta con ese correo. Inicia sesión.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (!data.session) {
        // Email confirmation required — Supabase dashboard setting
        setLoading(false)
        setConfirmationSent(true)
        return
      }

      setLoading(false)
      onSuccess(name.trim(), email.toLowerCase().trim(), data.user!.id)

    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials') || signInError.message.includes('invalid_credentials')) {
          setError('Correo o contraseña incorrectos.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Confirma tu correo antes de iniciar sesión.')
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      const userName = data.user?.user_metadata?.name ?? data.user?.email?.split('@')[0] ?? ''
      setLoading(false)
      onSuccess(userName, data.user!.email!, data.user!.id)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      setError('Ingresa tu correo para recuperar la contraseña.')
      return
    }
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.toLowerCase().trim(),
      { redirectTo: `${window.location.origin}/auth/reset-password` }
    )
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
    } else {
      setResetSent(true)
      setError('')
    }
  }

  // ── Confirmation screen ──
  if (confirmationSent) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-8"
        style={{ background: '#08080E', maxWidth: 430, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#F5F3F8', marginBottom: 12 }}>
            Revisa tu correo
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(245,243,248,0.45)', lineHeight: 1.6, marginBottom: 32 }}>
            Enviamos un enlace de confirmación a <strong style={{ color: '#E2B659' }}>{email}</strong>.
            Haz clic en el enlace para activar tu cuenta.
          </p>
          <button
            onClick={() => { setConfirmationSent(false); onToggleMode() }}
            className="btn-gold w-full rounded-[14px] text-[15px]"
            style={{ padding: '14px 0' }}
          >
            Ya confirmé — Iniciar sesión
          </button>
          <button onClick={onBack} style={{ marginTop: 16, fontSize: 13, color: 'rgba(245,243,248,0.3)' }}>
            ← Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: '#08080E', maxWidth: 430, margin: '0 auto' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 30%, rgba(214,188,250,0.05) 0%, transparent 70%)' }}
      />

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-14 pb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-9 h-9 rounded-full transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(245,243,248,0.6)', fontSize: 18 }}
        >←</button>
        <NExUSLogo size="sm" theme="dark" />
        <div style={{ width: 36 }} />
      </div>

      {/* ── Form area ── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6">
        <div className="animate-form-up" style={{ paddingBottom: 48 }}>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: '#F5F3F8', marginBottom: 6, letterSpacing: '0.01em' }}>
            {mode === 'login' ? 'Bienvenida de vuelta.' : 'Crea tu cuenta.'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(245,243,248,0.4)', marginBottom: 36, lineHeight: 1.5 }}>
            {mode === 'login'
              ? 'Tu espacio de trabajo te espera.'
              : 'Tu espacio privado, tu sistema, tu negocio.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Name (register only) */}
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,243,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                  Nombre
                </label>
                <input
                  type="text" placeholder="Tu nombre" value={name}
                  onChange={e => { setName(e.target.value); clearError() }}
                  autoComplete="name"
                  className="input-dark w-full rounded-[12px] text-[15px]"
                  style={{ padding: '14px 16px' }}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,243,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Correo Electrónico
              </label>
              <input
                type="email" placeholder="tu@correo.com" value={email}
                onChange={e => { setEmail(e.target.value); clearError() }}
                autoComplete="email"
                className="input-dark w-full rounded-[12px] text-[15px]"
                style={{ padding: '14px 16px' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,243,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => { setPassword(e.target.value); clearError() }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="input-dark w-full rounded-[12px] text-[15px]"
                  style={{ padding: '14px 48px 14px 16px' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,243,248,0.3)', fontSize: 13 }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(245,243,248,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                  Confirmar Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); clearError() }}
                    autoComplete="new-password"
                    className="input-dark w-full rounded-[12px] text-[15px]"
                    style={{ padding: '14px 48px 14px 16px' }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(245,243,248,0.3)', fontSize: 13 }}>
                    {showConfirmPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(220,74,101,0.12)', border: '1px solid rgba(220,74,101,0.25)', color: '#FF8FA3', fontSize: 13, lineHeight: 1.4 }}>
                {error}
              </div>
            )}

            {/* Reset sent confirmation */}
            {resetSent && (
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ADE80', fontSize: 13, lineHeight: 1.4 }}>
                Enviamos un enlace de recuperación a {email}. Revisa tu correo.
              </div>
            )}

            {/* Forgot password (login only) */}
            {mode === 'login' && !resetSent && (
              <div style={{ textAlign: 'right', marginTop: -4 }}>
                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  style={{ fontSize: 13, color: 'rgba(226,182,89,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-gold w-full rounded-[14px] text-[16px]"
              style={{ padding: '16px 0', marginTop: 8, letterSpacing: '0.02em', opacity: loading ? 0.7 : 1 }}
            >
              {loading
                ? (mode === 'login' ? 'Entrando…' : 'Creando cuenta…')
                : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>

            {/* Toggle */}
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <span style={{ fontSize: 14, color: 'rgba(245,243,248,0.4)' }}>
                {mode === 'login' ? '¿Nuevo aquí? ' : '¿Ya tienes cuenta? '}
              </span>
              <button onClick={onToggleMode} style={{ fontSize: 14, color: '#E2B659', fontWeight: 600 }}>
                {mode === 'login' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
