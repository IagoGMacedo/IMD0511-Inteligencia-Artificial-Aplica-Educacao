import { MODULES } from '../data/modules'
import { predictCorrect, P_L0 } from '../lib/bkt'
import { modComplete, topicState, TOPIC, TOPIC_MOD } from '../lib/studentModel'
import type { ProgressState, Question } from '../types'
import { QuestionBox } from './QuestionBox'

interface DrawerProps {
  currentTopic: string | null
  progress: ProgressState
  pT: number
  currentQuestion: Question | null
  answeredIdx: number | null
  onClose: () => void
  onAnswer: (optIndex: number, hintsUsed: number) => void
  onNext: () => void
}

/** Painel lateral (modelo aberto do aluno): P(domínio) BKT, pré-requisitos e a questão. */
export function Drawer({ currentTopic, progress, pT, currentQuestion, answeredIdx, onClose, onAnswer, onNext }: DrawerProps) {
  const open = currentTopic != null

  let content = null
  if (currentTopic) {
    const t = TOPIC[currentTopic]
    const mod = TOPIC_MOD[currentTopic]
    const s = topicState(t, progress)
    const st = progress[currentTopic]
    const pct = Math.round(st.m * 100)

    const stLabel = s === 'master' ? 'dominado' : s === 'learning' ? 'em aprendizado' : s === 'locked' ? 'bloqueado' : 'não iniciado'
    const stCls = s === 'master' ? 'master' : s === 'learning' ? 'learning' : 'locked'
    const pAcerto = currentQuestion ? Math.round(predictCorrect(st.m, currentQuestion.difficulty) * 100) : null

    content = (
      <>
        <div className="dr-head">
          <button className="dr-close" aria-label="Fechar" onClick={onClose}>×</button>
          <span className="kicker">{mod.code} · {mod.title}</span>
          <h2>{t.name}</h2>
        </div>
        <div className="dr-body">
          <p className="desc">{t.desc}</p>

          <div className="field">
            <div className="h">Modelo do aluno · P(domínio)</div>
            <div className="mastery-big">
              <span className="v">{pct}%</span>
              <span className={`state ${stCls}`}>{stLabel}</span>
            </div>
            <div className="mbar-lg"><i style={{ width: `${pct}%` }} /></div>
            <div className="thr" />
          </div>

          <div className="field">
            <div className="h">Pré-requisitos no grafo</div>
            <div className="prereq-list">
              {mod.prereq.length ? (
                mod.prereq.map((p) => {
                  const pm = MODULES.find((x) => x.id === p)!
                  const ok = modComplete(pm, progress)
                  return (
                    <span key={p} className={`prereq ${ok ? 'ok' : 'miss'}`}>
                      {ok ? '✓' : '•'} {pm.code} {pm.title}
                    </span>
                  )
                })
              ) : (
                <span className="prereq ok">✓ sem pré-requisito (raiz do grafo)</span>
              )}
            </div>
          </div>

          <div className="field">
            <div className="h">Como o tutor pensa · BKT</div>
            <div className="formula">
              P(domínio) atualiza por <span className="hl">Bayesian Knowledge Tracing</span>:<br />
              acerto / erro → <span className="hl">posterior</span> (slip · guess)<br />
              depois → aprendizado <span className="hl">P(T)</span>·(1 − posterior)<br />
              <span className="cmt"># prior P(L0) = {P_L0.toFixed(2)} · P(T) = {pT.toFixed(2)} · oportunidades: {st.seen}</span><br />
              <span className="cmt"># pedir dica (scaffolding) reduz o crédito de domínio do acerto</span>
              {pAcerto != null && (
                <>
                  <br />
                  <span className="cmt"># P(acerto) prevista nesta questão: {pAcerto}%</span>
                </>
              )}
            </div>
          </div>

          <QuestionBox
            key={currentQuestion?.id ?? 'none'}
            question={currentQuestion}
            status={s}
            answeredIdx={answeredIdx}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className={`scrim ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        {content}
      </aside>
    </>
  )
}
