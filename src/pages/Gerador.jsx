import React, { useState, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import { Field, Input, NVRow, VRow, PerfilRow } from '../components/FormFields.jsx'
import { buildHTML } from '../lib/buildHTML.js'
import { useAuth } from '../hooks/useAuth.js'

export default function Gerador() {
  const { user } = useAuth()
  const formRef = useRef(null)
  const [nvCount,  setNvCount]  = useState(2)
  const [vCount,   setVCount]   = useState(1)
  const [posItems, setPosItems] = useState(['', ''])
  const [negItems, setNegItems] = useState([''])
  const [status,   setStatus]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const gv = (name) => { const el = formRef.current?.elements[name]; return el ? el.value.trim() : '' }

  const collectData = () => {
    const d = {
      nome: gv('p_nome')||'Proprietário', corretor: gv('p_corretor')||'Corretor Liberty',
      residencial: gv('p_residencial')||'Residencial', endereco: gv('p_endereco')||'',
      bairro: gv('p_bairro')||'', quartos: gv('p_quartos')||'—', vagas: gv('p_vagas')||'—',
      area: gv('p_area')||'—', andar: gv('p_andar')||'—', selic: gv('selic')||'14,50%',
      vl_div: gv('vl_div')||'—', vl_fec: gv('vl_fec')||'—', vl_med: gv('vl_med')||'—',
      nv: [], v: [],
      pos: posItems.filter(Boolean),
      neg: negItems.filter(Boolean),
      comps: [1,2,3,4].map(i => ({ t: gv(`c${i}t`), d: '' })).filter(c => c.t),
    }
    for (let i = 1; i <= nvCount; i++) {
      const n=gv(`nv_n_${i}`),a=gv(`nv_a_${i}`),c=gv(`nv_c_${i}`),v=gv(`nv_v_${i}`),dd=gv(`nv_d_${i}`),url=gv(`lk_${i}`)
      if (a||c||v) d.nv.push({n,a,c,v,d:dd,url})
    }
    for (let i = 1; i <= vCount; i++) {
      const n=gv(`v_n_${i}`),a=gv(`v_a_${i}`),c=gv(`v_c_${i}`),v=gv(`v_v_${i}`)
      if (a||c||v||n) d.v.push({n,a,c,v})
    }
    return d
  }

  const handleGerar = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const rawData = collectData()

      // Tenta enriquecer com IA — usa rawData como fallback se falhar
      let enrichedData = rawData
      try {
        const { data, error } = await supabase.functions.invoke('gerar-apresentacao', { body: { data: rawData } })
        if (!error && data?.enriched) {
          enrichedData = data.enriched
        } else if (error) {
          console.warn('Edge function error (usando dados sem IA):', error.message)
        }
      } catch (edgeErr) {
        console.warn('Edge function indisponível (usando dados sem IA):', edgeErr.message)
      }

      // Garante que os campos obrigatórios existem antes do buildHTML
      if (!enrichedData.posEnriched) enrichedData.posEnriched = (enrichedData.pos||[]).map(t=>({t,d:''}))
      if (!enrichedData.negEnriched) enrichedData.negEnriched = (enrichedData.neg||[]).map(t=>({t,d:''}))
      if (!enrichedData.comps || !enrichedData.comps.length) {
        enrichedData.comps = [1,2,3,4].map(i=>({t:gv(`c${i}t`),d:''})).filter(c=>c.t)
      }

      const html = buildHTML(enrichedData)

      // Salva no banco (não bloqueia o download se falhar)
      supabase.from('apresentacoes').insert({
        user_id: user.id,
        cliente: rawData.nome,
        residencial: rawData.residencial,
        bairro: rawData.bairro,
        html
      }).then(({ error: saveError }) => {
        if (saveError) console.warn('Histórico não salvo:', saveError.message)
      })

      // Download imediato — não espera o banco
      const blob = new Blob([html], { type: 'text/html' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = (rawData.residencial||'Liberty').replace(/[^a-zA-Z0-9\s]/g,'').trim().replace(/\s+/g,'_') + '.html'
      a.click()
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Erro ao gerar apresentação.')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gerar Apresentação</h1>
        <p className="text-sm text-gray-400 mt-1">Preencha os dados. A IA gera as descrições automaticamente.</p>
      </div>
      <form ref={formRef} onSubmit={handleGerar} className="space-y-6">

        <section className="card p-6 space-y-4">
          <p className="section-title">Identificação</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nome do cliente"><Input name="p_nome" placeholder="Ex: Guilherme e Dilceia" /></Field>
            <Field label="Corretor"><Input name="p_corretor" placeholder="Corretor Liberty" defaultValue="Corretor Liberty" /></Field>
          </div>
          <Field label="Nome do imóvel / Condomínio"><Input name="p_residencial" placeholder="Ex: SQN 402, Condomínio Mont Blanc" /></Field>
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
            <Field label="Selic"><Input name="selic" placeholder="Ex: 14,50%" defaultValue="14,50%" /></Field>
            <Field label="Valor divulgação"><Input name="vl_div" placeholder="Ex: R$ 840.000" /></Field>
            <Field label="Expectativa fechamento"><Input name="vl_fec" placeholder="Ex: R$ 825.000" /></Field>
          </div>
          <Field label="Referência de mercado"><Input name="vl_med" placeholder="Ex: R$ 850.000" /></Field>
        </section>

        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-title mb-0">Concorrentes ativos (não vendidos)</p>
            {nvCount < 5 && <button type="button" onClick={() => setNvCount(n=>n+1)} className="text-xs text-blue-600 font-medium hover:underline">+ Adicionar</button>}
          </div>
          {Array.from({length:nvCount},(_,i) => <NVRow key={i} idx={i+1} onRemove={() => setNvCount(n=>Math.max(1,n-1))} />)}
        </section>

        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-title mb-0">Histórico de vendas reais</p>
            {vCount < 3 && <button type="button" onClick={() => setVCount(n=>n+1)} className="text-xs text-blue-600 font-medium hover:underline">+ Adicionar</button>}
          </div>
          {Array.from({length:vCount},(_,i) => <VRow key={i} idx={i+1} onRemove={() => setVCount(n=>Math.max(1,n-1))} />)}
        </section>

        <section className="card p-6 space-y-4">
          <p className="section-title">Análise Crítica</p>
          <p className="text-xs text-gray-400 -mt-2">Só o título — a IA gera a descrição estratégica</p>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Pontos Positivos</p>
            <div className="space-y-2">
              {posItems.map((v,i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v} onChange={e=>{const a=[...posItems];a[i]=e.target.value;setPosItems(a)}}
                    className="input-base flex-1" placeholder="Ex: Reformado, Vazado, Andar alto"/>
                  {posItems.length>1 && <button type="button" onClick={()=>setPosItems(p=>p.filter((_,j)=>j!==i))} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>}
                </div>
              ))}
              {posItems.length < 4 && <button type="button" onClick={() => setPosItems(p=>[...p,''])} className="text-xs text-blue-600 font-medium hover:underline">+ Adicionar positivo</button>}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Pontos de Atenção</p>
            <div className="space-y-2">
              {negItems.map((v,i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={v} onChange={e=>{const a=[...negItems];a[i]=e.target.value;setNegItems(a)}}
                    className="input-base flex-1" placeholder="Ex: Necessita de reforma, Sem suíte"/>
                  {negItems.length>1 && <button type="button" onClick={()=>setNegItems(p=>p.filter((_,j)=>j!==i))} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>}
                </div>
              ))}
              {negItems.length < 3 && <button type="button" onClick={() => setNegItems(p=>[...p,''])} className="text-xs text-blue-600 font-medium hover:underline">+ Adicionar atenção</button>}
            </div>
          </div>
        </section>

        <section className="card p-6 space-y-3">
          <p className="section-title">Perfil do Comprador</p>
          <p className="text-xs text-gray-400 -mt-2">Só o título — a IA gera a descrição e a estratégia</p>
          {[1,2,3,4].map(i => <PerfilRow key={i} idx={i} />)}
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={status==='loading'}>
            {status==='loading' ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Gerando...</> : '✦ Gerar Apresentação'}
          </button>
          {status==='done'  && <span className="text-sm text-green-600 font-medium">✓ Gerada e baixada!</span>}
          {status==='error' && <span className="text-sm text-red-500">{errorMsg}</span>}
        </div>
      </form>
    </div>
  )
}
