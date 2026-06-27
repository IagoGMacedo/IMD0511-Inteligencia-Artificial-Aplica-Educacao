import { useCallback, useEffect, useState } from 'react'
import { selectNextQuestion, selectSimilarQuestion } from '../lib/itemSelection'
import { updateMastery } from '../lib/overlayModel'
import { loadState, saveState } from '../lib/storage'
import { initialState } from '../lib/studentModel'
import type { ProgressState, Question } from '../types'

/** Quantos itens recentes lembrar por tópico para evitar repetição imediata. */
const RECENT_LIMIT = 3

/**
 * Apresenta a questão com as alternativas em ordem ALEATÓRIA (Fisher–Yates),
 * remapeando o índice da correta. Sem isso a posição carregaria sinal: no banco
 * a correta tende a ficar fixa, e o aluno acertaria pela posição, não pelo
 * conteúdo. Embaralhar a cada apresentação remove esse viés.
 */
function shuffleOptions(q: Question): Question {
  const order = q.options.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correct: order.indexOf(q.correct),
  }
}

/**
 * Concentra todo o estado mutável da trilha (modelo do aluno — domínio p por
 * conceito, a questão atualmente apresentada e o tópico aberto no modal) e as
 * ações que o alteram.
 */
export function useTrilha() {
  const [progress, setProgress] = useState<ProgressState>(initialState)
  const [currentTopic, setCurrentTopic] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [recentIds, setRecentIds] = useState<Record<string, string[]>>({})
  const [answeredIdx, setAnsweredIdx] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Carrega o estado persistido uma única vez, na montagem.
  useEffect(() => {
    let alive = true
    loadState().then((saved) => {
      if (!alive) return
      if (saved?.state) {
        setProgress((prev) => {
          const merged = { ...prev }
          Object.keys(merged).forEach((k) => {
            if (saved.state![k]) merged[k] = saved.state![k]
          })
          return merged
        })
      }
      setLoaded(true)
    })
    return () => { alive = false }
  }, [])

  // Persiste o modelo do aluno sempre que muda (após o carregamento inicial).
  useEffect(() => {
    if (!loaded) return
    saveState(progress)
  }, [progress, loaded])

  const openTopic = useCallback((id: string) => {
    setCurrentTopic(id)
    setAnsweredIdx(null)
    const q = selectNextQuestion(id, progress[id]?.m ?? 0, recentIds[id] ?? [])
    setCurrentQuestion(q ? shuffleOptions(q) : null)
  }, [progress, recentIds])

  const closeModal = useCallback(() => setCurrentTopic(null), [])

  const answer = useCallback((optIndex: number) => {
    const id = currentTopic
    if (id == null || answeredIdx != null || currentQuestion == null) return
    const correct = optIndex === currentQuestion.correct
    setAnsweredIdx(optIndex)
    setProgress((prev) => {
      const cur = prev[id]
      const m = updateMastery(cur.m, correct, cur.seen) // cur.seen = vistas antes desta
      return { ...prev, [id]: { m, seen: cur.seen + 1 } }
    })
    setRecentIds((prev) => {
      const list = [currentQuestion.id, ...(prev[id] ?? [])].slice(0, RECENT_LIMIT)
      return { ...prev, [id]: list }
    })
  }, [currentTopic, currentQuestion, answeredIdx])

  /**
   * Avança a questão de forma contextual: após um ERRO, oferece uma questão
   * SEMELHANTE (mesmo tópico e dificuldade, quando houver) para re-testar o
   * equívoco; após um ACERTO, segue a seleção adaptativa (ZDP).
   */
  const nextQuestion = useCallback(() => {
    const id = currentTopic
    if (id == null || currentQuestion == null) return
    const wasCorrect = answeredIdx === currentQuestion.correct
    setAnsweredIdx(null)
    const q = wasCorrect
      ? selectNextQuestion(id, progress[id]?.m ?? 0, recentIds[id] ?? [])
      : selectSimilarQuestion(id, currentQuestion.difficulty, recentIds[id] ?? [])
    setCurrentQuestion(q ? shuffleOptions(q) : currentQuestion)
  }, [currentTopic, currentQuestion, answeredIdx, progress, recentIds])

  const reset = useCallback(() => {
    setProgress(initialState())
    setRecentIds({})
    setCurrentTopic(null)
    setCurrentQuestion(null)
    setAnsweredIdx(null)
  }, [])

  // Fecha o modal ao pressionar Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  return {
    progress, currentTopic, currentQuestion, answeredIdx,
    openTopic, closeModal, answer, nextQuestion, reset,
  }
}
