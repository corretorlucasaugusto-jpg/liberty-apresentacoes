import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAutoSave } from '../hooks/useAutoSave.js'

const TIPOS = ['Apartamento', 'Casa', 'Cobertura', 'Kitnet / Studio', 'Comercial']
const SITUACOES = ['Vazio', 'Ocupado pelo dono', 'Locado']
const REFORMAS = ['Não precisa', 'Precisa de reforma', 'Recentemente reformado']
const POSICOES = ['Nascente', 'Poente', 'Norte', 'Sul', 'Nascente/Poente (Vazado)']
const DIFERENCIAIS = [
  'Fachada reformada','Portaria 24h','Elevador moderno','Salão de festas',
  'Piscina','Academia','Playground','Jardim cuidado','Interfone/Biometria',
  'Garagem coberta','Área de lazer','Espaço gourmet',
]
const DOCS = [
  { key: 'matricula',    label: 'Matrícula atualizada' },
  { key: 'iptu_ok',      label: 'IPTU em dia' },
  { key: 'condominio_ok',label: 'Condomínio em dia' },
  { key: 'inventario',   label: 'Sem inventário pendente' },
  { key: 'financiamento',label: 'Aceita financiamento' },
  { key: 'quitado',      label: 'Imóvel quitado' },
]

function SaveIndicator({ status, lastSaved }) {
  const dark = document.body.classList.contains('dark')
  const color = status === 'saved' ? '#22c55e' : status === 'saving' ? '#f59e0b' : status === 'error' ? '#ef4444' : 'transparent'
  const label = status === 'saved' ? `Salvo ${lastSaved ? new Date(lastSaved).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'}) : ''}` : status === 'saving' ? 'Salvando...' : status === 'error' ? 'Erro ao salvar' : ''
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color }}>
      {status === 'saving' && <div style={{ width:'8px', height:'8px', borderRadius:'50%', border:'2px solid #f59e0b', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/>}
      {status === 'saved'  && <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e' }}/>}
      {label}
    </div>
  )
}

export default function V1Form() {
  const { id: urlId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const dark = document.body.classList.contains('dark')

  const [recordId, setRecordId] = useState(urlId || null)
  const [loading, setLoading] = useState(!!urlId)

  // Form state
  const [form, setForm] = useState({
    cliente: '', residencial: '', endereco: '', bairro: '',
    tipo_imovel: 'Apartamento', area: '', quartos: '', vagas: '',
    andar: '', total_andares: '', posicao_solar: '', condominio: '', iptu: '',
    situacao: 'Vazio', reforma: 'Não precisa', observacoes: '',
  })
  const [pos,          setPos]          = useState([{ titulo: '' }])
  const [neg,          setNeg]          = useState([{ titulo: '' }])
  const [diferenciais, setDiferenciais] = useState([])
  const [docs,         setDocs]         = useState({})

  const { saveStatus, lastSaved, scheduleSave } = useAutoSave('visitas_v1', recordId, setRecordId, user?.id)

  // Load existing record
  useEffect(() => {
    if (!urlId) return
    supabase.from('visitas_v1').select('*').eq('id', urlId).single()
      .then(({ data }) => {
        if (!data) return
        setForm({
          cliente: data.cliente||'', residencial: data.residencial||'',
          endereco: data.endereco||'', bairro: data.bairro||'',
          tipo_imovel: data.tipo_imovel||'Apartamento', area: data.area||'',
          quartos: data.quartos||'', vagas: data.vagas||'', andar: data.andar||'',
          total_andares: data.total_andares||'', posicao_solar: data.posicao_solar||'',
          condominio: data.condominio||'', iptu: data.iptu||'',
          situacao: data.situacao||'Vazio', reforma: data.reforma||'Não precisa',
          observacoes: data.observacoes||'',
        })
        setPos(data.pos?.length ? data.pos : [{ titulo: '' }])
        setNeg(data.neg?.length ? data.neg : [{ titulo: '' }])
        setDiferenciais(data.diferenciais || [])
        setDocs(data.docs || {})
        setLoading(false)
      })
  }, [urlId])

  // Auto-save whenever anything changes
  const triggerSave = useCallback((patch = {}) => {
    scheduleSave({
      ...form, ...patch,
      pos, neg, diferenciais, docs,
    })
  }, [form, pos, neg, diferenciais, docs, scheduleSave])

  const setField = (key, val) => {
    const next = { ...form, [key]: val }
    setForm(next)
    scheduleSave({ ...next, pos, neg, diferenciais, docs })
  }

  const setPos2 = (val) => { setPos(val); scheduleSave({ ...form, pos: val, neg, diferenciais, docs }) }
  const setNeg2 = (val) => { setNeg(val); scheduleSave({ ...form, pos, neg: val, diferenciais, docs }) }
  const setDif  = (val) => { setDiferenciais(val); scheduleSave({ ...form, pos, neg, diferenciais: val, docs }) }
  const setDoc  = (key, val) => { const d = { ...docs, [key]: val }; setDocs(d); scheduleSave({ ...form, pos, neg, diferenciais, docs: d }) }

  const inp = {
    width:'100%', boxSizing:'border-box', padding:'10px 14px',
    border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
    borderRadius:'10px', fontSize:'13px', outline:'none',
    background: dark ? 'rgba(255,255,255,0.05)' : '#fff',
    color: dark ? '#e8eaf0' : '#111827', transition:'border-color .2s',
  }
  const label = { display:'block', fontSize:'10px', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px', color: dark ? 'rgba(255,255,255,0.35)' : '#9ca3af' }
  const section = { borderRadius:'16px', padding:'24px', marginBottom:'0', border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f3f4f6', background: dark ? 'rgba(255,255,255,0.03)' : '#fff' }
  const sectionTitle = { fontSize:'11px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', color:'#1266CD', marginBottom:'20px', display:'block' }

  if (loading) return <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <button onClick={() => navigate('/v1')} style={{ fontSize:'12px', color:'#1266CD', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:'6px' }}>
            ← Todas as V1s
          </button>
          <h1 style={{ fontSize:'1.4rem', fontWeight:'700', margin:0 }}>
            {recordId ? (form.cliente || 'Visita sem nome') : 'Nova Visita V1'}
          </h1>
          <p style={{ fontSize:'12px', color: dark ? 'rgba(255,255,255,0.3)' : '#9ca3af', marginTop:'4px' }}>
            Preencha durante a visita — salva automaticamente
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
          <SaveIndicator status={saveStatus} lastSaved={lastSaved} />
          {recordId && (
            <button
              onClick={() => navigate(`/v2/${recordId}`)}
              style={{ padding:'8px 16px', background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'12px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 12px rgba(18,102,205,0.35)' }}
            >
              Usar na V2 →
            </button>
          )}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

        {/* Identificação */}
        <div style={section}>
          <span style={sectionTitle}>Identificação</span>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[['cliente','Nome do cliente','Ex: João e Maria'],['residencial','Condomínio / Edifício','Ex: Residencial Vera Brant'],['endereco','Endereço completo','Ex: SQN 311 Bloco A Apto 501'],['bairro','Bairro / Região','Ex: Asa Norte']].map(([key,lbl,ph]) => (
              <div key={key}>
                <label style={label}>{lbl}</label>
                <input style={inp} value={form[key]} placeholder={ph}
                  onChange={e => setField(key, e.target.value)}
                  onFocus={e => e.target.style.borderColor='rgba(18,102,205,0.6)'}
                  onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Ficha técnica */}
        <div style={section}>
          <span style={sectionTitle}>Ficha Técnica</span>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {/* Tipo */}
            <div>
              <label style={label}>Tipo de imóvel</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.tipo_imovel} onChange={e => setField('tipo_imovel', e.target.value)}>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* Posição solar */}
            <div>
              <label style={label}>Posição solar</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.posicao_solar} onChange={e => setField('posicao_solar', e.target.value)}>
                <option value="">Selecione...</option>
                {POSICOES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            {[['area','Área (m²)','Ex: 111'],['quartos','Quartos','Ex: 3'],['vagas','Vagas','Ex: 2'],['andar','Andar','Ex: 5°'],['total_andares','Total de andares','Ex: 6'],['condominio','Condomínio R$','Ex: 1.141'],['iptu','IPTU R$/ano','Ex: 2.739']].map(([key,lbl,ph]) => (
              <div key={key}>
                <label style={label}>{lbl}</label>
                <input style={inp} value={form[key]} placeholder={ph}
                  onChange={e => setField(key, e.target.value)}
                  onFocus={e => e.target.style.borderColor='rgba(18,102,205,0.6)'}
                  onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Situação */}
        <div style={section}>
          <span style={sectionTitle}>Situação</span>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div>
              <label style={label}>Situação do imóvel</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.situacao} onChange={e => setField('situacao', e.target.value)}>
                {SITUACOES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Reforma</label>
              <select style={{ ...inp, cursor:'pointer' }} value={form.reforma} onChange={e => setField('reforma', e.target.value)}>
                {REFORMAS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Pontos positivos */}
        <div style={section}>
          <span style={sectionTitle}>Pontos Positivos</span>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {pos.map((p, i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <input style={{ ...inp, flex:1 }} value={p.titulo} placeholder="Ex: Reformado, Vazado, Andar alto, Nascente..."
                  onChange={e => { const a=[...pos]; a[i]={...a[i],titulo:e.target.value}; setPos2(a) }}
                  onFocus={e => e.target.style.borderColor='rgba(18,102,205,0.6)'}
                  onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                />
                {pos.length > 1 && (
                  <button onClick={() => setPos2(pos.filter((_,j) => j!==i))}
                    style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'18px' }}>×</button>
                )}
              </div>
            ))}
            {pos.length < 6 && (
              <button onClick={() => setPos2([...pos, { titulo:'' }])}
                style={{ alignSelf:'flex-start', fontSize:'12px', color:'#1266CD', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                + Adicionar ponto positivo
              </button>
            )}
          </div>
        </div>

        {/* Pontos de atenção */}
        <div style={section}>
          <span style={sectionTitle}>Pontos de Atenção</span>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {neg.map((n, i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <input style={{ ...inp, flex:1 }} value={n.titulo} placeholder="Ex: Necessita reforma, Sem suíte, Frente para rua..."
                  onChange={e => { const a=[...neg]; a[i]={...a[i],titulo:e.target.value}; setNeg2(a) }}
                  onFocus={e => e.target.style.borderColor='rgba(18,102,205,0.6)'}
                  onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
                />
                {neg.length > 1 && (
                  <button onClick={() => setNeg2(neg.filter((_,j) => j!==i))}
                    style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'18px' }}>×</button>
                )}
              </div>
            ))}
            {neg.length < 4 && (
              <button onClick={() => setNeg2([...neg, { titulo:'' }])}
                style={{ alignSelf:'flex-start', fontSize:'12px', color:'#1266CD', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                + Adicionar ponto de atenção
              </button>
            )}
          </div>
        </div>

        {/* Diferenciais do bloco */}
        <div style={section}>
          <span style={sectionTitle}>Diferenciais do Bloco / Condomínio</span>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px' }}>
            {DIFERENCIAIS.map(d => (
              <label key={d} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'13px', color: dark ? 'rgba(255,255,255,0.7)' : '#374151' }}>
                <input type="checkbox" checked={diferenciais.includes(d)}
                  onChange={e => setDif(e.target.checked ? [...diferenciais,d] : diferenciais.filter(x=>x!==d))}
                  style={{ width:'16px', height:'16px', cursor:'pointer', accentColor:'#1266CD' }}
                />
                {d}
              </label>
            ))}
          </div>
        </div>

        {/* Documentação */}
        <div style={section}>
          <span style={sectionTitle}>Checklist de Documentação</span>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px' }}>
            {DOCS.map(({ key, label: lbl }) => (
              <label key={key} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontSize:'13px', color: dark ? 'rgba(255,255,255,0.7)' : '#374151' }}>
                <input type="checkbox" checked={!!docs[key]}
                  onChange={e => setDoc(key, e.target.checked)}
                  style={{ width:'16px', height:'16px', cursor:'pointer', accentColor:'#1266CD' }}
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div style={section}>
          <span style={sectionTitle}>Observações do Corretor</span>
          <textarea
            style={{ ...inp, resize:'vertical', minHeight:'80px' }}
            value={form.observacoes}
            placeholder="Anotações livres: impressão do imóvel, comportamento do proprietário, urgência de venda, informações extras..."
            onChange={e => setField('observacoes', e.target.value)}
            onFocus={e => e.target.style.borderColor='rgba(18,102,205,0.6)'}
            onBlur={e => e.target.style.borderColor= dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}
          />
        </div>

        {/* CTA usar na V2 */}
        {recordId && (
          <button
            onClick={() => navigate(`/v2/${recordId}`)}
            style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'pointer', boxShadow:'0 8px 24px rgba(18,102,205,0.4)', marginBottom:'32px' }}
          >
            Usar esses dados na V2 →
          </button>
        )}
      </div>
    </div>
  )
}
