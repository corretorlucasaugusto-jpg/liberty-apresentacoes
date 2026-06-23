// _buildSlidesRealinhamento.js
export function buildSlidesRealinhamento(d, slides = []) {
  function e(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  if (!d) d = {};
  if (!d.residencial) d.residencial = 'Residencial';
  if (!d.nome) d.nome = 'Proprietário';
  if (!d.nv) d.nv = [];
  if (!d.v) d.v = [];
  if (!d.visitas) d.visitas = [];
  if (!d.propostas) d.propostas = [];
  if (!d.acoes) d.acoes = [];

  // ── Paleta Liberty ──
  var C = {
    dark:   '#1d1d1f',
    blue:   '#1266CD',
    gold:   '#C9A84C',
    gray:   '#6e6e73',
    light:  '#f5f5f7',
    border: '#e8e8ed',
    white:  '#ffffff',
  };

  // ── Helpers ──
  var parseVal = function(s){ return parseInt((s||'').replace(/[^0-9]/g,''))||0; };
  var parseArea = function(s){ return parseFloat((s||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0; };

  var fmtData = function(iso) {
    if (!iso) return '—';
    try {
      var p = iso.split('-');
      if (p.length===3) return p[2]+'/'+p[1]+'/'+p[0];
    } catch(x){}
    return iso;
  };

  var fmtDias = function(n) {
    if (!n||n<=0) return '—';
    var m = Math.floor(n/30), r = n%30;
    if (m===0) return n+' dias';
    if (r===0) return m+(m>1?' meses':' mês');
    return m+(m>1?' meses':' mês')+' e '+r+' dias';
  };

  var fmtBRL = function(n) {
    if (!n||n<=0) return '—';
    return 'R$ '+Number(n).toLocaleString('pt-BR');
  };

  var diasEntre = function(iso1, iso2) {
    try { return Math.round(Math.abs(new Date(iso2)-new Date(iso1))/(864e5)); } catch(x){ return 0; }
  };

  var diasCampanha = d.data_inicio
    ? diasEntre(d.data_inicio, new Date().toISOString().split('T')[0])
    : 0;

  var totalVisitantes = (d.visitas||[]).reduce(function(a,v){ return a+(parseInt(v.qtd)||0); },0);
  var totalPropostas  = (d.propostas||[]).filter(function(p){ return p.valor||p.data; }).length;
  var maiorProposta   = (d.propostas||[]).reduce(function(a,p){ var v=parseVal(p.valor); return v>a?v:a; },0);
  var precoOrigNum    = parseVal(d.preco_original);
  var selicNum        = parseFloat((d.selic||'14,50').replace(',','.'))||14.5;
  var custoMensal     = precoOrigNum>0 ? Math.round(precoOrigNum*(selicNum/100)/12) : 0;
  var custoTotal      = Math.round(custoMensal * Math.max(1, diasCampanha/30));

  // ── Wrappers ──
  var slide = function(id, inner, bg) {
    return '<div class="slide" id="'+id+'" style="display:flex;flex-direction:column;height:100%;overflow:hidden;background:'+(bg||C.white)+'">'
      +inner+'</div>';
  };

  var head = function(label, title, sub) {
    return '<div style="padding:40px 60px 28px;flex-shrink:0">'
      +'<div style="font-size:.52rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:'+C.gold+';margin-bottom:12px">'+label+'</div>'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:32px">'
        +'<div style="font-size:clamp(1.8rem,3vw,2.8rem);font-weight:800;color:'+C.dark+';line-height:.95;letter-spacing:-.04em">'+title+'</div>'
        +(sub?'<div style="font-size:.72rem;color:'+C.gray+';text-align:right;line-height:1.5;max-width:220px;flex-shrink:0">'+sub+'</div>':'')
      +'</div>'
      +'<div style="height:1px;background:'+C.border+';margin-top:20px"></div>'
    +'</div>';
  };

  var body = function(inner) {
    return '<div style="flex:1;overflow-y:auto;overflow-x:hidden;padding:0 60px 40px">'+inner+'</div>';
  };


  // ══════════════════════════════════════════════════════
  // S1 — CAPA
  // ══════════════════════════════════════════════════════
  var kpis = [
    ['Início', fmtData(d.data_inicio)],
    ['Em campanha', diasCampanha>0 ? fmtDias(diasCampanha) : '—'],
    ['Visitantes', totalVisitantes>0 ? totalVisitantes : '—'],
    ['Propostas', totalPropostas>0 ? totalPropostas : '0'],
  ];

  slides.push(slide('s1r',
    '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">'

    // Esquerda
    +'<div style="background:'+C.dark+';padding:72px 64px;display:flex;flex-direction:column;justify-content:space-between">'
      +'<div>'
        // Logo text
        +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:64px">'
          +'<div style="width:3px;height:28px;background:'+C.gold+'"></div>'
          +'<span style="font-size:.58rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.35)">Liberty Imóveis · Brasília</span>'
        +'</div>'

        +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:'+C.gold+';margin-bottom:20px">Alinhamento</div>'
        +'<div style="font-size:clamp(3.2rem,5.5vw,6rem);font-weight:900;color:'+C.white+';line-height:.82;letter-spacing:-.06em;margin-bottom:32px">'
          +'Análise<br>de<br><span style="color:'+C.gold+'">Campanha</span>'
        +'</div>'
        +'<div style="font-size:.88rem;color:rgba(255,255,255,.4);line-height:1.6">'
          +e(d.residencial)+(d.bairro?' · '+e(d.bairro):'')
        +'</div>'
      +'</div>'
      +'<div style="font-size:.56rem;color:rgba(255,255,255,.18);letter-spacing:.08em">'
        +'Preparado para '+e(d.nome)+' · '+new Date().toLocaleDateString('pt-BR')
      +'</div>'
    +'</div>'

    // Direita
    +'<div style="background:'+C.light+';padding:72px 60px;display:flex;flex-direction:column;justify-content:center">'
      +'<div style="font-size:.52rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:'+C.gray+';margin-bottom:28px">Resumo</div>'
      +'<div style="display:flex;flex-direction:column;gap:1px;background:'+C.border+'">'
        +kpis.map(function(k,i){
          var last = i===kpis.length-1;
          return '<div style="background:'+C.white+';padding:22px 28px;display:flex;justify-content:space-between;align-items:center">'
            +'<div style="font-size:.76rem;color:'+C.gray+'">'+k[0]+'</div>'
            +'<div style="font-size:1.1rem;font-weight:700;color:'+C.dark+'">'+e(String(k[1]))+'</div>'
          +'</div>';
        }).join('')
        +(precoOrigNum>0 ?
          '<div style="background:'+C.dark+';padding:22px 28px;display:flex;justify-content:space-between;align-items:center">'
            +'<div style="font-size:.76rem;color:rgba(255,255,255,.4)">Preço anunciado</div>'
            +'<div style="font-size:1.1rem;font-weight:700;color:'+C.gold+'">'+fmtBRL(precoOrigNum)+'</div>'
          +'</div>'
        :'')
        +(maiorProposta>0 ?
          '<div style="background:#fff8f0;padding:22px 28px;display:flex;justify-content:space-between;align-items:center">'
            +'<div style="font-size:.76rem;color:'+C.gray+'">Melhor proposta recebida</div>'
            +'<div style="font-size:1.1rem;font-weight:700;color:#b45309">'+fmtBRL(maiorProposta)+'</div>'
          +'</div>'
        :'')
      +'</div>'
    +'</div>'

    +'</div>'
  ));


  // ══════════════════════════════════════════════════════
  // S2 — LINHA DO TEMPO
  // ══════════════════════════════════════════════════════

  // Montar eventos e ordenar por data
  var events = [];

  if (d.data_inicio) events.push({
    iso: d.data_inicio,
    icon: '&#x1F680;',
    title: 'Início da campanha',
    sub: precoOrigNum>0 ? 'Anunciado por '+fmtBRL(precoOrigNum) : '',
    accent: C.blue,
  });

  (d.acoes||[]).filter(Boolean).forEach(function(a){
    events.push({ iso:'', icon:'&#x2713;', title: a, sub:'', accent: C.gold });
  });

  (d.visitas||[]).forEach(function(v){
    if (v.data||v.qtd||v.feedback) events.push({
      iso: v.data||'',
      icon: '&#x1F465;',
      title: (v.qtd?v.qtd+' visitante'+(parseInt(v.qtd)>1?'s':''):'Visita'),
      sub: v.feedback ? e(v.feedback.slice(0,100))+(v.feedback.length>100?'…':'') : '',
      accent: '#8e44ad',
    });
  });

  (d.propostas||[]).filter(function(p){ return p.valor||p.data; }).forEach(function(p){
    events.push({
      iso: p.data||'',
      icon: '&#x1F4CB;',
      title: 'Proposta recebida'+(p.valor?' · '+e(p.valor):''),
      sub: '',
      accent: '#b45309',
    });
  });

  // Ordenar: com data primeiro (asc), depois sem data
  events.sort(function(a,b){
    if (!a.iso && !b.iso) return 0;
    if (!a.iso) return 1;
    if (!b.iso) return -1;
    return new Date(a.iso)-new Date(b.iso);
  });

  // 2 colunas equilibradas
  var col1=[],col2=[];
  events.forEach(function(ev,i){ (i%2===0?col1:col2).push(ev); });

  var renderEv = function(ev, isLast) {
    return '<div style="display:flex;gap:16px;padding:18px 0;'+(isLast?'':'border-bottom:1px solid '+C.border)+'">'
      +'<div style="width:36px;height:36px;border-radius:50%;background:'+ev.accent+'18;display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;color:'+ev.accent+'">'+ev.icon+'</div>'
      +'<div style="flex:1;min-width:0">'
        +(ev.iso?'<div style="font-size:.58rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:'+C.gray+';margin-bottom:4px">'+fmtData(ev.iso)+'</div>':'')
        +'<div style="font-size:.82rem;font-weight:700;color:'+C.dark+';margin-bottom:'+(ev.sub?'4px':'0')+'">'+ev.title+'</div>'
        +(ev.sub?'<div style="font-size:.7rem;color:'+C.gray+';line-height:1.5;font-style:italic">&ldquo;'+ev.sub+'&rdquo;</div>':'')
      +'</div>'
    +'</div>';
  };

  slides.push(slide('s2r',
    head('Histórico','Linha do tempo da campanha','Tudo o que aconteceu desde o lançamento.')
    +body(
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 48px">'
        +'<div>'+col1.map(function(ev,i){return renderEv(ev,i===col1.length-1);}).join('')+'</div>'
        +'<div style="border-left:1px solid '+C.border+';padding-left:48px">'
          +col2.map(function(ev,i){return renderEv(ev,i===col2.length-1);}).join('')
        +'</div>'
      +'</div>'
    )
  ));


  // ══════════════════════════════════════════════════════
  // S3 — SINAIS DO MERCADO
  // ══════════════════════════════════════════════════════
  var nvVals = (d.nv||[]).map(function(r){return parseVal(r.v);}).filter(Boolean);
  var nvMedio = nvVals.length>0 ? Math.round(nvVals.reduce(function(a,b){return a+b;},0)/nvVals.length) : 0;

  var signals = [];
  if (diasCampanha>0) signals.push({
    n: diasCampanha,
    unit: 'dias',
    label: 'em campanha',
    sub: diasCampanha<30?'Dentro do prazo ideal':diasCampanha<90?'Acima do prazo médio de venda':'O mercado começa a perceber o imóvel como parado',
    color: diasCampanha>=90?'#c0392b':diasCampanha>=45?'#b45309':C.blue,
  });
  if (totalVisitantes>0) signals.push({
    n: totalVisitantes,
    unit: 'visita'+(totalVisitantes>1?'s':''),
    label: 'realizadas',
    sub: 'Interesse comprovado — o imóvel atrai, mas não fecha',
    color: C.blue,
  });
  if (totalPropostas>0) signals.push({
    n: totalPropostas,
    unit: 'proposta'+(totalPropostas>1?'s':''),
    label: 'recebidas',
    sub: maiorProposta>0&&precoOrigNum>0 ? 'Melhor oferta: '+fmtBRL(maiorProposta)+' ('+Math.round((maiorProposta/precoOrigNum)*100)+'% do pedido)' : 'Abaixo do valor pedido',
    color: '#b45309',
  });

  // Posicionamento vs concorrentes
  var posBlock = '';
  if (precoOrigNum>0 && nvMedio>0) {
    var diff = precoOrigNum-nvMedio;
    var pct  = Math.abs(Math.round((diff/nvMedio)*100));
    posBlock = '<div style="background:'+C.light+';border-radius:14px;padding:22px 28px;margin-top:24px">'
      +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:'+C.gold+';margin-bottom:10px">Posicionamento</div>'
      +(diff>0
        ?'<div style="font-size:.84rem;color:'+C.dark+';line-height:1.7">O imóvel está anunciado por <strong>'+fmtBRL(Math.abs(diff))+' ('+pct+'%) acima</strong> da média dos concorrentes ativos. O comprador enxerga alternativas mais acessíveis antes de chegar ao seu.</div>'
        :'<div style="font-size:.84rem;color:'+C.dark+';line-height:1.7">O preço está alinhado com a média dos concorrentes. Outros fatores podem estar influenciando a decisão do comprador.</div>'
      )
    +'</div>';
  }

  slides.push(slide('s3r',
    head('Diagnóstico','O que os dados mostram','Fatos — não opiniões.')
    +body(
      '<div style="display:grid;grid-template-columns:repeat('+Math.min(signals.length,3)+',1fr);gap:16px;margin-bottom:8px">'
        +signals.map(function(s){
          return '<div style="background:'+C.light+';border-radius:16px;padding:28px;border-top:3px solid '+s.color+'">'
            +'<div style="font-size:clamp(2.4rem,4vw,3.6rem);font-weight:900;color:'+s.color+';line-height:1;letter-spacing:-.05em;margin-bottom:4px">'+s.n+'</div>'
            +'<div style="font-size:.76rem;font-weight:700;color:'+C.dark+';margin-bottom:8px">'+s.unit+' '+s.label+'</div>'
            +'<div style="font-size:.68rem;color:'+C.gray+';line-height:1.55">'+s.sub+'</div>'
          +'</div>';
        }).join('')
      +'</div>'
      +posBlock
    )
  ));


  // ══════════════════════════════════════════════════════
  // S4 — O QUE FOI FEITO
  // ══════════════════════════════════════════════════════
  var acoesFilt = (d.acoes||[]).filter(Boolean);

  slides.push(slide('s4r',
    head('Campanha','O que foi feito','Trabalho executado por completo.')
    +body(
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px">'

      // Ações
      +'<div>'
        +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:'+C.blue+';margin-bottom:20px">Ações realizadas</div>'
        +acoesFilt.map(function(a,i){
          return '<div style="display:flex;align-items:center;gap:14px;padding:14px 0;'+(i>0?'border-top:1px solid '+C.border:'')+'">'
            +'<div style="width:22px;height:22px;border-radius:6px;background:'+C.blue+'18;display:flex;align-items:center;justify-content:center;flex-shrink:0">'
              +'<svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="'+C.blue+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1.5,5.5 4,8 9.5,2.5"/></svg>'
            +'</div>'
            +'<div style="font-size:.8rem;color:'+C.dark+'">'+e(a)+'</div>'
          +'</div>';
        }).join('')
      +'</div>'

      // Resultado
      +'<div>'
        +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:'+C.gold+';margin-bottom:20px">Resultado obtido</div>'
        +'<div style="display:flex;flex-direction:column;gap:12px">'
          +(totalVisitantes>0?
            '<div style="background:'+C.light+';border-radius:12px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center">'
              +'<div style="font-size:.76rem;color:'+C.gray+'">Visitantes</div>'
              +'<div style="font-size:1.4rem;font-weight:800;color:'+C.dark+'">'+totalVisitantes+'</div>'
            +'</div>'
          :'')
          +(totalPropostas>0?
            '<div style="background:'+C.light+';border-radius:12px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center">'
              +'<div style="font-size:.76rem;color:'+C.gray+'">Propostas</div>'
              +'<div style="font-size:1.4rem;font-weight:800;color:'+C.dark+'">'+totalPropostas+'</div>'
            +'</div>'
          :'')
          +(maiorProposta>0?
            '<div style="background:'+C.dark+';border-radius:12px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center">'
              +'<div style="font-size:.76rem;color:rgba(255,255,255,.4)">Melhor proposta</div>'
              +'<div style="font-size:1.4rem;font-weight:800;color:'+C.gold+'">'+fmtBRL(maiorProposta)+'</div>'
            +'</div>'
          :'')
        +'</div>'

        // Diagnóstico
        +'<div style="margin-top:20px;padding:18px 20px;background:'+C.light+';border-left:3px solid '+C.gold+';border-radius:0 10px 10px 0">'
          +'<div style="font-size:.78rem;color:'+C.dark+';line-height:1.7">O trabalho foi executado. Os canais estão ativos'+(totalVisitantes>0?', o imóvel foi visitado':'')+'. Um único fator impede o fechamento.'
          +'</div>'
        +'</div>'
      +'</div>'

      +'</div>'
    )
  ));


  // ══════════════════════════════════════════════════════
  // S5 — COMPARATIVO DE MERCADO
  // ══════════════════════════════════════════════════════
  (function(){
    var diasColor=function(dd){
      var n=parseInt((dd||'').replace(/[^0-9]/g,''))||0;
      if(!n) return C.gray; if(n<30) return '#27ae60'; if(n<90) return '#b45309'; return '#c0392b';
    };

    var row=function(r,i,isNV){
      var val=parseVal(r.v),area=parseArea(r.a);
      var vm2=area>0&&val>0?'R$ '+Math.round(val/area).toLocaleString('pt-BR')+'/m²':'—';
      var carac=r.c||[r.quartos?r.quartos+' qts':'',r.conservacao||''].filter(Boolean).join(' · ')||'—';
      var db=r.d?'<span style="font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:20px;background:'+diasColor(r.d)+'22;color:'+diasColor(r.d)+'">'+e(r.d)+'</span>':'—';
      var btn=isNV&&r.url?'<button onclick="openAnuncio(this.dataset.url)" data-url="'+(r.url||'').replace(/"/g,'&quot;')+'" style="font-size:.58rem;font-weight:700;padding:3px 8px;background:'+C.blue+';color:#fff;border:none;border-radius:5px;cursor:pointer">Ver</button>':'';
      var grid=isNV?'1.8fr .45fr 1.8fr .85fr .7fr .7fr .3fr':'1.8fr .45fr 1.8fr .85fr .7fr .7fr';
      return '<div style="display:grid;grid-template-columns:'+grid+';align-items:center;padding:10px 16px;background:'+(i%2===0?C.white:C.light)+';'+(i>0?'border-top:1px solid '+C.border:'')+'">'
        +'<div style="font-size:.74rem;font-weight:600;color:'+C.dark+'">'+e(r.n||'—')+'</div>'
        +'<div style="font-size:.68rem;color:'+C.gray+'">'+e(r.a||'—')+'m²</div>'
        +'<div style="font-size:.64rem;color:'+C.gray+'">'+e(carac)+'</div>'
        +'<div style="font-size:.74rem;font-weight:700;color:'+(isNV?'#c0392b':'#27ae60')+'">'+e(r.v||'—')+'</div>'
        +'<div style="font-size:.62rem;color:'+C.gray+'">'+vm2+'</div>'
        +'<div>'+db+'</div>'
        +(isNV?'<div>'+btn+'</div>':'')
      +'</div>';
    };

    var hdr=function(isNV){
      var grid=isNV?'1.8fr .45fr 1.8fr .85fr .7fr .7fr .3fr':'1.8fr .45fr 1.8fr .85fr .7fr .7fr';
      return '<div style="display:grid;grid-template-columns:'+grid+';padding:8px 16px;background:'+C.dark+';font-size:.58rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45)">'
        +'<div>Imóvel</div><div>Área</div><div>Características</div>'
        +(isNV?'<div>Preço anunciado</div>':'<div>Preço negociado</div>')
        +'<div>R$/m²</div><div>Dias</div>'+(isNV?'<div></div>':'')
      +'</div>';
    };

    var secLbl=function(cor,txt){
      return '<div style="font-size:.56rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:'+cor+';padding:16px 16px 8px;display:flex;align-items:center;gap:8px">'
        +'<span style="width:6px;height:6px;border-radius:50%;background:'+cor+';flex-shrink:0"></span>'+txt
      +'</div>';
    };

    var nvLocal=(d.nv||[]).filter(function(r){return (r.cat||'local')==='local';});
    var nvAmplo=(d.nv||[]).filter(function(r){return r.cat==='amplo';});
    var localRows=nvLocal.map(function(r,i){return row(r,i,true);}).join('');
    var amploRows=nvAmplo.map(function(r,i){return row(r,i,true);}).join('');
    var vRows=(d.v||[]).map(function(r,i){return row(r,i,false);}).join('');

    if(!localRows&&!amploRows) localRows='<div style="padding:16px;font-size:.76rem;color:'+C.gray+'">Nenhum comparável cadastrado.</div>';

    slides.push(slide('s5r',
      head('Mercado','O que o comprador está vendo','Concorrentes ativos e vendidos recentes.')
      +'<div style="flex:1;overflow-y:auto;padding:0 60px 40px">'
        +(vRows?'<div style="margin-bottom:20px;border:1px solid '+C.border+';border-radius:12px;overflow:hidden">'+secLbl('#27ae60','Vendidos recentes')+hdr(false)+vRows+'</div>':'')
        +'<div style="margin-bottom:20px;border:1px solid '+C.border+';border-radius:12px;overflow:hidden">'+secLbl(C.blue,'Concorrentes ativos')+hdr(true)+localRows+'</div>'
        +(amploRows?'<div style="border:1px solid '+C.border+';border-radius:12px;overflow:hidden">'+secLbl(C.gold,'Também no radar')+hdr(true)+amploRows+'</div>':'')
      +'</div>'
    ));
  })();


  // ══════════════════════════════════════════════════════
  // S6 — CUSTO DO TEMPO
  // ══════════════════════════════════════════════════════
  slides.push(slide('s6r',
    '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">'

    // Esquerda — número de impacto
    +'<div style="background:'+C.dark+';padding:72px 64px;display:flex;flex-direction:column;justify-content:center">'
      +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:'+C.gold+';margin-bottom:24px">Custo acumulado</div>'
      +'<div style="font-size:clamp(2.8rem,5vw,5.5rem);font-weight:900;color:'+C.white+';line-height:.85;letter-spacing:-.05em;margin-bottom:16px">'+fmtBRL(custoTotal)+'</div>'
      +'<div style="font-size:.8rem;color:rgba(255,255,255,.4);line-height:1.7;margin-bottom:40px">'
        +fmtDias(diasCampanha)+' × Selic <strong style="color:rgba(255,255,255,.6)">'+e(d.selic||'14,50%')+'</strong>/ano'
        +'<br>sobre o valor anunciado em renda fixa.'
      +'</div>'
      +'<div style="height:1px;background:rgba(255,255,255,.1);margin-bottom:32px"></div>'
      +'<div style="display:flex;gap:32px">'
        +'<div>'
          +'<div style="font-size:1.6rem;font-weight:800;color:'+C.gold+';line-height:1">'+fmtBRL(custoMensal)+'</div>'
          +'<div style="font-size:.62rem;color:rgba(255,255,255,.3);margin-top:4px">por mês</div>'
        +'</div>'
        +'<div>'
          +'<div style="font-size:1.6rem;font-weight:800;color:rgba(255,255,255,.7);line-height:1">'+diasCampanha+'</div>'
          +'<div style="font-size:.62rem;color:rgba(255,255,255,.3);margin-top:4px">dias parado</div>'
        +'</div>'
      +'</div>'
    +'</div>'

    // Direita — contexto
    +'<div style="background:'+C.light+';padding:72px 60px;display:flex;flex-direction:column;justify-content:center;gap:20px">'
      +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:'+C.gold+';margin-bottom:8px">O que isso significa</div>'
      +[
        ['O tempo tem custo','Enquanto o imóvel aguarda, o capital que ele representa deixa de render. Esse custo é real — e cresce a cada mês.'],
        ['O comprador percebe','Após 90 dias anunciado, o mercado começa a questionar o imóvel. A percepção de problema surge antes de qualquer visita.'],
        (maiorProposta>0&&precoOrigNum>0?
          ['A proposta está próxima','A diferença entre o preço pedido e a melhor proposta recebida é de '+fmtBRL(precoOrigNum-maiorProposta)+'. O custo de esperar pode superar essa diferença em poucos meses.']
        :['O interesse existe','As visitas aconteceram. Há demanda — a condição de fechamento é o único ponto de ajuste.']),
      ].map(function(item){
        return '<div style="background:'+C.white+';border-radius:12px;padding:20px 22px">'
          +'<div style="font-size:.8rem;font-weight:700;color:'+C.dark+';margin-bottom:6px">'+item[0]+'</div>'
          +'<div style="font-size:.72rem;color:'+C.gray+';line-height:1.6">'+item[1]+'</div>'
        +'</div>';
      }).join('')
    +'</div>'

    +'</div>'
  ,C.white));


  // ══════════════════════════════════════════════════════
  // S7 — FAIXA DE PREÇO
  // ══════════════════════════════════════════════════════
  var prec=d.prec||null;
  var temPrec=prec&&prec.mercado&&prec.mercado.total;

  slides.push(slide('s7r',
    head('Precificação','Faixa de referência do mercado','Baseada nos dados reais de comparáveis.')
    +body(
      temPrec?(
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">'
          +[
            {key:'competitivo',label:'Competitivo',sub:'Fechar em até 30 dias',cor:'#27ae60'},
            {key:'mercado',label:'Mercado',sub:'Equilíbrio · 30–60 dias',cor:C.blue},
            {key:'otimista',label:'Otimista',sub:'Com margem · 60–90 dias',cor:C.gold},
          ].map(function(f){
            var faixa=prec[f.key]; if(!faixa) return '';
            var isRec=prec.recomendacao===f.key;
            var ajuste='';
            if(precoOrigNum>0&&faixa.total){
              var dif=faixa.total-precoOrigNum;
              var pct=Math.abs(Math.round((dif/precoOrigNum)*100));
              ajuste='<div style="margin-top:14px;padding-top:14px;border-top:1px solid '+C.border+';font-size:.65rem;color:'+f.cor+';font-weight:600">'
                +(dif<0?'Ajuste de '+pct+'% abaixo do atual':'Acima do valor atual em '+pct+'%')
              +'</div>';
            }
            return '<div style="background:'+C.light+';border-radius:16px;padding:24px;position:relative;border-top:3px solid '+f.cor+(isRec?';box-shadow:0 4px 24px rgba(0,0,0,.08)':'')+'">'
              +(isRec?'<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:'+f.cor+';color:#fff;font-size:.5rem;font-weight:700;padding:3px 12px;border-radius:20px;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap">Recomendado</div>':'')
              +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:'+f.cor+';margin-bottom:12px">'+f.label+'</div>'
              +'<div style="font-size:1.9rem;font-weight:900;color:'+C.dark+';line-height:1;letter-spacing:-.04em;margin-bottom:6px">'+e(faixa.totalFmt||'—')+'</div>'
              +'<div style="font-size:.66rem;color:'+C.gray+';margin-bottom:10px">'+e(faixa.vm2Fmt||'—')+'</div>'
              +'<div style="font-size:.7rem;color:'+C.gray+';line-height:1.5">'+f.sub+'</div>'
              +ajuste
            +'</div>';
          }).join('')
        +'</div>'
        +(prec.justificativa?
          '<div style="background:'+C.light+';border-radius:12px;padding:20px 24px">'
            +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:'+C.blue+';margin-bottom:8px">Análise</div>'
            +'<div style="font-size:.78rem;color:'+C.dark+';line-height:1.7">'+e(prec.justificativa)+'</div>'
          +'</div>'
        :'')
      ):(
        '<div style="background:'+C.light+';border-radius:16px;padding:48px;text-align:center">'
          +'<div style="font-size:2.4rem;margin-bottom:16px">&#x1F4CA;</div>'
          +'<div style="font-size:.9rem;font-weight:700;color:'+C.dark+';margin-bottom:8px">Precificação não calculada</div>'
          +'<div style="font-size:.76rem;color:'+C.gray+';line-height:1.6;max-width:300px;margin:0 auto">Preencha os concorrentes e clique em Precificar no formulário.</div>'
        +'</div>'
      )
    )
  ));


  // ══════════════════════════════════════════════════════
  // S8 — ENCERRAMENTO
  // ══════════════════════════════════════════════════════
  var precoNovo = temPrec&&prec[prec.recomendacao] ? prec[prec.recomendacao].totalFmt : (temPrec?prec.mercado.totalFmt:null);
  var ajustePct = temPrec&&prec[prec.recomendacao]&&precoOrigNum>0
    ? Math.abs(Math.round(((prec[prec.recomendacao].total-precoOrigNum)/precoOrigNum)*100))
    : null;

  slides.push(slide('s8r',
    '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">'

    // Esquerda
    +'<div style="background:'+C.dark+';padding:72px 64px;display:flex;flex-direction:column;justify-content:space-between">'
      +'<div>'
        +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:64px">'
          +'<div style="width:3px;height:28px;background:'+C.gold+'"></div>'
          +'<span style="font-size:.56rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.28)">Liberty Imóveis · Brasília</span>'
        +'</div>'
        +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:'+C.gold+';margin-bottom:20px">Conclusão</div>'
        +'<div style="font-size:clamp(2.8rem,4.5vw,5rem);font-weight:900;color:'+C.white+';line-height:.85;letter-spacing:-.06em;margin-bottom:32px">'
          +'A decisão<br>é sua.<br><span style="color:'+C.gold+'">Os dados<br>já falaram.</span>'
        +'</div>'
        +'<div style="font-size:.84rem;color:rgba(255,255,255,.4);line-height:1.75;max-width:300px">'
          +'Não é uma pressão — é o mercado comunicando, de forma objetiva, qual o caminho para o fechamento.'
        +'</div>'
      +'</div>'
      +'<div>'
        +(precoNovo?
          '<div style="background:rgba(255,255,255,.06);border-radius:12px;padding:22px 26px;margin-bottom:18px">'
            +'<div style="font-size:.52rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.28);margin-bottom:8px">Faixa recomendada</div>'
            +'<div style="font-size:2.4rem;font-weight:900;color:'+C.gold+';letter-spacing:-.04em">'+e(precoNovo)+'</div>'
            +(ajustePct!==null?'<div style="font-size:.64rem;color:rgba(255,255,255,.28);margin-top:6px">Ajuste de '+ajustePct+'% sobre o preço atual</div>':'')
          +'</div>'
        :'')
        +'<div style="font-size:.52rem;color:rgba(255,255,255,.15);letter-spacing:.08em">Liberty Imóveis · Brasília, DF</div>'
      +'</div>'
    +'</div>'

    // Direita — argumentos
    +'<div style="background:'+C.light+';padding:72px 56px;display:flex;flex-direction:column;justify-content:center;gap:14px">'
      +'<div style="font-size:.56rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:'+C.gold+';margin-bottom:12px">Por que agir agora</div>'
      +[
        {icon:'&#x23F1;',title:'O tempo tem custo',desc:fmtBRL(custoMensal)+' por mês em custo de oportunidade. Esse valor cresce enquanto o imóvel aguarda.'},
        {icon:'&#x1F465;',title:'O interesse está comprovado',desc:(totalVisitantes>0?totalVisitantes+' pessoas visitaram o imóvel.':'Visitantes chegaram.')+' Quem visitou estava interessado — o preço bloqueou a decisão.'},
        {icon:'&#x1F4C9;',title:'O mercado penaliza a demora',desc:'Imóveis com mais de 90 dias anunciados geram dúvida no comprador antes mesmo da visita.'},
        {icon:'&#x2713;',title:'A venda está ao alcance',desc:'Localização, imóvel e campanha estão prontos. Um único ajuste separa esse imóvel de um fechamento.'},
      ].map(function(item){
        return '<div style="display:flex;gap:16px;background:'+C.white+';border-radius:12px;padding:18px 20px">'
          +'<div style="width:38px;height:38px;border-radius:10px;background:'+C.gold+'18;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem;color:'+C.gold+'">'+item.icon+'</div>'
          +'<div>'
            +'<div style="font-size:.8rem;font-weight:700;color:'+C.dark+';margin-bottom:4px">'+item.title+'</div>'
            +'<div style="font-size:.7rem;color:'+C.gray+';line-height:1.6">'+item.desc+'</div>'
          +'</div>'
        +'</div>';
      }).join('')
    +'</div>'

    +'</div>'
  ,C.white));

  return slides;
}
