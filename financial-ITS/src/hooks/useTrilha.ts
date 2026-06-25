import { useCallback, useEffect, useState } from 'react'
import { QUESTIONS } from '../data/questions'
import { loadState, saveState } from '../lib/storage'
import { DEFAULT_ALPHA, initialState, nextMastery } from '../lib/studentModel'
import type { ProgressState } from '../types'

/**
 * Concentra todo o estado mutável da trilha (modelo do aluno, parâmetro α,
 * fila de questões e o tópico aberto no drawer) e as ações que o alteram —
 * o equivalente em React do estado global do protótipo original.
 */
export function useTrilha() {
  const [progress, setProgress] = useState<ProgressState>(initialState)
  const [alpha, setAlphaState] = useState<number>(DEFAULT_ALPHA)
  const [qPos, setQPos] = useState<Record<string, number>>({})
  const [currentTopic, setCurrentTopic] = useState<string | null>(null)
  const [answeredIdx, setAnsweredIdx] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Carrega o estado persistido uma única vez, na montagem.
  useEffect(() => {
    let alive = true
    loadState().then((saved) => {
      if (!alive) return
      if (saved) {
        if (saved.state) {
          setProgress((prev) => {
            const merged = { ...prev }
            Object.keys(merged).forEach((k) => {
              if (saved.state![k]) merged[k] = saved.state![k]
            })
            return merged
          })
        }
        if (typeof saved.alpha === 'number') setAlphaState(saved.alpha)
      }
      setLoaded(true)
    })
    return () => { alive = false }
  }, [])

  // Persiste o modelo do aluno e α sempre que mudam (após o carregamento inicial).
  useEffect(() => {
    if (!loaded) return
    saveState(progress, alpha)
  }, [progress, alpha, loaded])

  const openTopic = useCallback((id: string) => {
    setCurrentTopic(id)
    setAnsweredIdx(null)
    setQPos((prev) => (prev[id] == null ? { ...prev, [id]: 0 } : prev))
  }, [])

  const closeDrawer = useCallback(() => setCurrentTopic(null), [])

  const answer = useCallback((optIndex: number) => {
    const id = currentTopic
    if (id == null || answeredIdx != null) return
    const bank = QUESTIONS[id] || []
    const item = bank[qPos[id] % bank.length]
    const correct = optIndex === item.c
    setAnsweredIdx(optIndex)
    setProgress((prev) => ({
      ...prev,
      [id]: { m: nextMastery(prev[id].m, correct, alpha), seen: prev[id].seen + 1 },
    }))
  }, [currentTopic, answeredIdx, qPos, alpha])

  const nextQuestion = useCallback(() => {
    const id = currentTopic
    if (id == null) return
    const bank = QUESTIONS[id] || []
    setQPos((prev) => ({ ...prev, [id]: (prev[id] + 1) % bank.length }))
    setAnsweredIdx(null)
  }, [currentTopic])

  const setAlpha = useCallback((value: number) => setAlphaState(value), [])

  const reset = useCallback(() => {
    setProgress(initialState())
    setQPos({})
    setCurrentTopic(null)
    setAnsweredIdx(null)
  }, [])

  // Fecha o drawer ao pressionar Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  return {
    progress, alpha, qPos, currentTopic, answeredIdx,
    openTopic, closeDrawer, answer, nextQuestion, setAlpha, reset,
  }
}
