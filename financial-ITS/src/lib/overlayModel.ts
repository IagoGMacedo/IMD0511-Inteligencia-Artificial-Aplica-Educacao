/* =========================================================================
   MODELO DO ALUNO — MODELO DE SOBREPOSIÇÃO (OVERLAY)

   Para cada conceito (tópico do grafo) guarda-se uma estimativa de domínio
   p ∈ [0, 1], atualizada a cada resposta segundo o resultado:

     acerto:  p' = p + α·(1 − p)      (α = 0,20)
     erro:    p' = p · (1 − β)        (β = 0,12)

   O ganho de acerto é ASSINTÓTICO: o primeiro acerto rende ~+20 pontos
   percentuais, mas perto da maestria cada acerto rende cada vez menos e o
   valor nunca passa de 1 (imita os rendimentos decrescentes do aprendizado).
   Partindo de p = 0, cerca de oito acertos atingem o limiar de domínio (0,80).

   No erro aplica-se um pequeno recuo (slip), de modo que acertar no chute não
   seja vantajoso. Pela "métrica de erro" do projeto, porém, um erro na PRIMEIRA
   questão de um tópico inédito (seen === 0) NÃO penaliza — só tópicos já
   abordados (ou erros sucessivos) sofrem o recuo. Assim um tópico já dominado
   também não cai abaixo do limiar por um único equívoco, evitando travamentos.
   ========================================================================= */

export const ALPHA = 0.2 // ganho de acerto
export const BETA = 0.12 // recuo de erro (slip)
export const P_INIT = 0 // domínio inicial de cada conceito
export const MASTER = 0.8 // limiar de domínio (mastery learning)

/**
 * Atualização do domínio p após uma resposta.
 * @param p       domínio atual do conceito (0–1).
 * @param correct se o aluno acertou.
 * @param seen    questões do tópico já respondidas ANTES desta. Um erro em
 *                tópico inédito (seen === 0) não penaliza.
 */
export function updateMastery(p: number, correct: boolean, seen: number): number {
  if (correct) return Math.min(1, p + ALPHA * (1 - p))
  if (seen === 0) return p // tópico inédito: erro não penaliza
  const recuo = p * (1 - BETA) // tópico já visto / erro sucessivo: recuo
  // Um tópico já dominado não cai abaixo do limiar por um único erro — isso
  // evita "travamentos" (re-bloqueio do módulo seguinte) descritos no projeto.
  return p >= MASTER ? Math.max(MASTER, recuo) : Math.max(0, recuo)
}
