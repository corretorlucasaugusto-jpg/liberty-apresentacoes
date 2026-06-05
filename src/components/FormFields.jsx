import React from 'react'

export function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
        {label}
        {hint && <span className="text-gray-300 font-normal">· {hint}</span>}
      </label>
      {children}
    </div>
  )
}

export function Input({ ...props }) {
  return <input className="input-base" {...props} />
}

export function NVRow({ idx, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none transition"
      >×</button>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Concorrente {idx}</div>
      <div className="grid grid-cols-2 gap-2">
        <Input name={`nv_n_${idx}`} placeholder="Nome (ex: Mont Serrat Studios)" />
        <Input name={`nv_a_${idx}`} placeholder="Área (ex: 66m²)" />
      </div>
      <Input name={`nv_c_${idx}`} placeholder="Características (ex: 2Q · 1V · reformado)" />
      <div className="grid grid-cols-2 gap-2">
        <Input name={`nv_v_${idx}`} placeholder="Valor (ex: R$ 850.000)" />
        <Input name={`nv_d_${idx}`} placeholder="Dias no mercado" />
      </div>
      <Input name={`lk_${idx}`} placeholder="Link do anúncio (DFImóveis ou Wimóveis)" />
    </div>
  )
}

export function VRow({ idx, onRemove }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg leading-none transition"
      >×</button>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vendido {idx}</div>
      <div className="grid grid-cols-2 gap-2">
        <Input name={`v_n_${idx}`} placeholder="Nome" />
        <Input name={`v_a_${idx}`} placeholder="Área" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input name={`v_c_${idx}`} placeholder="Características" />
        <Input name={`v_v_${idx}`} placeholder="Valor de venda" />
      </div>
    </div>
  )
}

export function PtoRow({ placeholder, onRemove }) {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder={placeholder} className="input-base flex-1" />
      <button
        type="button"
        onClick={onRemove}
        className="text-gray-300 hover:text-red-400 text-lg leading-none transition flex-shrink-0"
      >×</button>
    </div>
  )
}

export function PerfilRow({ idx }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <Input name={`c${idx}t`} placeholder={`Perfil ${idx} (ex: Solteiros, Investidores...)`} />
      <p className="text-xs text-gray-400 mt-1.5">A IA gera a descrição automaticamente</p>
    </div>
  )
}
