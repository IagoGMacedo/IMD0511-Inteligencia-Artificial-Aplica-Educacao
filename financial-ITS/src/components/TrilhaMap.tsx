import { MODULES } from '../data/modules'
import type { ProgressState } from '../types'
import { ModuleNode } from './ModuleNode'
import { TopicChip } from './TopicChip'

interface TrilhaMapProps {
  progress: ProgressState
  onOpenTopic: (id: string) => void
}

/** Mapa da trilha: cada módulo com seus tópicos distribuídos em duas colunas. */
export function TrilhaMap({ progress, onOpenTopic }: TrilhaMapProps) {
  return (
    <main className="map">
      {MODULES.map((m) => {
        const half = Math.ceil(m.topics.length / 2)
        const left = m.topics.slice(0, half)
        const right = m.topics.slice(half)
        return (
          <section className="module" key={m.id}>
            <div className="row">
              <div className="col-left">
                {left.map((t) => (
                  <TopicChip key={t.id} topic={t} progress={progress} onOpen={onOpenTopic} />
                ))}
              </div>
              <ModuleNode module={m} progress={progress} onOpen={onOpenTopic} />
              <div className="col-right">
                {right.map((t) => (
                  <TopicChip key={t.id} topic={t} progress={progress} onOpen={onOpenTopic} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </main>
  )
}
