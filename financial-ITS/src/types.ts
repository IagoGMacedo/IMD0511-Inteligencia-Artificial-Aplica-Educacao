/* Tipos do domínio da Trilha do Investidor. */

import type { Bloom, Difficulty, QuestionType } from './data/taxonomy'

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

/** Uma alternativa de uma questão. */
export interface QuestionOption {
  /** texto da alternativa */
  text: string
  /** id curto do equívoco que esta alternativa representa (opcional, forward-compat) */
  misconception?: string
  /** feedback direcionado caso o aluno escolha esta alternativa (opcional) */
  feedback?: string
}

/**
 * Item do banco de questões. Os campos `id, topicId, stem, options, correct,
 * explanation, difficulty, bloom` são OBRIGATÓRIOS; os demais são opcionais e
 * reservados para recursos futuros (scaffolding por dicas, feedback por
 * equívoco). O schema canônico para geração com IA está em
 * `schema/question.schema.json` e o guia em `docs/autoria-questoes.md`.
 */
export interface Question {
  /** id estável e único, ex.: "m2b-q07" (usado para evitar repetição) */
  id: string
  /** assunto = knowledge component rastreada pelo BKT (valor de TopicId) */
  topicId: string
  /** enunciado */
  stem: string
  /** alternativas (2 ou mais) */
  options: QuestionOption[]
  /** índice 0-based da alternativa correta */
  correct: number
  /** explicação exibida no feedback após responder */
  explanation: string
  /** dificuldade — calibra slip/guess do BKT e a seleção adaptativa */
  difficulty: Difficulty
  /** nível de Bloom — variedade cognitiva e analytics */
  bloom: Bloom
  /** natureza da tarefa (opcional) */
  type?: QuestionType
  /** dicas progressivas (opcional, forward-compat para scaffolding) */
  hints?: string[]
  /** procedência: aula/módulo de origem (opcional) */
  source?: string
  /** tags livres extras (opcional) */
  tags?: string[]
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
