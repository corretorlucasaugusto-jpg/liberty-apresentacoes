// src/lib/buildHTMLRealinhamento.js
import { buildSlidesRealinhamento } from './_buildSlidesRealinhamento.js'

const CSS_REALINHAMENTO = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;background:#f5f5f7;-webkit-font-smoothing:antialiased;overflow:hidden}
.deck{width:100vw;height:100vh;position:relative}
.slide{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .42s cubic-bezier(.4,0,.2,1);background:#fff;display:flex;flex-direction:column;overflow:hidden}
.slide.active{opacity:1!important;pointer-events:all!important}
.nav{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:13px;z-index:9000;background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border:1px solid rgba(0,0,0,.09);border-radius:50px;padding:8px 18px;box-shadow:0 3px 18px rgba(0,0,0,.09)}
.nb{width:30px;height:30px;border:none;border-radius:50%;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#424245}
.nb:hover{background:#f5f5f7}.nb:disabled{opacity:.2;cursor:not-allowed}
.nb svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.dots{display:flex;gap:5px;align-items:center}
.dot{width:5px;height:5px;border-radius:50%;background:#d2d2d7;cursor:pointer;transition:all .2s}
.dot.active{width:18px;border-radius:3px;background:#1d1d1f}
.nc{font-size:.6rem;color:#6e6e73;letter-spacing:.1em;min-width:34px;text-align:center;font-weight:500}
`

const NAVJS_REALINHAMENTO = `
var cur=0,slides=document.querySelectorAll('.slide'),dots=[];
function init(){
  var nd=document.getElementById('ndots');
  slides.forEach(function(_,i){
    var d=document.createElement('span');
    d.className='dot'+(i===0?' active':'');
    d.onclick=function(){go2(i);};
    nd.appendChild(d);dots.push(d);
  });
  upd();
}
function upd(){
  document.getElementById('prev').disabled=cur===0;
  document.getElementById('next').disabled=cur===slides.length-1;
  document.getElementById('nc').textContent=(cur+1)+' / '+slides.length;
  slides.forEach(function(s,i){s.classList.toggle('active',i===cur);});
  dots.forEach(function(d,i){d.classList.toggle('active',i===cur);});
}
function go(n){go2(cur+n);}
function go2(n){cur=Math.max(0,Math.min(slides.length-1,n));upd();}
document.addEventListener('keydown',function(e){if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);});
init();
`

export function buildHTMLRealinhamento(d) {
  const slideList = []
  try { buildSlidesRealinhamento(d, slideList) } catch (err) { console.error('buildSlidesRealinhamento:', err) }

  const slideDivs = slideList.map((s, i) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = s.trim()
    const el = tmp.firstElementChild || tmp
    if (i === 0) el.classList.add('active')
    else el.classList.remove('active')
    return el.outerHTML
  }).join('\n')

  const N = slideList.length
  const title = (d.residencial || 'Realinhamento').replace(/</g, '&lt;')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Realinhamento de Preço</title>
<style>${CSS_REALINHAMENTO}</style>
</head>
<body>
<div class="deck" id="deck">
${slideDivs}
</div>
<nav class="nav">
  <button class="nb" id="prev" disabled onclick="go(-1)"><svg viewBox="0 0 13 13"><polyline points="8,2 3,6.5 8,11"/></svg></button>
  <div class="dots" id="ndots"></div>
  <span class="nc" id="nc">1 / ${N}</span>
  <button class="nb" id="next" onclick="go(1)"${N <= 1 ? ' disabled' : ''}><svg viewBox="0 0 13 13"><polyline points="5,2 10,6.5 5,11"/></svg></button>
</nav>
<${"scr"}ipt>
${NAVJS_REALINHAMENTO}
function openAnuncio(url){ if(url) window.open(url,'_blank'); }
</${"scr"}ipt>
</body>
</html>`
}
