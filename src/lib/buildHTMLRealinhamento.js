// src/lib/buildHTMLRealinhamento.js
import { CSS }    from './_css.js'
import { NAVJS }  from './_navjs.js'
import { buildSlidesRealinhamento } from './_buildSlidesRealinhamento.js'

export function buildHTMLRealinhamento(d) {
  const slides = []
  try { buildSlidesRealinhamento(d, slides) } catch (e) { console.error('buildSlidesRealinhamento:', e) }

  const slideDivs = slides.map((s, i) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = s.trim()
    const el = tmp.firstElementChild || tmp
    if (i === 0) el.classList.add('active')
    else el.classList.remove('active')
    return el.outerHTML
  }).join('\n')

  const N = slides.length
  const title = (d.residencial || 'Realinhamento').replace(/</g, '&lt;')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Realinhamento de Preço</title>
<style>${CSS}
.deck{padding-bottom:56px!important}
.nav{position:fixed!important;bottom:0!important;left:50%!important;transform:translateX(-50%)!important;z-index:9000!important}
.slide{overflow-y:auto!important;overflow-x:hidden!important}
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
  <button class="nb" id="next" onclick="go(1)"${N <= 1 ? ' disabled' : ''}><svg viewBox="0 0 13 13"><polyline points="5,2 10,6.5 5,11"/></svg></button>
</nav>
<${"scr"}ipt>
${NAVJS}
// openAnuncio stub para links dos concorrentes
function openAnuncio(url){ if(url) window.open(url,'_blank'); }
</${"scr"}ipt>
</body>
</html>`
}
