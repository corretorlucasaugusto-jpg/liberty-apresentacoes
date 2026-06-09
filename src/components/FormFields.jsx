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

export function NVRow({ idx, onRemove, onExtract, extracting }) {
  return (
    <div style={{
      borderRadius:'12px', padding:'16px',
      border:'1px solid var(--border)',
      background:'var(--row-bg)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text3)' }}>
          Concorrente {idx}
        </div>
        <button type="button" onClick={onRemove}
          style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'18px', lineHeight:1, padding:'0 4px' }}>×</button>
      </div>

      {/* Link */}
      <input className="lv-input" name={`lk_${idx}`}
        placeholder="Link do anúncio (DFImóveis ou Wimóveis)"
        style={{ marginBottom:'8px' }}
      />

      {/* Content paste */}
      <div>
        <label style={{ display:'block', fontSize:'10px', color:'var(--text3)', marginBottom:'6px' }}>
          Cole o conteúdo do anúncio — a IA extrai os dados
        </label>
        <textarea
          name={`nv_content_${idx}`}
          rows={3}
          className="lv-input"
          style={{ resize:'none', marginBottom:'8px' }}
          placeholder="Cole aqui o texto ou deixe vazio e use o link acima"
        />
        <button
          type="button"
          onClick={() => onExtract(idx)}
          disabled={extracting}
          style={{
            padding:'7px 14px', borderRadius:'8px', border:'none', cursor: extracting?'not-allowed':'pointer',
            background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff',
            fontSize:'12px', fontWeight:600, opacity: extracting?0.6:1,
            display:'flex', alignItems:'center', gap:'6px',
          }}
        >
          {extracting
            ? <><div style={{width:'11px',height:'11px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Extraindo...</>
            : '✦ Extrair com IA'}
        </button>
      </div>

      {/* Manual fields */}
      <div style={{ borderTop:'1px solid var(--border)', marginTop:'12px', paddingTop:'12px' }}>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'8px' }}>Campos preenchidos pela IA — edite se necessário:</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <input className="lv-input" name={`nv_n_${idx}`} placeholder="Nome do imóvel" />
          <input className="lv-input" name={`nv_a_${idx}`} placeholder="Área (ex: 111m²)" />
        </div>
        <input className="lv-input" name={`nv_c_${idx}`} placeholder="Características (ex: 3Q · 2S · 2V · reformado)" style={{ marginBottom:'8px' }} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          <input className="lv-input" name={`nv_v_${idx}`} placeholder="Valor (ex: R$ 1.680.000)" />
          <input className="lv-input" name={`nv_d_${idx}`} placeholder="Dias no mercado (ex: 177 dias)" />
        </div>
      </div>
    </div>
  )
}

export function VRow({ idx, onRemove, onExtract, extracting }) {
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
          style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'18px', lineHeight:1, padding:'0 4px' }}>×</button>
      </div>

      {/* Content paste */}
      <div style={{ marginBottom:'8px' }}>
        <label style={{ display:'block', fontSize:'10px', color:'var(--text3)', marginBottom:'6px' }}>
          Cole o conteúdo do anúncio — a IA extrai os dados
        </label>
        <textarea
          name={`v_content_${idx}`}
          rows={3}
          className="lv-input"
          style={{ resize:'none', marginBottom:'8px' }}
          placeholder="Cole aqui o texto do anúncio vendido..."
        />
        <button
          type="button"
          onClick={() => onExtract(idx)}
          disabled={extracting}
          style={{
            padding:'7px 14px', borderRadius:'8px', border:'none', cursor: extracting?'not-allowed':'pointer',
            background:'linear-gradient(135deg,#1266CD,#1a7be8)', color:'#fff',
            fontSize:'12px', fontWeight:600, opacity: extracting?0.6:1,
            display:'flex', alignItems:'center', gap:'6px',
          }}
        >
          {extracting
            ? <><div style={{width:'11px',height:'11px',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Extraindo...</>
            : '✦ Extrair com IA'}
        </button>
      </div>

      {/* Manual fields */}
      <div style={{ borderTop:'1px solid var(--border)', paddingTop:'12px' }}>
        <p style={{ fontSize:'11px', color:'var(--text3)', marginBottom:'8px' }}>Campos preenchidos pela IA — edite se necessário:</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'8px' }}>
          <input className="lv-input" name={`v_n_${idx}`} placeholder="Nome do imóvel" />
          <input className="lv-input" name={`v_a_${idx}`} placeholder="Área" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
          <input className="lv-input" name={`v_c_${idx}`} placeholder="Características" />
          <input className="lv-input" name={`v_v_${idx}`} placeholder="Valor de venda" />
        </div>
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
