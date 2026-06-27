import { useState } from 'react'
import { Difficulty } from '../data/taxonomy'
import type { Question, TopicStatus } from '../types'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

const DIFF_LABEL: Record<Difficulty, string> = {
  [Difficulty.Facil]: 'fácil',
  [Difficulty.Medio]: 'médio',
  [Difficulty.Dificil]: 'difícil',
}

interface QuestionBoxProps {
  question: Question | null
  status: TopicStatus
  answeredIdx: number | null
  onAnswer: (optIndex: number) => void
  onNext: () => void
}

/** Bloco de questão do modal: bloqueio, ou pergunta + dicas (scaffolding) + feedback. */
export function QuestionBox({ question, status, answeredIdx, onAnswer, onNext }: QuestionBoxProps) {
  // Quantas dicas o aluno revelou nesta questão. O componente é remontado a
  // cada nova questão (key=question.id no Modal), então este estado zera só.
  const [revealed, setRevealed] = useState(0)

  if (status === 'locked') {
    return (
      <div className="qbox">
        <div className="qnum">Questão</div>
        <div className="lockmsg">
          🔒 Tópico bloqueado. Conclua os pré-requisitos acima (todos os tópicos do módulo anterior a 80%)
          para liberar as questões.
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="qbox">
        <div className="qnum">Questão</div>
        <div className="lockmsg">Ainda não há questões cadastradas para este tópico.</div>
      </div>
    )
  }

  const hints = question.hints ?? []
  const answered = answeredIdx != null
  const correct = answered && answeredIdx === question.correct
  const chosen = answered ? question.options[answeredIdx] : null

  return (
    <div className="qbox">
      <div className="qhead">
        <span className="qnum">Questão adaptativa</span>
        <span className={`diff-badge ${question.difficulty}`}>{DIFF_LABEL[question.difficulty]}</span>
      </div>
      <div className="enun">{question.stem}</div>

      {hints.length > 0 && (revealed > 0 || !answered) && (
        <div className="hints">
          {hints.slice(0, revealed).map((h, i) => (
            <div key={i} className="hint"><span className="hint-lt">Dica {i + 1}</span>{h}</div>
          ))}
          {!answered && revealed < hints.length && (
            <button className="hint-btn" onClick={() => setRevealed(revealed + 1)}>
              💡 {revealed === 0 ? 'Pedir dica' : 'Próxima dica'} <span className="hint-count">{revealed}/{hints.length}</span>
            </button>
          )}
        </div>
      )}

      {question.options.map((opt, i) => {
        let cls = 'opt'
        if (answered) {
          cls += ' disabled'
          if (i === question.correct) cls += ' correct'
          else if (i === answeredIdx) cls += ' wrong'
        }
        return (
          <button key={i} className={cls} disabled={answered} onClick={() => onAnswer(i)}>
            <span className="lt">{LETTERS[i]}</span><span>{opt.text}</span>
          </button>
        )
      })}

      {answered && (
        <>
          {!correct && chosen?.feedback && (
            <div className="feedback misc"><b>Equívoco comum.</b> {chosen.feedback}</div>
          )}
          <div className={`feedback ${correct ? 'ok' : 'no'}`}>
            <b>{correct ? (revealed > 0 ? 'Correto (com ajuda de dica).' : 'Correto.') : `Resposta correta: ${LETTERS[question.correct]}.`}</b> {question.explanation}
          </div>
          <button className="nextq" onClick={onNext}>
            {correct ? 'Próxima questão →' : '🔁 Tentar questão semelhante →'}
          </button>
        </>
      )}
    </div>
  )
}
