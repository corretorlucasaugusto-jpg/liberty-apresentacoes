import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Gerador from './pages/Gerador.jsx'
import Historico from './pages/Historico.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-liberty-light">
      <div className="w-8 h-8 border-2 border-liberty-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return <Login />

  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<Gerador />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="*"          element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
