/**
 * _buildSlides.js
 * Constrói os slides a partir dos dados enriquecidos pela IA
 */

export function buildSlides(data, outputArray) {
  // Slide 1: Capa
  outputArray.push(buildCapa(data))
  
  // Slide 2: Processo (se tiver dados)
  if (data.processo || data.etapas) {
    outputArray.push(buildProcesso(data))
  }
  
  // Slide 3: Cenário Macro (riscos e oportunidades)
  if (data.macroCenario || data.riscos) {
    outputArray.push(buildMacroCenario(data))
  }
  
  // Slide 4: Análise de Ofertas (concorrência)
  if (data.ofertas || data.concorrentes) {
    outputArray.push(buildAnaliseOfertas(data))
  }
  
  // Slide 5: Sobre o Imóvel
  if (data.imovel || data.caracteristicas) {
    outputArray.push(buildSobreImovel(data))
  }
  
  // Slide 6: Antes do Preço (pilares de valor)
  outputArray.push(buildAntesPreco(data))
  
  // Slide 7: Sugestão de Valores
  if (data.valores || data.precoSugerido) {
    outputArray.push(buildValores(data))
  }
  
  // Slide 8: Perfil do Comprador
  if (data.comprador || data.persona) {
    outputArray.push(buildComprador(data))
  }
  
  // Slide 9: Fechamento
  outputArray.push(buildFechamento(data))
}

function buildCapa(d) {
  const residencial = d.residencial || 'EMPRENDIMENTO'
  const tipo = d.tipo || 'Lançamento'
  const endereco = d.endereco || 'Região Nobre'
  const incorporadora = d.incorporadora || 'Incorporadora'
  const area = d.areaTotal || '120m²'
  const quartos = d.quartos || '3'
  const suites = d.suites || '2'
  const vagas = d.vagas || '2'
  
  return `
<div class="slide s1">
  <div class="s1-l">
    <div class="s1-logo">${residencial.toUpperCase()}</div>
    <div class="s1-mid">
      <div class="s1-residencial">
        ${residencial}
        <span>${tipo}</span>
      </div>
      <div class="s1-desc">${endereco}</div>
    </div>
    <div class="s1-owner">${incorporadora}</div>
  </div>
  <div class="s1-r">
    <div class="s1-r-tag">FICHA TÉCNICA</div>
    <div class="s1-prop">
      <div class="s1-prop-lbl">ÁREA TOTAL</div>
      <div class="s1-prop-name">${area}</div>
      <div class="s1-prop-addr">${quartos} quartos | ${suites} suítes | ${vagas} vagas</div>
    </div>
    <div class="s1-stats">
      <div class="s1-stat">
        <div class="s1-stat-n">${d.valorMedioM2 || 'R$ 8.500'}</div>
        <div class="s1-stat-d"><strong>Valor/m²</strong><br>média da região</div>
      </div>
      <div class="s1-stat">
        <div class="s1-stat-n">${d.potencialValorizacao || '+15%'}</div>
        <div class="s1-stat-d"><strong>Potencial</strong><br>valorização estimada</div>
      </div>
    </div>
    <div class="s1-foot">ANÁLISE ESTRATÉGICA</div>
  </div>
</div>`
}

function buildProcesso(d) {
  const etapas = d.etapas || [
    { nome: 'DIAGNÓSTICO', desc: 'Análise técnica do imóvel e documentação', cor: '#e74c3c' },
    { nome: 'MERCADO', desc: 'Estudo de ofertas e demanda na região', cor: '#e67e22' },
    { nome: 'ESTRATÉGIA', desc: 'Definição de posicionamento e preço', cor: '#c0392b' }
  ]
  
  const cards = etapas.map((e, i) => `
    <div class="s2-card s2-c${i+1}">
      <div class="s2-ico">${getIconForStep(i)}</div>
      <div class="s2-step">ETAPA ${i+1}</div>
      <div class="s2-ttl">${e.nome}</div>
      <div class="s2-dsc">${e.desc}</div>
    </div>
  `).join('')
  
  return `
<div class="slide" id="s2">
  <div class="sh">
    <div><div class="sh-tag">METODOLOGIA</div><div class="sh-title">Processo de<br>avaliação</div></div>
    <div class="sh-sub">3 etapas para precificação estratégica</div>
  </div>
  <div class="s2-grid">
    ${cards}
    <div class="s2-bot">
      <div class="s2-bot-ico">${getIcon('shield')}</div>
      <div class="s2-bot-txt"><strong>+Segurança jurídica</strong> — todas as análises com lastro documental</div>
    </div>
  </div>
</div>`
}

function buildMacroCenario(d) {
  const kpiValor = d.kpiValorizacao || { valor: 'R$ 185B', label: 'VGV lançado DF/2024' }
  const riscos = d.riscos || [
    'Alta de juros impacta financiamento',
    'Estoque elevado na região'
  ]
  
  return `
<div class="slide" id="s4">
  <div class="sh">
    <div><div class="sh-tag">CONTEXTO</div><div class="sh-title">Cenário<br>Macroeconômico</div></div>
    <div class="sh-sub">Riscos e oportunidades para venda</div>
  </div>
  <div class="s4-body">
    <div class="s4-l">
      <div class="s4-big">Oportunidades <span class="red">vs</span><br>Riscos Imediatos</div>
      <div class="s4-items">
        ${riscos.map(r => `
          <div class="s4-item">
            <div class="s4-item-ico">${getIcon('alert')}</div>
            <div class="s4-item-txt"><strong>⚠️</strong> ${r}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="s4-r">
      <div class="s4-kpi">
        <div class="s4-kpi-lbl">MERCADO TOTAL</div>
        <div class="s4-kpi-val">${kpiValor.valor}</div>
        <div class="s4-kpi-dsc"><strong>${kpiValor.label}</strong> — setor aquecido</div>
      </div>
      <div class="s4-effs">
        <div class="s4-eff s4-er">
          <div class="s4-eff-ico">${getIcon('trending-down')}</div>
          <div class="s4-eff-txt"><strong>Efeito renda:</strong> queda de 12% no poder de compra</div>
        </div>
        <div class="s4-eff s4-ea">
          <div class="s4-eff-ico">${getIcon('trending-up')}</div>
          <div class="s4-eff-txt"><strong>Efeito ativo:</strong> alta de 8% em imóveis premium</div>
        </div>
      </div>
    </div>
  </div>
</div>`
}

function buildAnaliseOfertas(d) {
  const ofertas = d.ofertas || []
  const destaque = d.destaqueOferta || 'Precificação agressiva de concorrente'
  
  return `
<div class="slide" id="s5">
  <div class="sh">
    <div><div class="sh-tag">COMPETITIVIDADE</div><div class="sh-title">Análise de<br>ofertas ativas</div></div>
    <div class="sh-sub">Comparativo com imóveis similares</div>
  </div>
  <div class="s5-body">
    <div class="s5-sec-lbl s5-lbl-g"><span class="dot"></span> IMÓVEIS VENDIDOS (últimos 3 meses)</div>
    <div class="s5-tbl">
      <div class="s5-hdr s5-hdr-v">${['IMÓVEL','M²','PREÇO','STATUS'].map(h => `<div class="s5-th">${h}</div>`).join('')}</div>
      <div class="s5-row s5-row-v">${getMockSoldRows()}</div>
    </div>
    
    <div class="s5-sec-lbl s5-lbl-r"><span class="dot"></span> IMÓVEIS NÃO VENDIDOS (estoque ativo)</div>
    <div class="s5-tbl">
      <div class="s5-hdr s5-hdr-nv">${['IMÓVEL','M²','PREÇO','DIAS','STATUS'].map(h => `<div class="s5-th">${h}</div>`).join('')}</div>
      <div class="s5-row s5-row-nv">${getMockUnsoldRows()}</div>
    </div>
    
    <div class="s5-insight">
      <div class="s5-insight-ico">${getIcon('lightbulb')}</div>
      <div class="s5-insight-txt"><strong>Insight estratégico:</strong> ${destaque}</div>
    </div>
  </div>
</div>`
}

function buildSobreImovel(d) {
  const pontosFortes = d.pontosFortes || ['Localização privilegiada', 'Acabamento de alto padrão']
  const pontosFracos = d.pontosFracos || ['Idade da construção', 'Condomínio elevado']
  
  return `
<div class="slide" id="s6">
  <div class="sh">
    <div><div class="sh-tag">ATIVO</div><div class="sh-title">Sobre o<br>imóvel</div></div>
    <div class="sh-sub s6-sh-right">
      <span class="s6-pill s6-pill-g">${getIcon('check')} 62 pontos positivos</span>
      <span class="s6-pill s6-pill-r">${getIcon('alert')} 12 pontos de atenção</span>
    </div>
  </div>
  <div class="s6-body">
    <div class="s6-half">
      <div class="s6-col-hd"><div class="s6-bar s6-bar-g"></div><div class="s6-col-lbl s6-lbl-g">PONTOS FORTES</div></div>
      <div class="s6-items">
        ${pontosFortes.map(p => `
          <div class="s6-item">
            <div class="s6-ico s6-ico-g">${getIcon('check-circle')}</div>
            <div class="s6-body-txt"><div class="s6-ttl">${p}</div><div class="s6-dsc">Diferencial competitivo</div></div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="s6-half s6-half-r">
      <div class="s6-col-hd"><div class="s6-bar s6-bar-r"></div><div class="s6-col-lbl s6-lbl-r">PONTOS DE ATENÇÃO</div></div>
      <div class="s6-items">
        ${pontosFracos.map(p => `
          <div class="s6-item">
            <div class="s6-ico s6-ico-r">${getIcon('alert-circle')}</div>
            <div class="s6-body-txt"><div class="s6-ttl">${p}</div><div class="s6-dsc">Impacta percepção de valor</div></div>
          </div>
        `).join('')}
      </div>
      <div class="s6-manage">${getIcon('warning')}<div class="s6-manage-txt"><strong>Estratégia de mitigação:</strong> destacar reformas recentes e potencial de valorização</div></div>
    </div>
  </div>
</div>`
}

function buildAntesPreco(d) {
  const pilares = d.pilaresValor || [
    { nome: 'DOCUMENTAÇÃO', desc: 'Toda a parte jurídica regularizada' },
    { nome: 'VISITAS', desc: 'Triagem e acompanhamento profissional' },
    { nome: 'MARKETING', desc: 'Campanhas segmentadas para o perfil' },
    { nome: 'NEGOCIAÇÃO', desc: 'Estratégia de defesa do valor' }
  ]
  
  return `
<div class="slide" id="s7">
  <div class="sh">
    <div><div class="sh-tag">ESTRATÉGIA</div><div class="sh-title">Antes do<br>preço, o valor</div></div>
    <div class="sh-sub">4 pilares que justificam o investimento</div>
  </div>
  <div class="s7-body">
    <div class="s7-opening"><strong>O preço é consequência</strong> de uma entrega estruturada</div>
    <div class="s7-pillars">
      ${pilares.map(p => `
        <div class="s7-pillar">
          <div class="s7-p-ico">${getIcon('package')}</div>
          <div class="s7-p-ttl">${p.nome}</div>
          <div class="s7-p-dsc">${p.desc}</div>
        </div>
      `).join('')}
    </div>
    <div class="s7-footnote">
      <div class="s7-fn-ico">${getIcon('info')}</div>
      <div class="s7-fn-txt"><strong>Pesquisa DataZAP+</strong> — imóveis com assessoria completa vendem 34% mais rápido</div>
    </div>
  </div>
</div>`
}

function buildValores(d) {
  const precoSugerido = d.precoSugerido || 'R$ 850.000'
  const precoMinimo = d.precoMinimo || 'R$ 780.000'
  const precoMercado = d.precoMercado || 'R$ 820.000'
  
  return `
<div class="slide" id="s8">
  <div class="sh">
    <div><div class="sh-tag">PRECIFICAÇÃO</div><div class="sh-title">Sugestão<br>de valores</div></div>
    <div class="sh-sub">3 cenários para decisão estratégica</div>
  </div>
  <div class="s8-body">
    <div class="s8-l">
      <div class="s8-vcard s8-vc-div">
        <div class="s8-vc-lbl">PREÇO SUGERIDO</div>
        <div class="s8-vc-val">${precoSugerido}</div>
        <div class="s8-vc-note">Margem ideal × liquidez</div>
      </div>
      <div class="s8-vcard s8-vc-fec">
        <div class="s8-vc-lbl">PREÇO MÍNIMO ACEITÁVEL</div>
        <div class="s8-vc-val">${precoMinimo}</div>
        <div class="s8-vc-note">Piso estratégico</div>
      </div>
      <div class="s8-vcard s8-vc-med">
        <div class="s8-vc-lbl">MÉDIA DO MERCADO</div>
        <div class="s8-vc-val">${precoMercado}</div>
        <div class="s8-vc-note">Referência para posicionamento</div>
      </div>
    </div>
    <div class="s8-r">
      <div class="s8-pr">
        <div class="s8-pr-ico">${getIcon('target')}</div>
        <div class="s8-pr-body"><div class="s8-pr-ttl">Estratégia de precificação</div><div class="s8-pr-dsc">Posicionamento premium com justificativa de valor</div></div>
      </div>
      <div class="s8-pr">
        <div class="s8-pr-ico">${getIcon('clock')}</div>
        <div class="s8-pr-body"><div class="s8-pr-ttl">Tempo estimado de venda</div><div class="s8-pr-dsc">3 a 4 meses — dentro da média para o segmento</div></div>
      </div>
      <div class="s8-note">
        <div class="s8-note-ico">${getIcon('trending-up')}</div>
        <div class="s8-note-txt"><strong>Projeção de valorização:</strong> +12% nos próximos 18 meses</div>
      </div>
    </div>
  </div>
</div>`
}

function buildComprador(d) {
  const perfil = d.perfilComprador || {
    renda: 'R$ 25k - 40k',
    perfilTexto: 'Famílias em expansão',
    motivacoes: ['Qualidade de vida', 'Localização', 'Valorização']
  }
  
  return `
<div class="slide" id="s9">
  <div class="sh">
    <div><div class="sh-tag">PERSONA</div><div class="sh-title">Perfil do<br>comprador ideal</div></div>
    <div class="sh-sub">Quem tem maior fit com o imóvel</div>
  </div>
  <div class="s8-body" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:40px 68px">
    <div>
      <div class="s8-vcard s8-vc-div" style="margin-bottom:20px">
        <div class="s8-vc-lbl">RENDA MENSAL</div>
        <div class="s8-vc-val">${perfil.renda}</div>
        <div class="s8-vc-note">Capacidade de financiamento</div>
      </div>
      <div class="s8-pr">
        <div class="s8-pr-ico">${getIcon('users')}</div>
        <div class="s8-pr-body"><div class="s8-pr-ttl">Perfil demográfico</div><div class="s8-pr-dsc">${perfil.perfilTexto}</div></div>
      </div>
    </div>
    <div>
      <div class="s8-pr">
        <div class="s8-pr-ico">${getIcon('heart')}</div>
        <div class="s8-pr-body"><div class="s8-pr-ttl">Principais motivadores</div><div class="s8-pr-dsc">${perfil.motivacoes.join(' · ')}</div></div>
      </div>
      <div class="s8-note" style="margin-top:20px">
        <div class="s8-note-ico">${getIcon('map-pin')}</div>
        <div class="s8-note-txt"><strong>Área de prospecção:</strong> regiões com perfil similar</div>
      </div>
    </div>
  </div>
</div>`
}

function buildFechamento(d) {
  return `
<div class="slide" id="s10">
  <div class="sh">
    <div><div class="sh-tag">PRÓXIMOS PASSOS</div><div class="sh-title">Roteiro de<br>execução</div></div>
    <div class="sh-sub">Cronograma sugerido</div>
  </div>
  <div class="s7-body" style="justify-content:center">
    <div class="s7-pillars" style="grid-template-columns:repeat(3,1fr);margin-bottom:30px">
      <div class="s7-pillar"><div class="s7-p-ico">${getIcon('file-text')}</div><div class="s7-p-ttl">Semana 1-2</div><div class="s7-p-dsc">Validação documental e laudo de avaliação</div></div>
      <div class="s7-pillar"><div class="s7-p-ico">${getIcon('camera')}</div><div class="s7-p-ttl">Semana 2-3</div><div class="s7-p-dsc">Produção de fotos, vídeo e tour virtual</div></div>
      <div class="s7-pillar"><div class="s7-p-ico">${getIcon('megaphone')}</div><div class="s7-p-ttl">Semana 3-4</div><div class="s7-p-dsc">Lançamento da campanha + visitas agendadas</div></div>
    </div>
    <div class="s7-footnote">
      <div class="s7-fn-ico">${getIcon('calendar')}</div>
      <div class="s7-fn-txt"><strong>Reunião de alinhamento:</strong> agendamos para próxima terça para validação final</div>
    </div>
  </div>
</div>`
}

// Helpers
function getIcon(name) {
  const icons = {
    'shield': '<svg viewBox="0 0 24 24"><path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z"/></svg>',
    'alert': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/></svg>',
    'check': '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-circle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="18 8 12 16 8 12"/></svg>',
    'alert-circle': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    'warning': '<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'trending-up': '<svg viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8 10 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'trending-down': '<svg viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8 14 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    'lightbulb': '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17h8v-1.3c1.8-1.3 3-3.4 3-5.7a7 7 0 0 0-7-7z"/></svg>',
    'target': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    'clock': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'users': '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'heart': '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    'map-pin': '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'file-text': '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    'camera': '<svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    'megaphone': '<svg viewBox="0 0 24 24"><path d="M3 11h18v2H3z"/><path d="M20 9v6"/><path d="M4 9v6"/><path d="M9 19l-3-3h2l3 3z"/><path d="M15 19l3-3h-2l-3 3z"/></svg>',
    'calendar': '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'package': '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><polyline points="9 8 12 11 15 8"/></svg>',
    'info': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  }
  return icons[name] || '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>'
}

function getIconForStep(i) {
  const icons = [getIcon('shield'), getIcon('target'), getIcon('trending-up')]
  return icons[i] || icons[0]
}

function getMockSoldRows() {
  return `
    <div class="s5-td"><strong>Residencial Solar</strong><br><span class="s5-td carac">120m² · 3 quartos</span></div>
    <div class="s5-td">120m²</div>
    <div class="s5-td">R$ 780.000</div>
    <div class="s5-td"><span class="s5-badge">Vendido 45d</span></div>
  `
}

function getMockUnsoldRows() {
  return `
    <div class="s5-td"><strong>Park Tower</strong><br><span class="s5-td carac">118m² · 2 suítes</span></div>
    <div class="s5-td">118m²</div>
    <div class="s5-td">R$ 920.000</div>
    <div class="s5-td">127 dias</div>
    <div class="s5-td"><span class="s5-badge s5-badge-r">+12% acima</span></div>
  `
}