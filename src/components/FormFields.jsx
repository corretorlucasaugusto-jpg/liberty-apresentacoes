import React, { useState } from 'react'

export function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="lv-label flex items-center gap-1">
        {label}
        {hint && <span style={{ color:'var(--text3)', fontWeight:400 }}>· {hint}</span>}
      </label>
      {children}
    </div>
  )
}

export function Input(props) {
  return <input className="lv-input" {...props} />
}

// Field with visual feedback when not extracted
function ExtractedInput({ name, placeholder, notFound, ...props }) {
  return (
    <div style={{ position:'relative' }}>
      <input
        className="lv-input"
        name={name}
        placeholder={notFound ? '⚠ Não encontrado — preencha' : placeholder}
        style={{
          borderColor: notFound ? '#f59e0b' : undefined,
          background: notFound ? 'rgba(245,158,11,0.06)' : undefined,
        }}
        {...props}
      />
      {notFound && (
        <div style={{
          position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)',
          fontSize:'9px', fontWeight:700, color:'#f59e0b', letterSpacing:'0.05em',
          pointerEvents:'none',
        }}>MANUAL</div>
      )}
    </div>
  )
}

const CONSERVACAO_OPTS = [
  { value:'',                    label:'Conservação...' },
  { value:'Alto padrão',         label:'Alto padrão (luxo)' },
  { value:'Reformado',           label:'Reformado (recente)' },
  { value:'Parcialmente reformado', label:'Parcialmente reformado' },
  { value:'Original',            label:'Original (sem reforma)' },
  { value:'Precisa de reforma',  label:'Precisa de reforma' },
]

export function NVRow({ idx, onRemove, onExtract, extracting, tipoImovel, notFound }) {
  const isCasa = tipoImovel === 'Casa'
  const nf = notFound || {}

  return (
    <div style={{
      borderRadius:'12px', padding:'16px',
      border:'1px solid var(--border)',
      background:'var(--row-bg)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text3)' }}>
          Concorrente {idx}
        </div>
        <button type="button" onClick={onRemove}
          style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'18px', lineHeight:1 }}>×</button>
      </div>

      {/* Link + Extract */}
      <input className="lv-input" name={`lk_${idx}`}
        placeholder="Link do anúncio (DFImóveis ou Wimóveis)"
        style={{ marginBottom:'8px' }}
      />
      <div style={{ marginBottom:'12px' }}>
        <textarea name={`nv_content_${idx}`} rows={2} className="lv-input"
          style={{ resize:'none', marginBottom:'6px', fontSize:'12px' }}
          placeholder="Cole o conteúdo do anúncio — a IA extrai os campos abaixo automaticamente"
        />
        <button type="button" onClick={() => onExtract(idx)} disabled={extracting}
          style={{
            padding:'6px 14px', borderRadius:'8px', border:'none', cursor: extracting?'not-allowed':'pointer',
            background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff',
            fontSize:'11px', fontWeight:600, opacity: extracting?0.6:1,
            display:'flex', alignItems:'center', gap:'6px',
          }}>
          {extracting
            ? <><div style={{width:'10px',height:'10px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Extraindo...</>
            : '✦ Extrair com IA'}
        </button>
      </div>

      {/* Structured fields */}
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'12px' }}>
        <p style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'10px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Dados da amostra
          {Object.keys(nf).length > 0 && (
            <span style={{ color:'#f59e0b', marginLeft:'8px', fontSize:'9px' }}>
              ⚠ {Object.values(nf).filter(Boolean).length} campo(s) não extraído(s)
            </span>
          )}
        </p>

        {/* Row 1: Nome + Valor */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <ExtractedInput name={`nv_n_${idx}`} placeholder="Nome do imóvel" notFound={nf.nome} />
          <ExtractedInput name={`nv_v_${idx}`} placeholder="Valor (R$)" notFound={nf.valor} />
        </div>

        {/* Row 2: Area + Quartos + Vagas */}
        <div style={{ display:'grid', gridTemplateColumns: isCasa ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <ExtractedInput name={`nv_a_${idx}`} placeholder={isCasa ? 'Área construída (m²)' : 'Área (m²)'} notFound={nf.area} />
          {isCasa && <ExtractedInput name={`nv_terreno_${idx}`} placeholder="Terreno (m²)" notFound={nf.terreno} />}
          <ExtractedInput name={`nv_q_${idx}`} placeholder="Quartos" notFound={nf.quartos} />
          <ExtractedInput name={`nv_vagas_${idx}`} placeholder="Vagas" notFound={nf.vagas} />
        </div>

        {/* Row 3: Conservação + Dias */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <div style={{ position:'relative' }}>
            <select name={`nv_cons_${idx}`} className="lv-input"
              style={{
                cursor:'pointer',
                borderColor: nf.conservacao ? '#f59e0b' : undefined,
                background: nf.conservacao ? 'rgba(245,158,11,0.06)' : undefined,
              }}>
              {CONSERVACAO_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {nf.conservacao && (
              <div style={{ position:'absolute', right:'28px', top:'50%', transform:'translateY(-50%)', fontSize:'9px', fontWeight:700, color:'#f59e0b', pointerEvents:'none' }}>
                MANUAL
              </div>
            )}
          </div>
          <ExtractedInput name={`nv_d_${idx}`} placeholder="Dias no mercado" notFound={nf.dias} />
        </div>

        {/* Row 4: Categoria (mesmo bairro ou mercado amplo) */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'8px' }}>
          <label style={{ fontSize:'11px', color:'var(--text3)', display:'flex', alignItems:'center', gap:'4px', cursor:'pointer' }}>
            <input type="radio" name={`nv_cat_${idx}`} value="local" defaultChecked style={{ accentColor:'#1266CD' }} />
            <span>Mesmo bairro / região</span>
          </label>
          <label style={{ fontSize:'11px', color:'var(--text3)', display:'flex', alignItems:'center', gap:'4px', cursor:'pointer' }}>
            <input type="radio" name={`nv_cat_${idx}`} value="amplo" style={{ accentColor:'#f59e0b' }} />
            <span>Mercado amplo</span>
          </label>
        </div>

        {/* Row 5: Observação */}
        <input className="lv-input" name={`nv_obs_${idx}`}
          placeholder={isCasa ? "Observação livre (piscina, suíte, lazer, diferenciais...)" : "Observação livre (posição, andar, diferencial...)"}
          style={{ fontSize:'12px' }}
        />
      </div>
    </div>
  )
}

export function VRow({ idx, onRemove, onExtract, extracting, tipoImovel, notFound }) {
  const isCasa = tipoImovel === 'Casa'
  const nf = notFound || {}

  return (
    <div style={{
      borderRadius:'12px', padding:'16px',
      border:'1px solid var(--border)',
      background:'var(--row-bg)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text3)' }}>
          Vendido {idx}
        </div>
        <button type="button" onClick={onRemove}
          style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'18px', lineHeight:1 }}>×</button>
      </div>

      {/* Extract from content */}
      <div style={{ marginBottom:'12px' }}>
        <textarea name={`v_content_${idx}`} rows={2} className="lv-input"
          style={{ resize:'none', marginBottom:'6px', fontSize:'12px' }}
          placeholder="Cole o conteúdo do anúncio vendido — a IA extrai os dados abaixo"
        />
        <button type="button" onClick={() => onExtract(idx)} disabled={extracting}
          style={{
            padding:'6px 14px', borderRadius:'8px', border:'none', cursor: extracting?'not-allowed':'pointer',
            background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff',
            fontSize:'11px', fontWeight:600, opacity: extracting?0.6:1,
            display:'flex', alignItems:'center', gap:'6px',
          }}>
          {extracting
            ? <><div style={{width:'10px',height:'10px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Extraindo...</>
            : '✦ Extrair com IA'}
        </button>
      </div>

      {/* Structured fields */}
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'12px' }}>
        <p style={{ fontSize:'10px', color:'var(--text3)', marginBottom:'10px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>
          Dados do imóvel vendido
          {Object.keys(nf).length > 0 && (
            <span style={{ color:'#f59e0b', marginLeft:'8px', fontSize:'9px' }}>
              ⚠ {Object.values(nf).filter(Boolean).length} campo(s) não extraído(s)
            </span>
          )}
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <ExtractedInput name={`v_n_${idx}`} placeholder="Nome do imóvel" notFound={nf.nome} />
          <ExtractedInput name={`v_v_${idx}`} placeholder="Valor de venda (R$)" notFound={nf.valor} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns: isCasa ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <ExtractedInput name={`v_a_${idx}`} placeholder={isCasa ? 'Área construída (m²)' : 'Área (m²)'} notFound={nf.area} />
          {isCasa && <ExtractedInput name={`v_terreno_${idx}`} placeholder="Terreno (m²)" notFound={nf.terreno} />}
          <ExtractedInput name={`v_q_${idx}`} placeholder="Quartos" notFound={nf.quartos} />
          <ExtractedInput name={`v_vagas_${idx}`} placeholder="Vagas" notFound={nf.vagas} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <select name={`v_cons_${idx}`} className="lv-input"
            style={{
              cursor:'pointer',
              borderColor: nf.conservacao ? '#f59e0b' : undefined,
            }}>
            {CONSERVACAO_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input className="lv-input" name={`v_data_${idx}`} placeholder="Data aprox. venda" style={{ fontSize:'12px' }} />
        </div>

        <input className="lv-input" name={`v_obs_${idx}`}
          placeholder="Observação (andar, posição solar, diferencial...)"
          style={{ fontSize:'12px' }}
        />
      </div>
    </div>
  )
}

export function PerfilRow({ idx }) {
  return (
    <div style={{
      borderRadius:'10px', padding:'12px 14px',
      border:'1px solid var(--border)',
      background:'var(--row-bg)',
    }}>
      <input className="lv-input" name={`c${idx}t`}
        placeholder={`Perfil ${idx} (ex: Solteiros, Investidores...)`}
        style={{ marginBottom:'4px' }}
      />
      <p style={{ fontSize:'11px', color:'var(--text3)', margin:0 }}>A IA gera a descrição automaticamente</p>
    </div>
  )
}