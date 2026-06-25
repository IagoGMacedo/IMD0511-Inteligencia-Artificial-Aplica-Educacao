import { MODULES } from '../data/modules'
import { BETA, modComplete, topicState, TOPIC, TOPIC_MOD } from '../lib/studentModel'
import type { ProgressState } from '../types'
import { QuestionBox } from './QuestionBox'

interface DrawerProps {
  currentTopic: string | null
  progress: ProgressState
  alpha: number
  qPos: Record<string, number>
  answeredIdx: number | null
  onClose: () => void
  onAnswer: (optIndex: number) => void
  onNext: () => void
}

/** Painel lateral com o modelo do aluno, pré-requisitos, fórmula e a questão. */
export function Drawer({ currentTopic, progress, alpha, qPos, answeredIdx, onClose, onAnswer, onNext }: DrawerProps) {
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
            <div className="h">Modelo do aluno</div>
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
            <div className="h">Atualização por questão</div>
            <div className="formula">
              acerto: p<span className="hl">'</span> = p + <span className="hl">α</span>·(1 − p)<br />
              erro:&nbsp;&nbsp; p<span className="hl">'</span> = p·(1 − <span className="hl">β</span>)<br />
              <span className="cmt"># α = {alpha.toFixed(2)} · β = {BETA.toFixed(2)} · questões respondidas: {st.seen}</span>
            </div>
          </div>

          <QuestionBox
            topicId={currentTopic}
            status={s}
            qPos={qPos[currentTopic] ?? 0}
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
