/* Tipos do domínio da Trilha do Investidor. */

export interface Topic {
  id: string
  name: string
  desc: string
}

export interface Module {
  id: string
  code: string
  alt: string
  title: string
  sub: string
  prereq: string[]
  topics: Topic[]
}

export interface Question {
  /** enunciado */
  q: string
  /** alternativas A–D */
  o: string[]
  /** índice da alternativa correta */
  c: number
  /** explicação exibida no feedback */
  e: string
}

/** Modelo do aluno por tópico: domínio (0–1) e questões vistas. */
export interface TopicProgress {
  m: number
  seen: number
}

export type TopicStatus = 'locked' | 'master' | 'learning' | 'new'

export type ProgressState = Record<string, TopicProgress>

/** Recomendação de próximo passo na trilha. */
export interface Recommendation {
  topic: Topic
  mode: 'study' | 'review'
}
