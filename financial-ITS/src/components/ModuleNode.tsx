import { MODULES } from '../data/modules'
import { modProgress, modUnlocked, MASTER } from '../lib/studentModel'
import type { Module, ProgressState } from '../types'
import { RingSVG } from './RingSVG'

interface ModuleNodeProps {
  module: Module
  progress: ProgressState
  onOpen: (id: string) => void
}

/** Nó central de um módulo: anel de progresso, contagem e aviso de bloqueio. */
export function ModuleNode({ module: m, progress, onOpen }: ModuleNodeProps) {
  const unlocked = modUnlocked(m, progress)
  const prog = modProgress(m, progress)
  const done = m.topics.filter((t) => progress[t.id].m >= MASTER).length

  return (
    <div className={`modnode ${unlocked ? '' : 'locked'}`} onClick={() => onOpen(m.topics[0].id)}>
      <div className="top">
        <div className="alt"><RingSVG p={prog} /><span className="code">{m.code}</span></div>
        <div>
          <div className="ttl">{m.title}</div>
          <div className="sub">{m.alt} · {m.sub}</div>
        </div>
      </div>
      <div className="mmeta">
        <div className="mbar"><i style={{ width: `${Math.round(prog * 100)}%` }} /></div>
        <span className="cnt">{done}/{m.topics.length}</span>
      </div>
      {!unlocked && (
        <div className="lockchip">
          🔒 conclua {m.prereq.map((p) => MODULES.find((x) => x.id === p)!.code).join(', ')} para liberar
        </div>
      )}
    </div>
  )
}
