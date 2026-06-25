import { MASTER, TOPIC_MOD } from '../lib/studentModel'
import type { ProgressState, Recommendation } from '../types'

interface RecommendationCardProps {
  recommendation: Recommendation
  progress: ProgressState
  onOpen: () => void
}

/** Faixa "Próximo passo" com a recomendação atual da trilha. */
export function RecommendationCard({ recommendation, progress, onOpen }: RecommendationCardProps) {
  const { topic, mode } = recommendation
  const masteredAll = mode === 'review' && progress[topic.id].m >= MASTER

  return (
    <div className="reco">
      <div className="reco-card">
        <span className="tag">Próximo passo</span>
        <div className="what">
          {masteredAll ? (
            <>
              Você dominou toda a trilha 🎉 <small>Revisão sugerida: {topic.name}</small>
            </>
          ) : (
            <>
              {topic.name}{' '}
              <small>
                {TOPIC_MOD[topic.id].title} · domínio atual {Math.round(progress[topic.id].m * 100)}%
              </small>
            </>
          )}
        </div>
        <button onClick={onOpen}>{masteredAll ? 'Revisar tópico' : 'Responder questões'}</button>
      </div>
    </div>
  )
}
