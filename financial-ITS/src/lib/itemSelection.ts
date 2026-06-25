import { QUESTIONS } from '../data/questions'
import type { Question } from '../types'
import { predictCorrect } from './bkt'
import { MASTER } from './studentModel'

/* =========================================================================
   MODELO PEDAGÓGICO — SELEÇÃO ADAPTATIVA DE QUESTÕES

   Substitui a apresentação sequencial. Dada a KC aberta e o P(domínio) atual
   do aluno, escolhe a próxima questão cuja P(acerto) prevista (do BKT) fica
   mais perto de um alvo na ZONA DE DESENVOLVIMENTO PROXIMAL — nem trivial
   (pouco aprendizado), nem frustrante. Evita repetir itens recém-vistos.
   ========================================================================= */

/** Alvo de P(acerto) enquanto o aluno aprende a KC (desafio calibrado). */
const TARGET_LEARNING = 0.75
/** Em revisão (KC já dominada), busca mais desafio: alvo de acerto menor. */
const TARGET_REVIEW = 0.6

/**
 * Escolhe a próxima questão de um tópico.
 * @param topicId    KC aberta.
 * @param pKnown     P(domínio) atual do aluno na KC.
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
