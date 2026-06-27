import { MODULES } from '../data/modules'
import { predictCorrect } from '../lib/bkt'
import { modComplete, topicState, TOPIC, TOPIC_MOD } from '../lib/studentModel'
import type { ProgressState, Question } from '../types'
import { BktExplainer } from './BktExplainer'
import { QuestionBox } from './QuestionBox'

interface ModalProps {
  currentTopic: string | null
  progress: ProgressState
  pT: number
  currentQuestion: Question | null
  answeredIdx: number | null
  onClose: () => void
  onAnswer: (optIndex: number, hintsUsed: number) => void
  onNext: () => void
}

/** Modal central (modelo aberto do aluno): P(domínio) BKT, pré-requisitos e a questão. */
export function Modal({ currentTopic, progress, pT, currentQuestion, answeredIdx, onClose, onAnswer, onNext }: ModalProps) {
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
        <div className="modal-head">
          <button className="modal-close" aria-label="Fechar" onClick={onClose}>×</button>
          <span className="kicker">{mod.code} · {mod.title}</span>
          <h2>{t.name}</h2>
        </div>
        <div className="modal-body">
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
            <BktExplainer pT={pT} seen={st.seen} pAcerto={pAcerto} />
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
      <div className={`modal ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        {content}
      </div>
    </>
  )
}
