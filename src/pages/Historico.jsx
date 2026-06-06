import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDark } from '../hooks/useTheme.js'

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
    if (!confirm('Excluir?')) return
    await supabase.from('apresentacoes').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('pt-BR', {
    day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'
  })

  const dark = useDark()

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Histórico</h1>
        <p className="text-sm label-muted mt-1">Apresentações geradas anteriormente</p>
      </div>

      {error && (
        <div style={{ padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', fontSize:'13px', color:'#f87171' }}>
          Erro ao carregar: {error}
          <button className="ml-3 underline" onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      )}

      {!error && rows.length === 0 && (
        <div className="card p-12 text-center">
          <p className="label-muted text-sm">Nenhuma apresentação gerada ainda.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row.id} className="card p-4 flex items-center gap-4">
              <div style={{
                width:'40px', height:'40px', borderRadius:'12px', flexShrink:0,
                background:'rgba(18,102,205,0.12)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ color:'#1266CD', fontSize:'14px', fontWeight:'700' }}>
                  {(row.residencial||'?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {row.cliente||'—'}
                  <span className="label-muted font-normal ml-2">· {row.residencial}</span>
                </p>
                <p className="text-xs label-muted mt-0.5">{row.bairro} · {fmt(row.created_at)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => download(row)} className="btn-ghost text-xs px-3 py-1.5">
                  ↓ Baixar
                </button>
                <button onClick={() => del(row.id)} className="label-muted hover:text-red-400 transition text-sm px-2">
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
