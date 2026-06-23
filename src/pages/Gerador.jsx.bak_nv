import React, { useState, useRef, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { Field, Input, NVRow, VRow, PerfilRow } from '../components/FormFields.jsx'
import { buildHTML } from '../lib/buildHTML.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDark } from '../hooks/useTheme.js'

const MAX_NV = 8
const MAX_V  = 8
const TIPOS  = ['Apartamento','Casa','Cobertura','Kitnet / Studio','Comercial','Terreno']

export default function Gerador() {
  const dark = useDark()
  const { v1id } = useParams()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  const { user } = useAuth()
  const formRef = useRef(null)
  const draftIdRef = useRef(null)
  const autoSaveTimer = useRef(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState(null)
  const [v1loaded, setV1loaded] = useState(false)
  const [nvCount,  setNvCount]  = useState(2)
  const [vCount,   setVCount]   = useState(1)
  const [posItems, setPosItems] = useState(['', ''])
  const [negItems, setNegItems] = useState([''])
  const [status,   setStatus]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [extractingNV,  setExtractingNV]  = useState({})
  const [extractingV,   setExtractingV]   = useState({})
  const [notFoundNV,    setNotFoundNV]    = useState({})
  const [notFoundV,     setNotFoundV]     = useState({})
  const [precStatus,    setPrecStatus]    = useState(null)
  const [precData,      setPrecData]      = useState(null)
  const [editData,      setEditData]      = useState(null)
  const [dataChanged,   setDataChanged]   = useState(false)
  const [precAdj, setPrecAdj] = useState({ competitivo: 0, mercado: 0, otimista: 0 })
  const [selic,   setSelic]   = useState('14,50%')
  const [tipoSel, setTipoSel] = useState('Apartamento')

  const isTer  = tipoSel === 'Terreno'
  const isCasa = tipoSel === 'Casa' || tipoSel === 'Cobertura'
  const isCom  = tipoSel === 'Comercial'
  const isApt  = tipoSel === 'Apartamento' || tipoSel === 'Kitnet / Studio'

  // Autosave quando nvCount ou vCount muda
  useEffect(() => {
    if (!editId && !draftIdRef.current) return
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(autoSave, 800)
  }, [nvCount, vCount])

  // Busca Selic atual via Edge Function
  useEffect(() => {
    supabase.functions.invoke('gerar-apresentacao', { body: { data: { _selic: true } } })
      .then(({ data }) => { if (data?.selic) setSelic(data.selic) })
      .catch(() => {})
  }, [])

  // Load V1 data if coming from /v2/:v1id
  useEffect(() => {
    if (!v1id || v1loaded) return
    supabase.from('visitas_v1').select('*').eq('id', v1id).single()
      .then(({ data }) => {
        if (!data) return
        const sv = (name, val) => { const el = formRef.current?.elements[name]; if (el && val) el.value = val }
        setTimeout(() => {
          sv('p_nome',         data.cliente)
          sv('p_residencial',  data.residencial)
          sv('p_endereco',     data.endereco)
          sv('p_bairro',       data.bairro)
          sv('p_quartos',      data.quartos)
          sv('p_vagas',        data.vagas)
          sv('p_area',         data.area)
          sv('p_andar',        data.andar)
          sv('p_posicao_solar',data.posicao_solar || '')
          sv('p_situacao',     data.situacao      || '')
          sv('p_reforma',      data.reforma       || '')
          // Tipo de imóvel — atualiza estado reativo
          if (data.tipo_imovel) setTipoSel(data.tipo_imovel)
          // Terreno
          if (data.terreno) sv('p_terreno', data.terreno)
          // Map V1 reforma to V2 condicao_interior
          const cond = data.reforma === 'Recentemente reformado' ? 'Recentemente reformado'
            : data.reforma === 'Precisa de reforma' ? 'Precisa de reforma'
            : data.reforma === 'Não precisa' ? 'Recentemente reformado'
            : ''
          if (cond) {
            const el = document.getElementsByName('p_condicao_interior')[0]
            if (el) el.value = cond
          }
          if (data.pos?.length) setPosItems(data.pos.map(p => p.titulo || p).filter(Boolean))
          if (data.neg?.length) setNegItems(data.neg.map(n => n.titulo || n).filter(Boolean))
          setV1loaded(true)
        }, 500)
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
        const d = data.raw_data || {
          nome:        data.cliente,
          residencial: data.residencial,
          bairro:      data.bairro,
        }
        setEditData(d)
        setTimeout(() => {
          const sv = (name, val) => { const els = document.getElementsByName(name); if (els.length && (val !== undefined && val !== null && val !== '')) els[0].value = val }
          sv('p_nome',         d.nome)
          sv('p_corretor',     d.corretor)
          sv('p_residencial',  d.residencial)
          sv('p_endereco',     d.endereco)
          sv('p_bairro',       d.bairro)
          sv('p_quartos',      d.quartos)
          sv('p_vagas',        d.vagas)
          sv('p_area',         d.area)
          sv('p_terreno',      d.terreno)
          sv('p_andar',        d.andar)
          sv('selic',          d.selic)
          sv('vl_div',         d.vl_div)
          sv('vl_fec',         d.vl_fec)
          sv('vl_med',         d.vl_med)
          sv('p_posicao_solar',d.posicao_solar)
          sv('p_situacao',     d.situacao)
          sv('p_reforma',      d.reforma)
          // Tipo de imóvel — atualiza estado reativo
          if (d.tipo_imovel) setTipoSel(d.tipo_imovel)
          if (d.pos?.length) setPosItems(d.pos)
          if (d.neg?.length) setNegItems(d.neg)
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
                sv(`nv_obs_${i+1}`, r.obs)
                sv(`nv_q_${i+1}`, r.quartos)
                sv(`nv_vagas_${i+1}`, r.vagas)
                sv(`nv_cons_${i+1}`, r.conservacao)
              }, 200)
            })
          }
          if (d.v?.length) {
            setVCount(d.v.length)
            d.v.forEach((r, i) => {
              setTimeout(() => {
                sv(`v_n_${i+1}`, r.n)
                sv(`v_a_${i+1}`, r.a)
                sv(`v_c_${i+1}`, r.c)
                sv(`v_v_${i+1}`, r.v)
                sv(`v_obs_${i+1}`, r.obs)
                sv(`v_q_${i+1}`, r.quartos)
                sv(`v_vagas_${i+1}`, r.vagas)
                sv(`v_cons_${i+1}`, r.conservacao)
              }, 200)
            })
          }
          if (d.comps?.length) {
            d.comps.forEach((c, i) => {
              setTimeout(() => sv(`c${i+1}t`, c.t), 200)
            })
          }
          if (d.prec) { setPrecData(d.prec); setPrecStatus('done') }
          if (d.precAdj) setPrecAdj(d.precAdj)
        }, 100)
      })
  }, [editId])

  // tipoImovel() agora usa estado reativo
  const tipoImovel = () => tipoSel

  const gv = (name) => {
    const els = document.getElementsByName(name)
    if (els.length > 0) return (els[0].value || '').trim()
    const el = formRef.current?.elements[name]
    return el ? el.value.trim() : ''
  }
  const sv = (name, val) => { const el = formRef.current?.elements[name]; if (el) el.value = val }

  const extractFromContent = async (type, idx) => {
    const getVal = (name) => { const els = document.getElementsByName(name); return els.length > 0 ? (els[0].value||'').trim() : '' }
    const setVal = (name, val) => { const els = document.getElementsByName(name); if (els.length > 0) els[0].value = val }
    const setSel = (name, val) => { const els = document.getElementsByName(name); if (els.length > 0 && val) els[0].value = val }

    const link   = type === 'nv' ? getVal(`lk_${idx}`) : ''
    const pasted = getVal(type === 'nv' ? `nv_content_${idx}` : `v_content_${idx}`)

    if (!link && !pasted) { alert('Cole o link ou o conteúdo do anúncio antes de extrair.'); return }

    const setExtracting = type === 'nv' ? setExtractingNV : setExtractingV
    const setNotFound   = type === 'nv' ? setNotFoundNV   : setNotFoundV
    setExtracting(prev => ({ ...prev, [idx]: true }))
    setNotFound(prev => ({ ...prev, [idx]: {} }))

    try {
      let content = pasted
      if (link && !pasted) {
        const { data: fd } = await supabase.functions.invoke('gerar-apresentacao', {
          body: { data: { _fetch_url: true, url: link } }
        })
        content = fd?.content || ''
        if (!content) throw new Error(fd?.error || 'Site bloqueou — cole o conteúdo manualmente')
      }

      const { data, error } = await supabase.functions.invoke('gerar-apresentacao', {
        body: { data: { _extract: true, type, content, tipo: tipoImovel() } }
      })

      if (!error && data?.extracted) {
        const ex = data.extracted
        const nf = {}

        if (type === 'nv') {
          if (ex.nome)        setVal(`nv_n_${idx}`,      ex.nome);      else nf.nome = true
          // Para terreno, área total/terreno vai para nv_a_
          if (ex.area || ex.terreno) setVal(`nv_a_${idx}`, ex.area || ex.terreno); else nf.area = true
          if (ex.quartos)     setVal(`nv_q_${idx}`,      ex.quartos);   else if (!isTer) nf.quartos = true
          if (ex.vagas !== undefined && ex.vagas !== '') setVal(`nv_vagas_${idx}`, ex.vagas); else if (!isTer) nf.vagas = true
          if (ex.conservacao) setSel(`nv_cons_${idx}`,   ex.conservacao); else if (!isTer) nf.conservacao = true
          if (ex.valor)       setVal(`nv_v_${idx}`,      ex.valor);     else nf.valor = true
          if (ex.dias)        setVal(`nv_d_${idx}`,      ex.dias);      else nf.dias = true
          if (ex.obs)         setVal(`nv_obs_${idx}`,    ex.obs)
        } else {
          if (ex.nome)        setVal(`v_n_${idx}`,       ex.nome);      else nf.nome = true
          if (ex.area || ex.terreno) setVal(`v_a_${idx}`, ex.area || ex.terreno); else nf.area = true
          if (ex.quartos)     setVal(`v_q_${idx}`,       ex.quartos);   else if (!isTer) nf.quartos = true
          if (ex.vagas !== undefined && ex.vagas !== '') setVal(`v_vagas_${idx}`, ex.vagas); else if (!isTer) nf.vagas = true
          if (ex.conservacao) setSel(`v_cons_${idx}`,    ex.conservacao); else if (!isTer) nf.conservacao = true
          if (ex.valor)       setVal(`v_v_${idx}`,       ex.valor);     else nf.valor = true
          if (ex.obs)         setVal(`v_obs_${idx}`,     ex.obs)
        }

        if (Object.keys(nf).length > 0) setNotFound(prev => ({ ...prev, [idx]: nf }))
      } else if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.error('Extração falhou:', err.message)
      alert('Extração falhou: ' + err.message)
    }
    setExtracting(prev => ({ ...prev, [idx]: false }))
    // Força autosave após IA preencher os campos via DOM
    setTimeout(() => {
      clearTimeout(autoSaveTimer.current)
      autoSaveTimer.current = setTimeout(autoSave, 800)
    }, 300)
  }

  const parseCarac = (c) => {
    if (!c) return { quartos: '', vagas: '', conservacao: '', obs: '' }
    const s = c.toLowerCase()
    let quartos = ''
    const qtMatch = s.match(/(\d+)\s*(quartos?|qts?|q\b)/)
    if (qtMatch) quartos = qtMatch[1]
    let vagas = ''
    if (/sem\s*vaga/.test(s)) { vagas = '0' } else {
      const vagMatch = s.match(/(\d+)\s*vaga/)
      if (vagMatch) vagas = vagMatch[1]
    }
    let conservacao = ''
    if (/alto\s*padr[ãa]o|luxo/.test(s))              conservacao = 'Alto padrão'
    else if (/reform/.test(s))                         conservacao = 'Reformado'
    else if (/parcial/.test(s))                        conservacao = 'Parcialmente reformado'
    else if (/precisa|deteriorad/.test(s))             conservacao = 'Precisa de reforma'
    else if (/original|sem\s*reforma/.test(s))         conservacao = 'Original'
    const obsTerms = []
    if (/nascente/.test(s))  obsTerms.push('Nascente')
    if (/poente/.test(s))    obsTerms.push('Poente')
    if (/vazado/.test(s))    obsTerms.push('Vazado')
    if (/canto/.test(s))     obsTerms.push('Canto')
    if (/su[ií]te/.test(s))  obsTerms.push('Suíte')
    if (/andar\s*alto|alto\s*andar/.test(s)) obsTerms.push('Andar alto')
    if (/andar\s*baixo|baixo\s*andar/.test(s)) obsTerms.push('Andar baixo')
    if (/cobertura/.test(s)) obsTerms.push('Cobertura')
    return { quartos, vagas, conservacao, obs: obsTerms.join(' · ') }
  }

  const collectData = () => {
    const d = {
      nome: gv('p_nome')||'Proprietário', corretor: gv('p_corretor')||'Corretor Liberty',
      residencial: gv('p_residencial')||'Residencial', endereco: gv('p_endereco')||'',
      bairro: gv('p_bairro')||'', quartos: gv('p_quartos')||'—', vagas: gv('p_vagas')||'—',
      area: gv('p_area')||'—', terreno: gv('p_terreno')||'',
      andar: gv('p_andar')||'—', selic: gv('selic')||'14,50%',
      tipo_imovel: tipoSel,
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
      const n     = gv(`nv_n_${i}`)
      const a     = gv(`nv_a_${i}`)
      const rawC  = gv(`nv_c_${i}`)
      const parsed = parseCarac(rawC)
      const q     = gv(`nv_q_${i}`)     || parsed.quartos
      const vag   = gv(`nv_vagas_${i}`) || parsed.vagas
      const con   = gv(`nv_cons_${i}`)  || parsed.conservacao
      const v     = gv(`nv_v_${i}`)
      const dd    = gv(`nv_d_${i}`)
      const obs   = gv(`nv_obs_${i}`)   || parsed.obs
      const url   = gv(`lk_${i}`)
      const cat   = (function(){ const els = document.getElementsByName(`nv_cat_${i}`); for(let e of els){ if(e.checked) return e.value; } return 'local'; })()
      const carac = rawC
      if (a||v||n) d.nv.push({n, a, quartos:q, vagas:vag, conservacao:con, c:carac, v, d:dd, obs, url, cat})
    }
    for (let i = 1; i <= vCount; i++) {
      const n     = gv(`v_n_${i}`)
      const a     = gv(`v_a_${i}`)
      const rawC  = gv(`v_c_${i}`)
      const parsed = parseCarac(rawC)
      const q     = gv(`v_q_${i}`)     || parsed.quartos
      const vag   = gv(`v_vagas_${i}`) || parsed.vagas
      const con   = gv(`v_cons_${i}`)  || parsed.conservacao
      const v     = gv(`v_v_${i}`)
      const obs   = gv(`v_obs_${i}`)   || parsed.obs
      const carac = rawC
      if (a||v||n) d.v.push({n, a, quartos:q, vagas:vag, conservacao:con, c:carac, v, obs})
    }
    if (precData) d.prec = precData
    if (precAdj) d.precAdj = precAdj
    return d
  }

  const autoSave = async () => {
    if (!user?.id) return
    const rawData = collectData()
    if (!rawData.residencial || rawData.residencial === 'Residencial') return
    const activeId = editId || draftIdRef.current
    setAutoSaveStatus('saving')
    try {
      if (activeId) {
        await supabase.from('apresentacoes')
          .update({ raw_data: rawData, updated_at: new Date().toISOString() })
          .eq('id', activeId)
      } else {
        const { data: inserted, error } = await supabase.from('apresentacoes')
          .insert({ user_id: user.id, cliente: rawData.nome, residencial: rawData.residencial, bairro: rawData.bairro, raw_data: rawData, html: '', draft: true })
          .select('id').single()
        if (error) throw error
        if (inserted?.id) {
          draftIdRef.current = inserted.id
          window.history.replaceState(null, '', `?edit=${inserted.id}`)
        }
      }
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus(null), 2000)
    } catch (err) {
      console.warn('Auto-save:', err.message)
      setAutoSaveStatus('error')
      setTimeout(() => setAutoSaveStatus(null), 3000)
    }
  }

  const handleFormBlur = (e) => {
    if (e.target.tagName === 'BUTTON') return
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(autoSave, 600)
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
    setPrecAdj({ competitivo: 0, mercado: 0, otimista: 0 })
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
      const rec = p[p.recomendacao] || p.mercado
      const sv2 = (name, val) => { const els = document.getElementsByName(name); if (els.length) els[0].value = val }
      sv2('vl_div', rec.totalFmt)
      sv2('vl_fec', p.mercado.totalFmt)
      sv2('vl_med', p.mercado.vm2Fmt)
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
            comps:       (data.enriched.comps?.length >= rawData.comps?.length && rawData.comps?.length > 0) ? data.enriched.comps : rawData.comps,
            nv:          data.enriched.nv || rawData.nv,
          }
        }
      } catch (edgeErr) { console.warn('Edge function:', edgeErr.message) }
      if (!enrichedData.posEnriched) enrichedData.posEnriched = (enrichedData.pos||[]).map(t=>({t,d:''}))
      if (!enrichedData.negEnriched) enrichedData.negEnriched = (enrichedData.neg||[]).map(t=>({t,d:''}))
      if (precData) {
        const applyAdj = (faixa, key) => {
          if (!faixa) return faixa
          const adj = (precAdj && precAdj[key]) || 0
          if (adj === 0) return faixa
          const totalAdj = Math.round(faixa.total * (1 + adj / 100) / 1000) * 1000
          const areaNum  = enrichedData.area ? parseFloat((enrichedData.area||'').replace(/[^0-9.,]/g,'').replace(',','.')) : 0
          const vm2Adj   = areaNum > 0 ? Math.round(totalAdj / areaNum) : faixa.vm2
          return {
            ...faixa,
            total:    totalAdj,
            vm2:      vm2Adj,
            totalFmt: 'R ' + totalAdj.toLocaleString('pt-BR'),
            vm2Fmt:   'R ' + vm2Adj.toLocaleString('pt-BR') + '/m²',
          }
        }
        enrichedData.prec = {
          ...precData,
          competitivo: applyAdj(precData.competitivo, 'competitivo'),
          mercado:     applyAdj(precData.mercado,     'mercado'),
          otimista:    applyAdj(precData.otimista,    'otimista'),
        }
      }
      const html = buildHTML(enrichedData)
      if (user?.id) {
        const insertData = {
          user_id: user.id, cliente: rawData.nome,
          residencial: rawData.residencial, bairro: rawData.bairro,
          html, raw_data: rawData,
        }
        if (editId) {
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
        <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
          <h1 className="text-2xl font-bold">{editId ? 'Editar Apresentação' : 'Gerar Apresentação · V2'}</h1>
          {autoSaveStatus === 'saving' && <span style={{ fontSize:'11px', color:'#6b7280' }}>Salvando...</span>}
          {autoSaveStatus === 'saved'  && <span style={{ fontSize:'11px', color:'#059669', fontWeight:'500' }}>✓ Salvo</span>}
          {autoSaveStatus === 'error'  && <span style={{ fontSize:'11px', color:'#ef4444' }}>⚠ Erro ao salvar</span>}
        </div>
        {v1id && (
          <div style={{ marginTop:'8px', padding:'8px 14px', borderRadius:'8px', background:'rgba(18,102,205,0.1)', border:'1px solid rgba(18,102,205,0.2)', fontSize:'12px', color:'#1266CD', display:'inline-flex', alignItems:'center', gap:'6px' }}>
            ✓ Dados pré-preenchidos da V1
          </div>
        )}
        <p className={`text-sm ${tmute} mt-2`}>Complete os dados de mercado. A IA gera as descrições.</p>
      </div>

      <form ref={formRef} onSubmit={handleGerar} className="space-y-6"
        onChange={() => { if(precData) setDataChanged(true); clearTimeout(autoSaveTimer.current); autoSaveTimer.current = setTimeout(autoSave, 1200) }}
        onBlur={handleFormBlur}>

        {/* ── Identificação ── */}
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
          {/* Hidden fields vindos da V1 */}
          <input type="hidden" name="p_posicao_solar" />
          <input type="hidden" name="p_situacao" />
          <input type="hidden" name="p_reforma" />
        </section>

        {/* ── Ficha Técnica ── */}
        <section className="card p-6 space-y-4">
          <p className="section-title">Ficha Técnica</p>

          {/* Tipo de imóvel — visível e reativo */}
          <Field label="Tipo de imóvel">
            <select
              name="p_tipo_imovel"
              className="lv-input"
              style={{cursor:'pointer'}}
              value={tipoSel}
              onChange={e => { setTipoSel(e.target.value); if(precData) setDataChanged(true) }}
            >
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>

          {/* Campos da ficha — adaptados por tipo */}
          <div className={`grid gap-4 ${isTer ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {!isTer && !isCom && (
              <Field label="Quartos"><Input name="p_quartos" placeholder="Ex: 2" /></Field>
            )}
            {!isTer && (
              <Field label={isCasa ? 'Vagas na garagem' : 'Vagas'}>
                <Input name="p_vagas" placeholder="Ex: 1" />
              </Field>
            )}
            <Field label={isTer ? 'Área do terreno (m²)' : isCom ? 'Área total (m²)' : 'Área (m²)'}>
              <Input name="p_area" placeholder={isTer ? 'Ex: 500' : 'Ex: 66'} />
            </Field>
            {isCasa && (
              <Field label="Área do terreno (m²)">
                <Input name="p_terreno" placeholder="Ex: 360" />
              </Field>
            )}
            {!isTer && (
              <Field label={isCom ? 'Andar / Localização' : 'Andar / Tipo'}>
                <Input name="p_andar" placeholder={isCom ? 'Ex: Térreo' : 'Ex: 3° andar'} />
              </Field>
            )}
          </div>

          {/* Condição interior/fachada — oculto em Terreno */}
          {!isTer && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Condição do interior" hint="usado na precificação">
                <select name="p_condicao_interior" className="lv-input" style={{cursor:'pointer'}}>
                  <option value="Recentemente reformado">Recentemente reformado</option>
                  <option value="Precisa de reforma">Precisa de reforma</option>
                  <option value="Parcialmente reformado">Parcialmente reformado</option>
                  <option value="Original">Original (sem reforma)</option>
                </select>
              </Field>
              {!isCom && !isCasa && (
                <Field label="Fachada do bloco" hint="usado na precificação">
                  <select name="p_condicao_fachada" className="lv-input" style={{cursor:'pointer'}}>
                    <option value="Boa">Boa condição</option>
                    <option value="Precisa de reforma">Precisa de reforma</option>
                    <option value="Recentemente reformada">Recentemente reformada</option>
                  </select>
                </Field>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Field label="Selic"><Input name="selic" value={selic} onChange={e=>setSelic(e.target.value)} /></Field>
            <Field label="Valor divulgação"><Input name="vl_div" placeholder="Calculado pela IA ↓" /></Field>
            <Field label="Expectativa fechamento"><Input name="vl_fec" placeholder="Calculado pela IA ↓" /></Field>
          </div>
          <Field label={isTer ? 'Referência de mercado (R$/m² de terreno)' : 'Referência de mercado (R$/m²)'}>
            <Input name="vl_med" placeholder="Calculado pela IA ↓" />
          </Field>
        </section>

        {/* ── Precificação Inteligente ── */}
        <section className="card p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="section-title mb-0">Precificação Inteligente</p>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'4px' }}>
                <p className={`text-xs ${tmute}`} style={{ margin:0 }}>
                  Preencha concorrentes e vendidos abaixo, depois clique para a IA calcular
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

          {precData && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px' }}>
                {[
                  { key:'competitivo', label:'Competitivo',  color:'#2563eb', bg: dark?'rgba(37,99,235,0.12)':'#EEF4FD' },
                  { key:'mercado',     label:'Mercado',      color:'#059669', bg: dark?'rgba(5,150,105,0.12)':'#ECFDF5', rec: true },
                  { key:'otimista',    label:'Otimista',     color:'#d97706', bg: dark?'rgba(217,119,6,0.12)':'#FFFBEB'  },
                ].map(({ key, label, color, bg, rec }) => {
                  const faixa = precData[key]
                  const adj   = precAdj[key] || 0
                  const totalBase = faixa.total
                  const totalAdj  = Math.round(totalBase * (1 + adj / 100) / 1000) * 1000
                  const fmtAdj  = 'R$\u00a0' + totalAdj.toLocaleString('pt-BR')
                  const vm2Adj  = faixa.vm2 > 0 && faixa.total > 0
                    ? Math.round(faixa.vm2 * (totalAdj / faixa.total))
                    : faixa.vm2
                  const vm2AdjFmt = 'R$\u00a0' + vm2Adj.toLocaleString('pt-BR') + (isTer ? '/m² terreno' : '/m²')

                  const applyValue = () => {
                    const sv2 = (n,v) => { const el = document.getElementsByName(n); if(el.length) el[0].value=v }
                    sv2('vl_div', fmtAdj)
                    sv2('vl_fec', precData.mercado
                      ? 'R$\u00a0' + (Math.round(precData.mercado.total * (1 + (precAdj.mercado||0) / 100) / 1000) * 1000).toLocaleString('pt-BR')
                      : fmtAdj)
                    sv2('vl_med', vm2AdjFmt)
                    if (editId) {
                      setTimeout(() => {
                        const rawData = collectData()
                        if (precData) rawData.prec = precData
                        if (precAdj) rawData.precAdj = precAdj
                        supabase.from('apresentacoes').update({ raw_data: rawData, updated_at: new Date().toISOString() }).eq('id', editId).then(() => {})
                      }, 300)
                    }
                  }

                  const btnStyle = {
                    width:'26px', height:'26px', borderRadius:'50%',
                    border: `1px solid ${color}60`,
                    background: dark ? `${color}22` : `${color}18`,
                    color, fontSize:'16px', fontWeight:'700', lineHeight:'1',
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink: 0, userSelect:'none', transition:'background .15s',
                  }

                  return (
                    <div key={key}
                      style={{
                        background: bg, borderRadius:'12px', padding:'14px',
                        border: `1px solid ${color}40`,
                        transition:'transform .15s', position:'relative',
                        display:'flex', flexDirection:'column', gap:'0',
                      }}
                    >
                      {rec && precData.recomendacao === key && (
                        <div style={{ position:'absolute', top:'-8px', right:'8px', background:color, color:'#fff', fontSize:'9px', fontWeight:'700', padding:'2px 7px', borderRadius:'10px', letterSpacing:'0.05em' }}>
                          SUGERIDO
                        </div>
                      )}
                      <div style={{ fontSize:'10px', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color, marginBottom:'8px' }}>{label}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'2px' }}>
                        <button type="button" style={btnStyle}
                          onMouseEnter={e => e.currentTarget.style.background = dark ? `${color}40` : `${color}30`}
                          onMouseLeave={e => e.currentTarget.style.background = dark ? `${color}22` : `${color}18`}
                          onClick={() => setPrecAdj(prev => ({ ...prev, [key]: (prev[key]||0) - 1 }))}>
                          −
                        </button>
                        <div style={{ fontSize:'1.05rem', fontWeight:'800', color: dark?'#fff':'#111', flex:1, textAlign:'center' }}>
                          {fmtAdj}
                        </div>
                        <button type="button" style={btnStyle}
                          onMouseEnter={e => e.currentTarget.style.background = dark ? `${color}40` : `${color}30`}
                          onMouseLeave={e => e.currentTarget.style.background = dark ? `${color}22` : `${color}18`}
                          onClick={() => setPrecAdj(prev => ({ ...prev, [key]: (prev[key]||0) + 1 }))}>
                          +
                        </button>
                      </div>
                      {adj !== 0 && (
                        <div style={{ fontSize:'10px', textAlign:'center', color: adj > 0 ? '#059669' : '#ef4444', fontWeight:'600', marginBottom:'2px' }}>
                          {adj > 0 ? `+${adj}%` : `${adj}%`} sobre base
                          <button type="button"
                            onClick={() => setPrecAdj(prev => ({ ...prev, [key]: 0 }))}
                            style={{ marginLeft:'6px', color: dark?'rgba(255,255,255,0.4)':'#9ca3af', background:'none', border:'none', cursor:'pointer', fontSize:'10px', padding:0 }}>
                            (zerar)
                          </button>
                        </div>
                      )}
                      <div style={{ fontSize:'11px', color: dark?'rgba(255,255,255,0.4)':'#6b7280', textAlign:'center' }}>{vm2AdjFmt}</div>
                      <div style={{ fontSize:'10px', color: dark?'rgba(255,255,255,0.35)':'#9ca3af', marginTop:'6px', lineHeight:'1.4' }}>{faixa.descricao}</div>
                      <button type="button"
                        onClick={applyValue}
                        style={{
                          marginTop:'10px', width:'100%', padding:'6px 0',
                          borderRadius:'8px', border:`1px solid ${color}50`,
                          background: dark ? `${color}18` : `${color}12`,
                          color, fontSize:'11px', fontWeight:'600', cursor:'pointer', transition:'background .15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = dark ? `${color}30` : `${color}22`}
                        onMouseLeave={e => e.currentTarget.style.background = dark ? `${color}18` : `${color}12`}
                      >
                        ← Usar este valor
                      </button>
                    </div>
                  )
                })}
              </div>

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

        {/* ── Concorrentes ativos ── */}
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
              onRemove={() => { setNvCount(n=>Math.max(1,n-1)); if(precData) setDataChanged(true) }}
              onExtract={(idx) => extractFromContent('nv', idx)}
              extracting={!!extractingNV[i+1]}
              tipoImovel={tipoSel}
              notFound={notFoundNV[i+1] || {}}
            />
          ))}
          <p className={`text-xs ${tmute} text-right`}>{nvCount}/{MAX_NV}</p>
        </section>

        {/* ── Histórico de vendas reais ── */}
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
              onRemove={() => { setVCount(n=>Math.max(1,n-1)); if(precData) setDataChanged(true) }}
              onExtract={(idx) => extractFromContent('v', idx)}
              extracting={!!extractingV[i+1]}
              tipoImovel={tipoSel}
              notFound={notFoundV[i+1] || {}}
            />
          ))}
          <p className={`text-xs ${tmute} text-right`}>{vCount}/{MAX_V}</p>
        </section>

        {/* ── Análise Crítica ── */}
        <section className="card p-6 space-y-4">
          <p className="section-title">Análise Crítica</p>
          <p className={`text-xs ${tmute} -mt-2`}>Só o título — a IA gera a descrição</p>
          <div>
            <p className={`text-xs font-medium ${tmute} mb-2`}>Pontos Positivos</p>
            <div className="space-y-2">
              {posItems.map((v,i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v} onChange={e=>{const a=[...posItems];a[i]=e.target.value;setPosItems(a);if(precData)setDataChanged(true)}}
                    className="input-base flex-1"
                    placeholder={isTer ? 'Ex: Localização privilegiada, Esquina, Plano' : 'Ex: Reformado, Vazado, Andar alto'}/>
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
                    className="input-base flex-1"
                    placeholder={isTer ? 'Ex: Aclive, Sem infraestrutura de esgoto' : 'Ex: Necessita de reforma'}/>
                  {negItems.length>1 && <button type="button" onClick={()=>setNegItems(p=>p.filter((_,j)=>j!==i))} className="label-muted hover:text-red-400 text-lg">×</button>}
                </div>
              ))}
              {negItems.length < 3 && <button type="button" onClick={() => setNegItems(p=>[...p,''])} className="text-xs text-blue-500 hover:underline">+ Adicionar</button>}
            </div>
          </div>
        </section>

        {/* ── Perfil do Comprador ── */}
        <section className="card p-6 space-y-3">
          <p className="section-title">{isTer ? 'Perfil do Comprador / Investidor' : 'Perfil do Comprador'}</p>
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
