#!/usr/bin/env node
/**
 * extract-slides.js
 * Uso: node extract-slides.js liberty_gerador_v2.html
 * Extrai buildSlides() do HTML e salva em src/lib/_buildSlides.js
 */
const fs   = require('fs')
const path = require('path')

const htmlPath = process.argv[2]
if (!htmlPath) { console.error('Uso: node extract-slides.js liberty_gerador_v2.html'); process.exit(1) }

const html = fs.readFileSync(htmlPath, 'utf8')
const bsIdx = html.indexOf('\nfunction buildSlides(')
if (bsIdx === -1) { console.error('buildSlides não encontrado'); process.exit(1) }

const afterBs      = html.slice(bsIdx + 100)
const nextFnMatch  = afterBs.match(/\n(?:async )?function \w+\(/)
if (!nextFnMatch)  { console.error('Fim de buildSlides não encontrado'); process.exit(1) }

const endIdx  = bsIdx + 100 + nextFnMatch.index
const buildFn = html.slice(bsIdx + 1, endIdx)
const fixed   = buildFn.replace(
  'function buildSlides(d){\n  const slides=[];',
  'function buildSlides(d, slides=[]){'
)

const output = ['// Auto-generated — não editar', '// Regenerar: node extract-slides.js liberty_gerador_v2.html', '', 'export ' + fixed].join('\n')
const outPath = path.join(__dirname, 'src/lib/_buildSlides.js')
fs.writeFileSync(outPath, output)
console.log(`✓ Extraído: ${outPath} (${fixed.length.toLocaleString()} chars)`)
