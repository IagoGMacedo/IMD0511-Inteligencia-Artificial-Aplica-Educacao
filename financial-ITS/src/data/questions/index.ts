import type { Question } from '../../types'

/* =========================================================================
   BANCO DE QUESTÕES — carrega todos os arquivos JSON deste diretório (um por
   módulo) e os agrega. Cada JSON é um array plano de `Question`; o tópico de
   cada item vem do próprio campo `topicId`. Para adicionar questões, basta
   editar/criar um `*.json` aqui — o loader as descobre automaticamente
   (via `import.meta.glob`), sem precisar alterar este arquivo.

   Antes de subir uma base nova, rode `npm run validate:questions`.
   ========================================================================= */

const files = import.meta.glob<Question[]>('./*.json', { eager: true, import: 'default' })

/** Todas as questões, em ordem estável por nome de arquivo. */
export const ALL_QUESTIONS: Question[] = Object.keys(files)
  .sort()
  .flatMap((path) => files[path])

/** Questões agrupadas por tópico (knowledge component) — chave = topicId. */
export const QUESTIONS: Record<string, Question[]> = {}
for (const q of ALL_QUESTIONS) {
  ;(QUESTIONS[q.topicId] ??= []).push(q)
}

const BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))

/** Recupera uma questão pelo seu id estável. */
export function getQuestion(id: string): Question | undefined {
  return BY_ID.get(id)
}
