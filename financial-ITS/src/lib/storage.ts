import type { ProgressState } from '../types'
import { STORE_KEY } from './studentModel'

/* =========================================================================
   PERSISTÊNCIA — usa o armazenamento assíncrono do host (window.storage)
   quando disponível (app embarcado) e cai para o localStorage do navegador
   caso contrário (ex.: rodando via `npm run dev`).
   ========================================================================= */

declare global {
  interface Window {
    storage?: {
      get(key: string): Promise<{ value?: string } | null>
      set(key: string, value: string): Promise<void>
    }
  }
}

export interface SavedState {
  state: ProgressState
}

function hostStorage() {
  return typeof window !== 'undefined' ? window.storage : undefined
}

/** Carrega o estado salvo (ou null se não houver / em caso de erro). */
export async function loadState(): Promise<Partial<SavedState> | null> {
  try {
    const host = hostStorage()
    let raw: string | undefined
    if (host) {
      const r = await host.get(STORE_KEY)
      raw = r?.value
    } else if (typeof localStorage !== 'undefined') {
      raw = localStorage.getItem(STORE_KEY) ?? undefined
    }
    if (raw) return JSON.parse(raw) as Partial<SavedState>
  } catch {
    /* sem persistência disponível: segue com o estado padrão */
  }
  return null
}

/** Salva o modelo do aluno (domínio p por conceito). */
export async function saveState(state: ProgressState): Promise<void> {
  const payload = JSON.stringify({ state })
  try {
    const host = hostStorage()
    if (host) await host.set(STORE_KEY, payload)
    else if (typeof localStorage !== 'undefined') localStorage.setItem(STORE_KEY, payload)
  } catch {
    /* ignora falhas de escrita */
  }
}
