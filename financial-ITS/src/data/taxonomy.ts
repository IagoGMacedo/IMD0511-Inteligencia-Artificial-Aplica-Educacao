/* =========================================================================
   TAXONOMIA DAS QUESTÕES — "enums" de metadados que enriquecem cada item do
   banco e alimentam o modelo do aluno (BKT) e a seleção adaptativa.

   Implementados como objetos `as const` (e não `enum`) por causa do modo
   `erasableSyntaxOnly` do projeto — o uso é idêntico ao de um enum:
   `Difficulty.Medio`, `Bloom.Aplicar`, etc. Os VALORES (strings) são o que
   aparece nos arquivos JSON do banco de questões e o que a IA generativa deve
   produzir; por isso a lista canônica vive aqui.
   ========================================================================= */

/**
 * Dificuldade do item. Calibra os parâmetros de slip/guess do BKT
 * (ver `lib/bkt.ts`) e é o eixo principal da seleção adaptativa: o tutor
 * escolhe a próxima questão cuja probabilidade de acerto prevista cai na
 * zona de desenvolvimento proximal do aluno.
 */
export const Difficulty = {
  Facil: 'facil',
  Medio: 'medio',
  Dificil: 'dificil',
} as const
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]

/** Ordem crescente de dificuldade — útil para seleção/relatórios. */
export const DIFFICULTY_ORDER: Difficulty[] = [Difficulty.Facil, Difficulty.Medio, Difficulty.Dificil]

/**
 * Nível cognitivo na taxonomia de Bloom revisada (pt-BR). Não altera o modelo
 * do aluno; serve para variedade cognitiva do banco e para analytics.
 */
export const Bloom = {
  Lembrar: 'lembrar',
  Entender: 'entender',
  Aplicar: 'aplicar',
  Analisar: 'analisar',
  Avaliar: 'avaliar',
  Criar: 'criar',
} as const
export type Bloom = (typeof Bloom)[keyof typeof Bloom]

/** Natureza da tarefa pedida pela questão (opcional). */
export const QuestionType = {
  Conceitual: 'conceitual',
  Calculo: 'calculo',
  Aplicacao: 'aplicacao',
  Interpretacao: 'interpretacao',
} as const
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]

/** Conjuntos de valores válidos — usados pelo validador do banco de questões. */
export const DIFFICULTY_VALUES = Object.values(Difficulty)
export const BLOOM_VALUES = Object.values(Bloom)
export const QUESTION_TYPE_VALUES = Object.values(QuestionType)
