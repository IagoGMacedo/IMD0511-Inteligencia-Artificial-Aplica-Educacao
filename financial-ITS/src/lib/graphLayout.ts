import { MODULES } from '../data/modules'
import type { Module } from '../types'

/* =========================================================================
   LAYOUT DO GRAFO DO DOMÍNIO (skill-tree em camadas)

   Posiciona os módulos a partir do DAG de pré-requisitos:
     • coluna (x) = nível pelo caminho mais longo a partir das raízes;
     • faixa (y)  = "lane" curada por módulo, para os ramos ficarem em
       trilhas limpas e a aresta longa M4→M6 passar por uma faixa vazia
       (sem sobrepor M5). Módulos fora do mapa de lanes caem empilhados.
   O componente do mapa só consome `nodes`/`edges` e decide cor/estado.
   ========================================================================= */

export const NODE_W = 184
export const NODE_H = 96
const COL_GAP = 78
const ROW_GAP = 26
const PAD = 24

/** Faixa (linha) de cada módulo. 0 = topo. Define as trilhas dos ramos. */
const LANE: Record<string, number> = {
  m1: 1, m2: 1, // tronco
  m3: 0, m5: 0, // ramo renda variável → exterior (faixa de cima)
  m4: 1, // ramo reservas de valor (faixa do meio)
  m6: 1, // convergência
  bonus: 2, // IR (faixa de baixo)
}

export interface GraphNode {
  id: string
  module: Module
  level: number
  x: number
  y: number
}

export interface GraphEdge {
  from: string
  to: string
  /** 'cross' = aresta cruzada (IR depende de Renda Fixa, não do módulo anterior). */
  type: 'spine' | 'cross'
}

export interface GraphLayout {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
}

/** Nível = 0 nas raízes; senão 1 + maior nível entre os pré-requisitos. */
function computeLevels(): Record<string, number> {
  const byId: Record<string, Module> = {}
  MODULES.forEach((m) => { byId[m.id] = m })
  const level: Record<string, number> = {}
  const visit = (id: string): number => {
    if (level[id] != null) return level[id]
    const m = byId[id]
    level[id] = m.prereq.length ? 1 + Math.max(...m.prereq.map(visit)) : 0
    return level[id]
  }
  MODULES.forEach((m) => visit(m.id))
  return level
}

/** Monta o layout (coluna por nível, faixa por lane curada). */
export function computeGraphLayout(): GraphLayout {
  const level = computeLevels()

  // Fallback de faixa para módulos sem lane: empilha por ordem dentro do nível.
  const perLevelCount: Record<number, number> = {}
  const rowOf: Record<string, number> = {}
  MODULES.forEach((m) => {
    if (LANE[m.id] != null) { rowOf[m.id] = LANE[m.id]; return }
    const l = level[m.id]
    rowOf[m.id] = (perLevelCount[l] ??= 0)
    perLevelCount[l]++
  })

  const step = NODE_H + ROW_GAP
  const colStep = NODE_W + COL_GAP
  const nodes: GraphNode[] = MODULES.map((m) => ({
    id: m.id,
    module: m,
    level: level[m.id],
    x: PAD + level[m.id] * colStep,
    y: PAD + rowOf[m.id] * step,
  }))

  const edges: GraphEdge[] = []
  MODULES.forEach((m) => {
    m.prereq.forEach((p) => edges.push({ from: p, to: m.id, type: m.id === 'bonus' ? 'cross' : 'spine' }))
  })

  const maxLevel = Math.max(...nodes.map((n) => n.level))
  const maxRow = Math.max(...Object.values(rowOf))
  return {
    nodes,
    edges,
    width: PAD * 2 + maxLevel * colStep + NODE_W,
    height: PAD * 2 + maxRow * step + NODE_H,
  }
}

/** Ports: saída à direita do origem, entrada à esquerda do alvo. */
export const rightPort = (n: GraphNode) => ({ x: n.x + NODE_W, y: n.y + NODE_H / 2 })
export const leftPort = (n: GraphNode) => ({ x: n.x, y: n.y + NODE_H / 2 })
