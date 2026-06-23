// src/pages/Realinhamento.jsx
import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { Field, Input, NVRow, VRow } from '../components/FormFields.jsx'
import { VisitaRow, PropostaRow, AcaoRow } from '../components/FormFieldsRealinhamento.jsx'
import { buildHTMLRealinhamento } from '../lib/buildHTMLRealinhamento.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDark } from '../hooks/useTheme.js'

const MAX_NV = 8
const MAX_V  = 6

export default function Realinhamento() {
  const dark = useDark()
  const { user } = useAuth()
  const formRef = useRef(null)

  // ── Contadores de linhas dinâmicas ──
  const [nvCount,       setNvCount]       = useState(2)
  const [vCount,        setVCount]        = useState(1)
  const [visitaCount,   setVisitaCount]   = useState(1)
  const [propostaCount, setPropostaCount] = useState(1)
  const [acaoCount,     setAcaoCount]     = useState(3)

  // ── Status de extração de concorrentes ──
  const [extractingNV, setExtractingNV] = useState({})
  const [extractingV,  setExtractingV]  = useState({})
  const [notFoundNV,   setNotFoundNV]   = useState({})
  const [notFoundV,    setNotFoundV]    = useState({})

  // ── Precificação ──
  const [precStatus,   setPrecStatus]   = useState(null)
  const [precData,     setPrecData]     = useState(null)
  const [precAdj,      setPrecAdj]      = useState({ competitivo: 0, mercado: 0, otimista: 0 })
  const [dataChanged,  setDataChanged]  = useState(false)
  const [selic,        setSelic]        = useState('14,50%')

  // ── Submit ──
  const [status,   setStatus]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Importar de apresentação V2 existente
  const [importId,  setImportId]  = useState('')
  const [importing, setImporting] = useState(false)

  // tema
  const card  = dark ? 'bg-gray-900 border border-gray-700/50' : 'bg-white border border-gray-100'
  const tmute = dark ? 'text-gray-500' : 'text-gray-400'
  const ttl   = dark ? 'text-white' : 'text-gray-900'

  // Busca Selic
  useEffect(() => {
    supabase.functions.invoke('gerar-apresentacao', { body: { data: { _selic: true } } })
      .then(({ data }) => { if (data?.selic) setSelic(data.selic) })
      .catch(() => {})
  }, [])

  // ── Helpers DOM ──────────────────────────────────────────────────
  const gv = (name) => {
    const els = document.getElementsByName(name)
    if (els.length > 0) return (els[0].value || '').trim()
    return ''
  }
  const sv = (name, val) => {
    const els = document.getElementsByName(name)
    if (els.length && val !== undefined && val !== null) els[0].value = val
  }

  // ── Importar dados de apresentação V2 ───────────────────────────
  const handleImport = async () => {
    if (!importId.trim()) return
    setImporting(true)
    try {
      const { data, error } = await supabase
        .from('apresentacoes')
        .select('raw_data, cliente, residencial, bairro')
        .eq('id', importId.trim())
        .single()
      if (error || !data) throw new Error('Apresentação não encontrada.')
      const d = data.raw_data || {}

      setTimeout(() => {
        sv('p_nome',        d.nome        || data.cliente)
        sv('p_residencial', d.residencial || data.residencial)
        sv('p_endereco',    d.endereco)
        sv('p_bairro',      d.bairro      || data.bairro)
        sv('p_quartos',     d.quartos)
        sv('p_vagas',       d.vagas)
        sv('p_area',        d.area)
        sv('p_andar',       d.andar)
        sv('selic',         d.selic || selic)

        if (d.nv?.length) {
          setNvCount(d.nv.length)
          d.nv.forEach((r, i) => {
            setTimeout(() => {
              sv(`nv_n_${i+1}`,    r.n)
              sv(`nv_a_${i+1}`,    r.a)
              sv(`nv_c_${i+1}`,    r.c)
              sv(`nv_v_${i+1}`,    r.v)
              sv(`nv_d_${i+1}`,    r.d)
              sv(`lk_${i+1}`,      r.url)
              sv(`nv_obs_${i+1}`,  r.obs)
              sv(`nv_q_${i+1}`,    r.quartos)
              sv(`nv_vagas_${i+1}`,r.vagas)
              sv(`nv_cons_${i+1}`, r.conservacao)
              // categoria (radio)
              if (r.cat) {
                const radios = document.getElementsByName(`nv_cat_${i+1}`)
                for (const rb of radios) { if (rb.value === r.cat) rb.checked = true }
              }
            }, 200)
          })
        }
        if (d.v?.length) {
          setVCount(d.v.length)
          d.v.forEach((r, i) => {
            setTimeout(() => {
              sv(`v_n_${i+1}`,     r.n)
              sv(`v_a_${i+1}`,     r.a)
              sv(`v_c_${i+1}`,     r.c)
              sv(`v_v_${i+1}`,     r.v)
              sv(`v_obs_${i+1}`,   r.obs)
              sv(`v_q_${i+1}`,     r.quartos)
              sv(`v_vagas_${i+1}`, r.vagas)
              sv(`v_cons_${i+1}`,  r.conservacao)
            }, 200)
          })
        }
        if (d.prec) { setPrecData(d.prec); setPrecStatus('done') }
        if (d.precAdj) setPrecAdj(d.precAdj)
      }, 100)

      alert('✓ Dados importados com sucesso! Preencha as informações da campanha (visitas, propostas, ações) e gere o realinhamento.')
    } catch (err) {
      alert('Erro ao importar: ' + err.message)
    }
    setImporting(false)
  }

  // ── Extração IA para concorrentes ────────────────────────────────
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
        body: { data: { _extract: true, type, content, tipo: 'Apartamento' } }
      })

      if (!error && data?.extracted) {
        const ex = data.extracted
        const nf = {}
        if (type === 'nv') {
          if (ex.nome)    setVal(`nv_n_${idx}`, ex.nome);    else nf.nome = true
          if (ex.area)    setVal(`nv_a_${idx}`, ex.area);    else nf.area = true
          if (ex.valor)   setVal(`nv_v_${idx}`, ex.valor);   else nf.valor = true
          if (ex.dias)    setVal(`nv_d_${idx}`, ex.dias);    else nf.dias = true
          if (ex.quartos) setVal(`nv_q_${idx}`, ex.quartos)
          if (ex.vagas !== undefined && ex.vagas !== '') setVal(`nv_vagas_${idx}`, ex.vagas)
          if (ex.conservacao) setSel(`nv_cons_${idx}`, ex.conservacao)
          if (ex.obs)     setVal(`nv_obs_${idx}`, ex.obs)
        } else {
          if (ex.nome)    setVal(`v_n_${idx}`,  ex.nome);    else nf.nome = true
          if (ex.area)    setVal(`v_a_${idx}`,  ex.area);    else nf.area = true
          if (ex.valor)   setVal(`v_v_${idx}`,  ex.valor);   else nf.valor = true
          if (ex.quartos) setVal(`v_q_${idx}`,  ex.quartos)
          if (ex.vagas !== undefined && ex.vagas !== '') setVal(`v_vagas_${idx}`, ex.vagas)
          if (ex.conservacao) setSel(`v_cons_${idx}`, ex.conservacao)
          if (ex.obs)     setVal(`v_obs_${idx}`, ex.obs)
        }
        if (Object.keys(nf).length > 0) setNotFound(prev => ({ ...prev, [idx]: nf }))
      } else if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      alert('Extração falhou: ' + err.message)
    }
    setExtracting(prev => ({ ...prev, [idx]: false }))
  }

  // ── parseCarac igual ao Gerador ──────────────────────────────────
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
    if (/alto\s*padr[ãa]o|luxo/.test(s))  conservacao = 'Alto padrão'
    else if (/reform/.test(s))             conservacao = 'Reformado'
    else if (/parcial/.test(s))            conservacao = 'Parcialmente reformado'
    else if (/precisa|deteriorad/.test(s)) conservacao = 'Precisa de reforma'
    else if (/original|sem\s*reforma/.test(s)) conservacao = 'Original'
    return { quartos, vagas, conservacao, obs: '' }
  }

  // ── collectData ──────────────────────────────────────────────────
  const collectData = () => {
    const d = {
      nome:        gv('p_nome')        || 'Proprietário',
      corretor:    gv('p_corretor')    || 'Corretor Liberty',
      residencial: gv('p_residencial') || 'Residencial',
      endereco:    gv('p_endereco')    || '',
      bairro:      gv('p_bairro')      || '',
      quartos:     gv('p_quartos')     || '—',
      vagas:       gv('p_vagas')       || '—',
      area:        gv('p_area')        || '—',
      andar:       gv('p_andar')       || '—',
      selic:       gv('selic')         || selic,
      data_inicio:    gv('data_inicio'),
      preco_original: gv('preco_original'),
      nv: [], v: [], visitas: [], propostas: [], acoes: [],
    }

    // NVs
    for (let i = 1; i <= nvCount; i++) {
      const n   = gv(`nv_n_${i}`)
      const a   = gv(`nv_a_${i}`)
      const rawC = gv(`nv_c_${i}`)
      const parsed = parseCarac(rawC)
      const q   = gv(`nv_q_${i}`)     || parsed.quartos
      const vag = gv(`nv_vagas_${i}`) || parsed.vagas
      const con = gv(`nv_cons_${i}`)  || parsed.conservacao
      const v   = gv(`nv_v_${i}`)
      const dd  = gv(`nv_d_${i}`)
      const obs = gv(`nv_obs_${i}`)   || parsed.obs
      const url = gv(`lk_${i}`)
      const cat = (function() {
        const els = document.getElementsByName(`nv_cat_${i}`)
        for (const e of els) { if (e.checked) return e.value }
        return 'local'
      })()
      if (a || v || n) d.nv.push({ n, a, quartos: q, vagas: vag, conservacao: con, c: rawC, v, d: dd, obs, url, cat })
    }

    // Vs
    for (let i = 1; i <= vCount; i++) {
      const n   = gv(`v_n_${i}`)
      const a   = gv(`v_a_${i}`)
      const rawC = gv(`v_c_${i}`)
      const parsed = parseCarac(rawC)
      const q   = gv(`v_q_${i}`)     || parsed.quartos
      const vag = gv(`v_vagas_${i}`) || parsed.vagas
      const con = gv(`v_cons_${i}`)  || parsed.conservacao
      const v   = gv(`v_v_${i}`)
      const obs = gv(`v_obs_${i}`)   || parsed.obs
      if (a || v || n) d.v.push({ n, a, quartos: q, vagas: vag, conservacao: con, c: rawC, v, obs })
    }

    // Visitas
    for (let i = 1; i <= visitaCount; i++) {
      const data     = gv(`vis_data_${i}`)
      const qtd      = gv(`vis_qtd_${i}`)
      const feedback = gv(`vis_feedback_${i}`)
      if (data || qtd || feedback) d.visitas.push({ data, qtd, feedback })
    }

    // Propostas
    for (let i = 1; i <= propostaCount; i++) {
      const data  = gv(`prop_data_${i}`)
      const valor = gv(`prop_valor_${i}`)
      if (data || valor) d.propostas.push({ data, valor })
    }

    // Ações
    for (let i = 1; i <= acaoCount; i++) {
      const a = gv(`acao_${i}`)
      if (a) d.acoes.push(a)
    }

    if (precData) d.prec = precData
    if (precAdj)  d.precAdj = precAdj

    return d
  }

  // ── Precificar ───────────────────────────────────────────────────
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
        body: { data: { _precificar: true, imovel: d, nv: d.nv, v: d.v } }
      })
      if (error) throw new Error(error.message)
      if (data?.error) throw new Error(data.error)
      const p = data.precificacao
      setPrecData(p)
      setPrecStatus('done')
    } catch (err) {
      console.error('Precificação:', err.message)
      setPrecStatus('error')
    }
  }

  // ── Gerar apresentação ───────────────────────────────────────────
  const handleGerar = async (e) => {
    e.preventDefault()
    setStatus('loading'); setErrorMsg('')
    try {
      const rawData = collectData()

      // Aplicar ajustes manuais de precificação
      let finalData = rawData
      if (precData && precAdj) {
        const applyAdj = (faixa, key) => {
          if (!faixa) return faixa
          const adj = (precAdj && precAdj[key]) || 0
          if (adj === 0) return faixa
          const areaNum = rawData.area ? parseFloat((rawData.area||'').replace(/[^0-9.,]/g,'').replace(',','.')) : 0
          const totalAdj = Math.round(faixa.total * (1 + adj / 100) / 1000) * 1000
          const vm2Adj   = areaNum > 0 ? Math.round(totalAdj / areaNum) : faixa.vm2
          return {
            ...faixa,
            total:    totalAdj,
            vm2:      vm2Adj,
            totalFmt: 'R\u00a0' + totalAdj.toLocaleString('pt-BR'),
            vm2Fmt:   'R\u00a0' + vm2Adj.toLocaleString('pt-BR') + '/m²',
          }
        }
        finalData = {
          ...rawData,
          prec: {
            ...precData,
            competitivo: applyAdj(precData.competitivo, 'competitivo'),
            mercado:     applyAdj(precData.mercado,     'mercado'),
            otimista:    applyAdj(precData.otimista,    'otimista'),
          }
        }
      }

      const html = buildHTMLRealinhamento(finalData)

      // Salvar no Supabase
      const { data: saved, error: saveErr } = await supabase
        .from('apresentacoes')
        .insert({
          user_id:     user.id,
          cliente:     finalData.nome,
          residencial: finalData.residencial,
          bairro:      finalData.bairro,
          html,
          raw_data:    finalData,
          tipo:        'realinhamento',
          draft:       false,
        })
        .select('id')
        .single()

      if (saveErr) console.warn('Supabase save:', saveErr.message)

      // Download automático
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url  = URL.createObjectURL(blob)
      const a2   = document.createElement('a')
      a2.href    = url
      a2.download = `realinhamento-${(finalData.residencial||'imovel').toLowerCase().replace(/\s+/g,'-')}.html`
      a2.click()
      URL.revokeObjectURL(url)

      setStatus('done')
    } catch (err) {
      console.error('Gerar:', err)
      setErrorMsg(err.message || 'Erro ao gerar apresentação.')
      setStatus('error')
    }
  }

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className={`max-w-3xl mx-auto px-4 py-8 ${dark ? 'text-white' : 'text-gray-900'}`}>

      {/* Cabeçalho */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg,#e67e22,#c0392b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2,14 7,8 11,11 16,4"/>
              <path d="M13 4h3v3"/>
            </svg>
          </div>
          <h1 className={`text-2xl font-bold ${ttl}`}>Realinhamento de Preço</h1>
        </div>
        <p className={`text-sm ${tmute}`}>
          Apresentação para convencer o cliente a ajustar o preço com base em dados reais da campanha.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleGerar} className="space-y-6">

        {/* ── Importar de V2 ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <div>
            <p className="font-semibold text-sm mb-1">Importar dados de apresentação V2</p>
            <p className={`text-xs ${tmute}`}>Opcional — preenche automaticamente os campos do imóvel e concorrentes.</p>
          </div>
          <div className="flex gap-2">
            <Input
              value={importId}
              onChange={e => setImportId(e.target.value)}
              placeholder="ID da apresentação V2 (cole aqui)"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={importing || !importId.trim()}
              style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                background: importing ? '#e5e7eb' : '#1266CD', color: importing ? '#9ca3af' : '#fff',
                border: 'none', cursor: importing ? 'not-allowed' : 'pointer', flexShrink: 0,
              }}
            >
              {importing ? 'Importando…' : 'Importar'}
            </button>
          </div>
          <p className={`text-xs ${tmute}`}>
            Onde encontrar o ID: abra o histórico, clique na apresentação e copie o ID da URL (<code>?edit=</code>…).
          </p>
        </section>

        {/* ── Dados do imóvel ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <p className="font-semibold text-sm">Dados do imóvel</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome do proprietário">
              <Input name="p_nome" placeholder="Ex: Carlos Mendes" />
            </Field>
            <Field label="Seu nome (corretor)">
              <Input name="p_corretor" placeholder="Ex: Lucas Augusto" />
            </Field>
          </div>
          <Field label="Nome do residencial / empreendimento">
            <Input name="p_residencial" placeholder="Ex: Residencial Park Towers" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bairro / Localização">
              <Input name="p_bairro" placeholder="Ex: Asa Norte" />
            </Field>
            <Field label="Endereço">
              <Input name="p_endereco" placeholder="Ex: SHLN Bloco B, Apto 204" />
            </Field>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Quartos">
              <Input name="p_quartos" placeholder="Ex: 3" />
            </Field>
            <Field label="Vagas">
              <Input name="p_vagas" placeholder="Ex: 2" />
            </Field>
            <Field label="Área (m²)">
              <Input name="p_area" placeholder="Ex: 120" />
            </Field>
            <Field label="Andar">
              <Input name="p_andar" placeholder="Ex: 8º" />
            </Field>
          </div>
        </section>

        {/* ── Campanha ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <p className="font-semibold text-sm">Dados da campanha</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data de início da campanha">
              <input
                type="date"
                name="data_inicio"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-liberty-blue focus:border-transparent transition"
              />
            </Field>
            <Field label="Preço original anunciado">
              <Input name="preco_original" placeholder="Ex: R$ 890.000" />
            </Field>
          </div>
          <Field label="Taxa Selic atual (para custo de oportunidade)">
            <Input name="selic" defaultValue={selic} placeholder="Ex: 14,50%" />
          </Field>
        </section>

        {/* ── Histórico de visitas ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-0">Histórico de visitas</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Texto ou transcrição do áudio do WhatsApp</p>
            </div>
            <button
              type="button"
              onClick={() => setVisitaCount(n => n + 1)}
              className="text-xs text-blue-500 font-medium hover:underline"
            >
              + Adicionar
            </button>
          </div>
          {Array.from({ length: visitaCount }, (_, i) => (
            <VisitaRow
              key={i}
              idx={i + 1}
              dark={dark}
              onRemove={() => setVisitaCount(n => Math.max(1, n - 1))}
            />
          ))}
        </section>

        {/* ── Propostas recebidas ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-0">Propostas recebidas</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Todas as ofertas que chegaram, aceitas ou não</p>
            </div>
            <button
              type="button"
              onClick={() => setPropostaCount(n => n + 1)}
              className="text-xs text-blue-500 font-medium hover:underline"
            >
              + Adicionar
            </button>
          </div>
          {Array.from({ length: propostaCount }, (_, i) => (
            <PropostaRow
              key={i}
              idx={i + 1}
              dark={dark}
              onRemove={() => setPropostaCount(n => Math.max(1, n - 1))}
            />
          ))}
        </section>

        {/* ── Ações realizadas ── */}
        <section className={`${card} rounded-2xl p-6 space-y-3`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-0">Ações realizadas</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Portais, fotos, vídeos, tráfego pago, placa, etc.</p>
            </div>
            <button
              type="button"
              onClick={() => setAcaoCount(n => n + 1)}
              className="text-xs text-blue-500 font-medium hover:underline"
            >
              + Adicionar
            </button>
          </div>
          {Array.from({ length: acaoCount }, (_, i) => (
            <AcaoRow
              key={i}
              idx={i + 1}
              dark={dark}
              onRemove={() => setAcaoCount(n => Math.max(1, n - 1))}
            />
          ))}
        </section>

        {/* ── Precificação ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-0">Nova faixa de preço</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Calcule com base nos concorrentes abaixo</p>
            </div>
            <button
              type="button"
              onClick={handlePrecificar}
              disabled={precStatus === 'loading'}
              style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                background: precStatus === 'loading' ? '#e5e7eb' : '#1266CD',
                color: precStatus === 'loading' ? '#9ca3af' : '#fff',
                border: 'none', cursor: precStatus === 'loading' ? 'not-allowed' : 'pointer',
              }}
            >
              {precStatus === 'loading' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  Calculando…
                </span>
              ) : '◆ Precificar'}
            </button>
          </div>

          {precStatus === 'done' && precData && (
            <div className="space-y-3">
              {dataChanged && (
                <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#FFFBEB', border: '1px solid rgba(245,158,11,.3)', fontSize: '12px', color: '#d97706' }}>
                  ⚠️ Dados alterados — recalcule para atualizar a precificação.
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { key: 'competitivo', label: 'Competitivo', color: '#27ae60' },
                  { key: 'mercado',     label: 'Mercado',     color: '#1266CD' },
                  { key: 'otimista',    label: 'Otimista',    color: '#e67e22' },
                ].map(({ key, label, color }) => {
                  const faixa = precData[key]
                  if (!faixa) return null
                  const adj = precAdj[key] || 0
                  const totalAdj = adj !== 0 ? Math.round(faixa.total * (1 + adj / 100) / 1000) * 1000 : faixa.total
                  const totalFmt = 'R\u00a0' + totalAdj.toLocaleString('pt-BR')
                  const isRec = precData.recomendacao === key
                  return (
                    <div key={key} style={{
                      padding: '14px', borderRadius: '12px',
                      background: dark ? `${color}15` : `${color}10`,
                      border: `${isRec ? '2px' : '1px'} solid ${color}${isRec ? '60' : '30'}`,
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        {label}{isRec && <span style={{ marginLeft: '4px', fontSize: '9px', opacity: .7 }}>✦ Rec.</span>}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color, marginBottom: '4px' }}>{totalFmt}</div>
                      {adj !== 0 && (
                        <div style={{ fontSize: '10px', color: dark ? 'rgba(255,255,255,.4)' : '#9ca3af', marginBottom: '4px' }}>
                          {adj > 0 ? `+${adj}%` : `${adj}%`} sobre base{' '}
                          <button type="button" onClick={() => setPrecAdj(prev => ({ ...prev, [key]: 0 }))}
                            style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', padding: 0 }}>
                            (zerar)
                          </button>
                        </div>
                      )}
                      {/* Sliders de ajuste */}
                      <input type="range" min="-15" max="15" step="1" value={adj}
                        onChange={e => { setPrecAdj(prev => ({ ...prev, [key]: Number(e.target.value) })); setDataChanged(false) }}
                        style={{ width: '100%', marginTop: '8px', accentColor: color }}
                      />
                    </div>
                  )
                })}
              </div>
              <div style={{ padding: '12px 14px', borderRadius: '10px', background: dark ? 'rgba(255,255,255,.04)' : '#f9fafb', border: dark ? '1px solid rgba(255,255,255,.08)' : '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1266CD', marginBottom: '6px' }}>Análise da IA</p>
                <p style={{ fontSize: '13px', color: dark ? 'rgba(255,255,255,.7)' : '#374151', lineHeight: '1.6', margin: 0 }}>{precData.justificativa}</p>
              </div>
            </div>
          )}

          {precStatus === 'error' && (
            <p style={{ fontSize: '12px', color: '#ef4444' }}>Erro ao calcular. Verifique se os campos de área e valor dos concorrentes estão preenchidos.</p>
          )}
        </section>

        {/* ── Concorrentes ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-0">Concorrentes ativos</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Link + conteúdo colado → IA extrai os dados</p>
            </div>
            {nvCount < MAX_NV && (
              <button type="button" onClick={() => { setNvCount(n => n + 1); if (precData) setDataChanged(true) }}
                className="text-xs text-blue-500 font-medium hover:underline">+ Adicionar</button>
            )}
          </div>
          {Array.from({ length: nvCount }, (_, i) => (
            <NVRow key={i} idx={i + 1}
              onRemove={() => { setNvCount(n => Math.max(1, n - 1)); if (precData) setDataChanged(true) }}
              onExtract={(idx) => extractFromContent('nv', idx)}
              extracting={!!extractingNV[i + 1]}
              tipoImovel="Apartamento"
              notFound={notFoundNV[i + 1] || {}}
            />
          ))}
          <p className={`text-xs ${tmute} text-right`}>{nvCount}/{MAX_NV}</p>
        </section>

        {/* ── Vendidos ── */}
        <section className={`${card} rounded-2xl p-6 space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-0">Histórico de vendas reais</p>
              <p className={`text-xs ${tmute} mt-0.5`}>Conteúdo colado → IA extrai os dados</p>
            </div>
            {vCount < MAX_V && (
              <button type="button" onClick={() => { setVCount(n => n + 1); if (precData) setDataChanged(true) }}
                className="text-xs text-blue-500 font-medium hover:underline">+ Adicionar</button>
            )}
          </div>
          {Array.from({ length: vCount }, (_, i) => (
            <VRow key={i} idx={i + 1}
              onRemove={() => { setVCount(n => Math.max(1, n - 1)); if (precData) setDataChanged(true) }}
              onExtract={(idx) => extractFromContent('v', idx)}
              extracting={!!extractingV[i + 1]}
              tipoImovel="Apartamento"
              notFound={notFoundV[i + 1] || {}}
            />
          ))}
          <p className={`text-xs ${tmute} text-right`}>{vCount}/{MAX_V}</p>
        </section>

        {/* ── Botão ── */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
              background: status === 'loading' ? '#e5e7eb' : 'linear-gradient(135deg,#e67e22,#c0392b)',
              color: status === 'loading' ? '#9ca3af' : '#fff',
              border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {status === 'loading'
              ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />Gerando…</>
              : '✦ Gerar Realinhamento'}
          </button>
          {status === 'done'  && <span style={{ fontSize: '13px', color: '#27ae60', fontWeight: '600' }}>✓ Gerado e baixado!</span>}
          {status === 'error' && <span style={{ fontSize: '13px', color: '#ef4444' }}>{errorMsg}</span>}
        </div>

      </form>
    </div>
  )
}
