import { MODULES } from '../data/modules'
import { P_L0 } from './bkt'
import type { Module, ProgressState, Recommendation, Topic, TopicStatus } from '../types'

/* =========================================================================
   MODELO DO DOMÍNIO + ÍNDICES DO MODELO DO ALUNO

   O modelo do aluno propriamente dito (atualização de P(domínio)) vive em
   `bkt.ts`. Aqui ficam o limiar de maestria, os índices de tópicos/módulos e
   a lógica de domínio (desbloqueio por pré-requisitos e recomendação).
   ========================================================================= */

export const MASTER = 0.8 // limiar de domínio (mastery learning)
export const STORE_KEY = 'its_auvp_state_v4'

/** Índices auxiliares: tópico por id e módulo de cada tópico. */
export const TOPIC: Record<string, Topic> = {}
export const TOPIC_MOD: Record<string, Module> = {}
MODULES.forEach((m) => m.topics.forEach((t) => { TOPIC[t.id] = t; TOPIC_MOD[t.id] = m }))

/** Estado inicial: P(domínio) de cada KC no prior do BKT, nenhuma questão vista. */
export function initialState(): ProgressState {
  const state: ProgressState = {}
  MODULES.forEach((m) => m.topics.forEach((t) => { state[t.id] = { m: P_L0, seen: 0 } }))
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
  if (state[t.id].seen > 0) return 'learning'
  return 'new'
}

export function globalProgress(state: ProgressState): number {
  const a = Object.values(state)
  return a.reduce((s, x) => s + x.m, 0) / a.length
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
