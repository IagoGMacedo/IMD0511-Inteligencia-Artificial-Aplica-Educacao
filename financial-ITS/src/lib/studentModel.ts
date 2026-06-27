import { MODULES } from '../data/modules'
import { MASTER, P_INIT } from './overlayModel'
import type { Module, ProgressState, Recommendation, Topic, TopicStatus } from '../types'

/* =========================================================================
   MODELO DO DOMÍNIO + ÍNDICES DO MODELO DO ALUNO

   O modelo do aluno propriamente dito (atualização de p e o limiar de
   maestria MASTER) vive em `overlayModel.ts`. Aqui ficam os índices de
   tópicos/módulos e a lógica de domínio (desbloqueio por pré-requisitos e
   recomendação). MASTER é reexportado por conveniência dos consumidores.
   ========================================================================= */

export { MASTER }
export const STORE_KEY = 'its_auvp_state_v5'

/** Índices auxiliares: tópico por id e módulo de cada tópico. */
export const TOPIC: Record<string, Topic> = {}
export const TOPIC_MOD: Record<string, Module> = {}
MODULES.forEach((m) => m.topics.forEach((t) => { TOPIC[t.id] = t; TOPIC_MOD[t.id] = m }))

/** Estado inicial: domínio de cada conceito em P_INIT (0), nenhuma questão vista. */
export function initialState(): ProgressState {
  const state: ProgressState = {}
  MODULES.forEach((m) => m.topics.forEach((t) => { state[t.id] = { m: P_INIT, seen: 0 } }))
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
