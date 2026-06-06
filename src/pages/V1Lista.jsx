import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDark } from '../hooks/useTheme.js'

export default function V1Lista() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const dark = useDark()

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    supabase
      .from('visitas_v1')
      .select('id, cliente, residencial, bairro, tipo_imovel, quartos, area, updated_at, status')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50)
      .then(({ data }) => { setRows(data || []); setLoading(false) })
  }, [user])

  const del = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Excluir esta V1?')) return
    await supabase.from('visitas_v1').delete().eq('id', id)
    setRows(r => r.filter(x => x.id !== id))
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })

  if (loading) return <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>

  const rowStyle = {
    borderRadius:'14px', padding:'16px 20px',
    border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6',
    background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
    cursor:'pointer', transition:'all .15s', display:'flex', alignItems:'center', gap:'14px',
  }

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:'700', margin:0 }}>Visitas V1</h1>
          <p style={{ fontSize:'12px', color: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af', marginTop:'4px' }}>
            Formulários de campo salvos
          </p>
        </div>
        <button
          onClick={() => navigate('/v1/nova')}
          style={{ padding:'10px 20px', background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'13px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(18,102,205,0.35)' }}
        >
          + Nova V1
        </button>
      </div>

      {rows.length === 0 && (
        <div style={{ textAlign:'center', padding:'64px 0', color: dark ? 'rgba(255,255,255,0.2)' : '#d1d5db' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>📋</div>
          <p style={{ fontSize:'14px' }}>Nenhuma visita V1 ainda.</p>
          <p style={{ fontSize:'12px', marginTop:'4px' }}>Clique em "+ Nova V1" para começar.</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {rows.map(row => (
          <div key={row.id}
            style={rowStyle}
            onClick={() => navigate(`/v1/${row.id}`)}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(18,102,205,0.3)'; e.currentTarget.style.transform='translateX(2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor= dark?'rgba(255,255,255,0.06)':'#f3f4f6'; e.currentTarget.style.transform='translateX(0)' }}
          >
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(18,102,205,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'18px' }}>
              📋
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:'14px', fontWeight:'600', margin:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {row.cliente || 'Sem nome'}
                <span style={{ fontWeight:'400', color: dark?'rgba(255,255,255,0.3)':'#9ca3af', marginLeft:'8px' }}>
                  · {row.residencial || '—'}
                </span>
              </p>
              <p style={{ fontSize:'11px', color: dark?'rgba(255,255,255,0.25)':'#9ca3af', margin:'3px 0 0' }}>
                {[row.tipo_imovel, row.area&&`${row.area}m²`, row.quartos&&`${row.quartos}Q`, row.bairro].filter(Boolean).join(' · ')}
                {' · '}Editado {fmt(row.updated_at)}
              </p>
            </div>
            <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
              <button
                onClick={e => { e.stopPropagation(); navigate(`/v2/${row.id}`) }}
                style={{ padding:'6px 12px', background:'rgba(18,102,205,0.1)', color:'#1266CD', border:'1px solid rgba(18,102,205,0.2)', borderRadius:'8px', fontSize:'11px', fontWeight:'600', cursor:'pointer' }}
              >
                Usar na V2
              </button>
              <button
                onClick={e => del(row.id, e)}
                style={{ padding:'6px 10px', background:'none', color: dark?'rgba(255,255,255,0.2)':'#d1d5db', border:'none', borderRadius:'8px', fontSize:'14px', cursor:'pointer' }}
              >✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
