import { P_L0 } from '../lib/bkt'

interface BktExplainerProps {
  pT: number
  /** Oportunidades vistas no tópico (só no modal de um tópico). */
  seen?: number
  /** P(acerto) prevista na questão aberta (só no modal). */
  pAcerto?: number | null
}

/** Caixa "Como o tutor pensa · BKT": explica como P(domínio) é atualizado. */
export function BktExplainer({ pT, seen, pAcerto }: BktExplainerProps) {
  return (
    <div className="formula">
      P(domínio) atualiza por <span className="hl">Bayesian Knowledge Tracing</span>:<br />
      acerto / erro → <span className="hl">posterior</span> (slip · guess)<br />
      depois → aprendizado <span className="hl">P(T)</span>·(1 − posterior)<br />
      <span className="cmt"># prior P(L0) = {P_L0.toFixed(2)} · P(T) = {pT.toFixed(2)}{seen != null && ` · oportunidades: ${seen}`}</span><br />
      <span className="cmt"># pedir dica (scaffolding) reduz o crédito de domínio do acerto</span>
      {pAcerto != null && (
        <>
          <br />
          <span className="cmt"># P(acerto) prevista nesta questão: {pAcerto}%</span>
        </>
      )}
    </div>
  )
}
