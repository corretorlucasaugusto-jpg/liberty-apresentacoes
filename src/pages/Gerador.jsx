import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
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
  const { user } = useAuth()
  const formRef = useRef(null)
  const [v1loaded, setV1loaded] = useState(false)
  const [nvCount,  setNvCount]  = useState(2)
  const [vCount,   setVCount]   = useState(1)
  const [posItems, setPosItems] = useState(['', ''])
  const [negItems, setNegItems] = useState([''])
  const [status,   setStatus]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [extractingNV, setExtractingNV] = useState({})
  const [extractingV,  setExtractingV]  = useState({})

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

  const gv = (name) => { const el = formRef.current?.elements[name]; return el ? el.value.trim() : '' }
  const sv = (name, val) => { const el = formRef.current?.elements[name]; if (el) el.value = val }

  const extractFromContent = async (type, idx) => {
    const content = gv(type === 'nv' ? `nv_content_${idx}` : `v_content_${idx}`)
    if (!content.trim()) return
    const setExtracting = type === 'nv' ? setExtractingNV : setExtractingV
    setExtracting(prev => ({ ...prev, [idx]: true }))
    try {
      const { data, error } = await supabase.functions.invoke('gerar-apresentacao', {
        body: { data: { _extract: true, type, content } }
      })
      if (!error && data?.extracted) {
        const ex = data.extracted
        if (type === 'nv') {
          if (ex.nome)  sv(`nv_n_${idx}`, ex.nome)
          if (ex.area)  sv(`nv_a_${idx}`, ex.area)
          if (ex.carac) sv(`nv_c_${idx}`, ex.carac)
          if (ex.valor) sv(`nv_v_${idx}`, ex.valor)
          if (ex.dias)  sv(`nv_d_${idx}`, ex.dias)
        } else {
          if (ex.nome)  sv(`v_n_${idx}`, ex.nome)
          if (ex.area)  sv(`v_a_${idx}`, ex.area)
          if (ex.carac) sv(`v_c_${idx}`, ex.carac)
          if (ex.valor) sv(`v_v_${idx}`, ex.valor)
        }
      }
    } catch (err) { console.warn('Extração falhou:', err.message) }
    setExtracting(prev => ({ ...prev, [idx]: false }))
  }

  const collectData = () => {
    const d = {
      nome: gv('p_nome')||'Proprietário', corretor: gv('p_corretor')||'Corretor Liberty',
      residencial: gv('p_residencial')||'Residencial', endereco: gv('p_endereco')||'',
      bairro: gv('p_bairro')||'', quartos: gv('p_quartos')||'—', vagas: gv('p_vagas')||'—',
      area: gv('p_area')||'—', andar: gv('p_andar')||'—', selic: gv('selic')||'14,50%',
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
      const html = buildHTML(enrichedData)
      if (user?.id) {
        supabase.from('apresentacoes').insert({
          user_id: user.id, cliente: rawData.nome,
          residencial: rawData.residencial, bairro: rawData.bairro, html
        }).then(({ error: se }) => { if (se) console.warn('Histórico:', se.message) })
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
        <h1 className="text-2xl font-bold">Gerar Apresentação · V2</h1>
        {v1id && (
          <div style={{ marginTop:'8px', padding:'8px 14px', borderRadius:'8px', background:'rgba(18,102,205,0.1)', border:'1px solid rgba(18,102,205,0.2)', fontSize:'12px', color:'#1266CD', display:'inline-flex', alignItems:'center', gap:'6px' }}>
            ✓ Dados pré-preenchidos da V1
          </div>
        )}
        <p className={`text-sm ${tmute} mt-2`}>Complete os dados de mercado. A IA gera as descrições.</p>
      </div>
      <form ref={formRef} onSubmit={handleGerar} className="space-y-6">

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
          <div className="grid grid-cols-3 gap-4">
            <Field label="Selic"><Input name="selic" defaultValue="14,50%" /></Field>
            <Field label="Valor divulgação"><Input name="vl_div" placeholder="Ex: R$ 840.000" /></Field>
            <Field label="Expectativa fechamento"><Input name="vl_fec" placeholder="Ex: R$ 825.000" /></Field>
          </div>
          <Field label="Referência de mercado"><Input name="vl_med" placeholder="Ex: R$ 850.000" /></Field>
        </section>

        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title mb-0">Concorrentes ativos</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Link + conteúdo colado → IA extrai os dados</p>
            </div>
            {nvCount < MAX_NV && (
              <button type="button" onClick={() => setNvCount(n=>n+1)}
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
              <button type="button" onClick={() => setVCount(n=>n+1)}
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
                  <input value={v} onChange={e=>{const a=[...posItems];a[i]=e.target.value;setPosItems(a)}}
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
                  <input value={v} onChange={e=>{const a=[...negItems];a[i]=e.target.value;setNegItems(a)}}
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
              : '✦ Gerar Apresentação'}
          </button>
          {status==='done'  && <span className="text-sm text-green-500 font-medium">✓ Gerada e baixada!</span>}
          {status==='error' && <span className="text-sm text-red-400">{errorMsg}</span>}
        </div>
      </form>
    </div>
  )
}
