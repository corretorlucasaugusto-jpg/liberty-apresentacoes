// _buildSlidesRealinhamento.js
// Slides para a apresentação de Realinhamento de Preço
// 100% inline styles — sem dependência de classes externas

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

  // ── helpers de data ──
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

  var fmtDias = function(dias) {
    if (dias <= 0) return '—';
    var meses = Math.floor(dias / 30);
    var restoDias = dias % 30;
    if (meses === 0) return dias + ' dias';
    if (restoDias === 0) return meses + ' mes' + (meses > 1 ? 'es' : '');
    return meses + ' mes' + (meses > 1 ? 'es' : '') + ' e ' + restoDias + ' dias';
  };

  var fmtBRL = function(num) {
    if (!num || num <= 0) return '—';
    return 'R$ ' + num.toLocaleString('pt-BR');
  };

  var totalVisitantes = (d.visitas||[]).reduce(function(acc, v){ return acc + (parseInt(v.qtd)||0); }, 0);
  var totalPropostas = (d.propostas||[]).length;
  var maiorProposta = (d.propostas||[]).reduce(function(acc, p){ var v = parseVal(p.valor); return v > acc ? v : acc; }, 0);
  var precoOriginalNum = parseVal(d.preco_original);
  var precoOriginalFmt = precoOriginalNum > 0 ? fmtBRL(precoOriginalNum) : (d.preco_original || '—');
  var diasCampanha = diasDesdeCampanha();

  // slide wrapper helper
  var wrap = function(id, inner) {
    return '<div class="slide" id="'+id+'" style="display:flex;flex-direction:column;height:100%;overflow:hidden">' + inner + '</div>';
  };

  // cabeçalho de slide padrão
  var slideHead = function(tag, tagColor, tagBg, title, sub) {
    return '<div style="padding:32px 52px 22px;border-bottom:1px solid #e8e8ed;display:flex;justify-content:space-between;align-items:flex-end;flex-shrink:0">' +
      '<div><div style="display:inline-block;padding:3px 10px;background:'+tagBg+';color:'+tagColor+';font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;border-radius:4px;margin-bottom:10px">'+tag+'</div>' +
      '<div style="font-size:clamp(1.4rem,2.4vw,2.2rem);font-weight:800;color:#1d1d1f;line-height:.95;letter-spacing:-.03em">'+title+'</div></div>' +
      (sub ? '<div style="font-size:.72rem;color:#888;max-width:240px;text-align:right;line-height:1.5">'+sub+'</div>' : '') +
    '</div>';
  };

  var slideBody = function(inner) {
    return '<div style="flex:1;overflow-y:auto;overflow-x:hidden;padding:24px 52px 32px">' + inner + '</div>';
  };


  // ══════════════════════════════════════════════════════════════════
  // S1 — CAPA
  // ══════════════════════════════════════════════════════════════════
  var diasColor = diasCampanha >= 90 ? '#c0392b' : diasCampanha >= 45 ? 'e67e22' : '#27ae60';

  slides.push(wrap('s1r', '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">' +

    // Esquerda escura
    '<div style="background:#1d1d1f;padding:60px 56px;display:flex;flex-direction:column;justify-content:space-between">' +
      '<div>' +
        '<div style="font-size:.52rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:52px">Liberty Imóveis · Brasília</div>' +
        '<div style="font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#e67e22;margin-bottom:16px">Relatório de campanha</div>' +
        '<div style="font-size:clamp(3rem,5vw,5.4rem);font-weight:900;color:#fff;line-height:.82;letter-spacing:-.06em;margin-bottom:28px">Reali<wbr>nha<br>mento<br><span style="color:#e67e22">de Preço</span></div>' +
        '<div style="font-size:.88rem;color:rgba(255,255,255,.45);line-height:1.65">'+e(d.residencial)+(d.bairro ? ' &middot; '+e(d.bairro) : '')+'</div>' +
      '</div>' +
      '<div style="font-size:.58rem;color:rgba(255,255,255,.2);letter-spacing:.08em">Preparado para '+e(d.nome)+' &middot; '+new Date().toLocaleDateString('pt-BR')+'</div>' +
    '</div>' +

    // Direita clara com stats
    '<div style="background:#f5f5f7;padding:60px 52px;display:flex;flex-direction:column;justify-content:center;gap:0">' +
      '<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#a1a1a6;margin-bottom:18px">Resumo da campanha</div>' +
      '<div style="display:flex;flex-direction:column;gap:1px;background:#e8e8ed;border:1px solid #e8e8ed">' +

        // stat row helper
        [
          ['Início da campanha', fmtData(d.data_inicio), '#1d1d1f'],
          ['Preço original anunciado', precoOriginalFmt, '#c0392b'],
          ['Dias em campanha', diasCampanha > 0 ? fmtDias(diasCampanha) : '—', diasCampanha >= 90 ? '#c0392b' : diasCampanha >= 45 ? '#e67e22' : '#27ae60'],
          ['Visitas realizadas', totalVisitantes > 0 ? totalVisitantes + ' visitante(s)' : '—', '#1d1d1f'],
          ['Propostas recebidas', totalPropostas > 0 ? totalPropostas + (totalPropostas===1?' proposta':' propostas') : 'Nenhuma', '#1d1d1f'],
          maiorProposta > 0 ? ['Maior proposta recebida', fmtBRL(maiorProposta), '#c0392b'] : null,
        ].filter(Boolean).map(function(row) {
          return '<div style="background:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between">' +
            '<div style="font-size:.76rem;color:#6e6e73">'+row[0]+'</div>' +
            '<div style="font-size:.92rem;font-weight:700;color:'+row[2]+'">'+e(String(row[1]))+'</div>' +
          '</div>';
        }).join('') +

      '</div>' +
    '</div>' +

  '</div>'
  ));


  // ══════════════════════════════════════════════════════════════════
  // S2 — LINHA DO TEMPO
  // ══════════════════════════════════════════════════════════════════
  var timelineItems = [];

  if (d.data_inicio) {
    timelineItems.push({ data: fmtData(d.data_inicio), emoji: '🚀', titulo: 'Início da campanha', desc: 'Imóvel lançado ao mercado' + (precoOriginalFmt !== '—' ? ' por ' + precoOriginalFmt : '') + '.', cor: '#1266CD' });
  }

  (d.acoes || []).filter(Boolean).forEach(function(a) {
    timelineItems.push({ data: '', emoji: '✓', titulo: a, desc: '', cor: '#27ae60' });
  });

  (d.visitas || []).forEach(function(v) {
    if (v.data || v.qtd || v.feedback) {
      timelineItems.push({
        data: fmtData(v.data), emoji: '👥',
        titulo: 'Visita' + (v.qtd ? ' — ' + v.qtd + ' visitante(s)' : ''),
        desc: v.feedback ? e(v.feedback.slice(0,140)) + (v.feedback.length > 140 ? '…' : '') : '',
        cor: '#8e44ad',
      });
    }
  });

  (d.propostas || []).forEach(function(p) {
    if (p.valor || p.data) {
      timelineItems.push({ data: fmtData(p.data), emoji: '📋', titulo: 'Proposta recebida' + (p.valor ? ' — ' + e(p.valor) : ''), desc: '', cor: '#e67e22' });
    }
  });

  // ordenar por data
  timelineItems.sort(function(a, b) {
    if (!a.data || a.data === '—' || !a.data.includes('/')) return 1;
    if (!b.data || b.data === '—' || !b.data.includes('/')) return -1;
    var pa = a.data.split('/'), pb = b.data.split('/');
    if (pa.length === 3 && pb.length === 3) {
      return new Date(pa[2]+'-'+pa[1]+'-'+pa[0]) - new Date(pb[2]+'-'+pb[1]+'-'+pb[0]);
    }
    return 0;
  });

  // split em 2 colunas para não ficar lista longa
  var col1 = timelineItems.filter(function(_,i){ return i % 2 === 0; });
  var col2 = timelineItems.filter(function(_,i){ return i % 2 === 1; });

  var renderTLItem = function(item) {
    return '<div style="display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid #f0f0f2">' +
      '<div style="width:38px;height:38px;border-radius:50%;background:'+item.cor+'18;border:1.5px solid '+item.cor+'40;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0">'+item.emoji+'</div>' +
      '<div style="flex:1;min-width:0">' +
        (item.data && item.data !== '—' ? '<div style="font-size:.58rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a1a1a6;margin-bottom:3px">'+item.data+'</div>' : '') +
        '<div style="font-size:.8rem;font-weight:700;color:#1d1d1f;margin-bottom:'+( item.desc ? '4px' : '0')+'">'+e(item.titulo)+'</div>' +
        (item.desc ? '<div style="font-size:.7rem;color:#6e6e73;line-height:1.5;font-style:italic">&ldquo;'+item.desc+'&rdquo;</div>' : '') +
      '</div>' +
    '</div>';
  };

  slides.push(wrap('s2r',
    slideHead('Histórico', '#1266CD', '#e8f0fd', 'Linha do tempo da campanha', 'Tudo o que aconteceu desde o lançamento.') +
    slideBody(
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 32px">' +
        '<div>' + (col1.length ? col1.map(renderTLItem).join('') : '<div style="font-size:.8rem;color:#a1a1a6;padding:16px 0">Nenhum evento registrado.</div>') + '</div>' +
        '<div style="border-left:1px solid #e8e8ed;padding-left:32px">' + col2.map(renderTLItem).join('') + '</div>' +
      '</div>'
    )
  ));


  // ══════════════════════════════════════════════════════════════════
  // S3 — O QUE MUDOU NO MERCADO
  // ══════════════════════════════════════════════════════════════════
  var feedbacks = (d.visitas||[]).filter(function(v){ return v.feedback; });

  var posicionamentoInsight = '';
  var nvVals = (d.nv||[]).map(function(r){ return parseVal(r.v); }).filter(Boolean);
  var nvMedio = nvVals.length > 0 ? Math.round(nvVals.reduce(function(a,b){return a+b;},0)/nvVals.length) : 0;
  if (precoOriginalNum > 0 && nvMedio > 0) {
    var diff = precoOriginalNum - nvMedio;
    var diffPct = Math.abs(Math.round((diff/nvMedio)*100));
    if (diff > 0) {
      posicionamentoInsight = 'O imóvel foi lançado <strong>R$ ' + Math.abs(diff).toLocaleString('pt-BR') + ' (' + diffPct + '%) acima</strong> da média dos concorrentes ativos. O comprador vê opções mais baratas antes de chegar ao seu imóvel.';
    } else {
      posicionamentoInsight = 'O imóvel está posicionado abaixo da média dos concorrentes em preço absoluto — mas <strong>outros fatores</strong> (andar, conservação, localização no bloco) explicam a ausência de propostas.';
    }
  }

  slides.push(wrap('s3r',
    slideHead('Contexto', '#856404', '#fefce8', 'O que o mercado comunicou', 'Dados, não pressão.') +
    slideBody(
      // 2 cards de impacto no topo
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px">' +

        '<div style="background:#fff0f0;border:1px solid rgba(192,57,43,.15);border-radius:14px;padding:22px 24px">' +
          '<div style="font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c0392b;margin-bottom:10px">Tempo em campanha</div>' +
          '<div style="font-size:2.8rem;font-weight:900;color:#c0392b;line-height:1;letter-spacing:-.04em;margin-bottom:8px">'+diasCampanha+'<span style="font-size:1.1rem;font-weight:600"> dias</span></div>' +
          '<div style="font-size:.72rem;color:#6e6e73;line-height:1.6">Imóveis bem precificados no Plano Piloto vendem entre 30 e 60 dias. Após 90 dias, o imóvel começa a ser percebido como problemático pelo mercado.</div>' +
        '</div>' +

        '<div style="background:#fff8f0;border:1px solid rgba(230,126,34,.15);border-radius:14px;padding:22px 24px">' +
          '<div style="font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e67e22;margin-bottom:10px">Propostas recebidas</div>' +
          '<div style="font-size:2.8rem;font-weight:900;color:#e67e22;line-height:1;letter-spacing:-.04em;margin-bottom:8px">'+totalPropostas+'<span style="font-size:1.1rem;font-weight:600"> proposta'+( totalPropostas !== 1 ? 's' : '')+'</span></div>' +
          '<div style="font-size:.72rem;color:#6e6e73;line-height:1.6">' +
            (maiorProposta > 0 ? 'Maior oferta recebida: <strong style="color:#e67e22">'+fmtBRL(maiorProposta)+'</strong> — ' + (precoOriginalNum > 0 ? Math.round((maiorProposta/precoOriginalNum)*100) + '% do preço pedido.' : '') + '' : 'Nenhuma proposta chegou — o mercado não reconhece o preço pedido como justo.') +
          '</div>' +
        '</div>' +

      '</div>' +

      // sinais do mercado
      '<div style="background:#f0f6ff;border-left:3px solid #1266CD;border-radius:0 12px 12px 0;padding:16px 20px;margin-bottom:20px">' +
        '<div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1266CD;margin-bottom:10px">O que o mercado sinalizou</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          (totalVisitantes > 0 ? '<div style="display:flex;gap:8px;font-size:.76rem;color:#1d1d1f;line-height:1.55"><span style="color:#1266CD;flex-shrink:0;font-size:.9rem">→</span><span><strong>'+totalVisitantes+' pessoas</strong> visitaram o imóvel. O interesse existe — o preço está bloqueando a decisão de compra.</span></div>' : '') +
          (posicionamentoInsight ? '<div style="display:flex;gap:8px;font-size:.76rem;color:#1d1d1f;line-height:1.55"><span style="color:#1266CD;flex-shrink:0;font-size:.9rem">→</span><span>'+posicionamentoInsight+'</span></div>' : '') +
          '<div style="display:flex;gap:8px;font-size:.76rem;color:#1d1d1f;line-height:1.55"><span style="color:#1266CD;flex-shrink:0;font-size:.9rem">→</span><span>Cada semana que passa, novos concorrentes entram com preços mais agressivos — e o seu imóvel perde posição de destaque nos portais.</span></div>' +
        '</div>' +
      '</div>' +

      // feedbacks
      (feedbacks.length > 0 ?
        '<div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8e44ad;margin-bottom:10px;display:flex;align-items:center;gap:8px"><span style="width:7px;height:7px;border-radius:50%;background:#8e44ad"></span>Feedbacks dos visitantes</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          feedbacks.map(function(v){
            return '<div style="background:#faf5ff;border:1px solid rgba(142,68,173,.12);border-radius:10px;padding:12px 16px">' +
              (v.data ? '<div style="font-size:.6rem;color:#a1a1a6;margin-bottom:5px">'+fmtData(v.data)+'</div>' : '') +
              '<div style="font-size:.76rem;color:#4a235a;line-height:1.65;font-style:italic">&ldquo;'+e(v.feedback)+'&rdquo;</div>' +
            '</div>';
          }).join('') +
        '</div>'
      : '')
    )
  ));


  // ══════════════════════════════════════════════════════════════════
  // S4 — ATIVIDADE DA CAMPANHA
  // ══════════════════════════════════════════════════════════════════
  var acoesFiltradas = (d.acoes || []).filter(Boolean);
  var visitasList = (d.visitas || []).filter(function(v){ return v.data || v.qtd || v.feedback; });
  var propostasList = (d.propostas || []).filter(function(p){ return p.valor || p.data; });

  slides.push(wrap('s4r',
    slideHead('Campanha', '#1266CD', '#e8f0fd', 'Tudo o que foi feito por você', 'Trabalho executado — resultado obtido.') +
    slideBody(
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px">' +

        // Ações
        '<div>' +
          '<div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1266CD;margin-bottom:12px;display:flex;align-items:center;gap:7px"><span style="width:7px;height:7px;border-radius:50%;background:#1266CD"></span>Ações realizadas ('+acoesFiltradas.length+')</div>' +
          (acoesFiltradas.length > 0 ?
            acoesFiltradas.map(function(a){
              return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f0f0f2">' +
                '<div style="width:20px;height:20px;border-radius:6px;background:#e8f0fd;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
                  '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#1266CD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5,5 3.5,7.5 8.5,2"/></svg>' +
                '</div>' +
                '<div style="font-size:.76rem;color:#1d1d1f;line-height:1.4">'+e(a)+'</div>' +
              '</div>';
            }).join('')
          : '<div style="font-size:.75rem;color:#a1a1a6;padding:8px 0">Nenhuma ação registrada.</div>') +
        '</div>' +

        // Visitas + propostas
        '<div>' +
          '<div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8e44ad;margin-bottom:12px;display:flex;align-items:center;gap:7px"><span style="width:7px;height:7px;border-radius:50%;background:#8e44ad"></span>Visitas ('+visitasList.length+')</div>' +
          (visitasList.length > 0 ?
            visitasList.map(function(v){
              return '<div style="padding:10px 0;border-bottom:1px solid #f0f0f2">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;' + (v.feedback ? 'margin-bottom:4px' : '') + '">' +
                  '<div style="font-size:.76rem;font-weight:600;color:#1d1d1f">' + (v.qtd ? v.qtd+' visitante(s)' : 'Visita') + '</div>' +
                  (v.data ? '<div style="font-size:.6rem;color:#888">'+fmtData(v.data)+'</div>' : '') +
                '</div>' +
                (v.feedback ? '<div style="font-size:.66rem;color:#6e6e73;font-style:italic;line-height:1.5">&ldquo;'+e(v.feedback.slice(0,100))+(v.feedback.length>100?'…':'')+'&rdquo;</div>' : '') +
              '</div>';
            }).join('')
          : '<div style="font-size:.75rem;color:#a1a1a6;padding:8px 0">Nenhuma visita registrada.</div>') +

          (propostasList.length > 0 ?
            '<div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#e67e22;margin:18px 0 12px;display:flex;align-items:center;gap:7px"><span style="width:7px;height:7px;border-radius:50%;background:#e67e22"></span>Propostas ('+propostasList.length+')</div>' +
            propostasList.map(function(p){
              return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f2">' +
                '<div style="font-size:.82rem;font-weight:700;color:#e67e22">'+e(p.valor||'—')+'</div>' +
                (p.data ? '<div style="font-size:.6rem;color:#888">'+fmtData(p.data)+'</div>' : '') +
              '</div>';
            }).join('')
          : '') +
        '</div>' +

      '</div>' +

      // Diagnóstico
      '<div style="margin-top:20px;background:#1d1d1f;border-radius:12px;padding:18px 22px">' +
        '<div style="font-size:.58rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:6px">Diagnóstico</div>' +
        '<div style="font-size:.84rem;color:#fff;line-height:1.7">O trabalho foi executado. Portais ativos, visitas realizadas' + (totalPropostas > 0 ? ', propostas chegaram' : '') + '. O mercado respondeu — e o sinal é claro: <strong style="color:#e67e22">o preço é o único obstáculo.</strong></div>' +
      '</div>'
    )
  ));


  // ══════════════════════════════════════════════════════════════════
  // S5 — COMPARATIVO DE MERCADO (inline, sem depender de buildS5)
  // ══════════════════════════════════════════════════════════════════
  (function() {
    var diasColor = function(dd){
      var n = parseInt((dd||'').replace(/[^0-9]/g,''))||0;
      if(n===0) return '#888'; if(n<30) return '#27ae60'; if(n<90) return '#e67e22'; if(n<180) return '#c0392b'; return '#7f0000';
    };

    var buildRow = function(r, i, isNV){
      var val = parseVal(r.v), area = parseArea(r.a);
      var vm2 = area>0&&val>0 ? 'R$\u00a0'+Math.round(val/area).toLocaleString('pt-BR')+'/m\u00b2' : '\u2014';
      var carac = r.c || [r.quartos?r.quartos+' qts':'', r.conservacao||''].filter(Boolean).join(' · ') || '—';
      var diasBadge = r.d ? '<span style="display:inline-block;background:'+diasColor(r.d)+';color:#fff;font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:20px">'+e(r.d)+'</span>' : '\u2014';
      var verBtn = (isNV && r.url) ? '<button onclick="openAnuncio(this.dataset.url)" data-url="'+r.url.replace(/"/g,'&quot;')+'" style="background:#1266CD;border:none;color:#fff;border-radius:5px;padding:3px 7px;font-size:.58rem;font-weight:700;cursor:pointer">Ver \u2197</button>' : '';
      var bg = isNV ? '#fff' : '#f0fff4';
      var grid = isNV ? '1.8fr .5fr 2fr .8fr .7fr .7fr .35fr' : '1.8fr .5fr 2fr .8fr .7fr .7fr';
      return '<div style="display:grid;grid-template-columns:'+grid+';align-items:center;padding:8px 14px;background:'+bg+';' + (i>0?'border-top:1px solid #e8e8ed;':'')+'">' +
        '<div style="font-size:.72rem"><strong>'+e(r.n||'Imóvel '+(i+1))+'</strong></div>' +
        '<div style="font-size:.68rem;color:#444">'+e(r.a||'—')+'m²</div>' +
        '<div style="font-size:.65rem;color:#555">'+e(carac)+'</div>' +
        '<div style="font-size:.7rem;font-weight:700;color:' + (isNV?'#c0392b':'#27ae60')+'">'+e(r.v||'—')+'</div>' +
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

    var secLabel = function(cor, txt){
      return '<div style="display:flex;align-items:center;gap:6px;padding:10px 14px 6px;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#555">' +
        '<span style="width:7px;height:7px;border-radius:50%;background:'+cor+';flex-shrink:0"></span>'+txt+'</div>';
    };

    var nvLocal = (d.nv||[]).filter(function(r){ return (r.cat||'local')==='local'; });
    var nvAmplo = (d.nv||[]).filter(function(r){ return r.cat==='amplo'; });
    var localRows = nvLocal.map(function(r,i){ return buildRow(r,i,true); }).join('');
    var amploRows = nvAmplo.map(function(r,i){ return buildRow(r,i,true); }).join('');
    var vRows = (d.v||[]).map(function(r,i){ return buildRow(r,i,false); }).join('');

    if(!localRows && !amploRows) localRows = '<div style="padding:10px 14px;font-size:.72rem;color:#a1a1a6">Nenhum comparável cadastrado</div>';

    // insight posicionamento
    var insightBlock = '';
    if (precoOriginalNum > 0 && nvMedio > 0) {
      var diff2 = precoOriginalNum - nvMedio;
      var cor2 = diff2 > 0 ? '#c0392b' : '#27ae60';
      var txt2 = diff2 > 0
        ? 'O imóvel está anunciado por <strong>R$ '+Math.abs(diff2).toLocaleString('pt-BR')+' acima</strong> da média dos concorrentes ativos. O comprador enxerga opções mais baratas antes.'
        : 'O preço está dentro da faixa de mercado. Outros fatores explicam a dificuldade de venda.';
      insightBlock = '<div style="margin-top:12px;background:' + (diff2>0?'#fff0f0':'#f0fff4')+';border-left:3px solid '+cor2+';border-radius:0 8px 8px 0;padding:10px 14px;font-size:.75rem;color:#1d1d1f;line-height:1.6">'+txt2+'</div>';
    }

    slides.push(wrap('s5r',
      slideHead('Mercado', '#1266CD', '#e8f0fd', 'O que o comprador está vendo agora', 'Antes de propor, ele já comparou com esses.') +
      '<div style="flex:1;overflow-y:auto;padding:0 0 16px">' +
        (vRows ? '<div style="margin-bottom:4px">'+secLabel('#27ae60','Vendidos recentes — preço real de fechamento')+tblHdr(false)+vRows+'</div>' : '') +
        '<div style="margin-bottom:4px">'+secLabel('#1266CD','Concorrentes ativos')+tblHdr(true)+localRows+'</div>' +
        (amploRows ? '<div style="margin-bottom:4px">'+secLabel('#f59e0b','Também no radar do comprador')+tblHdr(true)+amploRows+'</div>' : '') +
        (insightBlock ? '<div style="padding:0 52px">'+insightBlock+'</div>' : '') +
      '</div>'
    ));
  })();


  // ══════════════════════════════════════════════════════════════════
  // S6 — CUSTO DE CONTINUAR PARADO
  // ══════════════════════════════════════════════════════════════════
  var selicNum = parseFloat((d.selic||'14,50').replace(',','.')) || 14.5;
  var custoMensal = precoOriginalNum > 0 ? Math.round(precoOriginalNum * (selicNum/100) / 12) : 0;
  var mesesParado = Math.max(1, diasCampanha / 30);
  var custoTotal  = Math.round(custoMensal * mesesParado);

  slides.push(wrap('s6r',
    slideHead('Custo real', '#c0392b', '#fff0f0', 'O preço de não vender', 'Cada mês parado tem um custo invisível — mas real.') +
    slideBody(
      // Número de impacto
      '<div style="background:#1d1d1f;border-radius:16px;padding:28px 36px;margin-bottom:18px">' +
        '<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:10px">Custo de oportunidade acumulado ('+fmtDias(diasCampanha)+')</div>' +
        '<div style="font-size:clamp(2.4rem,5vw,5rem);font-weight:900;color:#e67e22;line-height:1;letter-spacing:-.04em;margin-bottom:10px">'+fmtBRL(custoTotal)+'</div>' +
        '<div style="font-size:.76rem;color:rgba(255,255,255,.45);line-height:1.6">Calculado com a Selic de <strong style="color:rgba(255,255,255,.75)">'+e(d.selic||'14,50%')+'</strong> ao ano — o que o capital renderia aplicado em renda fixa enquanto o imóvel fica parado.</div>' +
      '</div>' +

      // Cards
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px">' +
        '<div style="background:#fff;border:1px solid #e8e8ed;border-radius:12px;padding:18px 20px;text-align:center">' +
          '<div style="font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:10px">Custo mensal</div>' +
          '<div style="font-size:1.35rem;font-weight:800;color:#c0392b">'+fmtBRL(custoMensal)+'</div>' +
          '<div style="font-size:.62rem;color:#a1a1a6;margin-top:5px">por mês parado</div>' +
        '</div>' +
        '<div style="background:#fff;border:1px solid #e8e8ed;border-radius:12px;padding:18px 20px;text-align:center">' +
          '<div style="font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:10px">Tempo parado</div>' +
          '<div style="font-size:1.35rem;font-weight:800;color:' + (diasCampanha>=90?'#c0392b':diasCampanha>=45?'#e67e22':'#555')+'">'+diasCampanha+'</div>' +
          '<div style="font-size:.62rem;color:#a1a1a6;margin-top:5px">dias desde o lançamento</div>' +
        '</div>' +
        '<div style="background:#fff;border:1px solid #e8e8ed;border-radius:12px;padding:18px 20px;text-align:center">' +
          '<div style="font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#888;margin-bottom:10px">Propostas perdidas</div>' +
          '<div style="font-size:1.35rem;font-weight:800;color:#555">'+totalPropostas+'</div>' +
          '<div style="font-size:.62rem;color:#a1a1a6;margin-top:5px">abaixo do preço pedido</div>' +
        '</div>' +
      '</div>' +

      // Mensagem final
      '<div style="background:#f0f6ff;border-left:3px solid #1266CD;border-radius:0 12px 12px 0;padding:16px 20px">' +
        '<div style="font-size:.78rem;color:#1d1d1f;line-height:1.75">Um ajuste de preço não é uma perda — é uma <strong>recuperação de tempo e capital</strong>. ' +
        (precoOriginalNum > 0 && maiorProposta > 0
          ? 'A maior proposta recebida foi de ' + fmtBRL(maiorProposta) + '. Fechar nesse valor hoje economiza mais ' + fmtBRL(Math.round(custoMensal * 3)) + ' em custo de oportunidade dos próximos 3 meses.'
          : 'Fechar agora com um preço ajustado pode recuperar em valor de tempo mais do que a diferença entre o preço pedido e o preço de mercado.') +
        '</div>' +
      '</div>'
    )
  ));


  // ══════════════════════════════════════════════════════════════════
  // S7 — NOVA FAIXA DE PREÇO
  // ══════════════════════════════════════════════════════════════════
  var prec = d.prec || null;
  var temPrec = prec && prec.mercado && prec.mercado.total;

  slides.push(wrap('s7r',
    slideHead('Precificação', '#1266CD', '#e8f0fd', 'Nova faixa de preço recomendada', 'Com base nos dados reais do mercado atual.') +
    slideBody(
      temPrec ? (
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:22px">' +
          [
            { key:'competitivo', label:'Competitivo', sub:'Fechar rápido · 15–30 dias', cor:'#27ae60', bg:'#f0fff4', border:'rgba(39,174,96,.2)' },
            { key:'mercado', label:'Mercado', sub:'Equilíbrio ideal · 30–60 dias', cor:'#1266CD', bg:'#eff6ff', border:'rgba(18,102,205,.2)' },
            { key:'otimista', label:'Otimista', sub:'Com margem de negociação · 60–90 dias', cor:'#e67e22', bg:'#fff8f0', border:'rgba(230,126,34,.2)' },
          ].map(function(f) {
            var faixa = prec[f.key]; if(!faixa) return '';
            var isRec = prec.recomendacao === f.key;
            var ajusteStr = '';
            if (precoOriginalNum > 0 && faixa.total) {
              var diffAj = faixa.total - precoOriginalNum;
              var pct = Math.abs(Math.round((diffAj/precoOriginalNum)*100));
              ajusteStr = '<div style="margin-top:10px;padding-top:10px;border-top:1px solid '+f.border+';font-size:.65rem;color:'+f.cor+';font-weight:600">' +
                (diffAj < 0 ? 'Redução de R$ '+Math.abs(diffAj).toLocaleString('pt-BR')+' ('+pct+'%)' : 'Acima do original em '+pct+'%') +
              '</div>';
            }
            return '<div style="background:'+f.bg+';border:' + (isRec?'2px':'1px')+' solid '+f.border+';border-radius:14px;padding:20px;position:relative' + (isRec?';box-shadow:0 4px 20px rgba(18,102,205,.1)':'')+'">' +
              (isRec ? '<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:'+f.cor+';color:#fff;font-size:.52rem;font-weight:700;padding:3px 12px;border-radius:20px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap">✦ Recomendado</div>' : '') +
              '<div style="font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:'+f.cor+';margin-bottom:10px">'+f.label+'</div>' +
              '<div style="font-size:1.7rem;font-weight:900;color:'+f.cor+';line-height:1;letter-spacing:-.03em;margin-bottom:5px">'+e(faixa.totalFmt||'—')+'</div>' +
              '<div style="font-size:.64rem;color:#6e6e73;margin-bottom:10px">'+e(faixa.vm2Fmt||'—')+'</div>' +
              '<div style="font-size:.7rem;color:#555;line-height:1.5">'+f.sub+'</div>' +
              ajusteStr +
            '</div>';
          }).join('') +
        '</div>' +
        (prec.justificativa ?
          '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px">' +
            '<div style="font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#1266CD;margin-bottom:8px">Análise da IA</div>' +
            '<div style="font-size:.78rem;color:#374151;line-height:1.7">'+e(prec.justificativa)+'</div>' +
          '</div>'
        : '')
      ) : (
        '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:40px;text-align:center">' +
          '<div style="font-size:2.5rem;margin-bottom:14px">📊</div>' +
          '<div style="font-size:.9rem;font-weight:700;color:#1d1d1f;margin-bottom:8px">Precificação não calculada</div>' +
          '<div style="font-size:.76rem;color:#6e6e73;line-height:1.65;max-width:320px;margin:0 auto">Preencha os concorrentes e clique em "Precificar" no formulário para gerar as faixas recomendadas.</div>' +
        '</div>'
      )
    )
  ));


  // ══════════════════════════════════════════════════════════════════
  // S8 — ENCERRAMENTO (sem revelar próximos passos)
  // ══════════════════════════════════════════════════════════════════
  var precoNovo = temPrec && prec[prec.recomendacao] ? prec[prec.recomendacao].totalFmt : (temPrec ? prec.mercado.totalFmt : null);
  var ajustePct = temPrec && prec[prec.recomendacao] && precoOriginalNum > 0
    ? Math.abs(Math.round(((prec[prec.recomendacao].total - precoOriginalNum)/precoOriginalNum)*100))
    : null;

  slides.push(wrap('s8r', '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">' +

    // Esquerda escura
    '<div style="background:#1d1d1f;padding:64px 60px;display:flex;flex-direction:column;justify-content:space-between">' +
      '<div>' +
        '<div style="font-size:.52rem;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:52px">Liberty Imóveis · Conclusão</div>' +
        '<div style="font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#e67e22;margin-bottom:16px">Nossa posição</div>' +
        '<div style="font-size:clamp(2.8rem,4.5vw,4.8rem);font-weight:900;color:#fff;line-height:.85;letter-spacing:-.06em;margin-bottom:28px">A decisão<br>é sua.<br><span style="color:#e67e22">Os dados<br>já decidiram.</span></div>' +
        '<div style="font-size:.84rem;color:rgba(255,255,255,.48);line-height:1.75;max-width:320px">Não é uma pressão da Liberty — é o mercado comunicando, de forma inequívoca, qual é o preço que faz o comprador agir.</div>' +
      '</div>' +
      '<div>' +
        (precoNovo ?
          '<div style="background:rgba(255,255,255,.06);border-radius:12px;padding:20px 24px;margin-bottom:18px">' +
            '<div style="font-size:.52rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:8px">Faixa recomendada</div>' +
            '<div style="font-size:2.4rem;font-weight:900;color:#e67e22;letter-spacing:-.04em">'+e(precoNovo)+'</div>' +
            (ajustePct !== null ? '<div style="font-size:.68rem;color:rgba(255,255,255,.35);margin-top:6px">Ajuste de '+ajustePct+'% sobre o preço atual</div>' : '') +
          '</div>'
        : '') +
        '<div style="font-size:.56rem;color:rgba(255,255,255,.18);letter-spacing:.08em">Liberty Imóveis · Brasília, DF</div>' +
      '</div>' +
    '</div>' +

    // Direita — argumento emocional, sem revelar plano
    '<div style="background:#f5f5f7;padding:64px 56px;display:flex;flex-direction:column;justify-content:center;gap:20px">' +

      '<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#a1a1a6;margin-bottom:4px">Por que agir agora</div>' +

      '<div style="display:flex;flex-direction:column;gap:12px">' +

        [
          { ico:'⏱', cor:'#c0392b', bg:'#fff0f0', titulo:'O tempo trabalha contra o preço', desc:'Cada mês parado gera ' + fmtBRL(custoMensal) + ' em custo de oportunidade — dinheiro que deixa de render enquanto o imóvel aguarda.' },
          { ico:'👀', cor:'#1266CD', bg:'#eff6ff', titulo:'O comprador certo já pode ter passado', desc:'As visitas aconteceram. Quem visitou estava interessado — mas o preço não autorizou a decisão. Um ajuste reativa esse público.' },
          { ico:'📉', cor:'#e67e22', bg:'#fff8f0', titulo:'O mercado penaliza quem demora', desc:'Imóveis com mais de 90 dias anunciados geram desconfiança no comprador. A percepção de \"problema\" começa antes de qualquer visita.' },
          { ico:'✓', cor:'#27ae60', bg:'#f0fff4', titulo:'A venda está ao alcance', desc:'A demanda existe. A localização é boa. O trabalho está feito. Só o preço separa esse imóvel de uma venda bem-sucedida.' },
        ].map(function(item) {
          return '<div style="display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff;border-radius:12px;border:1px solid #e8e8ed">' +
            '<div style="width:38px;height:38px;border-radius:10px;background:'+item.bg+';display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.1rem">'+item.ico+'</div>' +
            '<div>' +
              '<div style="font-size:.8rem;font-weight:700;color:#1d1d1f;margin-bottom:3px">'+item.titulo+'</div>' +
              '<div style="font-size:.69rem;color:#6e6e73;line-height:1.55">'+item.desc+'</div>' +
            '</div>' +
          '</div>';
        }).join('') +

      '</div>' +

    '</div>' +

  '</div>'));

  return slides;
}
