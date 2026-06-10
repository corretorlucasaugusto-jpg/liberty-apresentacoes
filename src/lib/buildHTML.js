import { CSS }         from './_css.js'
import { NAVJS }       from './_navjs.js'
import { BMODAL_HTML, BMODAL_NEWS1, BMODAL_NEWS2, VMODAL1_HTML, VMODAL2_HTML } from './_modals.js'
import { MODAL_PORTFOLIO, MODAL_MATERIAIS, MODAL_MIDIA } from './_image_modals.js'
import { buildSlides } from './_buildSlides.js'

const VIDEO_PRODUCAO = import.meta.env.VITE_VIDEO_PRODUCAO_URL || 'liberty_video.mp4'
const VIDEO_TRAFEGO  = import.meta.env.VITE_VIDEO_TRAFEGO_URL  || 'liberty_trafego.mov'

const imgModalJs = `
function openImgModal(id){
  var m=document.getElementById(id);
  var sid='shell-'+id.split('-')[1];
  var s=document.getElementById(sid)||m&&m.firstElementChild;
  if(!m)return;
  m.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.78);backdrop-filter:blur(28px);display:flex;align-items:center;justify-content:center;pointer-events:all;transition:none';
  if(s){s.style.transform='scale(1) translateY(0)';s.style.opacity='1';}
}
function closeImgModal(id){
  var m=document.getElementById(id);
  var sid='shell-'+id.split('-')[1];
  var s=document.getElementById(sid)||m&&m.firstElementChild;
  if(!m)return;
  m.style.background='rgba(0,0,0,0)';m.style.backdropFilter='blur(0px)';m.style.pointerEvents='none';
  if(s){s.style.transform='scale(.88) translateY(24px)';s.style.opacity='0';}
}
`

export function buildHTML(d) {
  const lastSlides = []
  try { buildSlides(d, lastSlides) } catch(e) { console.error('buildSlides:', e) }

  const slideDivs = lastSlides.map((s, i) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = s.trim()
    const el = tmp.firstElementChild || tmp
    if (i === 0) el.classList.add('active')
    else el.classList.remove('active')
    return el.outerHTML
  }).join('\n')

  const N = lastSlides.length

  const navJsFinal   = NAVJS.replace(/liberty_video\.mp4/g, VIDEO_PRODUCAO).replace(/liberty_trafego\.mov/g, VIDEO_TRAFEGO)
  const vmodal1Final = (VMODAL1_HTML||'').replace(/liberty_video\.mp4/g, VIDEO_PRODUCAO)
  const vmodal2Final = (VMODAL2_HTML||'').replace(/liberty_trafego\.mov/g, VIDEO_TRAFEGO)

  const anuncioHtml = `<div id="modal-anuncio" onclick="if(event.target.id==='modal-anuncio')closeAnuncio()" style="position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0);backdrop-filter:blur(0px);display:flex;align-items:center;justify-content:center;pointer-events:none;transition:background .4s,backdrop-filter .4s"><div id="shell-anuncio" style="width:min(1000px,94vw);height:min(680px,88vh);background:#1e1e1e;border-radius:14px;overflow:hidden;box-shadow:0 48px 120px rgba(0,0,0,.55);transform:scale(.88) translateY(24px);opacity:0;transition:transform .52s cubic-bezier(.16,1,.3,1),opacity .38s;display:flex;flex-direction:column"><div style="background:#2a2a2a;padding:10px 14px;display:flex;align-items:center;gap:12px;flex-shrink:0"><div style="display:flex;gap:6px"><span style="width:12px;height:12px;border-radius:50%;background:#ff5f57;display:block"></span><span style="width:12px;height:12px;border-radius:50%;background:#febc2e;display:block"></span><span style="width:12px;height:12px;border-radius:50%;background:#28c840;display:block"></span></div><div style="flex:1;background:#3a3a3a;border-radius:7px;padding:5px 12px;font-size:.66rem;color:#a1a1a6;overflow:hidden"><span id="anuncio-url-bar"></span></div><button onclick="closeAnuncio()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0">✕</button></div><iframe id="frame-anuncio" src="" style="flex:1;border:none;background:#fff"></iframe></div></div>`

  const title = (d.residencial || 'Liberty Imóveis').replace(/</g, '&lt;')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>${CSS}
/* Nav nunca sobrepoe slides */
.deck{padding-bottom:56px!important}
.nav{position:fixed!important;bottom:0!important;left:50%!important;transform:translateX(-50%)!important;z-index:9000!important}
.slide{overflow-y:auto!important;overflow-x:hidden!important}
/* S5 font size overrides */
.s5-th{font-size:.65rem!important}
.s5-td{font-size:.88rem!important}
.s5-td.carac{font-size:.82rem!important}
.s5-td.val,.s5-td.val-r{font-size:.96rem!important}
.s5-badge{font-size:.72rem!important}
.s5-sec-lbl{font-size:.68rem!important}
.s5-insight-txt{font-size:.82rem!important}
.s5-row{padding:14px 16px!important}
/* S6 font size overrides */
.s6-ttl{font-size:1.05rem!important;font-weight:800!important}
.s6-dsc{font-size:.82rem!important;line-height:1.65!important;color:#3a3a3c!important}
.s6-ico{width:64px!important;height:64px!important;border-radius:18px!important;min-width:64px!important}
.s6-ico svg{width:30px!important;height:30px!important}
/* S9 perfil overrides */
.s9-ttl{font-size:1rem!important}
.s9-dsc{font-size:.8rem!important}
</style>
</head>
<body style="margin:0;overflow:hidden;background:#fff">
<div class="deck" id="deck">
${slideDivs}
</div>
<nav class="nav">
  <button class="nb" id="prev" disabled onclick="go(-1)"><svg viewBox="0 0 13 13"><polyline points="8,2 3,6.5 8,11"/></svg></button>
  <div class="dots" id="ndots"></div>
  <span class="nc" id="nc">1 / ${N}</span>
  <button class="nb" id="next" onclick="go(1)"${N<=1?' disabled':''} ><svg viewBox="0 0 13 13"><polyline points="5,2 10,6.5 5,11"/></svg></button>
</nav>
${BMODAL_HTML}
${BMODAL_NEWS1}
${BMODAL_NEWS2}
${vmodal1Final}
${vmodal2Final}
${MODAL_PORTFOLIO}
${MODAL_MATERIAIS}
${MODAL_MIDIA}
${anuncioHtml}
<${"scr"}ipt>
${navJsFinal}
${imgModalJs}
</${"scr"}ipt>
</body>
</html>`
}
