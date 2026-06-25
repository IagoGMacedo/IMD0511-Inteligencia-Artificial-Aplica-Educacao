import { topicState } from '../lib/studentModel'
import type { ProgressState, Topic } from '../types'

interface TopicChipProps {
  topic: Topic
  progress: ProgressState
  onOpen: (id: string) => void
}

/** Pílula de um tópico, com cor por estado e percentual de domínio. */
export function TopicChip({ topic, progress, onOpen }: TopicChipProps) {
  const s = topicState(topic, progress)
  const cls = s === 'master' ? 's-master' : s === 'learning' ? 's-learning' : s === 'locked' ? 'locked' : ''
  const lock = s === 'locked' ? '🔒 ' : ''
  return (
    <div className={`chip ${cls}`} onClick={() => onOpen(topic.id)}>
      <span className="dot" />
      <span className="name">{lock}{topic.name}</span>
      <span className="mini">{Math.round(progress[topic.id].m * 100)}%</span>
    </div>
  )
}
