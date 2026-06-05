import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'

export default function Login() {
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) setError('E-mail ou senha incorretos.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-xl font-bold">Liberty Apresentações</h1>
          <p className="text-sm text-gray-400 mt-1">Gerador de apresentações de captação</p>
        </div>
        <form onSubmit={handle} className="card p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">E-mail</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              className="input-base" placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Senha</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              className="input-base" placeholder="••••••••" required />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">Acesso restrito à equipe Liberty</p>
      </div>
    </div>
  )
}
