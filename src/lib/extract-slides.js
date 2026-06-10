#!/usr/bin/env node
/**
 * extract-slides.js
 * Uso: node extract-slides.js liberty_gerador_v2.html
 */
const fs   = require('fs')
const path = require('path')

const htmlPath = process.argv[2]
if (!htmlPath) { console.error('Uso: node extract-slides.js liberty_gerador_v2.html'); process.exit(1) }

const html = fs.readFileSync(htmlPath, 'utf8')

// buildS5 comes BEFORE buildSlides in the generator
const s5Idx  = html.indexOf('\nfunction buildS5(')
const bsIdx  = html.indexOf('\nfunction buildSlides(')
if (s5Idx === -1 || bsIdx === -1) { console.error('Funções não encontradas'); process.exit(1) }

const buildS5Fn = html.slice(s5Idx + 1, bsIdx)

const afterBs    = html.slice(bsIdx + 100)
const nextFnMatch = afterBs.match(/\n(?:async )?function \w+\(/)
const endBsIdx   = bsIdx + 100 + nextFnMatch.index
let buildSlidesFn = html.slice(bsIdx + 1, endBsIdx)

// Fix signature
buildSlidesFn = buildSlidesFn.replace(
  'function buildSlides(d){\n  const slides=[];\n  const rp=d.residencial.split(\' \');',
  `function buildSlides(d, slides=[]){
  function e(s){if(!s)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  if(!d) d={};
  if(!d.residencial) d.residencial='Residencial';
  if(!d.nome) d.nome='Proprietário';
  if(!d.bairro) d.bairro='';
  if(!d.endereco) d.endereco='';
  if(!d.quartos) d.quartos='—';
  if(!d.vagas) d.vagas='—';
  if(!d.area) d.area='—';
  if(!d.andar) d.andar='—';
  if(!d.selic) d.selic='14,50%';
  if(!d.vl_div) d.vl_div='—';
  if(!d.vl_fec) d.vl_fec='—';
  if(!d.vl_med) d.vl_med='—';
  if(!d.nv) d.nv=[];
  if(!d.v) d.v=[];
  if(!d.pos) d.pos=[];
  if(!d.neg) d.neg=[];
  if(!d.comps) d.comps=[];
  if(!d.posEnriched) d.posEnriched=d.pos.map(function(t){return{t:t,d:''};});
  if(!d.negEnriched) d.negEnriched=d.neg.map(function(t){return{t:t,d:''};});
  const rp=(d.residencial||'Residencial').split(' ');`
)

const output = [
  '// Auto-generated — do not edit',
  '// Regenerar: node extract-slides.js liberty_gerador_v2.html',
  '',
  'export ' + buildS5Fn,
  '',
  'export ' + buildSlidesFn,
].join('\n')

const outPath = path.join(__dirname, 'src/lib/_buildSlides.js')
fs.writeFileSync(outPath, output)
console.log(`✓ Extraído: ${outPath}`)
console.log(`  buildS5:     ${buildS5Fn.length.toLocaleString()} chars`)
console.log(`  buildSlides: ${buildSlidesFn.length.toLocaleString()} chars`)
