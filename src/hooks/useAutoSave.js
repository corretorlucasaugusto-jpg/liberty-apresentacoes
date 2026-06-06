/**
 * useAutoSave — salva automaticamente no Supabase a cada mudança
 * com debounce de 800ms. Retorna { saveStatus, lastSaved }
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useAutoSave(table, id, setId, userId) {
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error
  const [lastSaved,  setLastSaved]  = useState(null)
  const timerRef = useRef(null)
  const pendingRef = useRef(null)

  const save = useCallback(async (data) => {
    if (!userId) return
    setSaveStatus('saving')
    try {
      if (id) {
        // Update existente
        const { error } = await supabase
          .from(table)
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', userId)
        if (error) throw error
      } else {
        // Insert novo — guarda o id retornado
        const { data: row, error } = await supabase
          .from(table)
          .insert({ ...data, user_id: userId })
          .select('id')
          .single()
        if (error) throw error
        if (row?.id) setId(row.id)
      }
      setSaveStatus('saved')
      setLastSaved(new Date())
    } catch (err) {
      console.error('AutoSave error:', err.message)
      setSaveStatus('error')
    }
  }, [table, id, userId, setId])

  const scheduleSave = useCallback((data) => {
    pendingRef.current = data
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) save(pendingRef.current)
    }, 800)
  }, [save])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { saveStatus, lastSaved, scheduleSave, save }
}
