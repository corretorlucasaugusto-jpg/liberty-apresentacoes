import React, { useState } from 'react'

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

export function Input(props) {
  return <input className="input-base" {...props} />
}

export function NVRow({ idx, onRemove, onExtract, extracting }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 relative border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Concorrente {idx}</div>
        <button type="button" onClick={onRemove}
          className="text-gray-300 hover:text-red-400 text-lg leading-none transition">×</button>
      </div>

      {/* Link + Content side by side hint */}
      <div className="grid grid-cols-1 gap-2">
        <Input name={`lk_${idx}`} placeholder="Link do anúncio (DFImóveis ou Wimóveis)" />
        <div className="relative">
          <textarea
            name={`nv_content_${idx}`}
            rows={3}
            className="input-base resize-none text-xs w-full"
            placeholder="Cole aqui o conteúdo do anúncio — a IA extrai nome, área, valor, dias e características automaticamente"
          />
          <button
            type="button"
            onClick={() => onExtract(idx)}
            disabled={extracting}
            className="mt-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1.5"
          >
            {extracting
              ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>Extraindo...</>
              : '✦ Extrair com IA'}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 pt-3 space-y-2">
        <p className="text-xs text-gray-400 mb-2">Ou preencha manualmente:</p>
        <div className="grid grid-cols-2 gap-2">
          <Input name={`nv_n_${idx}`} placeholder="Nome (ex: Mont Serrat Studios)" />
          <Input name={`nv_a_${idx}`} placeholder="Área (ex: 66m²)" />
        </div>
        <Input name={`nv_c_${idx}`} placeholder="Características (ex: 2Q · 1V · reformado)" />
        <div className="grid grid-cols-2 gap-2">
          <Input name={`nv_v_${idx}`} placeholder="Valor (ex: R$ 850.000)" />
          <Input name={`nv_d_${idx}`} placeholder="Dias no mercado" />
        </div>
      </div>
    </div>
  )
}

export function VRow({ idx, onRemove, onExtract, extracting }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 relative border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vendido {idx}</div>
        <button type="button" onClick={onRemove}
          className="text-gray-300 hover:text-red-400 text-lg leading-none transition">×</button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="relative">
          <textarea
            name={`v_content_${idx}`}
            rows={3}
            className="input-base resize-none text-xs w-full"
            placeholder="Cole aqui o conteúdo do anúncio vendido — a IA extrai os dados automaticamente"
          />
          <button
            type="button"
            onClick={() => onExtract(idx)}
            disabled={extracting}
            className="mt-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1.5"
          >
            {extracting
              ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>Extraindo...</>
              : '✦ Extrair com IA'}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-2">
        <p className="text-xs text-gray-400 mb-2">Ou preencha manualmente:</p>
        <div className="grid grid-cols-2 gap-2">
          <Input name={`v_n_${idx}`} placeholder="Nome" />
          <Input name={`v_a_${idx}`} placeholder="Área" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input name={`v_c_${idx}`} placeholder="Características" />
          <Input name={`v_v_${idx}`} placeholder="Valor de venda" />
        </div>
      </div>
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
