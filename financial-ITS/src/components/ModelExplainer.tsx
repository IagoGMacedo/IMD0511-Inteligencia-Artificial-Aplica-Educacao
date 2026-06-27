import { ALPHA, BETA } from '../lib/overlayModel'
import { MASTER } from '../lib/studentModel'

interface ModelExplainerProps {
  /** Oportunidades vistas no tópico (só no modal de um tópico). */
  seen?: number
}

/** Caixa "Como o tutor pensa": explica como o domínio p é atualizado (overlay). */
export function ModelExplainer({ seen }: ModelExplainerProps) {
  return (
    <div className="formula">
      p (domínio) é um <span className="hl">modelo de sobreposição</span>, atualizado a cada resposta:<br />
      acerto → <span className="hl">p + α·(1 − p)</span> &nbsp; (α = {ALPHA.toFixed(2)})<br />
      erro → <span className="hl">p · (1 − β)</span> &nbsp; (β = {BETA.toFixed(2)})<br />
      <span className="cmt"># ganho assintótico: nunca passa de 1 · erro em tópico inédito não penaliza</span><br />
      <span className="cmt"># limiar de domínio {Math.round(MASTER * 100)}% · módulo libera o próximo quando todos os tópicos ≥ {Math.round(MASTER * 100)}%</span>
      {seen != null && (
        <>
          <br />
          <span className="cmt"># oportunidades neste tópico: {seen}</span>
        </>
      )}
    </div>
  )
}
