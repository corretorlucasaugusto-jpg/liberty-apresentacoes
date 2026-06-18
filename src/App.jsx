import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import V1Form from './pages/V1Form.jsx'
import V1Lista from './pages/V1Lista.jsx'
import Gerador from './pages/Gerador.jsx'
import Historico from './pages/Historico.jsx'
import Login from './pages/Login.jsx'
import VerApresentacao from './pages/VerApresentacao.jsx'
import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const { user, loading } = useAuth()

  // Rota pública — não exige login
  if (window.location.pathname.startsWith('/ver/')) {
    return (
      <Routes>
        <Route path="/ver/:id" element={<VerApresentacao />} />
      </Routes>
    )
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center page-bg">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  if (!user) return <Login />

  return (
    <Layout>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/v1"          element={<V1Lista />} />
        <Route path="/v1/nova"     element={<V1Form />} />
        <Route path="/v1/:id"      element={<V1Form />} />
        <Route path="/v2"          element={<Gerador />} />
        <Route path="/v2/:v1id"    element={<Gerador />} />
        <Route path="/historico"   element={<Historico />} />
        <Route path="*"            element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  )
}
