import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'

const LOGO = "data:image/png;base64,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"

export default function Login() {
  const { signIn } = useAuth()
  const [mode,     setMode]     = useState('login') // 'login' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      if (password !== confirm) { setError('As senhas não coincidem.'); return }
      if (password.length < 6)  { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    }

    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError('E-mail ou senha incorretos.')
    } else {
      const { supabase } = await import('../lib/supabase.js')
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else {
        setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
        setMode('login')
      }
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(18,102,205,0.12) 0%, transparent 70%)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}/>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img
            src={LOGO}
            alt="Liberty Imóveis"
            style={{ height: '88px', objectFit: 'contain', filter: 'drop-shadow(0 8px 24px rgba(18,102,205,0.3))' }}
          />
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        }}>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '3px', marginBottom: '28px',
          }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '600', transition: 'all .2s',
                  background: mode === m ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.02em',
                }}>
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                E-mail
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com" required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', fontSize: '14px', outline: 'none',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(18,102,205,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Senha
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', fontSize: '14px', outline: 'none',
                  background: 'rgba(255,255,255,0.06)', color: '#fff',
                  transition: 'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(18,102,205,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Confirm password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Confirmar senha
                </label>
                <input
                  type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••" required
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', fontSize: '14px', outline: 'none',
                    background: 'rgba(255,255,255,0.06)', color: '#fff',
                    transition: 'border-color .2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(18,102,205,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
                fontSize: '12px', color: '#fca5a5',
              }}>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
                fontSize: '12px', color: '#86efac',
              }}>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                marginTop: '4px', padding: '13px',
                background: loading ? 'rgba(18,102,205,0.4)' : 'linear-gradient(135deg, #1266CD, #1a7be8)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.02em', transition: 'all .2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(18,102,205,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                  }}/>
                  {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                mode === 'login' ? 'Entrar' : 'Criar conta'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
          LIBERTY IMÓVEIS · BRASÍLIA
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #1a1f2e inset;
          -webkit-text-fill-color: #fff;
        }
      `}</style>
    </div>
  )
}
