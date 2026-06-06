import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAutoSave } from '../hooks/useAutoSave.js'
import { useDark } from '../hooks/useTheme.js'

const TIPOS     = ['Apartamento','Casa','Cobertura','Kitnet / Studio','Comercial']
const SITUACOES = ['Vazio','Ocupado pelo dono','Locado']
const REFORMAS  = ['Não precisa','Precisa de reforma','Recentemente reformado']
const POSICOES  = ['Nascente','Poente','Norte','Sul','Nascente/Poente (Vazado)']

const DIFS = {
  apt: ['Fachada reformada','Portaria 24h','Elevador moderno','Salão de festas','Piscina','Academia','Playground','Jardim cuidado','Interfone / Biometria','Garagem coberta','Espaço gourmet','Vista livre'],
  casa:['Quintal / Jardim','Piscina','Churrasqueira','Área gourmet','Garagem coberta','Portão eletrônico','Câmeras de segurança','Gerador','Energia solar','Poço artesiano','Vista privilegiada'],
  com: ['Estacionamento próprio','Recepção','Ar-condicionado central','Copa / Cozinha','Sala de reunião','CFTV','Gerador','Elevador','Acesso para PCD','Banheiros independentes','Fachada envidraçada'],
}
const DOCS = {
  apt: [
    {key:'matricula',label:'Matrícula atualizada'},{key:'iptu_ok',label:'IPTU em dia'},
    {key:'cond_ok',label:'Condomínio em dia'},{key:'inventario',label:'Sem inventário pendente'},
    {key:'financiamento',label:'Aceita financiamento'},{key:'quitado',label:'Imóvel quitado'},
  ],
  casa:[
    {key:'matricula',label:'Matrícula atualizada'},{key:'iptu_ok',label:'IPTU em dia'},
    {key:'habitese',label:'Habite-se emitido'},{key:'averbacao',label:'Averbação de construção'},
    {key:'inventario',label:'Sem inventário pendente'},{key:'financiamento',label:'Aceita financiamento'},
    {key:'quitado',label:'Imóvel quitado'},
  ],
  com: [
    {key:'matricula',label:'Matrícula atualizada'},{key:'iptu_ok',label:'IPTU em dia'},
    {key:'habitese',label:'Habite-se / Auto de Vistoria'},{key:'alvara',label:'Alvará de funcionamento'},
    {key:'inventario',label:'Sem inventário pendente'},{key:'financiamento',label:'Aceita financiamento'},
    {key:'quitado',label:'Imóvel quitado'},
  ],
}

function typeKey(tipo) {
  if (tipo==='Casa') return 'casa'
  if (tipo==='Comercial') return 'com'
  return 'apt'
}

function SaveBadge({ status, lastSaved }) {
  if (status === 'idle') return null
  const cfg = {
    saving:{ color:'#f59e0b', text:'Salvando...' },
    saved: { color:'#22c55e', text:`Salvo ${lastSaved ? new Date(lastSaved).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):''}`},
    error: { color:'#f87171', text:'Erro ao salvar' },
  }[status]
  return (
    <div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'11px',color:cfg.color,fontWeight:500}}>
      {status==='saving' && <div style={{width:'8px',height:'8px',borderRadius:'50%',border:'2px solid #f59e0b',borderTopColor:'transparent',animation:'spin .7s linear infinite'}}/>}
      {status==='saved'  && <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#22c55e'}}/>}
      {cfg.text}
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="lv-section">
      <div className="lv-section-title">
        <span style={{fontSize:'15px'}}>{icon}</span>{title}
      </div>
      {children}
    </div>
  )
}

function LvCheck({ label, checked, onChange }) {
  return (
    <label className={`lv-check${checked?' checked':''}`} onClick={onChange}>
      <div className="lv-check-box">
        {checked && <span style={{color:'#fff',fontSize:'11px',fontWeight:700}}>✓</span>}
      </div>
      <span className="lv-check-label">{label}</span>
    </label>
  )
}

export default function V1Form() {
  const { id: urlId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const dark = useDark()
  const [recordId, setRecordId] = useState(urlId||null)
  const [loading,  setLoading]  = useState(!!urlId)

  const [form, setForm] = useState({
    cliente:'',residencial:'',endereco:'',bairro:'',
    tipo_imovel:'Apartamento',area:'',terreno:'',quartos:'',vagas:'',
    andar:'',total_andares:'',posicao_solar:'',condominio:'',iptu:'',
    situacao:'Vazio',reforma:'Não precisa',observacoes:'',
  })
  const [pos,          setPos]          = useState([{titulo:''}])
  const [neg,          setNeg]          = useState([{titulo:''}])
  const [diferenciais, setDiferenciais] = useState([])
  const [docs,         setDocs]         = useState({})

  const { saveStatus, lastSaved, scheduleSave } = useAutoSave('visitas_v1', recordId, setRecordId, user?.id)

  useEffect(() => {
    if (!urlId) return
    supabase.from('visitas_v1').select('*').eq('id', urlId).single()
      .then(({ data }) => {
        if (!data) return
        setForm({
          cliente:data.cliente||'',residencial:data.residencial||'',
          endereco:data.endereco||'',bairro:data.bairro||'',
          tipo_imovel:data.tipo_imovel||'Apartamento',area:data.area||'',
          terreno:data.terreno||'',quartos:data.quartos||'',vagas:data.vagas||'',
          andar:data.andar||'',total_andares:data.total_andares||'',
          posicao_solar:data.posicao_solar||'',condominio:data.condominio||'',
          iptu:data.iptu||'',situacao:data.situacao||'Vazio',
          reforma:data.reforma||'Não precisa',observacoes:data.observacoes||'',
        })
        setPos(data.pos?.length ? data.pos : [{titulo:''}])
        setNeg(data.neg?.length ? data.neg : [{titulo:''}])
        setDiferenciais(data.diferenciais||[])
        setDocs(data.docs||{})
        setLoading(false)
      })
  }, [urlId])

  const save = useCallback((patch={},pPos=pos,pNeg=neg,pDif=diferenciais,pDocs=docs) => {
    scheduleSave({...form,...patch,pos:pPos,neg:pNeg,diferenciais:pDif,docs:pDocs})
  },[form,pos,neg,diferenciais,docs,scheduleSave])

  const sf = (k,v) => { const n={...form,[k]:v}; setForm(n); save(n) }

  const tk = typeKey(form.tipo_imovel)
  const isCasa = tk==='casa'
  const isCom  = tk==='com'
  const isApt  = tk==='apt'

  if (loading) return (
    <div style={{display:'flex',justifyContent:'center',paddingTop:'80px'}}>
      <div style={{width:'28px',height:'28px',borderRadius:'50%',border:'3px solid #1266CD',borderTopColor:'transparent',animation:'spin .7s linear infinite'}}/>
    </div>
  )

  return (
    <div style={{maxWidth:'680px',margin:'0 auto',paddingBottom:'60px'}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'28px'}}>
        <div>
          <button onClick={()=>navigate('/v1')} style={{fontSize:'12px',color:'#1266CD',background:'none',border:'none',cursor:'pointer',padding:0,marginBottom:'8px'}}>
            ← Todas as visitas
          </button>
          <h1 style={{fontSize:'1.4rem',fontWeight:700,margin:0,color:'var(--text)'}}>
            {recordId ? (form.cliente||'Visita sem nome') : 'Nova Visita V1'}
          </h1>
          <p style={{fontSize:'12px',color:'var(--text3)',marginTop:'4px'}}>
            Salva automaticamente a cada campo preenchido
          </p>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'10px',flexShrink:0}}>
          <SaveBadge status={saveStatus} lastSaved={lastSaved}/>
          {recordId && (
            <button onClick={()=>navigate(`/v2/${recordId}`)} className="btn-primary" style={{fontSize:'12px',padding:'9px 18px',whiteSpace:'nowrap'}}>
              Usar na V2 →
            </button>
          )}
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

        {/* Identificação */}
        <Section title="Identificação" icon="👤">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {[['cliente','Nome do cliente','Ex: João e Maria'],['residencial','Condomínio / Edifício','Ex: Residencial Vera Brant'],['endereco','Endereço completo','Ex: SQN 311 Bloco A Apto 501'],['bairro','Bairro / Região','Ex: Asa Norte']].map(([k,l,p])=>(
              <div key={k}>
                <label className="lv-label">{l}</label>
                <input className="lv-input" value={form[k]} placeholder={p} onChange={e=>sf(k,e.target.value)}/>
              </div>
            ))}
          </div>
        </Section>

        {/* Ficha técnica */}
        <Section title="Ficha Técnica" icon="📐">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div>
              <label className="lv-label">Tipo de imóvel</label>
              <select className="lv-input" value={form.tipo_imovel} onChange={e=>sf('tipo_imovel',e.target.value)} style={{cursor:'pointer'}}>
                {TIPOS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            {!isCom && (
              <div>
                <label className="lv-label">Posição solar</label>
                <select className="lv-input" value={form.posicao_solar} onChange={e=>sf('posicao_solar',e.target.value)} style={{cursor:'pointer'}}>
                  <option value="">Selecione...</option>
                  {POSICOES.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="lv-label">{isCom?'Área total (m²)':'Área privativa (m²)'}</label>
              <input className="lv-input" value={form.area} placeholder="Ex: 125" onChange={e=>sf('area',e.target.value)}/>
            </div>
            {isCasa && (
              <div>
                <label className="lv-label">Área do terreno (m²)</label>
                <input className="lv-input" value={form.terreno} placeholder="Ex: 360" onChange={e=>sf('terreno',e.target.value)}/>
              </div>
            )}
            {!isCom && (
              <div>
                <label className="lv-label">Quartos</label>
                <input className="lv-input" value={form.quartos} placeholder="Ex: 3" onChange={e=>sf('quartos',e.target.value)}/>
              </div>
            )}
            <div>
              <label className="lv-label">{isCasa?'Vagas na garagem':'Vagas'}</label>
              <input className="lv-input" value={form.vagas} placeholder="Ex: 2" onChange={e=>sf('vagas',e.target.value)}/>
            </div>
            {isApt && <>
              <div>
                <label className="lv-label">Andar</label>
                <input className="lv-input" value={form.andar} placeholder="Ex: 5°" onChange={e=>sf('andar',e.target.value)}/>
              </div>
              <div>
                <label className="lv-label">Total de andares</label>
                <input className="lv-input" value={form.total_andares} placeholder="Ex: 6" onChange={e=>sf('total_andares',e.target.value)}/>
              </div>
            </>}
            {isCom && (
              <div>
                <label className="lv-label">Andar / Localização</label>
                <input className="lv-input" value={form.andar} placeholder="Ex: Térreo, 2° andar" onChange={e=>sf('andar',e.target.value)}/>
              </div>
            )}
            {!isCasa && (
              <div>
                <label className="lv-label">Condomínio R$/mês</label>
                <input className="lv-input" value={form.condominio} placeholder="Ex: 1.141" onChange={e=>sf('condominio',e.target.value)}/>
              </div>
            )}
            <div>
              <label className="lv-label">IPTU R$/ano</label>
              <input className="lv-input" value={form.iptu} placeholder="Ex: 2.739" onChange={e=>sf('iptu',e.target.value)}/>
            </div>
          </div>
        </Section>

        {/* Situação */}
        <Section title="Situação" icon="🔑">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div>
              <label className="lv-label">Situação atual</label>
              <select className="lv-input" value={form.situacao} onChange={e=>sf('situacao',e.target.value)} style={{cursor:'pointer'}}>
                {SITUACOES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="lv-label">Reforma</label>
              <select className="lv-input" value={form.reforma} onChange={e=>sf('reforma',e.target.value)} style={{cursor:'pointer'}}>
                {REFORMAS.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* Pontos positivos */}
        <Section title="Pontos Positivos" icon="✅">
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {pos.map((p,i)=>(
              <div key={i} style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <input className="lv-input" style={{flex:1}} value={p.titulo}
                  placeholder="Ex: Reformado, Vazado, Andar alto..."
                  onChange={e=>{const a=[...pos];a[i]={...a[i],titulo:e.target.value};setPos(a);save({},a,neg,diferenciais,docs)}}/>
                {pos.length>1 && <button onClick={()=>{const a=pos.filter((_,j)=>j!==i);setPos(a);save({},a,neg,diferenciais,docs)}} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:'18px'}}>×</button>}
              </div>
            ))}
            {pos.length<6 && <button onClick={()=>{const a=[...pos,{titulo:''}];setPos(a);save({},a,neg,diferenciais,docs)}} style={{alignSelf:'flex-start',fontSize:'12px',color:'#1266CD',background:'none',border:'none',cursor:'pointer',padding:0}}>+ Adicionar</button>}
          </div>
        </Section>

        {/* Pontos de atenção */}
        <Section title="Pontos de Atenção" icon="⚠️">
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {neg.map((n,i)=>(
              <div key={i} style={{display:'flex',gap:'8px',alignItems:'center'}}>
                <input className="lv-input" style={{flex:1}} value={n.titulo}
                  placeholder="Ex: Necessita reforma, Sem suíte, Frente para rua..."
                  onChange={e=>{const a=[...neg];a[i]={...a[i],titulo:e.target.value};setNeg(a);save({},pos,a,diferenciais,docs)}}/>
                {neg.length>1 && <button onClick={()=>{const a=neg.filter((_,j)=>j!==i);setNeg(a);save({},pos,a,diferenciais,docs)}} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:'18px'}}>×</button>}
              </div>
            ))}
            {neg.length<5 && <button onClick={()=>{const a=[...neg,{titulo:''}];setNeg(a);save({},pos,a,diferenciais,docs)}} style={{alignSelf:'flex-start',fontSize:'12px',color:'#1266CD',background:'none',border:'none',cursor:'pointer',padding:0}}>+ Adicionar</button>}
          </div>
        </Section>

        {/* Diferenciais */}
        <Section title={isCasa?'Características da Casa':isCom?'Infraestrutura do Espaço':'Diferenciais do Bloco'} icon="🏠">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {DIFS[tk].map(d=>(
              <LvCheck key={d} label={d} checked={diferenciais.includes(d)}
                onChange={()=>{const nd=diferenciais.includes(d)?diferenciais.filter(x=>x!==d):[...diferenciais,d];setDiferenciais(nd);save({},pos,neg,nd,docs)}}/>
            ))}
          </div>
        </Section>

        {/* Documentação */}
        <Section title="Checklist de Documentação" icon="📄">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {DOCS[tk].map(({key,label})=>(
              <LvCheck key={key} label={label} checked={!!docs[key]}
                onChange={()=>{const nd={...docs,[key]:!docs[key]};setDocs(nd);save({},pos,neg,diferenciais,nd)}}/>
            ))}
          </div>
        </Section>

        {/* Observações */}
        <Section title="Observações do Corretor" icon="📝">
          <textarea className="lv-input" style={{resize:'vertical',minHeight:'90px',lineHeight:'1.6'}}
            value={form.observacoes}
            placeholder="Impressões da visita, urgência do proprietário, informações extras..."
            onChange={e=>sf('observacoes',e.target.value)}/>
        </Section>

        {recordId && (
          <button onClick={()=>navigate(`/v2/${recordId}`)} className="btn-primary"
            style={{width:'100%',padding:'15px',fontSize:'15px',fontWeight:700,borderRadius:'12px',letterSpacing:'-0.01em',marginBottom:'16px'}}>
            ✦ Usar esses dados na V2 →
          </button>
        )}
      </div>
    </div>
  )
}
