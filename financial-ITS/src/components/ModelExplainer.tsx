import { ALPHA, BETA, MASTER, updateMastery } from '../lib/overlayModel'

interface ModelExplainerProps {
  /** Domínio atual do tópico (0–1). Quando presente, mostra o cálculo com números reais. */
  mastery?: number
  /** Oportunidades vistas no tópico (só no modal de um tópico). */
  seen?: number
}

/** pt-BR: 0.59 -> "0,59". */
const fmt = (x: number) => x.toFixed(2).replace('.', ',')

/** Caixa "Como o tutor pensa": explica como o domínio p é atualizado (overlay). */
export function ModelExplainer({ mastery, seen }: ModelExplainerProps) {
  // Cálculo concreto a partir do p atual (usa a MESMA função que atualiza o aluno).
  let calc: { pct: number; up: number; pctUp: number; down: number; pctDown: number; erroExpr: string } | null = null
  if (mastery != null) {
    const m = mastery
    const up = updateMastery(m, true, seen ?? 1)
    const down = updateMastery(m, false, seen ?? 1)
    const erroExpr =
      (seen ?? 1) === 0
        ? 'mantém p (tópico inédito não penaliza)'
        : m >= MASTER
          ? `máx(0,80; ${fmt(m)}·${fmt(1 - BETA)}) = ${fmt(down)}`
          : `${fmt(m)}·(1 − ${fmt(BETA)}) = ${fmt(down)}`
    calc = { pct: Math.round(m * 100), up, pctUp: Math.round(up * 100), down, pctDown: Math.round(down * 100), erroExpr }
  }

  return (
    <div className="formula">
      p (domínio) é um <span className="hl">modelo de sobreposição</span>, atualizado a cada resposta:<br />
      acerto → <span className="hl">p + α·(1 − p)</span> &nbsp; (α = {ALPHA.toFixed(2)})<br />
      erro → <span className="hl">p · (1 − β)</span> &nbsp; (β = {BETA.toFixed(2)})<br />
      <span className="cmt"># ganho assintótico: nunca passa de 1 · erro em tópico inédito não penaliza</span><br />
      <span className="cmt"># limiar de domínio {Math.round(MASTER * 100)}% · módulo libera o próximo quando todos os tópicos ≥ {Math.round(MASTER * 100)}%</span>
      {calc && (
        <>
          <br />
          <span className="cmt"># a partir do seu domínio atual ({calc.pct}%):</span><br />
          <span className="cmt">&nbsp;&nbsp;&nbsp;acerto → {fmt(mastery!)} + {fmt(ALPHA)}·(1 − {fmt(mastery!)}) = {fmt(calc.up)} ({calc.pctUp}%)</span><br />
          <span className="cmt">&nbsp;&nbsp;&nbsp;erro → {calc.erroExpr} ({calc.pctDown}%)</span>
        </>
      )}
      {seen != null && (
        <>
          <br />
          <span className="cmt"># oportunidades neste tópico: {seen}</span>
        </>
      )}
    </div>
  )
}
