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

  // ── Paleta V2 ──
  var W    = '#ffffff';
  var OFF  = '#f5f5f7';
  var DARK = '#1d1d1f';
  var MID  = '#424245';
  var GRAY = '#6e6e73';
  var LGRAY= '#a1a1a6';
  var BL   = '#e8e8ed';
  var BORD = '#d2d2d7';
  var GOLD = '#b8832a';
  var GBG  = '#fdf6ec';
  var BLUE = '#1A4C8B';
  var BLBG = '#eef3fb';
  var RED  = '#c0392b';
  var RDBG = '#fff5f5';

  var LOGO = '<img src="data:image/webp;base64,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" style="width:52px" alt="Liberty Imóveis"/>';

  // ── Helpers ──
  var parseVal  = function(s){ return parseInt((s||'').replace(/[^0-9]/g,''))||0; };
  var parseArea = function(s){ return parseFloat((s||'').replace(/[^0-9.,]/g,'').replace(',','.'))||0; };
  var fmtData   = function(iso){ if(!iso)return'—'; try{var p=iso.split('-');if(p.length===3)return p[2]+'/'+p[1]+'/'+p[0];}catch(x){}return iso; };
  var fmtMes    = function(iso){ if(!iso)return''; try{var p=iso.split('-');var ms=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];return ms[parseInt(p[1])-1]+' '+p[0];}catch(x){}return iso; };
  var fmtBRL    = function(n){ if(!n||n<=0)return'—'; return'R$ '+Number(n).toLocaleString('pt-BR'); };
  var fmtDias   = function(n){ if(!n||n<=0)return'—'; var m=Math.floor(n/30),r=n%30; if(m===0)return n+' dias'; if(r===0)return m+(m>1?' meses':' mês'); return m+(m>1?' meses':' mês')+' e '+r+' dias'; };
  var diasEntre = function(a,b){ try{return Math.round(Math.abs(new Date(b)-new Date(a))/864e5);}catch(x){return 0;} };
  var diasColor = function(dd){ var n=parseInt((dd||'').replace(/[^0-9]/g,''))||0; if(!n)return LGRAY; if(n<30)return'#2d7a4f'; if(n<90)return GOLD; return RED; };

  var diasCampanha   = d.data_inicio ? diasEntre(d.data_inicio, new Date().toISOString().split('T')[0]) : 0;
  var totalVisitantes= (d.visitas||[]).reduce(function(a,v){return a+(parseInt(v.qtd)||0);},0);
  var propostasFilt  = (d.propostas||[]).filter(function(p){return p.valor||p.data;});
  var totalPropostas = propostasFilt.length;
  var maiorProposta  = propostasFilt.reduce(function(a,p){var v=parseVal(p.valor);return v>a?v:a;},0);
  var precoOrigNum   = parseVal(d.preco_original);
  var selicNum       = parseFloat((d.selic||'14,50').replace(',','.'))||14.5;
  var custoMensal    = precoOrigNum>0 ? Math.round(precoOrigNum*(selicNum/100)/12) : 0;
  var custoTotal     = Math.round(custoMensal*Math.max(1,diasCampanha/30));
  var acoesFilt      = (d.acoes||[]).filter(Boolean);
  var nvVals         = (d.nv||[]).map(function(r){return parseVal(r.v);}).filter(Boolean);
  var nvMedio        = nvVals.length>0 ? Math.round(nvVals.reduce(function(a,b){return a+b;},0)/nvVals.length) : 0;

  // ── Layout helpers (estilo V2) ──
  var slide = function(id, inner) {
    return '<div class="slide" id="'+id+'" style="display:flex;flex-direction:column;height:100%;overflow:hidden;background:'+W+';font-family:-apple-system,BlinkMacSystemFont,Inter,sans-serif">'+inner+'</div>';
  };

  var sh = function(lbl, lblColor, title, sub) {
    return '<div style="padding:44px 64px 24px;border-bottom:1px solid '+BL+';display:flex;justify-content:space-between;align-items:flex-end;flex-shrink:0">'
      +'<div style="display:flex;flex-direction:column;gap:8px">'
        +'<div style="font-size:.65rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+(lblColor||GOLD)+'">'+lbl+'</div>'
        +'<div style="font-size:clamp(1.9rem,3.2vw,3rem);font-weight:700;color:'+DARK+';line-height:1;letter-spacing:-.03em">'+title+'</div>'
      +'</div>'
      +(sub?'<div style="font-size:.8rem;color:'+GRAY+';max-width:230px;text-align:right;line-height:1.5">'+sub+'</div>':'')
    +'</div>';
  };

  var sb = function(inner, pad) {
    return '<div style="padding:'+(pad||'26px 64px 48px')+';flex:1;overflow-y:auto;overflow-x:hidden">'+inner+'</div>';
  };


  // ══════════════════════════════════════════════════════
  // S1 — CAPA (estilo V2: esquerda clara, direita com acento)
  // ══════════════════════════════════════════════════════
  var kpis = [
    ['Início da campanha',  fmtData(d.data_inicio)],
    ['Tempo em campanha',   diasCampanha>0?fmtDias(diasCampanha):'—'],
    ['Visitantes',          totalVisitantes>0?totalVisitantes:'—'],
    ['Propostas recebidas', totalPropostas>0?totalPropostas:'0'],
  ];

  slides.push(slide('s1r',
    '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">'

    // Esquerda branca
    +'<div style="padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid '+BL+'">'
      +'<div style="display:flex;align-items:center;gap:12px">'+LOGO+'<span style="font-size:.58rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+LGRAY+'">Brasília · DF</span></div>'
      +'<div>'
        +'<div style="font-size:.6rem;color:'+LGRAY+';letter-spacing:.16em;text-transform:uppercase;font-weight:500;margin-bottom:14px">Alinhamento Estratégico</div>'
        +'<div style="font-size:clamp(2.6rem,4.5vw,4.5rem);font-weight:700;color:'+DARK+';line-height:.95;letter-spacing:-.04em;margin-bottom:18px">Alinhamento<br><span style="color:'+GOLD+'">Estratégico</span></div>'
        +'<div style="font-size:.86rem;color:'+GRAY+';line-height:1.65">'+e(d.residencial)+(d.bairro?' · '+e(d.bairro):'')+'</div>'
      +'</div>'
      +'<div style="font-size:.58rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+LGRAY+'">Preparado para '+e(d.nome)+' · '+new Date().toLocaleDateString('pt-BR')+'</div>'
    +'</div>'

    // Direita dourada/escura (estilo V2 cap-r)
    +'<div style="background:'+DARK+';padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden">'
      +'<div style="position:absolute;top:-110px;right:-110px;width:450px;height:450px;border-radius:50%;background:radial-gradient(circle,rgba(184,131,42,.11) 0%,transparent 65%)"></div>'
      +'<div style="font-size:.58rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.28)">Liberty Imóveis</div>'
      +'<div style="display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,.08);position:relative;z-index:1">'
        +kpis.map(function(k){
          return '<div style="background:rgba(255,255,255,.06);padding:18px 22px;display:flex;justify-content:space-between;align-items:center">'
            +'<div style="font-size:.76rem;color:rgba(255,255,255,.45)">'+k[0]+'</div>'
            +'<div style="font-size:1rem;font-weight:700;color:'+W+'">'+e(String(k[1]))+'</div>'
          +'</div>';
        }).join('')
        +(precoOrigNum>0
          ?'<div style="background:rgba(184,131,42,.15);padding:18px 22px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(184,131,42,.3)">'
            +'<div style="font-size:.76rem;color:rgba(255,255,255,.45)">Preço anunciado</div>'
            +'<div style="font-size:1rem;font-weight:700;color:'+GOLD+'">'+fmtBRL(precoOrigNum)+'</div>'
          +'</div>'
          :'')
        +(maiorProposta>0
          ?'<div style="background:rgba(192,57,43,.12);padding:18px 22px;display:flex;justify-content:space-between;align-items:center">'
            +'<div style="font-size:.76rem;color:rgba(255,255,255,.45)">Melhor proposta recebida</div>'
            +'<div style="font-size:1rem;font-weight:700;color:#e88">'+fmtBRL(maiorProposta)+'</div>'
          +'</div>'
          :'')
      +'</div>'
      +'<div style="font-size:.54rem;color:rgba(255,255,255,.18);letter-spacing:.08em;position:relative;z-index:1">Alinhamento Estratégico · '+new Date().toLocaleDateString('pt-BR')+'</div>'
    +'</div>'
    +'</div>'
  ));


  // ══════════════════════════════════════════════════════
  // S2 — LINHA DO TEMPO HORIZONTAL
  // ══════════════════════════════════════════════════════
  var events = [];
  if (d.data_inicio) events.push({ iso:d.data_inicio, icon:'🚀', title:'Início', sub:precoOrigNum>0?fmtBRL(precoOrigNum):'', cor:BLUE });
  acoesFilt.forEach(function(a){ events.push({ iso:'', icon:'✓', title:a, sub:'', cor:GOLD }); });
  (d.visitas||[]).forEach(function(v){
    if(v.data||v.qtd||v.feedback) events.push({ iso:v.data||'', icon:'👥', title:(v.qtd?v.qtd+' visita'+(parseInt(v.qtd)>1?'ntes':'nte'):'Visita'), sub:v.feedback?e(v.feedback.slice(0,60))+(v.feedback.length>60?'…':''):'', cor:BLUE });
  });
  propostasFilt.forEach(function(p){
    events.push({ iso:p.data||'', icon:'📋', title:'Proposta'+(p.valor?' '+e(p.valor):''), sub:'', cor:RED });
  });
  events.sort(function(a,b){ if(!a.iso&&!b.iso)return 0; if(!a.iso)return 1; if(!b.iso)return-1; return new Date(a.iso)-new Date(b.iso); });

  // Timeline horizontal com trilho
  var evHtml = events.map(function(ev, i) {
    var isFirst = i===0, isLast = i===events.length-1;
    return '<div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:0;position:relative">'
      // Linha esquerda
      +(i>0?'<div style="position:absolute;top:19px;right:50%;width:50%;height:2px;background:'+BL+'"></div>':'')
      // Linha direita
      +(!isLast?'<div style="position:absolute;top:19px;left:50%;width:50%;height:2px;background:'+BL+'"></div>':'')
      // Nó
      +'<div style="width:40px;height:40px;border-radius:50%;background:'+ev.cor+'15;border:2px solid '+ev.cor+';display:flex;align-items:center;justify-content:center;font-size:.9rem;flex-shrink:0;position:relative;z-index:1;background:'+W+'">'+ev.icon+'</div>'
      // Data
      +(ev.iso?'<div style="font-size:.56rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:'+LGRAY+';margin-top:8px;text-align:center">'+fmtData(ev.iso)+'</div>':'<div style="margin-top:8px;height:16px"></div>')
      // Título
      +'<div style="font-size:.74rem;font-weight:700;color:'+DARK+';margin-top:4px;text-align:center;line-height:1.3;padding:0 4px">'+ev.title+'</div>'
      // Sub
      +(ev.sub?'<div style="font-size:.62rem;color:'+GRAY+';margin-top:3px;text-align:center;line-height:1.4;font-style:italic;padding:0 4px">"'+ev.sub+'"</div>':'')
    +'</div>';
  }).join('');

  slides.push(slide('s2r',
    sh('Histórico', GOLD, 'Linha do tempo', 'Todos os eventos desde o lançamento.')
    +sb(
      '<div style="overflow-x:auto;padding-bottom:8px">'
        +'<div style="display:flex;align-items:flex-start;min-width:'+(events.length*160)+'px;gap:0;padding:24px 0">'
          +evHtml
        +'</div>'
      +'</div>'
    ,'26px 64px 48px')
  ));


  // ══════════════════════════════════════════════════════
  // S3 — DIAGNÓSTICO (dados + ações + feedbacks — único slide)
  // ══════════════════════════════════════════════════════
  var posMsg = '';
  if (precoOrigNum>0&&nvMedio>0) {
    var diff=precoOrigNum-nvMedio, pct=Math.abs(Math.round((diff/nvMedio)*100));
    posMsg = diff>0
      ?'O imóvel está anunciado por <strong>'+fmtBRL(Math.abs(diff))+' ('+pct+'%) acima</strong> da média dos concorrentes — o comprador vê alternativas mais acessíveis primeiro.'
      :'O preço está dentro da faixa de mercado. Outros fatores podem estar influenciando a decisão.';
  }

  var bigCards = [
    { n:diasCampanha||'—', unit:'dias em campanha', cor:diasCampanha>=90?RED:diasCampanha>=45?GOLD:BLUE, sub:diasCampanha<30?'Dentro do prazo':diasCampanha<90?'Acima do prazo médio':'Risco de desvalorização de percepção' },
    { n:totalVisitantes||'—', unit:'visitante'+(totalVisitantes!==1?'s':''), cor:BLUE, sub:totalVisitantes>0?'Interesse comprovado — o preço bloqueou a decisão':'Sem visitas registradas' },
    { n:totalPropostas||'0', unit:'proposta'+(totalPropostas!==1?'s':''), cor:GOLD, sub:maiorProposta>0&&precoOrigNum>0?'Melhor: '+fmtBRL(maiorProposta)+' ('+Math.round((maiorProposta/precoOrigNum)*100)+'% do pedido)':'Abaixo do valor pedido' },
  ];

  var feedbacks = (d.visitas||[]).filter(function(v){return v.feedback;});

  slides.push(slide('s3r',
    sh('Diagnóstico', GOLD, 'O que os dados indicam', 'Fatos objetivos da campanha.')
    +sb(
      // Big numbers
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px">'
        +bigCards.map(function(s){
          return '<div style="background:'+OFF+';padding:24px 22px;border-top:3px solid '+s.cor+'">'
            +'<div style="font-size:clamp(2rem,3.5vw,3.2rem);font-weight:700;color:'+s.cor+';line-height:1;letter-spacing:-.05em;margin-bottom:6px">'+s.n+'</div>'
            +'<div style="font-size:.74rem;font-weight:600;color:'+DARK+';margin-bottom:5px">'+s.unit+'</div>'
            +'<div style="font-size:.66rem;color:'+GRAY+';line-height:1.5">'+s.sub+'</div>'
          +'</div>';
        }).join('')
      +'</div>'

      // Duas colunas: ações | posicionamento + feedbacks
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">'
        // Ações
        +'<div>'
          +'<div style="font-size:.65rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+BLUE+';margin-bottom:14px">Ações realizadas ('+acoesFilt.length+')</div>'
          +acoesFilt.map(function(a,i){
            return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;'+(i>0?'border-top:1px solid '+BL:'')+'">'
              +'<div style="width:18px;height:18px;background:'+BLUE+'15;border:1px solid '+BLUE+'40;display:flex;align-items:center;justify-content:center;flex-shrink:0">'
                +'<svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="'+BLUE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1,4.5 3.2,7 8,2"/></svg>'
              +'</div>'
              +'<div style="font-size:.78rem;color:'+DARK+'">'+e(a)+'</div>'
            +'</div>';
          }).join('')
        +'</div>'

        // Posicionamento + feedbacks
        +'<div style="display:flex;flex-direction:column;gap:12px">'
          +(posMsg
            ?'<div style="background:'+GBG+';border-left:3px solid '+GOLD+';padding:14px 16px">'
              +'<div style="font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:'+GOLD+';margin-bottom:6px">Posicionamento</div>'
              +'<div style="font-size:.76rem;color:'+DARK+';line-height:1.65">'+posMsg+'</div>'
            +'</div>'
            :'')
          +feedbacks.map(function(v){
            return '<div style="background:'+OFF+';padding:14px 16px">'
              +(v.data?'<div style="font-size:.58rem;color:'+LGRAY+';margin-bottom:5px">'+fmtData(v.data)+'</div>':'')
              +'<div style="font-size:.76rem;color:'+DARK+';line-height:1.6;font-style:italic">&ldquo;'+e(v.feedback)+'&rdquo;</div>'
            +'</div>';
          }).join('')
        +'</div>'
      +'</div>'
    )
  ));


  // ══════════════════════════════════════════════════════
  // S4 — COMPARATIVO DE MERCADO
  // ══════════════════════════════════════════════════════
  (function(){
    var rowHtml=function(r,i,isNV){
      var val=parseVal(r.v),area=parseArea(r.a);
      var vm2=area>0&&val>0?'R$ '+Math.round(val/area).toLocaleString('pt-BR')+'/m²':'—';
      var carac=r.c||[r.quartos?r.quartos+' qts':'',r.conservacao||''].filter(Boolean).join(' · ')||'—';
      var dcor=diasColor(r.d);
      var db=r.d?'<span style="font-size:.6rem;font-weight:600;padding:2px 7px;background:'+dcor+'18;color:'+dcor+'">'+e(r.d)+'</span>':'—';
      var btn=isNV&&r.url?'<button onclick="openAnuncio(this.dataset.url)" data-url="'+(r.url||'').replace(/"/g,'&quot;')+'" style="font-size:.58rem;font-weight:600;padding:3px 8px;background:'+DARK+';color:'+W+';border:none;cursor:pointer">Ver</button>':'';
      var grid=isNV?'1.8fr .42fr 1.6fr .85fr .7fr .7fr .3fr':'1.8fr .42fr 1.6fr .85fr .7fr .7fr';
      var rowBg = i%2===0?W:OFF;
      var rowBorder = i>0?'border-top:1px solid '+BL+';':'';
      return '<div style="display:grid;grid-template-columns:'+grid+';align-items:center;padding:9px 14px;background:'+rowBg+';'+rowBorder+'">'
        +'<div style="font-size:.72rem;font-weight:600;color:'+DARK+'">'+e(r.n||'—')+'</div>'
        +'<div style="font-size:.66rem;color:'+GRAY+'">'+e(r.a||'—')+'m²</div>'
        +'<div style="font-size:.62rem;color:'+GRAY+'">'+e(carac)+'</div>'
        +'<div style="font-size:.72rem;font-weight:700;color:'+(isNV?RED:'#2d7a4f')+'">'+e(r.v||'—')+'</div>'
        +'<div style="font-size:.6rem;color:'+LGRAY+'">'+vm2+'</div>'
        +'<div>'+db+'</div>'
        +(isNV?'<div>'+btn+'</div>':'')
      +'</div>';
    };

    var hdr=function(isNV){
      var grid=isNV?'1.8fr .42fr 1.6fr .85fr .7fr .7fr .3fr':'1.8fr .42fr 1.6fr .85fr .7fr .7fr';
      return '<div style="display:grid;grid-template-columns:'+grid+';padding:7px 14px;background:'+DARK+';font-size:.58rem;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:rgba(255,255,255,.45)">'
        +'<div>Imóvel</div><div>Área</div><div>Características</div>'
        +(isNV?'<div>Anunciado</div>':'<div>Negociado</div>')
        +'<div>R$/m²</div><div>Dias</div>'+(isNV?'<div></div>':'')
      +'</div>';
    };

    var sec=function(cor,txt){
      return '<div style="font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:'+cor+';padding:12px 14px 6px;display:flex;align-items:center;gap:7px">'
        +'<span style="width:5px;height:5px;border-radius:50%;background:'+cor+'"></span>'+txt
      +'</div>';
    };

    var nvLocal=(d.nv||[]).filter(function(r){return(r.cat||'local')==='local';});
    var nvAmplo=(d.nv||[]).filter(function(r){return r.cat==='amplo';});
    var localRows=nvLocal.map(function(r,i){return rowHtml(r,i,true);}).join('');
    var amploRows=nvAmplo.map(function(r,i){return rowHtml(r,i,true);}).join('');
    var vRows=(d.v||[]).map(function(r,i){return rowHtml(r,i,false);}).join('');
    if(!localRows&&!amploRows) localRows='<div style="padding:14px;font-size:.76rem;color:'+LGRAY+'">Nenhum comparável cadastrado.</div>';

    slides.push(slide('s4r',
      sh('Mercado', BLUE, 'O que o comprador está vendo', 'Concorrentes ativos e vendas recentes.')
      +'<div style="flex:1;overflow-y:auto;padding:16px 64px 48px">'
        +(vRows?'<div style="margin-bottom:16px;border:1px solid '+BL+'">'+sec('#2d7a4f','Vendidos recentes')+hdr(false)+vRows+'</div>':'')
        +'<div style="margin-bottom:16px;border:1px solid '+BL+'">'+sec(BLUE,'Concorrentes ativos')+hdr(true)+localRows+'</div>'
        +(amploRows?'<div style="border:1px solid '+BL+'">'+sec(GOLD,'Também no radar')+hdr(true)+amploRows+'</div>':'')
      +'</div>'
    ));
  })();


  // ══════════════════════════════════════════════════════
  // S5 — CUSTO DO TEMPO
  // ══════════════════════════════════════════════════════
  slides.push(slide('s5r',
    sh('Custo real', RED, 'O preço de não vender', 'Cada mês parado tem um custo concreto.')
    +sb(
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">'

      // Esquerda — número grande em fundo off
      +'<div style="background:'+OFF+';padding:32px 28px">'
        +'<div style="font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+LGRAY+';margin-bottom:12px">Custo acumulado ('+fmtDias(diasCampanha)+')</div>'
        +'<div style="font-size:clamp(2.4rem,5vw,4.8rem);font-weight:700;color:'+RED+';line-height:1;letter-spacing:-.05em;margin-bottom:12px">'+fmtBRL(custoTotal)+'</div>'
        +'<div style="font-size:.76rem;color:'+GRAY+';line-height:1.65;margin-bottom:24px">Selic <strong style="color:'+DARK+'">'+e(d.selic||'14,50%')+'</strong>/ano sobre o valor anunciado.</div>'
        +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:1px;background:'+BORD+'">'
          +'<div style="background:'+W+';padding:16px 18px"><div style="font-size:1.3rem;font-weight:700;color:'+GOLD+'">'+fmtBRL(custoMensal)+'</div><div style="font-size:.62rem;color:'+LGRAY+';margin-top:3px">por mês</div></div>'
          +'<div style="background:'+W+';padding:16px 18px"><div style="font-size:1.3rem;font-weight:700;color:'+MID+'">'+diasCampanha+'</div><div style="font-size:.62rem;color:'+LGRAY+';margin-top:3px">dias</div></div>'
        +'</div>'
      +'</div>'

      // Direita — argumentos
      +'<div style="display:flex;flex-direction:column;gap:1px;background:'+BL+'">'
        +[
          {title:'O tempo tem custo real', desc:'Cada mês sem venda representa '+fmtBRL(custoMensal)+' que o capital deixa de render — valor que cresce a cada semana.'},
          {title:'O mercado penaliza a demora', desc:'Após 90 dias anunciado, o imóvel começa a gerar dúvida no comprador antes mesmo da visita.'},
          {title:maiorProposta>0&&precoOrigNum>0?'A proposta está próxima':'O interesse existe',
            desc:maiorProposta>0&&precoOrigNum>0
              ?'A diferença entre o preço pedido e a melhor proposta é de '+fmtBRL(precoOrigNum-maiorProposta)+'. O custo de esperar pode superar essa diferença em meses.'
              :'As visitas aconteceram. Há demanda real — o ajuste desbloquearia o fechamento.'},
        ].map(function(item){
          return '<div style="background:'+W+';padding:20px 22px">'
            +'<div style="font-size:.8rem;font-weight:700;color:'+DARK+';margin-bottom:5px">'+item.title+'</div>'
            +'<div style="font-size:.72rem;color:'+GRAY+';line-height:1.6">'+item.desc+'</div>'
          +'</div>';
        }).join('')
      +'</div>'

      +'</div>'
    )
  ));


  // ══════════════════════════════════════════════════════
  // S6 — FAIXA DE PREÇO
  // ══════════════════════════════════════════════════════
  var prec=d.prec||null, temPrec=prec&&prec.mercado&&prec.mercado.total;

  slides.push(slide('s6r',
    sh('Precificação', GOLD, 'Faixa de referência do mercado', 'Baseada nos dados reais de comparáveis.')
    +sb(
      temPrec?(
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px">'
          +[
            {key:'competitivo',label:'Competitivo',sub:'Fechar em até 30 dias',cor:'#2d7a4f'},
            {key:'mercado',    label:'Mercado',    sub:'Equilíbrio · 30–60 dias',cor:BLUE},
            {key:'otimista',   label:'Otimista',   sub:'Com margem · 60–90 dias',cor:GOLD},
          ].map(function(f){
            var faixa=prec[f.key]; if(!faixa) return '';
            var isRec=prec.recomendacao===f.key;
            var ajuste='';
            if(precoOrigNum>0&&faixa.total){
              var dif=faixa.total-precoOrigNum, pct=Math.abs(Math.round((dif/precoOrigNum)*100));
              ajuste='<div style="margin-top:12px;padding-top:12px;border-top:1px solid '+BL+';font-size:.64rem;font-weight:700;color:'+f.cor+'">'+(dif<0?'↓ Ajuste de '+pct+'% abaixo do atual':'↑ Acima do atual em '+pct+'%')+'</div>';
            }
            return '<div style="background:'+OFF+';padding:22px;border-top:3px solid '+f.cor+(isRec?';outline:2px solid '+f.cor+';outline-offset:-2px':'')+'">'
              +(isRec?'<div style="display:inline-block;background:'+f.cor+';color:'+W+';font-size:.5rem;font-weight:700;padding:2px 10px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px">✦ Recomendado</div><br>':'')
              +'<div style="font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+f.cor+';margin-bottom:10px">'+f.label+'</div>'
              +'<div style="font-size:1.8rem;font-weight:700;color:'+DARK+';line-height:1;letter-spacing:-.04em;margin-bottom:5px">'+e(faixa.totalFmt||'—')+'</div>'
              +'<div style="font-size:.64rem;color:'+LGRAY+';margin-bottom:8px">'+e(faixa.vm2Fmt||'—')+'</div>'
              +'<div style="font-size:.7rem;color:'+GRAY+';line-height:1.5">'+f.sub+'</div>'
              +ajuste
            +'</div>';
          }).join('')
        +'</div>'
        +(prec.justificativa
          ?'<div style="background:'+GBG+';border-left:3px solid '+GOLD+';padding:16px 20px">'
            +'<div style="font-size:.62rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:'+GOLD+';margin-bottom:7px">Análise</div>'
            +'<div style="font-size:.78rem;color:'+DARK+';line-height:1.7">'+e(prec.justificativa)+'</div>'
          +'</div>'
          :'')
      ):(
        '<div style="background:'+OFF+';padding:48px;text-align:center">'
          +'<div style="font-size:2.2rem;margin-bottom:14px">📊</div>'
          +'<div style="font-size:.9rem;font-weight:700;color:'+DARK+';margin-bottom:8px">Precificação não calculada</div>'
          +'<div style="font-size:.76rem;color:'+GRAY+';line-height:1.6;max-width:300px;margin:0 auto">Preencha os concorrentes e clique em Precificar no formulário.</div>'
        +'</div>'
      )
    )
  ));


  // ══════════════════════════════════════════════════════
  // S7 — ENCERRAMENTO
  // ══════════════════════════════════════════════════════
  var precoNovo=temPrec&&prec[prec.recomendacao]?prec[prec.recomendacao].totalFmt:(temPrec?prec.mercado.totalFmt:null);
  var ajustePct=temPrec&&prec[prec.recomendacao]&&precoOrigNum>0?Math.abs(Math.round(((prec[prec.recomendacao].total-precoOrigNum)/precoOrigNum)*100)):null;

  slides.push(slide('s7r',
    '<div style="display:grid;grid-template-columns:1fr 1fr;height:100%">'

    // Esquerda clara com logo
    +'<div style="padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid '+BL+'">'
      +'<div>'+LOGO+'</div>'
      +'<div>'
        +'<div style="font-size:.6rem;color:'+LGRAY+';letter-spacing:.16em;text-transform:uppercase;font-weight:500;margin-bottom:14px">Conclusão</div>'
        +'<div style="font-size:clamp(2.4rem,4vw,4rem);font-weight:700;color:'+DARK+';line-height:.92;letter-spacing:-.04em;margin-bottom:20px">A decisão<br>é sua.<br><span style="color:'+GOLD+'">Os dados<br>já falaram.</span></div>'
        +'<div style="font-size:.84rem;color:'+GRAY+';line-height:1.75;max-width:320px">Não é uma pressão — é o mercado comunicando, de forma objetiva, qual o caminho para o fechamento.</div>'
      +'</div>'
      +'<div style="font-size:.56rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+LGRAY+'">Liberty Imóveis · Brasília, DF</div>'
    +'</div>'

    // Direita escura só no card de preço, resto off-white
    +'<div style="background:'+OFF+';padding:56px 64px;display:flex;flex-direction:column;justify-content:center;gap:12px">'
      +'<div style="font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:'+GOLD+';margin-bottom:8px">Por que agir agora</div>'
      +(precoNovo
        ?'<div style="background:'+DARK+';padding:22px 24px;margin-bottom:8px">'
          +'<div style="font-size:.58rem;color:rgba(255,255,255,.35);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Faixa recomendada</div>'
          +'<div style="font-size:2rem;font-weight:700;color:'+GOLD+';letter-spacing:-.03em">'+e(precoNovo)+'</div>'
          +(ajustePct!==null?'<div style="font-size:.62rem;color:rgba(255,255,255,.3);margin-top:5px">Ajuste de '+ajustePct+'% sobre o preço atual</div>':'')
        +'</div>'
        :'')
      +[
        {icon:'⏱', title:'O tempo tem custo', desc:fmtBRL(custoMensal)+' por mês em custo de oportunidade.'},
        {icon:'👥', title:'O interesse está comprovado', desc:(totalVisitantes>0?totalVisitantes+' pessoa'+(totalVisitantes>1?'s':'')+' visitaram o imóvel.':'Visitantes chegaram.')+' O preço bloqueou a decisão.'},
        {icon:'✓',  title:'A venda está ao alcance', desc:'Localização, produto e campanha prontos. Um ajuste fecha esse ciclo.'},
      ].map(function(item){
        return '<div style="background:'+W+';padding:14px 16px;display:flex;gap:12px;align-items:flex-start">'
          +'<div style="width:30px;height:30px;background:'+GOLD+'18;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:.9rem">'+item.icon+'</div>'
          +'<div>'
            +'<div style="font-size:.78rem;font-weight:700;color:'+DARK+';margin-bottom:3px">'+item.title+'</div>'
            +'<div style="font-size:.7rem;color:'+GRAY+';line-height:1.55">'+item.desc+'</div>'
          +'</div>'
        +'</div>';
      }).join('')
    +'</div>'

    +'</div>'
  ));

  return slides;
}
