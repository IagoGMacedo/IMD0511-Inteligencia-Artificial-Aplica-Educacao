import { QUESTIONS } from '../data/questions'
import { Difficulty } from '../data/taxonomy'
import type { Question } from '../types'
import { MASTER } from './studentModel'

/* =========================================================================
   MODELO PEDAGÓGICO — SELEÇÃO ADAPTATIVA DE QUESTÕES

   Casa a DIFICULDADE da questão com a HABILIDADE estimada do aluno (o domínio
   p da KC) — o mesmo princípio do Teste Adaptativo Informatizado / TRI: cada
   dificuldade tem um "limiar de habilidade" b; a chance de acerto vale ~0,5
   quando p iguala b, cresce acima e cai abaixo. A seleção escolhe o item cuja
   P(acerto) estimada fica mais perto de um alvo — então, à medida que p sobe,
   a dificuldade apresentada sobe junto (fácil → média → difícil). Evita repetir
   itens recém-vistos. Isto serve só à seleção — não atualiza p.
   ========================================================================= */

/**
 * Alvo de P(acerto): no aprendizado mira ~0,6 (desafio calibrado à ZDP); na
 * revisão (KC dominada) baixa o alvo para puxar os itens mais difíceis.
 */
const TARGET_LEARNING = 0.6
const TARGET_REVIEW = 0.4

/** Limiar de habilidade b de cada dificuldade, na escala do domínio p (0–1). */
const DIFFICULTY_B: Record<Difficulty, number> = {
  [Difficulty.Facil]: 0.25,
  [Difficulty.Medio]: 0.5,
  [Difficulty.Dificil]: 0.75,
}

/**
 * P(acerto) estimada (curva da TRI, simplificada): 0,5 quando o domínio p iguala
 * o limiar b da dificuldade; maior acima, menor abaixo. É o que liga o domínio
 * do aluno à dificuldade do item na seleção adaptativa.
 */
function predictCorrect(pKnown: number, difficulty: Difficulty): number {
  const b = DIFFICULTY_B[difficulty] ?? 0.5
  return Math.min(1, Math.max(0, 0.5 + (pKnown - b)))
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
