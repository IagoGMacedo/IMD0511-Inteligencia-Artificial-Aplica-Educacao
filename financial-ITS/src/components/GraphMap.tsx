import { useMemo, useState } from 'react'
import { MODULES } from '../data/modules'
import { computeGraphLayout, leftPort, NODE_H, NODE_W, rightPort, type GraphNode } from '../lib/graphLayout'
import { MASTER, modComplete, modProgress, modUnlocked } from '../lib/studentModel'
import type { ProgressState } from '../types'
import { RingSVG } from './RingSVG'
import { TopicChip } from './TopicChip'

interface GraphMapProps {
  progress: ProgressState
  onOpenTopic: (id: string) => void
}

/** Curva bézier horizontal entre dois pontos (ports das arestas). */
function edgePath(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const dx = Math.max(40, (b.x - a.x) * 0.5)
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`
}

/**
 * Mapa do domínio como skill-tree em camadas: módulos posicionados pelo DAG de
 * pré-requisitos, arestas que "acendem" ao concluir o pré-requisito, e um painel
 * com os tópicos do módulo selecionado.
 */
export function GraphMap({ progress, onOpenTopic }: GraphMapProps) {
  const layout = useMemo(() => computeGraphLayout(), [])
  const nodeById = useMemo(() => {
    const m: Record<string, GraphNode> = {}
    layout.nodes.forEach((n) => { m[n.id] = n })
    return m
  }, [layout])

  const [selected, setSelected] = useState<string>(MODULES[0].id)
  const selMod = MODULES.find((m) => m.id === selected) ?? MODULES[0]
  const selUnlocked = modUnlocked(selMod, progress)
  const prereqCodes = (m: typeof selMod) =>
    m.prereq.map((p) => MODULES.find((x) => x.id === p)!.code).join(', ')

  return (
    <main className="graph-wrap">
      <div className="graph-scroll">
        <div className="graph" style={{ width: layout.width, height: layout.height }}>
          <svg className="graph-edges" width={layout.width} height={layout.height} aria-hidden="true">
            <defs>
              {[['lit', '#D6A23C'], ['cross', '#B8542C'], ['muted', '#cfc7b5']].map(([id, fill]) => (
                <marker key={id} id={`ah-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill={fill} />
                </marker>
              ))}
            </defs>
            {layout.edges.map((e) => {
              const from = nodeById[e.from]
              const to = nodeById[e.to]
              if (!from || !to) return null
              const lit = modComplete(from.module, progress)
              const marker = lit ? (e.type === 'cross' ? 'cross' : 'lit') : 'muted'
              return (
                <path
                  key={`${e.from}-${e.to}`}
                  className={`gedge ${e.type} ${lit ? 'lit' : 'pending'}`}
                  d={edgePath(rightPort(from), leftPort(to))}
                  markerEnd={`url(#ah-${marker})`}
                />
              )
            })}
          </svg>

          {layout.nodes.map((n) => {
            const m = n.module
            const unlocked = modUnlocked(m, progress)
            const complete = modComplete(m, progress)
            const done = m.topics.filter((t) => progress[t.id].m >= MASTER).length
            const cls = ['gnode']
            if (!unlocked) cls.push('locked')
            if (complete) cls.push('complete')
            if (selected === m.id) cls.push('selected')
            return (
              <button
                key={m.id}
                className={cls.join(' ')}
                style={{ left: n.x, top: n.y, width: NODE_W, height: NODE_H }}
                onClick={() => setSelected(m.id)}
              >
                <span className="gnode-ring"><RingSVG p={modProgress(m, progress)} /><span className="gnode-code">{m.code}</span></span>
                <span className="gnode-info">
                  <span className="gnode-title">{m.title}</span>
                  <span className="gnode-meta">
                    {!unlocked ? `🔒 requer ${prereqCodes(m)}` : complete ? '✓ dominado' : `${done}/${m.topics.length} tópicos`}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`gpanel ${selUnlocked ? '' : 'locked'}`}>
        <div className="gpanel-head">
          <span className="gpanel-code">{selMod.code}</span>
          <span className="gpanel-titles">
            <span className="gpanel-title">{selMod.title}</span>
            <span className="gpanel-sub">
              {selUnlocked ? selMod.sub : `🔒 bloqueado — conclua ${prereqCodes(selMod)}`}
            </span>
          </span>
        </div>
        <div className="gpanel-topics">
          {selMod.topics.map((t) => (
            <TopicChip key={t.id} topic={t} progress={progress} onOpen={onOpenTopic} />
          ))}
        </div>
      </div>
    </main>
  )
}
