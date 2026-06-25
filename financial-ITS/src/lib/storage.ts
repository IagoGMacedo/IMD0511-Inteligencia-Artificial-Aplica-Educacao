import type { ProgressState } from '../types'
import { STORE_KEY } from './studentModel'

/* =========================================================================
   PERSISTÊNCIA — usa o armazenamento assíncrono do host (window.storage).
   ========================================================================= */

declare global {
  interface Window {
    storage: {
      get(key: string): Promise<{ value?: string } | null>
      set(key: string, value: string): Promise<void>
    }
  }
}

export interface SavedState {
  state: ProgressState
  alpha: number
}

/** Carrega o estado salvo (ou null se não houver / em caso de erro). */
export async function loadState(): Promise<Partial<SavedState> | null> {
  try {
    const r = await window.storage.get(STORE_KEY)
    if (r && r.value) return JSON.parse(r.value) as Partial<SavedState>
  } catch {
    /* sem persistência disponível: segue com o estado padrão */
  }
  return null
}

/** Salva o modelo do aluno e o parâmetro α. */
export async function saveState(state: ProgressState, alpha: number): Promise<void> {
  try {
    await window.storage.set(STORE_KEY, JSON.stringify({ state, alpha }))
  } catch {
    /* ignora falhas de escrita */
  }
}
