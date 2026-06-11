// src/components/FormFields.jsx
import React from 'react'

export const Field = ({ label, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label className="lv-label">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs" style={{color:"var(--text3)"}}>{hint}</p>}
  </div>
)

export const Input = (props) => (
  <input {...props} className="lv-input" />
)

// Retorna true quando o tipo é Terreno
const isTerrenoType = (tipoImovel) =>
  (tipoImovel || '').toLowerCase().includes('terreno')

export const NVRow = ({ idx, onRemove, onExtract, extracting, tipoImovel, notFound = {} }) => {
  const isTer = isTerrenoType(tipoImovel)

  return (
    <div className="lv-row p-3 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium" style={{color:"var(--text3)"}}>Concorrente #{idx}</span>
        {idx > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm transition" style={{color:"var(--text3)"}}
          >
            ✕ Remover
          </button>
        )}
      </div>

      {/* Linha principal de dados */}
      <div className={`grid gap-2 ${isTer ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        <Field label="Nome">
          <Input name={`nv_n_${idx}`} placeholder="Ex: Park Tower" />
        </Field>

        {isTer ? (
          <Field label={<span className={notFound.area ? 'text-amber-500' : ''}>Área do terreno (m²)</span>}>
            <Input name={`nv_a_${idx}`} placeholder="Ex: 500" />
          </Field>
        ) : (
          <Field label={<span className={notFound.area ? 'text-amber-500' : ''}>Área (m²)</span>}>
            <Input name={`nv_a_${idx}`} placeholder="Ex: 120" />
          </Field>
        )}

        {!isTer && (
          <Field label={<span className={notFound.quartos ? 'text-amber-500' : ''}>Quartos</span>}>
            <Input name={`nv_q_${idx}`} placeholder="Ex: 3" />
          </Field>
        )}

        <Field label={<span className={notFound.valor ? 'text-amber-500' : ''}>Preço</span>}>
          <Input name={`nv_v_${idx}`} placeholder="Ex: R$ 890.000" />
        </Field>
      </div>

      {/* Linha secundária */}
      <div className={`grid gap-2 ${isTer ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {!isTer && (
          <Field label={<span className={notFound.vagas ? 'text-amber-500' : ''}>Vagas</span>}>
            <Input name={`nv_vagas_${idx}`} placeholder="Ex: 2" />
          </Field>
        )}
        {!isTer && (
          <Field label={<span className={notFound.conservacao ? 'text-amber-500' : ''}>Conservação</span>}>
            <select name={`nv_cons_${idx}`} className="lv-input" style={{cursor:'pointer'}}>
              <option value="">Selecione...</option>
              <option>Alto padrão</option>
              <option>Reformado</option>
              <option>Parcialmente reformado</option>
              <option>Original</option>
              <option>Precisa de reforma</option>
            </select>
          </Field>
        )}
        <Field label={<span className={notFound.dias ? 'text-amber-500' : ''}>Dias no mercado</span>}>
          <Input name={`nv_d_${idx}`} placeholder="Ex: 45 dias" />
        </Field>
        <Field label="Link do anúncio">
          <Input name={`lk_${idx}`} placeholder="https://..." />
        </Field>
      </div>

      {/* Obs */}
      <Field label="Observações">
        <Input name={`nv_obs_${idx}`} placeholder={isTer ? 'Ex: Esquina, plano, infraestrutura...' : 'Ex: Nascente, andar alto, canto...'} />
      </Field>

      {/* Área de conteúdo colado + botão extrair */}
      <div className="flex gap-2 items-start">
        <textarea
          name={`nv_content_${idx}`}
          rows={2}
          placeholder="Cole aqui o conteúdo do anúncio para a IA extrair os dados automaticamente..."
          className="lv-input flex-1 resize-none"
        />
        {onExtract && (
          <button
            type="button"
            onClick={() => onExtract(idx)}
            disabled={extracting}
            className="btn-ghost shrink-0 text-xs font-medium disabled:opacity-50" style={{color:"var(--blue)"}}
          >
            {extracting ? '...' : '✦ Extrair'}
          </button>
        )}
      </div>

      {/* Categoria */}
      <div className="flex gap-4 text-xs" style={{color:"var(--text3)"}}>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={`nv_cat_${idx}`} value="local" defaultChecked />
          Mesmo bairro
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={`nv_cat_${idx}`} value="amplo" />
          Mercado amplo
        </label>
      </div>
    </div>
  )
}

export const VRow = ({ idx, onRemove, onExtract, extracting, tipoImovel, notFound = {} }) => {
  const isTer = isTerrenoType(tipoImovel)

  return (
    <div className="lv-row p-3 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium" style={{color:"var(--text3)"}}>Vendido #{idx}</span>
        {idx > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm transition" style={{color:"var(--text3)"}}
          >
            ✕ Remover
          </button>
        )}
      </div>

      {/* Linha principal */}
      <div className={`grid gap-2 ${isTer ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
        <Field label="Nome">
          <Input name={`v_n_${idx}`} placeholder="Ex: Residencial Solar" />
        </Field>

        {isTer ? (
          <Field label={<span className={notFound.area ? 'text-amber-500' : ''}>Área do terreno (m²)</span>}>
            <Input name={`v_a_${idx}`} placeholder="Ex: 500" />
          </Field>
        ) : (
          <Field label={<span className={notFound.area ? 'text-amber-500' : ''}>Área (m²)</span>}>
            <Input name={`v_a_${idx}`} placeholder="Ex: 118" />
          </Field>
        )}

        {!isTer && (
          <Field label={<span className={notFound.quartos ? 'text-amber-500' : ''}>Quartos</span>}>
            <Input name={`v_q_${idx}`} placeholder="Ex: 3" />
          </Field>
        )}

        <Field label={<span className={notFound.valor ? 'text-amber-500' : ''}>Preço de venda</span>}>
          <Input name={`v_v_${idx}`} placeholder="Ex: R$ 780.000" />
        </Field>
      </div>

      {/* Linha secundária */}
      {!isTer && (
        <div className="grid grid-cols-2 gap-2">
          <Field label={<span className={notFound.vagas ? 'text-amber-500' : ''}>Vagas</span>}>
            <Input name={`v_vagas_${idx}`} placeholder="Ex: 2" />
          </Field>
          <Field label={<span className={notFound.conservacao ? 'text-amber-500' : ''}>Conservação</span>}>
            <select name={`v_cons_${idx}`} className="lv-input" style={{cursor:'pointer'}}>
              <option value="">Selecione...</option>
              <option>Alto padrão</option>
              <option>Reformado</option>
              <option>Parcialmente reformado</option>
              <option>Original</option>
              <option>Precisa de reforma</option>
            </select>
          </Field>
        </div>
      )}

      {/* Obs */}
      <Field label="Observações">
        <Input name={`v_obs_${idx}`} placeholder={isTer ? 'Ex: Esquina, plano, próximo a avenida...' : 'Ex: Nascente, andar alto, canto...'} />
      </Field>

      {/* Área de conteúdo colado + botão extrair */}
      <div className="flex gap-2 items-start">
        <textarea
          name={`v_content_${idx}`}
          rows={2}
          placeholder="Cole aqui o conteúdo do anúncio para a IA extrair os dados automaticamente..."
          className="lv-input flex-1 resize-none"
        />
        {onExtract && (
          <button
            type="button"
            onClick={() => onExtract(idx)}
            disabled={extracting}
            className="btn-ghost shrink-0 text-xs font-medium disabled:opacity-50" style={{color:"var(--blue)"}}
          >
            {extracting ? '...' : '✦ Extrair'}
          </button>
        )}
      </div>
    </div>
  )
}

export const PerfilRow = ({ idx }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-medium w-6" style={{color:"var(--text3)"}}>{idx}</span>
    <Input name={`c${idx}t`} placeholder={`Ex: Jovens profissionais, Famílias, Investidores, Moradores locais`} />
  </div>
)
