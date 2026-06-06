import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAutoSave } from '../hooks/useAutoSave.js'

// ─── Configs por tipo ───────────────────────────────────────────────
const TIPOS = ['Apartamento','Casa','Cobertura','Kitnet / Studio','Comercial']

const SITUACOES = ['Vazio','Ocupado pelo dono','Locado']
const REFORMAS  = ['Não precisa','Precisa de reforma','Recentemente reformado']
const POSICOES  = ['Nascente','Poente','Norte','Sul','Nascente/Poente (Vazado)']

const DIFERENCIAIS_APT = [
  'Fachada reformada','Portaria 24h','Elevador moderno',
  'Salão de festas','Piscina','Academia','Playground',
  'Jardim cuidado','Interfone / Biometria','Garagem coberta',
  'Espaço gourmet','Vista livre',
]
const DIFERENCIAIS_CASA = [
  'Quintal / Jardim','Piscina','Churrasqueira','Área gourmet',
  'Garagem coberta','Portão eletrônico','Câmeras de segurança',
  'Gerador','Energia solar','Poço artesiano','Vista privilegiada',
]
const DIFERENCIAIS_COM = [
  'Estacionamento próprio','Recepção','Ar-condicionado central',
  'Copa / Cozinha','Sala de reunião','CFTV','Gerador','Elevador',
  'Acesso para PCD','Banheiros independentes','Fachada envidraçada',
]

const DOCS_APT = [
  { key:'matricula',     label:'Matrícula atualizada' },
  { key:'iptu_ok',       label:'IPTU em dia' },
  { key:'cond_ok',       label:'Condomínio em dia' },
  { key:'inventario',    label:'Sem inventário pendente' },
  { key:'financiamento', label:'Aceita financiamento' },
  { key:'quitado',       label:'Imóvel quitado' },
]
const DOCS_CASA = [
  { key:'matricula',     label:'Matrícula atualizada' },
  { key:'iptu_ok',       label:'IPTU em dia' },
  { key:'habitese',      label:'Habite-se emitido' },
  { key:'averbacao',     label:'Averbação de construção' },
  { key:'inventario',    label:'Sem inventário pendente' },
  { key:'financiamento', label:'Aceita financiamento' },
  { key:'quitado',       label:'Imóvel quitado' },
]
const DOCS_COM = [
  { key:'matricula',     label:'Matrícula atualizada' },
  { key:'iptu_ok',       label:'IPTU em dia' },
  { key:'habitese',      label:'Habite-se / Auto de Vistoria' },
  { key:'alvara',        label:'Alvará de funcionamento' },
  { key:'inventario',    label:'Sem inventário pendente' },
  { key:'financiamento', label:'Aceita financiamento' },
  { key:'quitado',       label:'Imóvel quitado' },
]

function getDiferenciais(tipo) {
  if (tipo === 'Casa') return DIFERENCIAIS_CASA
  if (tipo === 'Comercial') return DIFERENCIAIS_COM
  return DIFERENCIAIS_APT
}
function getDocs(tipo) {
  if (tipo === 'Casa') return DOCS_CASA
  if (tipo === 'Comercial') return DOCS_COM
  return DOCS_APT
}

// ─── Save indicator ──────────────────────────────────────────────────
function SaveBadge({ status, lastSaved }) {
  const cfg = {
    saving: { color:'#f59e0b', icon:'⟳', text:'Salvando...' },
    saved:  { color:'#22c55e', icon:'✓',  text:`Salvo ${lastSaved ? new Date(lastSaved).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) : ''}` },
    error:  { color:'#ef4444', icon:'!',  text:'Erro ao salvar' },
    idle:   { color:'transparent', icon:'', text:'' },
  }[status] || { color:'transparent', icon:'', text:'' }

  if (status === 'idle') return null
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', color:cfg.color, fontWeight:'500' }}>
      <span style={{ fontSize: status==='saving' ? '13px':'10px', animation: status==='saving' ? 'spin .8s linear infinite':'' }}>{cfg.icon}</span>
      {cfg.text}
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────
function Section({ title, icon, children, dark }) {
  return (
    <div style={{
      borderRadius:'16px', padding:'24px 20px',
      border: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #f0f0f0',
      background: dark ? 'rgba(255,255,255,0.03)' : '#fff',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px' }}>
        <span style={{ fontSize:'16px' }}>{icon}</span>
        <span style={{ fontSize:'11px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', color:'#1266CD' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

// ─── Field components ────────────────────────────────────────────────
function Lbl({ children, dark }) {
  return <label style={{ display:'block', fontSize:'10px', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'6px', color: dark?'rgba(255,255,255,0.3)':'#9ca3af' }}>{children}</label>
}

function Inp({ dark, ...props }) {
  const base = { width:'100%', boxSizing:'border-box', padding:'10px 14px', borderRadius:'10px', fontSize:'13px', outline:'none', transition:'border-color .2s, background .2s', border: dark?'1px solid rgba(255,255,255,0.1)':'1px solid #e5e7eb', background: dark?'rgba(255,255,255,0.05)':'#fafafa', color: dark?'#e8eaf0':'#111' }
  return (
    <input style={base} {...props}
      onFocus={e=>{e.target.style.borderColor='rgba(18,102,205,0.6)';e.target.style.background=dark?'rgba(18,102,205,0.08)':'#fff'}}
      onBlur={e=>{e.target.style.borderColor=dark?'rgba(255,255,255,0.1)':'#e5e7eb';e.target.style.background=dark?'rgba(255,255,255,0.05)':'#fafafa'}}
    />
  )
}

function Sel({ dark, children, ...props }) {
  return (
    <select style={{ width:'100%', boxSizing:'border-box', padding:'10px 14px', borderRadius:'10px', fontSize:'13px', outline:'none', cursor:'pointer', border: dark?'1px solid rgba(255,255,255,0.1)':'1px solid #e5e7eb', background: dark?'rgba(255,255,255,0.05)':'#fafafa', color: dark?'#e8eaf0':'#111' }} {...props}>
      {children}
    </select>
  )
}

function Check({ label, checked, onChange, dark }) {
  return (
    <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', padding:'8px 12px', borderRadius:'10px', border: dark?'1px solid rgba(255,255,255,0.07)':'1px solid #f3f4f6', background: checked?(dark?'rgba(18,102,205,0.15)':'rgba(18,102,205,0.05)'):'transparent', transition:'all .15s' }}>
      <div style={{ width:'18px', height:'18px', borderRadius:'5px', border: checked?'none':'2px solid '+(dark?'rgba(255,255,255,0.2)':'#d1d5db'), background: checked?'#1266CD':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
        {checked && <span style={{ color:'#fff', fontSize:'11px', fontWeight:'700' }}>✓</span>}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display:'none' }}/>
      <span style={{ fontSize:'13px', color: dark?(checked?'#93c5fd':'rgba(255,255,255,0.6)'):(checked?'#1d4ed8':'#374151'), fontWeight: checked?'500':'400' }}>{label}</span>
    </label>
  )
}

// ─── Main component ──────────────────────────────────────────────────
export default function V1Form() {
  const { id: urlId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const dark = document.body.classList.contains('dark')
  const [recordId, setRecordId] = useState(urlId || null)
  const [loading,  setLoading]  = useState(!!urlId)

  const [form, setForm] = useState({
    cliente:'', residencial:'', endereco:'', bairro:'',
    tipo_imovel:'Apartamento', area:'', terreno:'', quartos:'', vagas:'',
    andar:'', total_andares:'', posicao_solar:'', condominio:'', iptu:'',
    situacao:'Vazio', reforma:'Não precisa', observacoes:'',
  })
  const [pos,          setPos]          = useState([{ titulo:'' }])
  const [neg,          setNeg]          = useState([{ titulo:'' }])
  const [diferenciais, setDiferenciais] = useState([])
  const [docs,         setDocs]         = useState({})

  const { saveStatus, lastSaved, scheduleSave } = useAutoSave('visitas_v1', recordId, setRecordId, user?.id)

  useEffect(() => {
    if (!urlId) return
    supabase.from('visitas_v1').select('*').eq('id', urlId).single()
      .then(({ data }) => {
        if (!data) return
        setForm({
          cliente:data.cliente||'', residencial:data.residencial||'',
          endereco:data.endereco||'', bairro:data.bairro||'',
          tipo_imovel:data.tipo_imovel||'Apartamento', area:data.area||'',
          terreno:data.terreno||'', quartos:data.quartos||'', vagas:data.vagas||'',
          andar:data.andar||'', total_andares:data.total_andares||'',
          posicao_solar:data.posicao_solar||'', condominio:data.condominio||'',
          iptu:data.iptu||'', situacao:data.situacao||'Vazio',
          reforma:data.reforma||'Não precisa', observacoes:data.observacoes||'',
        })
        setPos(data.pos?.length ? data.pos : [{ titulo:'' }])
        setNeg(data.neg?.length ? data.neg : [{ titulo:'' }])
        setDiferenciais(data.diferenciais || [])
        setDocs(data.docs || {})
        setLoading(false)
      })
  }, [urlId])

  const trigger = useCallback((patch={}, pPos=pos, pNeg=neg, pDif=diferenciais, pDocs=docs) => {
    scheduleSave({ ...form, ...patch, pos:pPos, neg:pNeg, diferenciais:pDif, docs:pDocs })
  }, [form, pos, neg, diferenciais, docs, scheduleSave])

  const sf = (key, val) => {
    const next = { ...form, [key]:val }
    setForm(next)
    trigger(next)
  }

  const tipo = form.tipo_imovel
  const isCasa = tipo === 'Casa'
  const isCom  = tipo === 'Comercial'
  const isApt  = !isCasa && !isCom

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', paddingTop:'80px' }}>
      <div style={{ width:'28px', height:'28px', borderRadius:'50%', border:'3px solid #1266CD', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/>
    </div>
  )

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto', paddingBottom:'60px' }}>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px' }}>
        <div>
          <button onClick={() => navigate('/v1')} style={{ fontSize:'12px', color:'#1266CD', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:'8px', display:'flex', alignItems:'center', gap:'4px' }}>
            ← Todas as visitas
          </button>
          <h1 style={{ fontSize:'1.4rem', fontWeight:'700', margin:0 }}>
            {recordId ? (form.cliente || 'Visita sem nome') : 'Nova Visita V1'}
          </h1>
          <p style={{ fontSize:'12px', color:dark?'rgba(255,255,255,0.25)':'#9ca3af', marginTop:'4px' }}>
            Salva automaticamente a cada campo preenchido
          </p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'10px', flexShrink:0 }}>
          <SaveBadge status={saveStatus} lastSaved={lastSaved} />
          {recordId && (
            <button onClick={() => navigate(`/v2/${recordId}`)} style={{ padding:'9px 18px', background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'12px', fontWeight:'600', cursor:'pointer', boxShadow:'0 4px 14px rgba(18,102,205,0.4)', whiteSpace:'nowrap' }}>
              Usar na V2 →
            </button>
          )}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

        {/* Identificação */}
        <Section title="Identificação" icon="👤" dark={dark}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[['cliente','Nome do cliente','Ex: João e Maria'],['residencial','Condomínio / Edifício','Ex: Residencial Vera Brant'],['endereco','Endereço completo','Ex: SQN 311 Bloco A Apto 501'],['bairro','Bairro / Região','Ex: Asa Norte']].map(([k,l,p]) => (
              <div key={k}>
                <Lbl dark={dark}>{l}</Lbl>
                <Inp dark={dark} value={form[k]} placeholder={p} onChange={e=>sf(k,e.target.value)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Tipo + ficha técnica */}
        <Section title="Ficha Técnica" icon="📐" dark={dark}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <Lbl dark={dark}>Tipo de imóvel</Lbl>
              <Sel dark={dark} value={form.tipo_imovel} onChange={e=>sf('tipo_imovel',e.target.value)}>
                {TIPOS.map(t=><option key={t}>{t}</option>)}
              </Sel>
            </div>
            {!isCom && (
              <div>
                <Lbl dark={dark}>Posição solar</Lbl>
                <Sel dark={dark} value={form.posicao_solar} onChange={e=>sf('posicao_solar',e.target.value)}>
                  <option value="">Selecione...</option>
                  {POSICOES.map(p=><option key={p}>{p}</option>)}
                </Sel>
              </div>
            )}
            <div>
              <Lbl dark={dark}>{isCom ? 'Área total (m²)' : 'Área privativa (m²)'}</Lbl>
              <Inp dark={dark} value={form.area} placeholder="Ex: 125" onChange={e=>sf('area',e.target.value)} />
            </div>
            {isCasa && (
              <div>
                <Lbl dark={dark}>Área do terreno (m²)</Lbl>
                <Inp dark={dark} value={form.terreno} placeholder="Ex: 360" onChange={e=>sf('terreno',e.target.value)} />
              </div>
            )}
            {!isCom && (
              <div>
                <Lbl dark={dark}>Quartos</Lbl>
                <Inp dark={dark} value={form.quartos} placeholder="Ex: 3" onChange={e=>sf('quartos',e.target.value)} />
              </div>
            )}
            <div>
              <Lbl dark={dark}>{isCasa?'Vagas na garagem':'Vagas'}</Lbl>
              <Inp dark={dark} value={form.vagas} placeholder="Ex: 2" onChange={e=>sf('vagas',e.target.value)} />
            </div>
            {isApt && (
              <>
                <div>
                  <Lbl dark={dark}>Andar</Lbl>
                  <Inp dark={dark} value={form.andar} placeholder="Ex: 5°" onChange={e=>sf('andar',e.target.value)} />
                </div>
                <div>
                  <Lbl dark={dark}>Total de andares</Lbl>
                  <Inp dark={dark} value={form.total_andares} placeholder="Ex: 6" onChange={e=>sf('total_andares',e.target.value)} />
                </div>
              </>
            )}
            {isCom && (
              <div>
                <Lbl dark={dark}>Andar / Localização</Lbl>
                <Inp dark={dark} value={form.andar} placeholder="Ex: Térreo, 2° andar" onChange={e=>sf('andar',e.target.value)} />
              </div>
            )}
            {!isCasa && (
              <div>
                <Lbl dark={dark}>Condomínio R$/mês</Lbl>
                <Inp dark={dark} value={form.condominio} placeholder="Ex: 1.141" onChange={e=>sf('condominio',e.target.value)} />
              </div>
            )}
            <div>
              <Lbl dark={dark}>IPTU R$/ano</Lbl>
              <Inp dark={dark} value={form.iptu} placeholder="Ex: 2.739" onChange={e=>sf('iptu',e.target.value)} />
            </div>
          </div>
        </Section>

        {/* Situação */}
        <Section title="Situação" icon="🔑" dark={dark}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <Lbl dark={dark}>Situação atual</Lbl>
              <Sel dark={dark} value={form.situacao} onChange={e=>sf('situacao',e.target.value)}>
                {SITUACOES.map(s=><option key={s}>{s}</option>)}
              </Sel>
            </div>
            <div>
              <Lbl dark={dark}>Necessidade de reforma</Lbl>
              <Sel dark={dark} value={form.reforma} onChange={e=>sf('reforma',e.target.value)}>
                {REFORMAS.map(r=><option key={r}>{r}</option>)}
              </Sel>
            </div>
          </div>
        </Section>

        {/* Pontos positivos */}
        <Section title="Pontos Positivos" icon="✅" dark={dark}>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {pos.map((p,i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <Inp dark={dark} value={p.titulo} style={{ flex:1 }}
                  placeholder="Ex: Reformado, Vazado, Andar alto, Vista livre..."
                  onChange={e=>{const a=[...pos];a[i]={...a[i],titulo:e.target.value};setPos(a);trigger({},a,neg,diferenciais,docs)}}
                />
                {pos.length > 1 && (
                  <button onClick={()=>{const a=pos.filter((_,j)=>j!==i);setPos(a);trigger({},a,neg,diferenciais,docs)}}
                    style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'18px', padding:'0 4px' }}>×</button>
                )}
              </div>
            ))}
            {pos.length < 6 && (
              <button onClick={()=>{const a=[...pos,{titulo:''}];setPos(a);trigger({},a,neg,diferenciais,docs)}}
                style={{ alignSelf:'flex-start', fontSize:'12px', color:'#1266CD', background:'none', border:'none', cursor:'pointer', padding:0, marginTop:'4px' }}>
                + Adicionar ponto positivo
              </button>
            )}
          </div>
        </Section>

        {/* Pontos de atenção */}
        <Section title="Pontos de Atenção" icon="⚠️" dark={dark}>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {neg.map((n,i) => (
              <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <Inp dark={dark} value={n.titulo} style={{ flex:1 }}
                  placeholder="Ex: Necessita reforma, Sem suíte, Frente para rua ruidosa..."
                  onChange={e=>{const a=[...neg];a[i]={...a[i],titulo:e.target.value};setNeg(a);trigger({},pos,a,diferenciais,docs)}}
                />
                {neg.length > 1 && (
                  <button onClick={()=>{const a=neg.filter((_,j)=>j!==i);setNeg(a);trigger({},pos,a,diferenciais,docs)}}
                    style={{ background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'18px', padding:'0 4px' }}>×</button>
                )}
              </div>
            ))}
            {neg.length < 5 && (
              <button onClick={()=>{const a=[...neg,{titulo:''}];setNeg(a);trigger({},pos,a,diferenciais,docs)}}
                style={{ alignSelf:'flex-start', fontSize:'12px', color:'#1266CD', background:'none', border:'none', cursor:'pointer', padding:0, marginTop:'4px' }}>
                + Adicionar ponto de atenção
              </button>
            )}
          </div>
        </Section>

        {/* Diferenciais */}
        <Section title={isCasa?'Características da Casa':isCom?'Infraestrutura do Espaço':'Diferenciais do Bloco'} icon="🏠" dark={dark}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {getDiferenciais(tipo).map(d => (
              <Check key={d} label={d} dark={dark}
                checked={diferenciais.includes(d)}
                onChange={e=>{const nd=e.target.checked?[...diferenciais,d]:diferenciais.filter(x=>x!==d);setDiferenciais(nd);trigger({},pos,neg,nd,docs)}}
              />
            ))}
          </div>
        </Section>

        {/* Documentação */}
        <Section title="Checklist de Documentação" icon="📄" dark={dark}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {getDocs(tipo).map(({ key, label:lbl }) => (
              <Check key={key} label={lbl} dark={dark}
                checked={!!docs[key]}
                onChange={e=>{const nd={...docs,[key]:e.target.checked};setDocs(nd);trigger({},pos,neg,diferenciais,nd)}}
              />
            ))}
          </div>
        </Section>

        {/* Observações */}
        <Section title="Observações do Corretor" icon="📝" dark={dark}>
          <textarea
            value={form.observacoes}
            placeholder="Impressões da visita, urgência do proprietário, informações extras, próximos passos..."
            onChange={e=>sf('observacoes',e.target.value)}
            style={{ width:'100%', boxSizing:'border-box', minHeight:'100px', padding:'12px 14px', borderRadius:'10px', fontSize:'13px', outline:'none', resize:'vertical', border:dark?'1px solid rgba(255,255,255,0.1)':'1px solid #e5e7eb', background:dark?'rgba(255,255,255,0.05)':'#fafafa', color:dark?'#e8eaf0':'#111', lineHeight:'1.6' }}
            onFocus={e=>{e.target.style.borderColor='rgba(18,102,205,0.6)'}}
            onBlur={e=>{e.target.style.borderColor=dark?'rgba(255,255,255,0.1)':'#e5e7eb'}}
          />
        </Section>

        {/* CTA */}
        {recordId && (
          <button onClick={() => navigate(`/v2/${recordId}`)}
            style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'pointer', boxShadow:'0 8px 24px rgba(18,102,205,0.4)', letterSpacing:'-0.01em' }}>
            ✦ Usar esses dados na V2 →
          </button>
        )}
      </div>
    </div>
  )
}
