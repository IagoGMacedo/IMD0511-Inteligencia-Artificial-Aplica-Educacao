import { MODULES } from '../data/modules'
import type { Module, ProgressState, Recommendation, Topic, TopicStatus } from '../types'

/* =========================================================================
   DOMÍNIO + MODELO DO ALUNO
   ========================================================================= */

export const MASTER = 0.8 // limiar de domínio (mastery learning)
export const BETA = 0.12 // penalidade (slip) por erro
export const DEFAULT_ALPHA = 0.2 // ganho por acerto (padrão)
export const STORE_KEY = 'its_auvp_state_v3'

/** Índices auxiliares: tópico por id e módulo de cada tópico. */
export const TOPIC: Record<string, Topic> = {}
export const TOPIC_MOD: Record<string, Module> = {}
MODULES.forEach((m) => m.topics.forEach((t) => { TOPIC[t.id] = t; TOPIC_MOD[t.id] = m }))

/** Estado inicial: todos os tópicos zerados. */
export function initialState(): ProgressState {
  const state: ProgressState = {}
  MODULES.forEach((m) => m.topics.forEach((t) => { state[t.id] = { m: 0, seen: 0 } }))
  return state
}

export function modProgress(m: Module, state: ProgressState): number {
  return m.topics.reduce((s, t) => s + state[t.id].m, 0) / m.topics.length
}

export function modComplete(m: Module, state: ProgressState): boolean {
  return m.topics.every((t) => state[t.id].m >= MASTER)
}

export function modUnlocked(m: Module, state: ProgressState): boolean {
  return m.prereq.every((pid) => modComplete(MODULES.find((x) => x.id === pid)!, state))
}

export function topicState(t: Topic, state: ProgressState): TopicStatus {
  if (!modUnlocked(TOPIC_MOD[t.id], state)) return 'locked'
  if (state[t.id].m >= MASTER) return 'master'
  if (state[t.id].m > 0) return 'learning'
  return 'new'
}

export function globalProgress(state: ProgressState): number {
  const a = Object.values(state)
  return a.reduce((s, x) => s + x.m, 0) / a.length
}

/**
 * Regra de atualização do domínio:
 *  - acerto -> p + α(1 − p)
 *  - erro   -> pequeno recuo p·(1 − β), sem rebaixar abaixo da maestria já conquistada.
 */
export function nextMastery(m: number, correct: boolean, alpha: number): number {
  if (correct) return Math.min(1, m + alpha * (1 - m))
  const floor = m >= MASTER ? MASTER : 0
  return Math.max(floor, m * (1 - BETA))
}

/**
 * Recomendação: 1º tópico não-dominado em ordem de currículo;
 * se tudo dominado, revisa o mais fraco.
 */
export function recommend(state: ProgressState): Recommendation {
  for (const m of MODULES) {
    if (!modUnlocked(m, state)) continue
    for (const t of m.topics) {
      if (state[t.id].m < MASTER) return { topic: t, mode: 'study' }
    }
  }
  let weakest: string | null = null
  Object.keys(state).forEach((id) => {
    if (!weakest || state[id].m < state[weakest].m) weakest = id
  })
  return { topic: TOPIC[weakest!], mode: 'review' }
}
