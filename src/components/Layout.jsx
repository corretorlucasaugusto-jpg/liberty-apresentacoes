import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-semibold text-sm">Liberty Apresentações</span>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={({isActive}) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`
            }>Gerar</NavLink>
            <NavLink to="/historico" className={({isActive}) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:text-gray-900'}`
            }>Histórico</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600 transition">Sair</button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 py-8">{children}</main>
    </div>
  )
}
