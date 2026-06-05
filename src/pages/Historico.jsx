import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'

export default function Historico() {
  const { user } = useAuth()
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    supabase
      .from('apresentacoes')
      .select('id, cliente, residencial, bairro, created_at, html')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) setError(error.message)
        setRows(data || [])
        setLoading(false)
      })
  }, [user])

  const download = (row) => {
    const blob = new Blob([row.html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (row.residencial||'Liberty').replace(/[^a-zA-Z0-9\s]/g,'').trim().replace(/\s+/g,'_') + '.html'
    a.click()
  }

  const del = async (id) => {
    if (!confirm('Excluir esta apresentação?')) return
    await supabase.from('apresentacoes').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('pt-BR', {
    day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  })

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-sm text-gray-400 mt-1">Apresentações geradas anteriormente</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          Erro ao carregar: {error}
          <button className="ml-3 underline" onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-400 text-sm">Nenhuma apresentação gerada ainda.</p>
          <p className="text-gray-300 text-xs mt-2">As apresentações aparecem aqui após serem geradas.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row.id} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-bold">
                  {(row.residencial||'?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {row.cliente||'—'}
                  <span className="text-gray-400 font-normal ml-2">· {row.residencial}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{row.bairro} · {fmt(row.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => download(row)} className="btn-ghost text-xs px-3 py-1.5">
                  ↓ Baixar
                </button>
                <button onClick={() => del(row.id)} className="text-xs text-gray-300 hover:text-red-400 transition px-2">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
