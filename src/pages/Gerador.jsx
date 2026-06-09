import React, { useState, useRef, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { Field, Input, NVRow, VRow, PerfilRow } from '../components/FormFields.jsx'
import { buildHTML } from '../lib/buildHTML.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDark } from '../hooks/useTheme.js'

const MAX_NV = 8
const MAX_V  = 8

export default function Gerador() {
  const dark = useDark()
  const { v1id } = useParams()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit') // ID of apresentacao to edit
  const { user } = useAuth()
  const formRef = useRef(null)
  const [v1loaded, setV1loaded] = useState(false)
  const [nvCount,  setNvCount]  = useState(2)
  const [vCount,   setVCount]   = useState(1)
  const [posItems, setPosItems] = useState(['', ''])
  const [negItems, setNegItems] = useState([''])
  const [status,   setStatus]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [extractingNV,  setExtractingNV]  = useState({})
  const [extractingV,   setExtractingV]   = useState({})
  const [precStatus,    setPrecStatus]    = useState(null) // null | 'loading' | 'done' | 'error'
  const [precData,      setPrecData]      = useState(null) // resultado da precificação
  const [dataChanged,   setDataChanged]   = useState(false) // true when form changes after pricing
  const [selic,        setSelic]        = useState('14,50%')

  // Busca Selic atual via Edge Function (proxy para Banco Central)
  useEffect(() => {
    supabase.functions.invoke('gerar-apresentacao', { body: { data: { _selic: true } } })
      .then(({ data }) => {
        if (data?.selic) setSelic(data.selic)
      })
      .catch(() => {})
  }, [])

  // Load V1 data if coming from /v2/:v1id
  useEffect(() => {
    if (!v1id || v1loaded) return
    supabase.from('visitas_v1').select('*').eq('id', v1id).single()
      .then(({ data }) => {
        if (!data) return
        const sv = (name, val) => { const el = formRef.current?.elements[name]; if (el && val) el.value = val }
        // Pre-fill form fields after a tick (form must be mounted)
        setTimeout(() => {
          sv('p_nome',        data.cliente)
          sv('p_residencial', data.residencial)
          sv('p_endereco',    data.endereco)
          sv('p_bairro',      data.bairro)
          sv('p_quartos',     data.quartos)
          sv('p_vagas',       data.vagas)
          sv('p_area',        data.area)
          sv('p_andar',       data.andar)
          sv('p_tipo_imovel',  data.tipo_imovel  || 'Apartamento')
          sv('p_posicao_solar',data.posicao_solar || '')
          sv('p_situacao',     data.situacao      || '')
          sv('p_reforma',      data.reforma       || '')
          // Map V1 reforma to V2 condicao_interior
          const cond = data.reforma === 'Recentemente reformado' ? 'Recentemente reformado'
            : data.reforma === 'Precisa de reforma' ? 'Precisa de reforma'
            : data.reforma === 'Não precisa' ? 'Recentemente reformado'
            : ''
          if (cond) {
            const el = document.getElementsByName('p_condicao_interior')[0]
            if (el) el.value = cond
          }
          // Pre-fill pontos positivos
          if (data.pos?.length) {
            setPosItems(data.pos.map(p => p.titulo || p).filter(Boolean))
          }
          if (data.neg?.length) {
            setNegItems(data.neg.map(n => n.titulo || n).filter(Boolean))
          }
          setV1loaded(true)
        }, 100)
      })
  }, [v1id, v1loaded])

  // Load existing apresentacao for editing
  useEffect(() => {
    if (!editId) return
    supabase.from('apresentacoes')
      .select('raw_data, cliente, residencial, bairro')
      .eq('id', editId)
      .single()
      .then(({ data }) => {
        if (!data) return
        // If raw_data exists, use it for full pre-fill
        // Otherwise fall back to basic fields stored in the main columns
        const d = data.raw_data || {
          nome:        data.cliente,
          residencial: data.residencial,
          bairro:      data.bairro,
        }
        // Pre-fill all form fields
        setTimeout(() => {
          const sv = (name, val) => { const els = document.getElementsByName(name); if (els.length && val) els[0].value = val }
          sv('p_nome',         d.nome)
          sv('p_corretor',     d.corretor)
          sv('p_residencial',  d.residencial)
          sv('p_endereco',     d.endereco)
          sv('p_bairro',       d.bairro)
          sv('p_quartos',      d.quartos)
          sv('p_vagas',        d.vagas)
          sv('p_area',         d.area)
          sv('p_andar',        d.andar)
          sv('selic',          d.selic)
          sv('vl_div',         d.vl_div)
          sv('vl_fec',         d.vl_fec)
          sv('vl_med',         d.vl_med)
          sv('p_tipo_imovel',  d.tipo_imovel)
          sv('p_posicao_solar',d.posicao_solar)
          sv('p_situacao',     d.situacao)
          sv('p_reforma',      d.reforma)
          // Pontos positivos e negativos
          if (d.pos?.length) setPosItems(d.pos)
          if (d.neg?.length) setNegItems(d.neg)
          // NV rows
          if (d.nv?.length) {
            setNvCount(d.nv.length)
            d.nv.forEach((r, i) => {
              setTimeout(() => {
                sv(`nv_n_${i+1}`, r.n)
                sv(`nv_a_${i+1}`, r.a)
                sv(`nv_c_${i+1}`, r.c)
                sv(`nv_v_${i+1}`, r.v)
                sv(`nv_d_${i+1}`, r.d)
                sv(`lk_${i+1}`,   r.url)
              }, 200)
            })
          }
          // V rows
          if (d.v?.length) {
            setVCount(d.v.length)
            d.v.forEach((r, i) => {
              setTimeout(() => {
                sv(`v_n_${i+1}`, r.n)
                sv(`v_a_${i+1}`, r.a)
                sv(`v_c_${i+1}`, r.c)
                sv(`v_v_${i+1}`, r.v)
              }, 200)
            })
          }
          // Perfis
          if (d.comps?.length) {
            d.comps.forEach((c, i) => {
              setTimeout(() => sv(`c${i+1}t`, c.t), 200)
            })
          }
        }, 100)
      })
  }, [editId])

  const gv = (name) => {
    // Use getElementsByName for reliability — works for inputs AND selects in nested components
    const els = document.getElementsByName(name)
    if (els.length > 0) return (els[0].value || '').trim()
    // Fallback to formRef
    const el = formRef.current?.elements[name]
    return el ? el.value.trim() : ''
  }
  const sv = (name, val) => { const el = formRef.current?.elements[name]; if (el) el.value = val }

  const extractFromContent = async (type, idx) => {
    // Read values directly from DOM by name — more reliable than form.elements
    const getVal = (name) => {
      const els = document.getElementsByName(name)
      return els.length > 0 ? (els[0].value || '').trim() : ''
    }
    const setVal = (name, val) => {
      const els = document.getElementsByName(name)
      if (els.length > 0) els[0].value = val
    }

    const link   = type === 'nv' ? getVal(`lk_${idx}`) : ''
    const pasted = getVal(type === 'nv' ? `nv_content_${idx}` : `v_content_${idx}`)

    if (!link && !pasted) {
      alert('Cole o link ou o conteúdo do anúncio antes de extrair.')
      return
    }

    const setExtracting = type === 'nv' ? setExtractingNV : setExtractingV
    setExtracting(prev => ({ ...prev, [idx]: true }))

    try {
      let content = pasted

      // Fetch via Supabase proxy if only link provided
      if (link && !pasted) {
        console.log('Fetching URL via proxy:', link)
        const { data: fetchData, error: fetchErr } = await supabase.functions.invoke('gerar-apresentacao', {
          body: { data: { _fetch_url: true, url: link } }
        })
        console.log('Fetch result:', fetchData, fetchErr)
        content = fetchData?.content || ''
        if (!content) throw new Error(fetchData?.error || 'Site bloqueou o acesso — cole o conteúdo manualmente')
      }

      console.log('Extracting from content length:', content.length)
      const { data, error } = await supabase.functions.invoke('gerar-apresentacao', {
        body: { data: { _extract: true, type, content } }
      })
      console.log('Extract result:', data, error)

      if (!error && data?.extracted) {
        const ex = data.extracted
        if (type === 'nv') {
          if (ex.nome)  setVal(`nv_n_${idx}`, ex.nome)
          if (ex.area)  setVal(`nv_a_${idx}`, ex.area)
          if (ex.carac) setVal(`nv_c_${idx}`, ex.carac)
          if (ex.valor) setVal(`nv_v_${idx}`, ex.valor)
          if (ex.dias)  setVal(`nv_d_${idx}`, ex.dias)
        } else {
          if (ex.nome)  setVal(`v_n_${idx}`, ex.nome)
          if (ex.area)  setVal(`v_a_${idx}`, ex.area)
          if (ex.carac) setVal(`v_c_${idx}`, ex.carac)
          if (ex.valor) setVal(`v_v_${idx}`, ex.valor)
        }
      } else if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.error('Extração falhou:', err.message)
      alert('Extração falhou: ' + err.message)
    }
    setExtracting(prev => ({ ...prev, [idx]: false }))
  }

  const parseCarac = (c) => {
    if (!c) return { quartos: '', vagas: '', conservacao: '', obs: '' }
    const s = c.toLowerCase()
    let quartos = ''
    const qtMatch = s.match(/(\d+)\s*(quartos?|qts?|q\b)/)
    if (qtMatch) quartos = qtMatch[1]
    let vagas = ''
    if (/sem\s*vaga/.test(s)) { vagas = '0' }
    else { const vagMatch = s.match(/(\d+)\s*vaga/); if (vagMatch) vagas = vagMatch[1] }
    let conservacao = ''
    if (/alto\s*padr/.test(s)) conservacao = 'Alto padrão'
    else if (/reform/.test(s)) conservacao = 'Reformado'
    else if (/parcial/.test(s)) conservacao = 'Parcialmente reformado'
    else if (/precisa/.test(s)) conservacao = 'Precisa de reforma'
    else if (/original/.test(s)) conservacao = 'Original'
    const obs = []
    if (/nascente/.test(s)) obs.push('Nascente')
    if (/poente/.test(s)) obs.push('Poente')
    if (/canto/.test(s)) obs.push('Canto')
    if (/andar alto/.test(s)) obs.push('Andar alto')
    if (/andar baixo/.test(s)) obs.push('Andar baixo')
    if (/cobertura/.test(s)) obs.push('Cobertura')
    return { quartos, vagas, conservacao, obs: obs.join(' · ') }
  }

  const collectData = () => {
    const d = {
      nome: gv('p_nome')||'Proprietário', corretor: gv('p_corretor')||'Corretor Liberty',
      residencial: gv('p_residencial')||'Residencial', endereco: gv('p_endereco')||'',
      bairro: gv('p_bairro')||'', quartos: gv('p_quartos')||'—', vagas: gv('p_vagas')||'—',
      area: gv('p_area')||'—', andar: gv('p_andar')||'—', selic: gv('selic')||'14,50%',
      tipo_imovel: gv('p_tipo_imovel')||'Apartamento',
      posicao_solar: gv('p_posicao_solar')||'',
      situacao: gv('p_situacao')||'',
      reforma: gv('p_reforma')||'',
      condicao_interior: gv('p_condicao_interior')||'',
      condicao_fachada: gv('p_condicao_fachada')||'',
      vl_div: gv('vl_div')||'—', vl_fec: gv('vl_fec')||'—', vl_med: gv('vl_med')||'—',
      nv: [], v: [], pos: posItems.filter(Boolean), neg: negItems.filter(Boolean),
      comps: [1,2,3,4].map(i => ({ t: gv(`c${i}t`), d: '' })).filter(c => c.t),
    }
    for (let i = 1; i <= nvCount; i++) {
      const n=gv(`nv_n_${i}`),a=gv(`nv_a_${i}`),c=gv(`nv_c_${i}`),v=gv(`nv_v_${i}`),dd=gv(`nv_d_${i}`),url=gv(`lk_${i}`)
      if (a||c||v||n) d.nv.push({n,a,c,v,d:dd,url})
    }
    for (let i = 1; i <= vCount; i++) {
      const n=gv(`v_n_${i}`),a=gv(`v_a_${i}`),c=gv(`v_c_${i}`),v=gv(`v_v_${i}`)
      if (a||c||v||n) d.v.push({n,a,c,v})
    }
    return d
  }

  const handlePrecificar = async () => {
    const d = collectData()
    if (!d.nv.length && !d.v.length) {
      alert('Adicione pelo menos um concorrente ou imóvel vendido antes de precificar.')
      return
    }
    setPrecStatus('loading')
    setPrecData(null)
    setDataChanged(false)
    try {
      const { data, error } = await supabase.functions.invoke('gerar-apresentacao', {
        body: { data: {
          _precificar: true,
          imovel: { ...d, pos: d.pos, neg: d.neg },
          nv: d.nv,
          v:  d.v,
        }}
      })
      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.error)
      const p = data.precificacao
      setPrecData(p)
      setPrecStatus('done')
      // Auto-fill pricing fields with "mercado" recommendation
      const rec = p[p.recomendacao] || p.mercado
      const sv = (name, val) => { const els = document.getElementsByName(name); if (els.length) els[0].value = val }
      sv('vl_div', rec.totalFmt)
      sv('vl_fec', p.mercado.totalFmt)
      sv('vl_med', p.mercado.vm2Fmt)
      // Scroll to pricing section
      setTimeout(() => {
        document.getElementsByName('vl_div')[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    } catch (err) {
      console.error('Precificação:', err.message)
      setPrecStatus('error')
    }
  }

  const handleGerar = async (e) => {
    e.preventDefault()
    setStatus('loading'); setErrorMsg('')
    try {
      const rawData = collectData()
      let enrichedData = rawData
      try {
        const { data, error } = await supabase.functions.invoke('gerar-apresentacao', { body: { data: rawData } })
        if (!error && data?.enriched && data.enriched.residencial) {
          enrichedData = {
            ...rawData,
            posEnriched: data.enriched.posEnriched || rawData.pos.map(t=>({t,d:''})),
            negEnriched: data.enriched.negEnriched || rawData.neg.map(t=>({t,d:''})),
            comps:       data.enriched.comps?.length ? data.enriched.comps : rawData.comps,
            nv:          data.enriched.nv || rawData.nv,
          }
        }
      } catch (edgeErr) { console.warn('Edge function:', edgeErr.message) }
      if (!enrichedData.posEnriched) enrichedData.posEnriched = (enrichedData.pos||[]).map(t=>({t,d:''}))
      if (!enrichedData.negEnriched) enrichedData.negEnriched = (enrichedData.neg||[]).map(t=>({t,d:''}))
      // Inject pricing data if available
      if (precData) enrichedData.prec = precData
      const html = buildHTML(enrichedData)
      if (user?.id) {
        const insertData = {
          user_id: user.id, cliente: rawData.nome,
          residencial: rawData.residencial, bairro: rawData.bairro,
          html, raw_data: rawData,
        }
        if (editId) {
          // Update existing apresentacao
          supabase.from('apresentacoes')
            .update({ html, raw_data: rawData, updated_at: new Date().toISOString() })
            .eq('id', editId)
            .then(({ error: se }) => { if (se) console.warn('Update:', se.message) })
        } else {
          supabase.from('apresentacoes').insert(insertData)
            .then(({ error: se }) => { if (se) console.warn('Histórico:', se.message) })
        }
      }
      const blob = new Blob([html], { type: 'text/html' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = (rawData.residencial||'Liberty').replace(/[^a-zA-Z0-9\s]/g,'').trim().replace(/\s+/g,'_') + '.html'
      a.click()
      setStatus('done')
    } catch (err) { setErrorMsg(err.message||'Erro.'); setStatus('error') }
  }

  const tmute = 'text-gray-400'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{editId ? 'Editar Apresentação' : 'Gerar Apresentação · V2'}</h1>
        {v1id && (
          <div style={{ marginTop:'8px', padding:'8px 14px', borderRadius:'8px', background:'rgba(18,102,205,0.1)', border:'1px solid rgba(18,102,205,0.2)', fontSize:'12px', color:'#1266CD', display:'inline-flex', alignItems:'center', gap:'6px' }}>
            ✓ Dados pré-preenchidos da V1
          </div>
        )}
        <p className={`text-sm ${tmute} mt-2`}>Complete os dados de mercado. A IA gera as descrições.</p>
      </div>
      <form ref={formRef} onSubmit={handleGerar} className="space-y-6"
        onChange={() => { if(precData) setDataChanged(true) }}>

        <section className="card p-6 space-y-4">
          <p className="section-title">Identificação</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome do cliente"><Input name="p_nome" placeholder="Ex: Guilherme e Dilceia" /></Field>
            <Field label="Corretor"><Input name="p_corretor" defaultValue="Corretor Liberty" /></Field>
          </div>
          <Field label="Nome do imóvel / Condomínio"><Input name="p_residencial" placeholder="Ex: SQN 402, Mont Blanc" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Endereço"><Input name="p_endereco" placeholder="Ex: Bloco G, Apto 301" /></Field>
            <Field label="Bairro / Região"><Input name="p_bairro" placeholder="Ex: Asa Norte — Brasília, DF" /></Field>
          {/* Hidden fields from V1 — auto-filled when coming from V1 */}
          <input type="hidden" name="p_tipo_imovel" defaultValue="Apartamento" />
          <input type="hidden" name="p_posicao_solar" />
          <input type="hidden" name="p_situacao" />
          <input type="hidden" name="p_reforma" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <p className="section-title">Ficha Técnica</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Quartos"><Input name="p_quartos" placeholder="Ex: 2" /></Field>
            <Field label="Vagas"><Input name="p_vagas" placeholder="Ex: 1" /></Field>
            <Field label="Área (m²)"><Input name="p_area" placeholder="Ex: 66" /></Field>
            <Field label="Andar / Tipo"><Input name="p_andar" placeholder="Ex: 3° andar" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Condição do interior" hint="usado na precificação">
              <select name="p_condicao_interior" className="lv-input" style={{cursor:'pointer'}}>
                <option value="Recentemente reformado">Recentemente reformado</option>
                <option value="Precisa de reforma">Precisa de reforma</option>
                <option value="Parcialmente reformado">Parcialmente reformado</option>
                <option value="Original">Original (sem reforma)</option>
              </select>
            </Field>
            <Field label="Fachada do bloco" hint="usado na precificação">
              <select name="p_condicao_fachada" className="lv-input" style={{cursor:'pointer'}}>
                <option value="Boa">Boa condição</option>
                <option value="Precisa de reforma">Precisa de reforma</option>
                <option value="Recentemente reformada">Recentemente reformada</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Selic"><Input name="selic" value={selic} onChange={e=>setSelic(e.target.value)} /></Field>
            <Field label="Valor divulgação"><Input name="vl_div" placeholder="Calculado pela IA ↓" /></Field>
            <Field label="Expectativa fechamento"><Input name="vl_fec" placeholder="Calculado pela IA ↓" /></Field>
          </div>
          <Field label="Referência de mercado (R$/m²)"><Input name="vl_med" placeholder="Calculado pela IA ↓" /></Field>
        </section>

        {/* ── Precificação Inteligente ── */}
        <section className="card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-title mb-0">Precificação Inteligente</p>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'4px' }}>
                <p className={`text-xs ${tmute}`} style={{ margin:0 }}>
                  Preencha concorrentes e vendidos acima, depois clique para a IA calcular
                </p>
                {dataChanged && precData && (
                  <span style={{
                    fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'10px',
                    background:'rgba(245,158,11,0.15)', color:'#f59e0b',
                    border:'1px solid rgba(245,158,11,0.3)', whiteSpace:'nowrap',
                  }}>
                    ⚠️ Dados alterados — recalcule
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handlePrecificar}
              disabled={precStatus === 'loading'}
              style={{
                background: 'linear-gradient(135deg,#1266CD,#1a7be8)',
                color: '#fff', border: 'none', borderRadius: '10px',
                padding: '10px 18px', fontSize: '13px', fontWeight: '600',
                cursor: precStatus === 'loading' ? 'not-allowed' : 'pointer',
                opacity: precStatus === 'loading' ? 0.7 : 1,
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(18,102,205,0.4)', flexShrink: 0,
              }}
            >
              {precStatus === 'loading'
                ? <><div style={{width:'14px',height:'14px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Calculando...</>
                : '✦ Sugerir Valores'}
            </button>
          </div>

          {/* Resultado da precificação */}
          {precData && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {/* Três faixas */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
                {[
                  { key:'competitivo', label:'Competitivo',  color:'#2563eb', bg: dark?'rgba(37,99,235,0.12)':'#EEF4FD' },
                  { key:'mercado',     label:'Mercado',      color:'#059669', bg: dark?'rgba(5,150,105,0.12)':'#ECFDF5', rec: true },
                  { key:'otimista',    label:'Otimista',     color:'#d97706', bg: dark?'rgba(217,119,6,0.12)':'#FFFBEB'  },
                ].map(({ key, label, color, bg, rec }) => {
                  const faixa = precData[key]
                  return (
                    <div key={key}
                      onClick={() => {
                        const sv = (n,v) => { const el = document.getElementsByName(n); if(el.length) el[0].value=v }
                        sv('vl_div', faixa.totalFmt)
                        sv('vl_fec', precData.mercado.totalFmt)
                        sv('vl_med', faixa.vm2Fmt)
                      }}
                      style={{
                        background: bg, borderRadius:'12px', padding:'14px',
                        border: `1px solid ${color}40`,
                        cursor:'pointer', transition:'transform .15s',
                        position:'relative',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                    >
                      {rec && precData.recomendacao === key && (
                        <div style={{ position:'absolute', top:'-8px', right:'8px', background:color, color:'#fff', fontSize:'9px', fontWeight:'700', padding:'2px 7px', borderRadius:'10px', letterSpacing:'0.05em' }}>
                          SUGERIDO
                        </div>
                      )}
                      <div style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color, marginBottom:'6px' }}>{label}</div>
                      <div style={{ fontSize:'1.1rem', fontWeight:'800', color: dark?'#fff':'#111', marginBottom:'2px' }}>
                        {faixa.totalFmt}
                      </div>
                      <div style={{ fontSize:'11px', color: dark?'rgba(255,255,255,0.4)':'#6b7280' }}>{faixa.vm2Fmt}</div>
                      <div style={{ fontSize:'10px', color: dark?'rgba(255,255,255,0.35)':'#9ca3af', marginTop:'6px', lineHeight:'1.4' }}>{faixa.descricao}</div>
                      <div style={{ fontSize:'10px', color, marginTop:'8px', fontWeight:'600' }}>← Usar este valor</div>
                    </div>
                  )
                })}
              </div>

              {/* Justificativa */}
              <div style={{
                padding:'14px 16px', borderRadius:'12px',
                background: dark?'rgba(255,255,255,0.04)':'#f9fafb',
                border: dark?'1px solid rgba(255,255,255,0.08)':'1px solid #e5e7eb',
              }}>
                <p style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:'#1266CD', marginBottom:'6px' }}>
                  Análise da IA
                </p>
                <p style={{ fontSize:'13px', color: dark?'rgba(255,255,255,0.7)':'#374151', lineHeight:'1.6', margin:0 }}>
                  {precData.justificativa}
                </p>
              </div>

              {/* Alertas */}
              {precData.alertas?.length > 0 && (
                <div style={{
                  padding:'10px 14px', borderRadius:'10px',
                  background: dark?'rgba(245,158,11,0.1)':'#FFFBEB',
                  border:'1px solid rgba(245,158,11,0.3)',
                }}>
                  {precData.alertas.map((a, i) => (
                    <p key={i} style={{ fontSize:'12px', color:'#d97706', margin: i===0?0:'4px 0 0', lineHeight:'1.5' }}>
                      ⚠️ {a}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {precStatus === 'error' && (
            <p style={{ fontSize:'12px', color:'#ef4444' }}>
              Erro ao calcular. Verifique se os campos de área e valor dos concorrentes estão preenchidos.
            </p>
          )}
        </section>

        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title mb-0">Concorrentes ativos</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Link + conteúdo colado → IA extrai os dados</p>
            </div>
            {nvCount < MAX_NV && (
              <button type="button" onClick={() => { setNvCount(n=>n+1); if(precData) setDataChanged(true) }}
                className="text-xs text-blue-500 font-medium hover:underline">+ Adicionar</button>
            )}
          </div>
          {Array.from({length:nvCount},(_,i) => (
            <NVRow key={i} idx={i+1}
              onRemove={() => setNvCount(n=>Math.max(1,n-1))}
              onExtract={(idx) => extractFromContent('nv', idx)}
              extracting={!!extractingNV[i+1]}
            />
          ))}
          <p className={`text-xs ${tmute} text-right`}>{nvCount}/{MAX_NV}</p>
        </section>

        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title mb-0">Histórico de vendas reais</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Conteúdo colado → IA extrai os dados</p>
            </div>
            {vCount < MAX_V && (
              <button type="button" onClick={() => { setVCount(n=>n+1); if(precData) setDataChanged(true) }}
                className="text-xs text-blue-500 font-medium hover:underline">+ Adicionar</button>
            )}
          </div>
          {Array.from({length:vCount},(_,i) => (
            <VRow key={i} idx={i+1}
              onRemove={() => setVCount(n=>Math.max(1,n-1))}
              onExtract={(idx) => extractFromContent('v', idx)}
              extracting={!!extractingV[i+1]}
            />
          ))}
          <p className={`text-xs ${tmute} text-right`}>{vCount}/{MAX_V}</p>
        </section>

        <section className="card p-6 space-y-4">
          <p className="section-title">Análise Crítica</p>
          <p className={`text-xs ${tmute} -mt-2`}>Só o título — a IA gera a descrição</p>
          <div>
            <p className={`text-xs font-medium ${tmute} mb-2`}>Pontos Positivos</p>
            <div className="space-y-2">
              {posItems.map((v,i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v} onChange={e=>{const a=[...posItems];a[i]=e.target.value;setPosItems(a);if(precData)setDataChanged(true)}}
                    className="input-base flex-1" placeholder="Ex: Reformado, Vazado"/>
                  {posItems.length>1 && <button type="button" onClick={()=>setPosItems(p=>p.filter((_,j)=>j!==i))} className="label-muted hover:text-red-400 text-lg">×</button>}
                </div>
              ))}
              {posItems.length < 4 && <button type="button" onClick={() => setPosItems(p=>[...p,''])} className="text-xs text-blue-500 hover:underline">+ Adicionar</button>}
            </div>
          </div>
          <div>
            <p className={`text-xs font-medium ${tmute} mb-2`}>Pontos de Atenção</p>
            <div className="space-y-2">
              {negItems.map((v,i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v} onChange={e=>{const a=[...negItems];a[i]=e.target.value;setNegItems(a);if(precData)setDataChanged(true)}}
                    className="input-base flex-1" placeholder="Ex: Necessita de reforma"/>
                  {negItems.length>1 && <button type="button" onClick={()=>setNegItems(p=>p.filter((_,j)=>j!==i))} className="label-muted hover:text-red-400 text-lg">×</button>}
                </div>
              ))}
              {negItems.length < 3 && <button type="button" onClick={() => setNegItems(p=>[...p,''])} className="text-xs text-blue-500 hover:underline">+ Adicionar</button>}
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-3">
          <p className="section-title">Perfil do Comprador</p>
          <p className={`text-xs ${tmute} -mt-2`}>Só o título — a IA gera a descrição</p>
          {[1,2,3,4].map(i => <PerfilRow key={i} idx={i} />)}
        </section>

        <div className="flex items-center gap-4 pb-8">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={status==='loading'}>
            {status==='loading'
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Gerando...</>
              : (editId ? '✦ Atualizar Apresentação' : '✦ Gerar Apresentação')}
          </button>
          {status==='done'  && <span className="text-sm text-green-500 font-medium">✓ Gerada e baixada!</span>}
          {status==='error' && <span className="text-sm text-red-400">{errorMsg}</span>}
        </div>
      </form>
    </div>
  )
}
