import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    const { data: d } = await req.json()
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada')

    const posItems  = d.pos  || []
    const negItems  = d.neg  || []
    const compItems = (d.comps||[]).map((c: any) => c.t).filter(Boolean)
    const nvItems   = d.nv   || []

    const nvSection = nvItems.length ? `\nIMÓVEIS NÃO VENDIDOS:\n${nvItems.map((nv: any, i: number) =>
      `${i+1}. ${nv.n||nv.a} — ${nv.a} — ${nv.v} — ${nv.d?nv.d+' no mercado':'em anúncio'}`
    ).join('\n')}\nPara cada NV, gere um comentário estratégico curto (1 frase).` : ''

    const prompt = `Especialista em mercado imobiliário de Brasília. Gere textos curtos e persuasivos.
Imóvel: ${d.residencial}, ${d.bairro}. Área: ${d.area}m². Quartos: ${d.quartos}. Vagas: ${d.vagas}. Valor: ${d.vl_div}.

PONTOS POSITIVOS (valor real para o comprador, 1-2 frases):
${posItems.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')}

PONTOS DE ATENÇÃO (antecipe a objeção, mostre como a Liberty gerencia):
${negItems.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')}

PERFIS DO COMPRADOR (quem é, por que este imóvel é ideal):
${compItems.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')}
${nvSection}

Responda APENAS com JSON válido:
{"pos":[{"t":"título","d":"descrição"}],"neg":[{"t":"título","d":"descrição"}],"comps":[{"t":"título","d":"descrição"}],"nv_comentarios":["comentário 1","comentário 2"]}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: prompt }] }),
    })

    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(`API error ${res.status}: ${err.error?.message||''}`) }

    const apiData = await res.json()
    const text = apiData.content?.map((b: any) => b.type==='text'?b.text:'').join('') || ''
    const jsonStart = text.indexOf('{'), jsonEnd = text.lastIndexOf('}')
    if (jsonStart===-1||jsonEnd===-1) throw new Error('Sem JSON na resposta')
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd+1))

    const enriched = { ...d }
    if (parsed.pos)   enriched.posEnriched = parsed.pos
    if (parsed.neg)   enriched.negEnriched = parsed.neg
    if (parsed.comps) enriched.comps       = parsed.comps
    if (parsed.nv_comentarios && enriched.nv) {
      enriched.nv = enriched.nv.map((item: any, i: number) => ({ ...item, ai: parsed.nv_comentarios[i]||'' }))
    }

    return new Response(JSON.stringify({ enriched }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
  } catch (err: any) {
    console.error('Error:', err)
    // FALLBACK: retorna dados sem enriquecimento em vez de falhar
    try {
      const { data: d } = await req.clone().json()
      const enriched = { ...d }
      enriched.posEnriched = (d.pos||[]).map((t: string) => ({ t, d: '' }))
      enriched.negEnriched = (d.neg||[]).map((t: string) => ({ t, d: '' }))
      return new Response(JSON.stringify({ enriched, warning: err.message }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
    } catch {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }
  }
})
