import { QUESTIONS } from '../data/questions'
import { Difficulty } from '../data/taxonomy'
import type { Question } from '../types'
import { MASTER } from './studentModel'

/* =========================================================================
   MODELO PEDAGÓGICO — SELEÇÃO ADAPTATIVA DE QUESTÕES

   Substitui a apresentação sequencial. Dada a KC aberta e o domínio p atual do
   aluno, escolhe a próxima questão cuja P(acerto) estimada fica mais perto de
   um alvo na ZONA DE DESENVOLVIMENTO PROXIMAL — nem trivial (pouco
   aprendizado), nem frustrante. Evita repetir itens recém-vistos.

   A estimativa de P(acerto) é uma heurística simples: parte do domínio p e
   aplica um ajuste pela dificuldade da questão (fácil sobe a chance de acerto,
   difícil reduz). Serve só à seleção — não faz parte da atualização de p.
   ========================================================================= */

/** Alvo de P(acerto) enquanto o aluno aprende a KC (desafio calibrado). */
const TARGET_LEARNING = 0.75
/** Em revisão (KC já dominada), busca mais desafio: alvo de acerto menor. */
const TARGET_REVIEW = 0.6

/** Ajuste de P(acerto) por dificuldade da questão. */
const DIFF_OFFSET: Record<Difficulty, number> = {
  [Difficulty.Facil]: 0.15,
  [Difficulty.Medio]: 0,
  [Difficulty.Dificil]: -0.15,
}

/**
 * P(acerto) estimada para uma questão de dada dificuldade, dado o domínio atual.
 * Usada pela seleção adaptativa para mirar a zona de desenvolvimento proximal.
 */
function predictCorrect(pKnown: number, difficulty: Difficulty): number {
  const est = pKnown + (DIFF_OFFSET[difficulty] ?? 0)
  return Math.min(1, Math.max(0, est))
}

/**
 * Escolhe a próxima questão de um tópico.
 * @param topicId    KC aberta.
 * @param pKnown     domínio p atual do aluno na KC.
 * @param recentIds  ids de questões recém-mostradas (evitar repetição).
 */
export function selectNextQuestion(topicId: string, pKnown: number, recentIds: string[] = []): Question | null {
  const bank = QUESTIONS[topicId]
  if (!bank || bank.length === 0) return null

  // Evita repetir itens recentes; se todos foram vistos, recomeça do banco todo.
  let pool = bank.filter((q) => !recentIds.includes(q.id))
  if (pool.length === 0) pool = bank

  const target = pKnown >= MASTER ? TARGET_REVIEW : TARGET_LEARNING

  let best = pool[0]
  let bestDist = Infinity
  for (const q of pool) {
    const dist = Math.abs(predictCorrect(pKnown, q.difficulty) - target)
    if (dist < bestDist) {
      bestDist = dist
      best = q
    }
  }
  return best
}

/**
 * Escolhe uma questão SEMELHANTE para reteste após um erro: mesmo tópico e,
 * quando possível, mesma dificuldade da questão errada. Evita itens recentes.
 * @param topicId    KC do equívoco.
 * @param difficulty dificuldade da questão errada (preferida na escolha).
 * @param recentIds  ids de questões recém-mostradas (evitar repetição).
 */
export function selectSimilarQuestion(
  topicId: string,
  difficulty: Difficulty | undefined,
  recentIds: string[] = [],
): Question | null {
  const bank = QUESTIONS[topicId]
  if (!bank || bank.length === 0) return null

  let pool = bank.filter((q) => !recentIds.includes(q.id))
  if (pool.length === 0) pool = bank

  const sameDiff = difficulty != null ? pool.filter((q) => q.difficulty === difficulty) : []
  const chooseFrom = sameDiff.length ? sameDiff : pool
  return chooseFrom[Math.floor(Math.random() * chooseFrom.length)]
}
