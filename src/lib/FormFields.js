// src/components/FormFields.jsx
import React from 'react'

export const Field = ({ label, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
)

export const Input = (props) => (
  <input {...props} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-liberty-blue focus:border-transparent transition" />
)

export const NVRow = ({ idx, onRemove }) => (
  <div className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50/30">
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium text-gray-400">Concorrente #{idx}</span>
      {idx > 1 && (
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 text-sm transition"
        >
          ✕ Remover
        </button>
      )}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <Field label="Nome">
        <Input name={`nv_n_${idx}`} placeholder="Ex: Park Tower" />
      </Field>
      <Field label="Área (m²)">
        <Input name={`nv_a_${idx}`} placeholder="Ex: 120" />
      </Field>
      <Field label="Características">
        <Input name={`nv_c_${idx}`} placeholder="Ex: 3 qtos, 2 suítes" />
      </Field>
      <Field label="Preço">
        <Input name={`nv_v_${idx}`} placeholder="Ex: R$ 890.000" />
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Dias no mercado">
        <Input name={`nv_d_${idx}`} placeholder="Ex: 45 dias" />
      </Field>
      <Field label="Link do anúncio">
        <Input name={`lk_${idx}`} placeholder="https://..." />
      </Field>
    </div>
  </div>
)

export const VRow = ({ idx, onRemove }) => (
  <div className="border border-gray-100 rounded-lg p-3 space-y-2 bg-green-50/20">
    <div className="flex justify-between items-center">
      <span className="text-xs font-medium text-gray-400">Vendido #{idx}</span>
      {idx > 1 && (
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-400 text-sm transition"
        >
          ✕ Remover
        </button>
      )}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <Field label="Nome">
        <Input name={`v_n_${idx}`} placeholder="Ex: Residencial Solar" />
      </Field>
      <Field label="Área (m²)">
        <Input name={`v_a_${idx}`} placeholder="Ex: 118" />
      </Field>
      <Field label="Características">
        <Input name={`v_c_${idx}`} placeholder="Ex: 3 qtos c/ suíte" />
      </Field>
      <Field label="Preço de venda">
        <Input name={`v_v_${idx}`} placeholder="Ex: R$ 780.000" />
      </Field>
    </div>
  </div>
)

export const PerfilRow = ({ idx }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium text-gray-400 w-6">{idx}</span>
    <Input name={`c${idx}t`} placeholder={`Ex: Jovens profissionais, Famílias, Investidores, Moradores locais`} />
  </div>
)