import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function VerApresentacao() {
  const { id } = useParams()
  const [html,    setHtml]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro,    setErro]    = useState(null)

  useEffect(() => {
    if (!id) { setErro('ID inválido'); setLoading(false); return }
    supabase
      .from('apresentacoes')
      .select('html, cliente, residencial')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setErro('Apresentação não encontrada'); setLoading(false); return }
        if (!data.html) { setErro('Apresentação ainda não foi gerada — abra o Gerador e clique em Gerar Apresentação primeiro.'); setLoading(false); return }
        setHtml(data.html)
        setLoading(false)
      })
  }, [id])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff' }}>
      <div style={{ width:'32px', height:'32px', borderRadius:'50%', border:'3px solid #1266CD', borderTopColor:'transparent', animation:'spin .7s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (erro) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#f5f5f7', padding:'32px', textAlign:'center' }}>
      <div style={{ fontSize:'48px', marginBottom:'16px' }}>📋</div>
      <h1 style={{ fontSize:'1.2rem', fontWeight:700, color:'#1d1d1f', marginBottom:'8px' }}>Apresentação não encontrada</h1>
      <p style={{ fontSize:'14px', color:'#6e6e73', maxWidth:'320px' }}>{erro}</p>
    </div>
  )

  // Renderiza o HTML completo da apresentação dentro de um iframe fullscreen
  return (
    <iframe
      srcDoc={html}
      style={{ width:'100vw', height:'100vh', border:'none', display:'block' }}
      title="Apresentação Liberty"
      allow="autoplay"
    />
  )
}
