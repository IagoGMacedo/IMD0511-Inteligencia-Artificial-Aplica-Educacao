import { useCallback, useEffect, useState } from 'react'
import { getQuestion } from '../data/questions'
import { applyHintPenalty, DEFAULT_PT, updateBKT } from '../lib/bkt'
import { selectNextQuestion } from '../lib/itemSelection'
import { loadState, saveState } from '../lib/storage'
import { initialState } from '../lib/studentModel'
import type { ProgressState, Question } from '../types'

/** Quantos itens recentes lembrar por tópico para evitar repetição imediata. */
const RECENT_LIMIT = 3

/**
 * Concentra todo o estado mutável da trilha (modelo do aluno BKT, ritmo de
 * aprendizado P(T), a questão atualmente selecionada por tópico e o tópico
 * aberto no modal) e as ações que o alteram.
 */
export function useTrilha() {
  const [progress, setProgress] = useState<ProgressState>(initialState)
  const [pT, setPTState] = useState<number>(DEFAULT_PT)
  const [currentTopic, setCurrentTopic] = useState<string | null>(null)
  const [currentQId, setCurrentQId] = useState<Record<string, string>>({})
  const [recentIds, setRecentIds] = useState<Record<string, string[]>>({})
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
        if (typeof saved.pT === 'number') setPTState(saved.pT)
      }
      setLoaded(true)
    })
    return () => { alive = false }
  }, [])

  // Persiste o modelo do aluno e P(T) sempre que mudam (após o carregamento inicial).
  useEffect(() => {
    if (!loaded) return
    saveState(progress, pT)
  }, [progress, pT, loaded])

  /** Seleciona adaptativamente uma questão para o tópico e a registra. */
  const pickQuestion = useCallback((id: string) => {
    setCurrentQId((prev) => {
      const q = selectNextQuestion(id, progress[id]?.m ?? 0, recentIds[id] ?? [])
      return q ? { ...prev, [id]: q.id } : prev
    })
  }, [progress, recentIds])

  const openTopic = useCallback((id: string) => {
    setCurrentTopic(id)
    setAnsweredIdx(null)
    pickQuestion(id)
  }, [pickQuestion])

  const closeModal = useCallback(() => setCurrentTopic(null), [])

  const answer = useCallback((optIndex: number, hintsUsed = 0) => {
    const id = currentTopic
    if (id == null || answeredIdx != null) return
    const qid = currentQId[id]
    const item = qid ? getQuestion(qid) : undefined
    if (!item) return
    const correct = optIndex === item.correct
    setAnsweredIdx(optIndex)
    setProgress((prev) => {
      const bkt = updateBKT(prev[id].m, correct, item.difficulty, pT)
      const m = applyHintPenalty(prev[id].m, bkt, hintsUsed > 0)
      return { ...prev, [id]: { m, seen: prev[id].seen + 1 } }
    })
    setRecentIds((prev) => {
      const list = [item.id, ...(prev[id] ?? [])].slice(0, RECENT_LIMIT)
      return { ...prev, [id]: list }
    })
  }, [currentTopic, currentQId, answeredIdx, pT])

  const nextQuestion = useCallback(() => {
    const id = currentTopic
    if (id == null) return
    setAnsweredIdx(null)
    pickQuestion(id)
  }, [currentTopic, pickQuestion])

  const setPT = useCallback((value: number) => setPTState(value), [])

  const reset = useCallback(() => {
    setProgress(initialState())
    setCurrentQId({})
    setRecentIds({})
    setCurrentTopic(null)
    setAnsweredIdx(null)
  }, [])

  // Fecha o modal ao pressionar Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  const currentQuestion: Question | null =
    (currentTopic && currentQId[currentTopic] ? getQuestion(currentQId[currentTopic]) : undefined) ?? null

  return {
    progress, pT, currentTopic, currentQuestion, answeredIdx,
    openTopic, closeModal, answer, nextQuestion, setPT, reset,
  }
}
