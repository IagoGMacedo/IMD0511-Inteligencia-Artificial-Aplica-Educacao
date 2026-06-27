/** Legenda do mapa em grafo: estados de tópico, de módulo e tipos de aresta. */
export function Legend() {
  return (
    <div className="legend">
      <span><i style={{ background: 'var(--locked)' }} /> não iniciado</span>
      <span><i style={{ background: 'var(--clay)' }} /> em aprendizado</span>
      <span><i style={{ background: 'var(--gold)' }} /> dominado (≥ 80%)</span>
      <span>🔒 módulo bloqueado por pré-requisito</span>
      <span><b style={{ color: 'var(--gold-deep)' }}>──</b> aresta liberada (pré-requisito concluído)</span>
      <span><b style={{ color: 'var(--ink-soft)' }}>╌╌</b> pré-requisito pendente</span>
      <span><b style={{ color: 'var(--clay)' }}>╌╌</b> aresta cruzada (IR → Renda Fixa)</span>
    </div>
  )
}
