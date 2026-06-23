// _buildSlidesRealinhamento.js
// Slides para a apresentação de Realinhamento de Preço

export function buildSlidesRealinhamento(d, slides = []) {
  function e(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  if (!d) d = {};
  if (!d.residencial) d.residencial = 'Residencial';
  if (!d.nome) d.nome = 'Proprietário';
  if (!d.bairro) d.bairro = '';
  if (!d.nv) d.nv = [];
  if (!d.v) d.v = [];
  if (!d.visitas) d.visitas = [];
  if (!d.propostas) d.propostas = [];
  if (!d.acoes) d.acoes = [];

  var parseVal = function(s) { return parseInt((s||'').replace(/[^0-9]/g,''))||0; };
  var parseArea = function(s) { return parseFloat((s||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0; };

  // ── helpers de data ──────────────────────────────────────────────
  var fmtData = function(iso) {
    if (!iso) return '—';
    try {
      var parts = iso.split('-');
      if (parts.length === 3) return parts[2]+'/'+parts[1]+'/'+parts[0];
    } catch(x) {}
    return iso;
  };

  var diasEntre = function(iso1, iso2) {
    try {
      var d1 = new Date(iso1), d2 = new Date(iso2);
      return Math.round(Math.abs(d2-d1)/(1000*60*60*24));
    } catch(x) { return 0; }
  };

  var diasDesdeCampanha = function() {
    if (!d.data_inicio) return 0;
    return diasEntre(d.data_inicio, new Date().toISOString().split('T')[0]);
  };

  var totalVisitantes = (d.visitas||[]).reduce(function(acc, v){ return acc + (parseInt(v.qtd)||0); }, 0);
  var totalPropostas = (d.propostas||[]).length;
  var maiorProposta = (d.propostas||[]).reduce(function(acc, p){ var v = parseVal(p.valor); return v > acc ? v : acc; }, 0);
  var maiorPropostaFmt = maiorProposta > 0 ? 'R\u00a0' + maiorProposta.toLocaleString('pt-BR') : '—';
  var precoOriginalNum = parseVal(d.preco_original);
  var precoOriginalFmt = precoOriginalNum > 0 ? 'R\u00a0' + precoOriginalNum.toLocaleString('pt-BR') : (d.preco_original || '—');
  var diasCampanha = diasDesdeCampanha();


  // ══════════════════════════════════════════════════════════════════
  // S1 — CAPA
  // ══════════════════════════════════════════════════════════════════
  slides.push(`<div class="slide" id="s1">
  <div style="display:grid;grid-template-columns:1fr 1fr;height:100%">

    <!-- Esquerda -->
    <div style="background:#1d1d1f;padding:60px 56px;display:flex;flex-direction:column;justify-content:space-between">
      <div>
        <div style="font-size:.52rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:48px">Liberty Imóveis · Brasília</div>
        <div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#e67e22;margin-bottom:14px">Relatório de Campanha</div>
        <div style="font-size:clamp(2.4rem,4.2vw,4.6rem);font-weight:800;color:#fff;line-height:.88;letter-spacing:-.055em;margin-bottom:22px">
          Reali<br>nhamento<br><span style="color:#e67e22">de Preço</span>
        </div>
        <div style="font-size:.9rem;color:rgba(255,255,255,.5);line-height:1.6;max-width:320px">
          ${e(d.residencial)}${d.bairro ? ' · ' + e(d.bairro) : ''}
        </div>
      </div>
      <div style="font-size:.58rem;color:rgba(255,255,255,.25);letter-spacing:.08em">
        Preparado para ${e(d.nome)} · ${new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>

    <!-- Direita -->
    <div style="background:#f5f5f7;padding:60px 52px;display:flex;flex-direction:column;justify-content:center;gap:24px">

      <div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#888;margin-bottom:4px">Resumo da campanha</div>

      <div style="display:flex;flex-direction:column;gap:12px">
        <div style="background:#fff;border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.75rem;color:#555">Início da campanha</div>
          <div style="font-size:.95rem;font-weight:700;color:#1d1d1f">${fmtData(d.data_inicio)}</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.75rem;color:#555">Preço original anunciado</div>
          <div style="font-size:.95rem;font-weight:700;color:#c0392b">${e(precoOriginalFmt)}</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.75rem;color:#555">Dias em campanha</div>
          <div style="font-size:.95rem;font-weight:700;color:${diasCampanha >= 90 ? '#c0392b' : diasCampanha >= 45 ? '#e67e22' : '#27ae60'}">${diasCampanha > 0 ? diasCampanha + ' dias' : '—'}</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.75rem;color:#555">Visitas realizadas</div>
          <div style="font-size:.95rem;font-weight:700;color:#1d1d1f">${totalVisitantes > 0 ? totalVisitantes + ' visitante(s)' : '—'}</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.75rem;color:#555">Propostas recebidas</div>
          <div style="font-size:.95rem;font-weight:700;color:#1d1d1f">${totalPropostas > 0 ? totalPropostas + (totalPropostas === 1 ? ' proposta' : ' propostas') : 'Nenhuma'}</div>
        </div>
        ${maiorProposta > 0 ? `<div style="background:#fff0f0;border:1px solid rgba(192,57,43,.15);border-radius:12px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.75rem;color:#555">Maior proposta recebida</div>
          <div style="font-size:.95rem;font-weight:700;color:#c0392b">${e(maiorPropostaFmt)}</div>
        </div>` : ''}
      </div>

    </div>
  </div>
</div>`);


  // ══════════════════════════════════════════════════════════════════
  // S2 — LINHA DO TEMPO
  // ══════════════════════════════════════════════════════════════════
  var timelineItems = [];

  if (d.data_inicio) {
    timelineItems.push({
      data: fmtData(d.data_inicio),
      icon: '🚀',
      titulo: 'Início da campanha',
      desc: 'Imóvel lançado ao mercado' + (precoOriginalFmt !== '—' ? ' por ' + precoOriginalFmt : '') + '.',
      cor: '#27ae60',
    });
  }

  (d.acoes || []).forEach(function(a) {
    if (a) timelineItems.push({ data: '', icon: '✓', titulo: a, desc: '', cor: '#1266CD' });
  });

  (d.visitas || []).forEach(function(v, i) {
    if (v.data || v.qtd || v.feedback) {
      timelineItems.push({
        data: fmtData(v.data),
        icon: '👥',
        titulo: 'Visita' + (v.qtd ? ' — ' + v.qtd + ' visitante(s)' : ''),
        desc: v.feedback ? e(v.feedback.slice(0, 120)) + (v.feedback.length > 120 ? '…' : '') : '',
        cor: '#8e44ad',
      });
    }
  });

  (d.propostas || []).forEach(function(p, i) {
    if (p.valor || p.data) {
      timelineItems.push({
        data: fmtData(p.data),
        icon: '📋',
        titulo: 'Proposta recebida' + (p.valor ? ' — ' + e(p.valor) : ''),
        desc: '',
        cor: '#e67e22',
      });
    }
  });

  // ordenar por data se possível
  timelineItems.sort(function(a, b) {
    if (!a.data || a.data === '—') return 1;
    if (!b.data || b.data === '—') return -1;
    var pa = a.data.split('/'), pb = b.data.split('/');
    if (pa.length === 3 && pb.length === 3) {
      var da = new Date(pa[2]+'-'+pa[1]+'-'+pa[0]);
      var db = new Date(pb[2]+'-'+pb[1]+'-'+pb[0]);
      return da - db;
    }
    return 0;
  });

  var timelineRows = timelineItems.map(function(item, i) {
    var isLast = i === timelineItems.length - 1;
    return `<div style="display:flex;gap:16px;position:relative">
      <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0">
        <div style="width:36px;height:36px;border-radius:50%;background:${item.cor}18;border:2px solid ${item.cor};display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0">${item.icon}</div>
        ${!isLast ? `<div style="width:2px;flex:1;background:#e8e8ed;margin:4px 0;min-height:20px"></div>` : ''}
      </div>
      <div style="padding-bottom:${isLast?'0':'18px'};flex:1;min-width:0">
        ${item.data && item.data !== '—' ? `<div style="font-size:.6rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#888;margin-bottom:3px">${item.data}</div>` : ''}
        <div style="font-size:.82rem;font-weight:700;color:#1d1d1f;margin-bottom:${item.desc ? '4px' : '0'}">${item.titulo}</div>
        ${item.desc ? `<div style="font-size:.72rem;color:#6e6e73;line-height:1.5">${item.desc}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  slides.push(`<div class="slide" id="s2">
  <div class="s-head">
    <div>
      <div class="s-tag s-tag-blue">Histórico</div>
      <div class="s-title">Linha do tempo da campanha</div>
    </div>
    <div style="font-size:.72rem;color:#888;max-width:240px;text-align:right;line-height:1.4">
      Tudo o que aconteceu desde o início.
    </div>
  </div>
  <div style="overflow-y:auto;max-height:calc(100% - 90px);padding-bottom:16px">
    ${timelineRows || '<div style="padding:20px;font-size:.8rem;color:#a1a1a6">Nenhum evento registrado ainda.</div>'}
  </div>
</div>`);


  // ══════════════════════════════════════════════════════════════════
  // S3 — O QUE MUDOU NO MERCADO
  // ══════════════════════════════════════════════════════════════════
  slides.push(`<div class="slide" id="s3">
  <div class="s-head">
    <div>
      <div class="s-tag" style="background:#fff3cd;color:#856404">Contexto</div>
      <div class="s-title">O que mudou desde o início</div>
    </div>
    <div style="font-size:.72rem;color:#888;max-width:260px;text-align:right;line-height:1.4">
      O mercado não para enquanto o imóvel fica parado.
    </div>
  </div>
  <div style="overflow-y:auto;max-height:calc(100% - 90px);padding-bottom:16px">

    <!-- Cards de impacto -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">

      <div style="background:#fff0f0;border:1px solid rgba(192,57,43,.15);border-radius:14px;padding:20px 22px">
        <div style="font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c0392b;margin-bottom:8px">Tempo parado</div>
        <div style="font-size:2.4rem;font-weight:800;color:#c0392b;line-height:1;letter-spacing:-.04em;margin-bottom:6px">${diasCampanha > 0 ? diasCampanha : '—'}<span style="font-size:1rem;font-weight:600"> dias</span></div>
        <div style="font-size:.72rem;color:#6e6e73;line-height:1.5">Cada semana que passa, novos concorrentes entram com preços mais competitivos.</div>
      </div>

      <div style="background:#fff8f0;border:1px solid rgba(230,126,34,.15);border-radius:14px;padding:20px 22px">
        <div style="font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e67e22;margin-bottom:8px">Propostas rejeitadas</div>
        <div style="font-size:2.4rem;font-weight:800;color:#e67e22;line-height:1;letter-spacing:-.04em;margin-bottom:6px">${totalPropostas}<span style="font-size:1rem;font-weight:600"> proposta${totalPropostas !== 1 ? 's' : ''}</span></div>
        <div style="font-size:.72rem;color:#6e6e73;line-height:1.5">${maiorProposta > 0 ? 'A maior oferta foi ' + maiorPropostaFmt + ' — abaixo do preço pedido.' : 'Nenhuma proposta chegou ao valor pedido.'}</div>
      </div>

    </div>

    <!-- O que o mercado sinalizou -->
    <div style="background:#f0f6ff;border-left:3px solid #1266CD;border-radius:0 10px 10px 0;padding:14px 18px;margin-bottom:16px">
      <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1266CD;margin-bottom:8px">O que o mercado sinalizou</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${totalVisitantes > 0 ? `<div style="display:flex;align-items:flex-start;gap:8px;font-size:.75rem;color:#1d1d1f"><span style="color:#1266CD;flex-shrink:0">→</span><span><strong>${totalVisitantes} pessoas</strong> visitaram o imóvel. Interesse existe — o preço está afastando a decisão de compra.</span></div>` : ''}
        ${maiorProposta > 0 && precoOriginalNum > 0 ? `<div style="display:flex;align-items:flex-start;gap:8px;font-size:.75rem;color:#1d1d1f"><span style="color:#1266CD;flex-shrink:0">→</span><span>A maior proposta recebida representa <strong>${Math.round((maiorProposta/precoOriginalNum)*100)}% do valor pedido</strong>. O mercado está falando com dados.</span></div>` : ''}
        <div style="display:flex;align-items:flex-start;gap:8px;font-size:.75rem;color:#1d1d1f"><span style="color:#1266CD;flex-shrink:0">→</span><span>Imóveis bem precificados no Plano Piloto vendem em <strong>30 a 60 dias</strong>. Acima de 90 dias, o imóvel começa a ser percebido como "com problema".</span></div>
      </div>
    </div>

    <!-- Feedbacks das visitas -->
    ${d.visitas && d.visitas.some(function(v){ return v.feedback; }) ? `
    <div style="margin-bottom:4px">
      <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#555;margin-bottom:8px;display:flex;align-items:center;gap:6px"><span style="width:7px;height:7px;border-radius:50%;background:#8e44ad;flex-shrink:0"></span>Feedbacks dos visitantes</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${d.visitas.filter(function(v){ return v.feedback; }).map(function(v){
          return `<div style="background:#faf5ff;border:1px solid rgba(142,68,173,.12);border-radius:10px;padding:12px 16px">
            ${v.data ? `<div style="font-size:.6rem;color:#888;margin-bottom:4px">${fmtData(v.data)}</div>` : ''}
            <div style="font-size:.75rem;color:#4a235a;line-height:1.6;font-style:italic">"${e(v.feedback)}"</div>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

  </div>
</div>`);


  // ══════════════════════════════════════════════════════════════════
  // S4 — ATIVIDADE DA CAMPANHA
  // ══════════════════════════════════════════════════════════════════
  var acoesFiltradas = (d.acoes || []).filter(Boolean);
  var visitasList = (d.visitas || []).filter(function(v){ return v.data || v.qtd || v.feedback; });
  var propostasList = (d.propostas || []).filter(function(p){ return p.valor || p.data; });

  slides.push(`<div class="slide" id="s4">
  <div class="s-head">
    <div>
      <div class="s-tag s-tag-blue">Campanha</div>
      <div class="s-title">Tudo o que foi feito por você</div>
    </div>
    <div style="font-size:.72rem;color:#888;max-width:260px;text-align:right;line-height:1.4">
      Trabalho executado e resultados obtidos.
    </div>
  </div>
  <div style="overflow-y:auto;max-height:calc(100% - 90px);padding-bottom:16px">

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">

      <!-- Coluna esquerda: ações -->
      <div>
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1266CD;margin-bottom:10px;display:flex;align-items:center;gap:6px">
          <span style="width:7px;height:7px;border-radius:50%;background:#1266CD"></span>Ações realizadas
        </div>
        ${acoesFiltradas.length > 0 ? acoesFiltradas.map(function(a){
          return `<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f0f0f2">
            <div style="width:20px;height:20px;border-radius:6px;background:#e8f0fd;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#1266CD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5,5.5 4,8 9.5,2.5"/></svg>
            </div>
            <div style="font-size:.75rem;color:#1d1d1f;line-height:1.4">${e(a)}</div>
          </div>`;
        }).join('') : '<div style="font-size:.75rem;color:#a1a1a6;padding:8px 0">Nenhuma ação registrada.</div>'}
      </div>

      <!-- Coluna direita: visitas e propostas -->
      <div>
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8e44ad;margin-bottom:10px;display:flex;align-items:center;gap:6px">
          <span style="width:7px;height:7px;border-radius:50%;background:#8e44ad"></span>Visitas (${visitasList.length})
        </div>
        ${visitasList.length > 0 ? visitasList.map(function(v){
          return `<div style="padding:10px 0;border-bottom:1px solid #f0f0f2">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${v.feedback ? '4px' : '0'}">
              <div style="font-size:.72rem;font-weight:600;color:#1d1d1f">${v.qtd ? v.qtd + ' visitante(s)' : 'Visita'}</div>
              ${v.data ? `<div style="font-size:.6rem;color:#888">${fmtData(v.data)}</div>` : ''}
            </div>
            ${v.feedback ? `<div style="font-size:.65rem;color:#6e6e73;font-style:italic;line-height:1.5">"${e(v.feedback.slice(0,100))}${v.feedback.length>100?'…':''}"</div>` : ''}
          </div>`;
        }).join('') : '<div style="font-size:.75rem;color:#a1a1a6;padding:8px 0">Nenhuma visita registrada.</div>'}

        ${propostasList.length > 0 ? `
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#e67e22;margin:16px 0 10px;display:flex;align-items:center;gap:6px">
          <span style="width:7px;height:7px;border-radius:50%;background:#e67e22"></span>Propostas (${propostasList.length})
        </div>
        ${propostasList.map(function(p){
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f2">
            <div style="font-size:.78rem;font-weight:700;color:#e67e22">${e(p.valor||'—')}</div>
            ${p.data ? `<div style="font-size:.6rem;color:#888">${fmtData(p.data)}</div>` : ''}
          </div>`;
        }).join('')}` : ''}
      </div>

    </div>

    <!-- Conclusão -->
    <div style="margin-top:16px;background:#1d1d1f;border-radius:12px;padding:16px 20px">
      <div style="font-size:.68rem;color:rgba(255,255,255,.5);margin-bottom:4px">Diagnóstico</div>
      <div style="font-size:.82rem;color:#fff;line-height:1.6">
        O trabalho foi feito. Os portais estão ativos, as visitas aconteceram${totalPropostas > 0 ? ', chegaram propostas' : ''}. O mercado sinalizou que <strong style="color:#e67e22">o preço é o obstáculo</strong> — e só um ajuste resolve isso.
      </div>
    </div>

  </div>
</div>`);


  // ══════════════════════════════════════════════════════════════════
  // S5 — COMPARATIVO DE MERCADO (reusa buildS5 se tiver dados)
  // ══════════════════════════════════════════════════════════════════
  // Construído inline para não depender de import
  (function() {
    var parseVal2  = function(s){ return parseInt((s||'').replace(/[^0-9]/g,''))||0; };
    var parseArea2 = function(s){ return parseFloat((s||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0; };

    var diasColor = function(dd){
      var n = parseInt((dd||'').replace(/[^0-9]/g,''))||0;
      if(n===0) return '#888';
      if(n<30)  return '#27ae60';
      if(n<90)  return '#e67e22';
      if(n<180) return '#c0392b';
      return '#7f0000';
    };

    var buildRow = function(r, i, isNV){
      var val  = parseVal2(r.v);
      var area = parseArea2(r.a);
      var vm2  = area>0&&val>0 ? 'R\u00a0'+Math.round(val/area).toLocaleString('pt-BR')+'/m\u00b2' : '\u2014';
      var carac = r.c || [r.quartos?r.quartos+'qts':'', r.conservacao||''].filter(Boolean).join(' · ') || '—';
      var diasBadge = r.d
        ? '<span style="display:inline-block;background:'+diasColor(r.d)+';color:#fff;font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:20px">'+e(r.d)+'</span>'
        : '\u2014';
      var verBtn = (isNV && r.url)
        ? '<button onclick="openAnuncio(this.dataset.url)" data-url="'+(r.url||'').replace(/"/g,'&quot;')+'" style="background:#1266CD;border:none;color:#fff;border-radius:5px;padding:3px 7px;font-size:.58rem;font-weight:700;cursor:pointer">Ver \u2197</button>'
        : '';
      var bg = isNV ? '#fff' : '#f0fff4';
      var borderTop = i>0 ? 'border-top:1px solid #e8e8ed;' : '';
      var grid = isNV ? '1.8fr .5fr 2fr .8fr .7fr .7fr .35fr' : '1.8fr .5fr 2fr .8fr .7fr .7fr';
      return '<div style="display:grid;grid-template-columns:'+grid+';align-items:center;padding:8px 14px;background:'+bg+';'+borderTop+'">' +
        '<div style="font-size:.72rem"><strong>'+e(r.n||'Imóvel '+(i+1))+'</strong></div>' +
        '<div style="font-size:.68rem;color:#444">'+e(r.a||'—')+'m²</div>' +
        '<div style="font-size:.65rem;color:#555">'+e(carac)+'</div>' +
        '<div style="font-size:.7rem;font-weight:700;color:'+(isNV?'#c0392b':'#27ae60')+'">'+e(r.v||'—')+'</div>' +
        '<div style="font-size:.62rem;color:#888">'+vm2+'</div>' +
        '<div>'+diasBadge+'</div>' +
        (isNV ? '<div>'+verBtn+'</div>' : '') +
      '</div>';
    };

    var tblHdr = function(isNV){
      var grid = isNV ? '1.8fr .5fr 2fr .8fr .7fr .7fr .35fr' : '1.8fr .5fr 2fr .8fr .7fr .7fr';
      return '<div style="display:grid;grid-template-columns:'+grid+';padding:6px 14px;background:#f5f5f7;font-size:.6rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#888">' +
        '<div>Imóvel</div><div>Área</div><div>Características</div>' +
        (isNV ? '<div>Valor anunciado</div>' : '<div>Valor negociado</div>') +
        '<div>R$/m²</div><div>Parado</div>' + (isNV ? '<div></div>' : '') +
      '</div>';
    };

    var nvLocal = (d.nv||[]).filter(function(r){ return (r.cat||'local')==='local'; });
    var nvAmplo = (d.nv||[]).filter(function(r){ return r.cat==='amplo'; });
    var localRows = nvLocal.map(function(r,i){ return buildRow(r,i,true); }).join('');
    var amploRows = nvAmplo.map(function(r,i){ return buildRow(r,i,true); }).join('');
    var vRows     = (d.v||[]).map(function(r,i){ return buildRow(r,i,false); }).join('');

    if(!localRows && !amploRows) localRows = '<div style="padding:10px 14px;font-size:.72rem;color:#a1a1a6">Nenhum comparável cadastrado</div>';

    var secLabel = function(cor, txt){
      return '<div style="display:flex;align-items:center;gap:6px;padding:10px 14px 6px;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#555">' +
        '<span style="width:7px;height:7px;border-radius:50%;background:'+cor+';flex-shrink:0"></span>'+txt+'</div>';
    };

    // Insight de posicionamento do preço original vs concorrentes
    var nvVals = (d.nv||[]).map(function(r){ return parseVal2(r.v); }).filter(Boolean);
    var nvMedio = nvVals.length > 0 ? Math.round(nvVals.reduce(function(a,b){return a+b;},0)/nvVals.length) : 0;
    var posicionamentoBlock = '';
    if (precoOriginalNum > 0 && nvMedio > 0) {
      var diff = precoOriginalNum - nvMedio;
      var diffPct = Math.round((diff/nvMedio)*100);
      posicionamentoBlock = '<div style="margin-top:16px;background:' + (diff > 0 ? '#fff0f0' : '#f0fff4') + ';border-left:3px solid ' + (diff > 0 ? '#c0392b' : '#27ae60') + ';border-radius:0 8px 8px 0;padding:10px 14px">' +
        '<div style="font-size:.6rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:' + (diff > 0 ? '#c0392b' : '#27ae60') + ';margin-bottom:8px">Posicionamento do preço original</div>' +
        '<div style="font-size:.75rem;color:#1d1d1f;line-height:1.6">' +
        (diff > 0
          ? 'O imóvel foi lançado <strong>R\u00a0' + Math.abs(diff).toLocaleString('pt-BR') + ' (' + Math.abs(diffPct) + '%) acima</strong> da média dos concorrentes ativos. O comprador vê opções mais baratas primeiro.'
          : 'O imóvel está <strong>posicionado abaixo</strong> da média dos concorrentes. O preço não é o problema — revise outros fatores.') +
        '</div></div>';
    }

    slides.push('<div class="slide" id="s5r">' +
      '<div class="s-head"><div><div class="s-tag s-tag-blue">Mercado</div><div class="s-title">O que o comprador está vendo agora</div></div>' +
      '<div style="font-size:.72rem;color:#888;max-width:260px;text-align:right;line-height:1.4">Antes de propor, ele já comparou com esses.</div></div>' +
      '<div style="overflow-y:auto;max-height:calc(100% - 90px);padding-bottom:8px">' +
      (vRows ? '<div style="margin-bottom:4px">'+secLabel('#27ae60','Vendidos recentes — preço real de fechamento')+tblHdr(false)+vRows+'</div>' : '') +
      '<div style="margin-bottom:4px">'+secLabel('#1266CD','Concorrentes ativos')+tblHdr(true)+localRows+'</div>' +
      (amploRows ? '<div style="margin-bottom:4px">'+secLabel('#f59e0b','Também no radar do comprador')+tblHdr(true)+amploRows+'</div>' : '') +
      posicionamentoBlock +
      '</div></div>');
  })();


  // ══════════════════════════════════════════════════════════════════
  // S6 — CUSTO DE CONTINUAR PARADO
  // ══════════════════════════════════════════════════════════════════
  var selicNum = parseFloat((d.selic||'14,50').replace(',','.')) || 14.5;
  var custoMensal = precoOriginalNum > 0 ? Math.round(precoOriginalNum * (selicNum/100) / 12) : 0;
  var custoTotal  = custoMensal * Math.max(1, Math.round(diasCampanha / 30));
  var custoMensalFmt = custoMensal > 0 ? 'R\u00a0' + custoMensal.toLocaleString('pt-BR') : '—';
  var custoTotalFmt  = custoTotal  > 0 ? 'R\u00a0' + custoTotal.toLocaleString('pt-BR')  : '—';

  slides.push(`<div class="slide" id="s6r">
  <div class="s-head">
    <div>
      <div class="s-tag" style="background:#fff0f0;color:#c0392b">Custo real</div>
      <div class="s-title">O preço de não vender</div>
    </div>
    <div style="font-size:.72rem;color:#888;max-width:260px;text-align:right;line-height:1.4">
      Manter o preço alto tem um custo invisível — mas real.
    </div>
  </div>
  <div style="overflow-y:auto;max-height:calc(100% - 90px);padding-bottom:16px">

    <!-- Número de impacto -->
    <div style="background:#1d1d1f;border-radius:16px;padding:28px 32px;margin-bottom:16px">
      <div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px">Custo de oportunidade acumulado (${Math.max(1,Math.round(diasCampanha/30))} mes${Math.round(diasCampanha/30)>1?'es':''})</div>
      <div style="font-size:clamp(2rem,4vw,4rem);font-weight:800;color:#e67e22;line-height:1;letter-spacing:-.04em;margin-bottom:8px">${custoTotalFmt}</div>
      <div style="font-size:.75rem;color:rgba(255,255,255,.5);line-height:1.6">
        Calculado com a Selic atual de <strong style="color:rgba(255,255,255,.8)">${e(d.selic||'14,50%')}</strong> ao ano sobre o valor do imóvel — o que o capital aplicado renderia.
      </div>
    </div>

    <!-- Grid de cards -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:#fff;border:1px solid #e8e8ed;border-radius:12px;padding:18px;text-align:center">
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:8px">Custo mensal</div>
        <div style="font-size:1.3rem;font-weight:800;color:#c0392b">${custoMensalFmt}</div>
        <div style="font-size:.62rem;color:#a1a1a6;margin-top:4px">por mês parado</div>
      </div>
      <div style="background:#fff;border:1px solid #e8e8ed;border-radius:12px;padding:18px;text-align:center">
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:8px">Dias parado</div>
        <div style="font-size:1.3rem;font-weight:800;color:${diasCampanha>=90?'#c0392b':diasCampanha>=45?'#e67e22':'#555'}">${diasCampanha > 0 ? diasCampanha : '—'}</div>
        <div style="font-size:.62rem;color:#a1a1a6;margin-top:4px">desde o lançamento</div>
      </div>
      <div style="background:#fff;border:1px solid #e8e8ed;border-radius:12px;padding:18px;text-align:center">
        <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:8px">Propostas</div>
        <div style="font-size:1.3rem;font-weight:800;color:#555">${totalPropostas}</div>
        <div style="font-size:.62rem;color:#a1a1a6;margin-top:4px">recebidas e perdidas</div>
      </div>
    </div>

    <!-- Mensagem -->
    <div style="background:#f0f6ff;border-left:3px solid #1266CD;border-radius:0 10px 10px 0;padding:14px 18px">
      <div style="font-size:.75rem;color:#1d1d1f;line-height:1.7">
        O imóvel que não vende não está "esperando o preço certo" — ele está <strong>perdendo dinheiro todo mês</strong>. Um ajuste de ${precoOriginalNum > 0 && maiorProposta > 0 ? Math.round(((precoOriginalNum-maiorProposta)/precoOriginalNum)*100)+'%' : '5 a 10%'} pode ser o que falta para fechar em 30 dias e recuperar tudo isso — e ainda sobrar.
      </div>
    </div>

  </div>
</div>`);


  // ══════════════════════════════════════════════════════════════════
  // S7 — NOVA FAIXA DE PREÇO
  // ══════════════════════════════════════════════════════════════════
  var prec = d.prec || null;
  var temPrec = prec && prec.mercado && prec.mercado.total;

  slides.push(`<div class="slide" id="s7r">
  <div class="s-head">
    <div>
      <div class="s-tag s-tag-blue">Precificação</div>
      <div class="s-title">Nova faixa de preço recomendada</div>
    </div>
    <div style="font-size:.72rem;color:#888;max-width:260px;text-align:right;line-height:1.4">
      Baseada nos dados reais do mercado atual.
    </div>
  </div>
  <div style="overflow-y:auto;max-height:calc(100% - 90px);padding-bottom:16px">
    ${temPrec ? `
    <!-- Faixas -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px">

      ${[
        { key:'competitivo', label:'Competitivo', sub:'Fechar rápido (15–30 dias)', cor:'#27ae60', bg:'#f0fff4', border:'rgba(39,174,96,.2)' },
        { key:'mercado',     label:'Mercado',     sub:'Equilíbrio ideal (30–60 dias)', cor:'#1266CD', bg:'#eff6ff', border:'rgba(18,102,205,.2)', destaque: prec.recomendacao === 'mercado' },
        { key:'otimista',   label:'Otimista',    sub:'Negociação com margem (60–90 dias)', cor:'#e67e22', bg:'#fff8f0', border:'rgba(230,126,34,.2)' },
      ].map(function(f) {
        var faixa = prec[f.key];
        if (!faixa) return '';
        return `<div style="background:${f.bg};border:${f.destaque ? '2px solid '+f.cor : '1px solid '+f.border};border-radius:14px;padding:20px;position:relative${f.destaque ? ';box-shadow:0 4px 20px rgba(18,102,205,.12)' : ''}">
          ${f.destaque ? `<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:${f.cor};color:#fff;font-size:.52rem;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap">Recomendado</div>` : ''}
          <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${f.cor};margin-bottom:8px">${f.label}</div>
          <div style="font-size:1.5rem;font-weight:800;color:${f.cor};line-height:1;letter-spacing:-.03em;margin-bottom:4px">${e(faixa.totalFmt||'—')}</div>
          <div style="font-size:.62rem;color:#6e6e73;margin-bottom:12px">${e(faixa.vm2Fmt||'—')}</div>
          <div style="font-size:.7rem;color:#555;line-height:1.5">${f.sub}</div>
          ${precoOriginalNum > 0 && faixa.total ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid ${f.border};font-size:.65rem;color:${f.cor};font-weight:600">
            Ajuste: ${faixa.total < precoOriginalNum ? '-' : '+'}R\u00a0${Math.abs(faixa.total - precoOriginalNum).toLocaleString('pt-BR')} (${faixa.total < precoOriginalNum ? '-' : '+'}${Math.abs(Math.round(((faixa.total-precoOriginalNum)/precoOriginalNum)*100))}%)
          </div>` : ''}
        </div>`;
      }).join('')}
    </div>

    ${prec.justificativa ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px">
      <div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1266CD;margin-bottom:8px">Análise da IA</div>
      <div style="font-size:.78rem;color:#374151;line-height:1.7">${e(prec.justificativa)}</div>
    </div>` : ''}

    ` : `
    <!-- Sem dados de precificação -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:32px;text-align:center">
      <div style="font-size:2rem;margin-bottom:12px">📊</div>
      <div style="font-size:.85rem;font-weight:700;color:#1d1d1f;margin-bottom:8px">Precificação não calculada</div>
      <div style="font-size:.75rem;color:#6e6e73;line-height:1.6;max-width:320px;margin:0 auto">
        Preencha os concorrentes e clique em "Precificar" no formulário para gerar as faixas de preço recomendadas com base no mercado atual.
      </div>
    </div>
    `}
  </div>
</div>`);


  // ══════════════════════════════════════════════════════════════════
  // S8 — RECOMENDAÇÃO FINAL
  // ══════════════════════════════════════════════════════════════════
  var precoNovo = temPrec && prec[prec.recomendacao] ? prec[prec.recomendacao].totalFmt : (temPrec ? prec.mercado.totalFmt : null);
  var ajustePct = temPrec && prec[prec.recomendacao] && precoOriginalNum > 0
    ? Math.abs(Math.round(((prec[prec.recomendacao].total - precoOriginalNum)/precoOriginalNum)*100))
    : null;

  slides.push(`<div class="slide" id="s8r">
  <div style="display:grid;grid-template-columns:1fr 1fr;height:100%">

    <!-- Esquerda -->
    <div style="background:#1d1d1f;padding:60px 56px;display:flex;flex-direction:column;justify-content:space-between">
      <div>
        <div style="font-size:.52rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:48px">Recomendação</div>
        <div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#e67e22;margin-bottom:14px">Nossa posição</div>
        <div style="font-size:clamp(2rem,3.6vw,4rem);font-weight:800;color:#fff;line-height:.9;letter-spacing:-.055em;margin-bottom:24px">
          Chegou a<br>hora de<br><span style="color:#e67e22">realinhar.</span>
        </div>
        <div style="font-size:.8rem;color:rgba(255,255,255,.55);line-height:1.7;max-width:320px">
          Todos os dados apontam na mesma direção. Não é uma pressão — é o mercado comunicando o preço justo.
        </div>
      </div>
      <div>
        ${precoNovo ? `
        <div style="background:rgba(255,255,255,.06);border-radius:12px;padding:18px 22px;margin-bottom:16px">
          <div style="font-size:.52rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:6px">Novo preço sugerido</div>
          <div style="font-size:2rem;font-weight:800;color:#e67e22;letter-spacing:-.04em">${e(precoNovo)}</div>
          ${ajustePct !== null ? `<div style="font-size:.68rem;color:rgba(255,255,255,.4);margin-top:4px">Ajuste de ${ajustePct}% sobre o preço atual</div>` : ''}
        </div>` : ''}
        <div style="font-size:.58rem;color:rgba(255,255,255,.2);letter-spacing:.08em">Liberty Imóveis · Brasília, DF</div>
      </div>
    </div>

    <!-- Direita -->
    <div style="background:#f5f5f7;padding:60px 52px;display:flex;flex-direction:column;justify-content:center;gap:16px">

      <div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#888;margin-bottom:8px">Próximos passos</div>

      <div style="display:flex;flex-direction:column;gap:10px">

        <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff;border-radius:12px;border:1px solid #e8e8ed">
          <div style="width:32px;height:32px;border-radius:9px;background:#e8f0fd;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="font-size:.9rem">1</span>
          </div>
          <div>
            <div style="font-size:.8rem;font-weight:700;color:#1d1d1f;margin-bottom:3px">Autorizar o ajuste de preço</div>
            <div style="font-size:.68rem;color:#6e6e73;line-height:1.5">Formalizar o novo valor para atualizarmos todos os portais imediatamente.</div>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff;border-radius:12px;border:1px solid #e8e8ed">
          <div style="width:32px;height:32px;border-radius:9px;background:#e8f0fd;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="font-size:.9rem">2</span>
          </div>
          <div>
            <div style="font-size:.8rem;font-weight:700;color:#1d1d1f;margin-bottom:3px">Reativação da campanha</div>
            <div style="font-size:.68rem;color:#6e6e73;line-height:1.5">Novo impulso de mídia com o preço corrigido — o algoritmo dos portais favorece anúncios recém-atualizados.</div>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff;border-radius:12px;border:1px solid #e8e8ed">
          <div style="width:32px;height:32px;border-radius:9px;background:#e8f0fd;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="font-size:.9rem">3</span>
          </div>
          <div>
            <div style="font-size:.8rem;font-weight:700;color:#1d1d1f;margin-bottom:3px">Retomar contato com os interessados</div>
            <div style="font-size:.68rem;color:#6e6e73;line-height:1.5">Os visitantes anteriores serão notificados — muitos já estão prontos para proposta.</div>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff0f0;border-radius:12px;border:1px solid rgba(192,57,43,.12)">
          <div style="width:32px;height:32px;border-radius:9px;background:#fff0f0;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <span style="font-size:.9rem">⏱</span>
          </div>
          <div>
            <div style="font-size:.8rem;font-weight:700;color:#c0392b;margin-bottom:3px">Meta: fechar em 30 dias</div>
            <div style="font-size:.68rem;color:#6e6e73;line-height:1.5">Com o preço alinhado, esse é um prazo realista — e dentro do padrão de mercado do Plano Piloto.</div>
          </div>
        </div>

      </div>

    </div>
  </div>
</div>`);

  return slides;
}
