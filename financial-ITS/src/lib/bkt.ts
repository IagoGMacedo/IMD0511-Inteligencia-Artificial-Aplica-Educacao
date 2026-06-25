import { Difficulty } from '../data/taxonomy'

/* =========================================================================
   MODELO DO ALUNO — BAYESIAN KNOWLEDGE TRACING (BKT)

   Cada tópico da trilha é uma *knowledge component* (KC). O estado do aluno em
   uma KC é P(domínio) = P(L), a probabilidade de o aluno já dominar a
   habilidade. A cada questão respondida, P(L) é atualizado em dois passos:

     1) inferência bayesiana dada a evidência (acerto/erro), usando os
        parâmetros de "escorregão" (slip) e "chute" (guess);
     2) transição de aprendizado P(T): a chance de o aluno ter aprendido a KC
        naquela oportunidade.

   Parâmetros clássicos do BKT (Corbett & Anderson, 1995):
     - P(L0)  prior: P(domínio) inicial de cada KC;
     - P(T)   learn rate: P(não-sabe -> sabe) por oportunidade;
     - P(S)   slip: P(errar | sabe);
     - P(G)   guess: P(acertar | não sabe).

   Aqui slip/guess dependem da DIFICULDADE da questão respondida — questões
   fáceis têm guess alto (mais fácil chutar) e slip baixo; difíceis, o
   contrário. É isso que liga a metadata das questões ao modelo do aluno e
   alimenta a seleção adaptativa (`itemSelection.ts`).
   ========================================================================= */

export const P_L0 = 0.2 // prior de domínio de cada KC
export const DEFAULT_PT = 0.15 // P(T): ritmo de aprendizado padrão (ajustável na UI)

/**
 * Penalidade de ajuda (help penalty), estilo cognitive tutor: quando o aluno
 * pede dica antes de acertar, o acerto vale como evidência mais fraca de
 * domínio. Mantemos só uma fração do ganho de P(domínio) daquela resposta.
 */
export const HINT_CREDIT = 0.5

/** slip (P(errar|sabe)) e guess (P(acertar|não sabe)) por dificuldade. */
const SLIP_GUESS: Record<Difficulty, { slip: number; guess: number }> = {
  [Difficulty.Facil]: { slip: 0.05, guess: 0.35 },
  [Difficulty.Medio]: { slip: 0.1, guess: 0.25 },
  [Difficulty.Dificil]: { slip: 0.2, guess: 0.15 },
}

export function slipGuess(difficulty: Difficulty) {
  return SLIP_GUESS[difficulty] ?? SLIP_GUESS[Difficulty.Medio]
}

/**
 * P(acerto) prevista para uma questão de dada dificuldade, dado o domínio atual.
 *   P(correto) = P(L)·(1 − slip) + (1 − P(L))·guess
 * Usada pela seleção adaptativa para mirar a zona de desenvolvimento proximal.
 */
export function predictCorrect(pKnown: number, difficulty: Difficulty): number {
  const { slip, guess } = slipGuess(difficulty)
  return pKnown * (1 - slip) + (1 - pKnown) * guess
}

/**
 * Atualização BKT de P(domínio) após uma resposta.
 * @param pKnown     P(domínio) atual da KC.
 * @param correct    se o aluno acertou.
 * @param difficulty dificuldade da questão respondida (define slip/guess).
 * @param pT         ritmo de aprendizado P(T).
 */
export function updateBKT(pKnown: number, correct: boolean, difficulty: Difficulty, pT: number): number {
  const { slip, guess } = slipGuess(difficulty)

  // 1) Posterior bayesiano dado o resultado observado.
  let posterior: number
  if (correct) {
    const num = pKnown * (1 - slip)
    posterior = num / (num + (1 - pKnown) * guess)
  } else {
    const num = pKnown * slip
    posterior = num / (num + (1 - pKnown) * (1 - guess))
  }

  // 2) Transição de aprendizado.
  const updated = posterior + (1 - posterior) * pT
  return Math.min(1, Math.max(0, updated))
}

/**
 * Aplica a penalidade de ajuda ao resultado do BKT. Se houve dica e a resposta
 * gerou ganho de domínio (acerto), mantém apenas `HINT_CREDIT` desse ganho;
 * caso contrário, devolve o valor do BKT inalterado.
 */
export function applyHintPenalty(prev: number, updated: number, assisted: boolean): number {
  if (!assisted || updated <= prev) return updated
  return prev + (updated - prev) * HINT_CREDIT
}
