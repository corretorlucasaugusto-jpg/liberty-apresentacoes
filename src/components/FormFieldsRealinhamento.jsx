// src/components/FormFieldsRealinhamento.jsx
import React from 'react'
import { Field, Input, NVRow, VRow } from './FormFields.jsx'

export { Field, Input, NVRow, VRow }

// Linha de visita
export const VisitaRow = ({ idx, onRemove, dark }) => {
  const border = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb'
  const bg     = dark ? 'rgba(255,255,255,0.03)' : '#f9fafb'
  const lbl    = dark ? 'rgba(255,255,255,0.4)' : '#6b7280'
  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-liberty-blue focus:border-transparent transition'

  return (
    <div style={{ border, borderRadius: '10px', padding: '14px', background: bg, marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: lbl, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Visita #{idx}
        </span>
        {idx > 1 && (
          <button type="button" onClick={onRemove}
            style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕ Remover
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Field label="Data">
          <input type="date" name={`vis_data_${idx}`} className={inputCls} />
        </Field>
        <Field label="Nº de visitantes">
          <Input name={`vis_qtd_${idx}`} placeholder="Ex: 2" />
        </Field>
      </div>
      <Field label="Feedback (texto ou transcrição do áudio)">
        <textarea
          name={`vis_feedback_${idx}`}
          rows={2}
          placeholder='Ex: "Gostaram, mas acharam caro para o andar." ou cole aqui a transcrição do áudio do WhatsApp.'
          style={{
            width: '100%', padding: '8px 12px',
            border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e5e7eb',
            borderRadius: '8px', fontSize: '13px', resize: 'vertical',
            background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
            color: dark ? 'rgba(255,255,255,0.85)' : '#111',
            outline: 'none', lineHeight: '1.5',
          }}
        />
      </Field>
    </div>
  )
}

// Linha de proposta recebida
export const PropostaRow = ({ idx, onRemove, dark }) => {
  const border = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb'
  const bg     = dark ? 'rgba(18,102,205,0.06)' : '#eff6ff'
  const lbl    = dark ? 'rgba(255,255,255,0.4)' : '#6b7280'
  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-liberty-blue focus:border-transparent transition'

  return (
    <div style={{ border, borderRadius: '10px', padding: '14px', background: bg, marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: lbl, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Proposta #{idx}
        </span>
        {idx > 1 && (
          <button type="button" onClick={onRemove}
            style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
            ✕ Remover
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <Field label="Data da proposta">
          <input type="date" name={`prop_data_${idx}`} className={inputCls} />
        </Field>
        <Field label="Valor ofertado">
          <Input name={`prop_valor_${idx}`} placeholder="Ex: R$ 750.000" />
        </Field>
      </div>
    </div>
  )
}

// Linha de ação realizada
export const AcaoRow = ({ idx, onRemove, dark }) => {
  const border = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb'
  const bg     = dark ? 'rgba(255,255,255,0.03)' : '#f9fafb'
  const lbl    = dark ? 'rgba(255,255,255,0.4)' : '#6b7280'

  return (
    <div style={{ border, borderRadius: '10px', padding: '12px 14px', background: bg, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ fontSize: '11px', color: lbl, flexShrink: 0, width: '20px' }}>{idx}.</span>
      <Input name={`acao_${idx}`} placeholder="Ex: Publicado no ZAP, Vídeo produzido, Tráfego pago no Instagram, Placa na fachada…" />
      {idx > 1 && (
        <button type="button" onClick={onRemove}
          style={{ fontSize: '12px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          ✕
        </button>
      )}
    </div>
  )
}
