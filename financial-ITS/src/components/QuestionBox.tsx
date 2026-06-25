import { QUESTIONS } from '../data/questions'
import type { TopicStatus } from '../types'

const LETTERS = ['A', 'B', 'C', 'D']

interface QuestionBoxProps {
  topicId: string
  status: TopicStatus
  qPos: number
  answeredIdx: number | null
  onAnswer: (optIndex: number) => void
  onNext: () => void
}

/** Bloco de questão do drawer: mensagem de bloqueio ou pergunta + feedback. */
export function QuestionBox({ topicId, status, qPos, answeredIdx, onAnswer, onNext }: QuestionBoxProps) {
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

  const bank = QUESTIONS[topicId] || []
  const index = qPos % bank.length
  const item = bank[index]
  const answered = answeredIdx != null
  const correct = answered && answeredIdx === item.c

  return (
    <div className="qbox">
      <div className="qnum">Questão · {index + 1} de {bank.length}</div>
      <div className="enun">{item.q}</div>
      {item.o.map((txt, i) => {
        let cls = 'opt'
        if (answered) {
          cls += ' disabled'
          if (i === item.c) cls += ' correct'
          else if (i === answeredIdx) cls += ' wrong'
        }
        return (
          <button key={i} className={cls} disabled={answered} onClick={() => onAnswer(i)}>
            <span className="lt">{LETTERS[i]}</span><span>{txt}</span>
          </button>
        )
      })}
      {answered && (
        <>
          <div className={`feedback ${correct ? 'ok' : 'no'}`}>
            <b>{correct ? 'Correto.' : `Resposta correta: ${LETTERS[item.c]}.`}</b> {item.e}
          </div>
          <button className="nextq" onClick={onNext}>Próxima questão →</button>
        </>
      )}
    </div>
  )
}
