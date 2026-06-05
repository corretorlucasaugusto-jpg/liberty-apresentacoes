import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-liberty-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-liberty-blue flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-semibold text-sm text-liberty-dark">Liberty Apresentações</span>
          </div>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-liberty-light text-liberty-blue' : 'text-gray-500 hover:text-liberty-dark'
                }`
              }
            >
              Gerar
            </NavLink>
            <NavLink
              to="/historico"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-liberty-light text-liberty-blue' : 'text-gray-500 hover:text-liberty-dark'
                }`
              }
            >
              Histórico
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-xs text-gray-400 hover:text-gray-600 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-5 py-8">
        {children}
      </main>
    </div>
  )
}
