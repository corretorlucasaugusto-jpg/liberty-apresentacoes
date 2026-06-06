import { useState, useEffect } from 'react'

// Força dark como padrão se não houver preferência salva
if (!localStorage.getItem('liberty_theme')) {
  localStorage.setItem('liberty_theme', 'dark')
}

export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('liberty_theme') !== 'light')

  useEffect(() => {
    document.body.className = dark ? 'dark' : 'light'
    localStorage.setItem('liberty_theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}

// Hook read-only para componentes filhos (sem toggle)
export function useDark() {
  const [dark, setDark] = useState(() => document.body.classList.contains('dark'))

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.body.classList.contains('dark'))
    })
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return dark
}
