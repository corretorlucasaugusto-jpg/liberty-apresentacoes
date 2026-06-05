/**
 * Supabase Edge Function: gerar-apresentacao
 * Recebe os dados do formulário, chama a API da Anthropic no servidor,
 * e retorna os dados enriquecidos com descrições geradas pela IA.
 *
 * Deploy: supabase functions deploy gerar-apresentacao
 * Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 */

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
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada no servidor')

    const posItems  = d.pos  || []
    const negItems  = d.neg  || []
    const compItems = (d.comps || []).map((c: any) => c.t).filter(Boolean)
    const nvItems   = d.nv   || []

    // Build NV section for prompt
    const nvSection = nvItems.length ? `
IMÓVEIS NÃO VENDIDOS (análise estratégica):
${nvItems.map((nv: any, i: number) =>
  `${i+1}. ${nv.n || nv.a} — ${nv.a} — ${nv.v} — ${nv.d ? nv.d + ' no mercado' : 'em anúncio'} — ${nv.c || ''}`
).join('\n')}
Para cada NV, gere um comentário estratégico curto (1 frase) que explique o que esse concorrente representa no posicionamento do imóvel do cliente.
` : ''

    const prompt = `Você é um especialista sênior em mercado imobiliário de Brasília, com foco em precificação estratégica e captação de exclusividade.
Gere textos curtos, diretos e persuasivos para uma apresentação de captação ao proprietário.
Imóvel: ${d.residencial}, ${d.bairro}. Área: ${d.area}m². Quartos: ${d.quartos}. Vagas: ${d.vagas}. Valor sugerido: ${d.vl_div}.

PONTOS POSITIVOS (destaque o valor real para o comprador ideal, 1-2 frases objetivas):
${posItems.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')}

PONTOS DE ATENÇÃO (antecipe a objeção e mostre como a Liberty gerencia, 1-2 frases):
${negItems.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')}

PERFIS DO COMPRADOR (descreva quem é este perfil e por que este imóvel é ideal, 1-2 frases diretas):
${compItems.map((t: string, i: number) => `${i+1}. ${t}`).join('\n')}
${nvSection}

Responda APENAS com JSON válido, sem markdown, sem texto extra:
{
  "pos": [{"t":"título original","d":"descrição gerada"}],
  "neg": [{"t":"título original","d":"descrição gerada"}],
  "comps": [{"t":"título original","d":"descrição gerada"}],
  "nv_comentarios": ["comentário estratégico item 1","comentário item 2"]
}`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Anthropic API error ${res.status}: ${err.error?.message || ''}`)
    }

    const apiData = await res.json()
    const text = apiData.content?.map((b: any) => b.type === 'text' ? b.text : '').join('') || ''

    // Parse JSON robustly
    const jsonStart = text.indexOf('{')
    const jsonEnd   = text.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) throw new Error('Resposta da IA sem JSON válido')
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1))

    // Enrich the data
    const enriched = { ...d }
    if (parsed.pos)  enriched.posEnriched = parsed.pos
    if (parsed.neg)  enriched.negEnriched = parsed.neg
    if (parsed.comps) enriched.comps      = parsed.comps

    if (parsed.nv_comentarios && enriched.nv) {
      enriched.nv = enriched.nv.map((item: any, i: number) => ({
        ...item,
        ai: parsed.nv_comentarios[i] || '',
      }))
    }

    return new Response(
      JSON.stringify({ enriched }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )

  } catch (err: any) {
    console.error('gerar-apresentacao error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
