/** Legenda das cores de estado dos tópicos. */
export function Legend() {
  return (
    <div className="legend">
      <span><i style={{ background: 'var(--locked)' }} /> não iniciado</span>
      <span><i style={{ background: 'var(--clay)' }} /> em aprendizado</span>
      <span><i style={{ background: 'var(--gold)' }} /> dominado (≥ 80%)</span>
      <span>🔒 bloqueado por pré-requisito</span>
    </div>
  )
}
