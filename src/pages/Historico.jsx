import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDark } from '../hooks/useTheme.js'

export default function Historico() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dark = useDark()
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [preview, setPreview] = useState(null) // row being previewed

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    supabase
      .from('apresentacoes')
      .select('id, cliente, residencial, bairro, created_at, updated_at, html, raw_data, v1_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)
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
    if (preview?.id === id) setPreview(null)
  }

  const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR', {
    day:'2-digit', month:'2-digit', year:'2-digit', hour:'2-digit', minute:'2-digit'
  }) : '—'

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', paddingTop:'80px' }}>
      <div style={{ width:'24px', height:'24px', borderRadius:'50%', border:'3px solid #1266CD', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontSize:'1.4rem', fontWeight:700, margin:0 }}>Histórico de V2</h1>
        <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'4px' }}>
          {rows.length} apresentações geradas — clique para ver, editar ou baixar
        </p>
      </div>

      {error && (
        <div style={{ padding:'12px 16px', borderRadius:'12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', fontSize:'13px', color:'#f87171', marginBottom:'16px' }}>
          Erro: {error} — <button style={{ background:'none', border:'none', color:'#f87171', cursor:'pointer', textDecoration:'underline' }} onClick={() => window.location.reload()}>tentar novamente</button>
        </div>
      )}

      {rows.length === 0 && !error && (
        <div className="lv-section" style={{ textAlign:'center', padding:'64px 24px' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>🎯</div>
          <p style={{ color:'var(--text3)', fontSize:'14px' }}>Nenhuma apresentação gerada ainda.</p>
        </div>
      )}

      <div style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>

        {/* Lista */}
        <div style={{ flex: preview ? '0 0 340px' : '1', display:'flex', flexDirection:'column', gap:'8px' }}>
          {rows.map(row => {
            const isActive = preview?.id === row.id
            return (
              <div key={row.id}
                onClick={() => setPreview(isActive ? null : row)}
                style={{
                  borderRadius:'14px', padding:'14px 16px',
                  border: isActive ? '1px solid rgba(18,102,205,0.5)' : '1px solid var(--border)',
                  background: isActive ? 'rgba(18,102,205,0.08)' : 'var(--section-bg)',
                  cursor:'pointer', transition:'all .15s',
                  display:'flex', alignItems:'center', gap:'12px',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor='rgba(18,102,205,0.3)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor='var(--border)' }}
              >
                {/* Icon */}
                <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'rgba(18,102,205,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'16px' }}>
                  🎯
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'13px', fontWeight:600, margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color:'var(--text)' }}>
                    {row.cliente||'—'}
                    <span style={{ fontWeight:400, color:'var(--text3)', marginLeft:'6px' }}>· {row.residencial}</span>
                  </p>
                  <p style={{ fontSize:'11px', color:'var(--text3)', margin:'3px 0 0' }}>
                    {row.bairro && `${row.bairro} · `}
                    Gerado {fmt(row.created_at)}
                    {row.updated_at && row.updated_at !== row.created_at && ` · Editado ${fmt(row.updated_at)}`}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:'6px', flexShrink:0 }} onClick={e => e.stopPropagation()}>
                  {/* Edit button — only if raw_data exists */}
                  {row.raw_data && (
                    <button
                      onClick={() => navigate(`/v2?edit=${row.id}`)}
                      title="Editar e regenerar"
                      style={{
                        padding:'6px 10px', borderRadius:'8px', border:'none', cursor:'pointer',
                        background:'rgba(18,102,205,0.12)', color:'#1266CD',
                        fontSize:'11px', fontWeight:600,
                      }}
                    >
                      ✎ Editar
                    </button>
                  )}
                  <button
                    onClick={() => download(row)}
                    title="Baixar HTML"
                    style={{
                      padding:'6px 10px', borderRadius:'8px',
                      border:'1px solid var(--border2)', background:'transparent',
                      color:'var(--text2)', fontSize:'11px', fontWeight:500, cursor:'pointer',
                    }}
                  >
                    ↓ Baixar
                  </button>
                  <button
                    onClick={() => del(row.id)}
                    title="Excluir"
                    style={{
                      padding:'6px 8px', borderRadius:'8px', border:'none',
                      background:'transparent', color:'var(--text3)',
                      fontSize:'13px', cursor:'pointer',
                    }}
                  >✕</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Preview panel */}
        {preview && (
          <div style={{
            flex:1, borderRadius:'16px', overflow:'hidden',
            border:'1px solid var(--border)',
            background:'var(--section-bg)',
            position:'sticky', top:'80px',
            maxHeight:'calc(100vh - 120px)',
            display:'flex', flexDirection:'column',
          }}>
            {/* Preview header */}
            <div style={{
              padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
              borderBottom:'1px solid var(--border)', flexShrink:0,
            }}>
              <div>
                <p style={{ fontSize:'13px', fontWeight:600, margin:0, color:'var(--text)' }}>{preview.residencial}</p>
                <p style={{ fontSize:'11px', color:'var(--text3)', margin:'2px 0 0' }}>
                  {preview.cliente} · {fmt(preview.created_at)}
                </p>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                {preview.raw_data && (
                  <button
                    onClick={() => navigate(`/v2?edit=${preview.id}`)}
                    style={{ padding:'7px 14px', borderRadius:'8px', border:'none', cursor:'pointer', background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff', fontSize:'12px', fontWeight:600 }}
                  >
                    ✎ Editar
                  </button>
                )}
                <button
                  onClick={() => download(preview)}
                  style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid var(--border2)', background:'transparent', color:'var(--text2)', fontSize:'12px', cursor:'pointer' }}
                >
                  ↓ Baixar
                </button>
                <button onClick={() => setPreview(null)}
                  style={{ padding:'7px 10px', borderRadius:'8px', border:'none', background:'transparent', color:'var(--text3)', fontSize:'16px', cursor:'pointer' }}>
                  ✕
                </button>
              </div>
            </div>

            {/* iframe preview */}
            <iframe
              srcDoc={preview.html}
              style={{ flex:1, border:'none', background:'#fff' }}
              title="Preview da apresentação"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
    </div>
  )
}
