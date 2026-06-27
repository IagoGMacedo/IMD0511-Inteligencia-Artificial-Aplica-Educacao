interface HeaderProps {
  globalPct: number // 0–1
  onReset: () => void
}

/** Cabeçalho fixo: marca, reiniciar progresso e domínio global. */
export function Header({ globalPct, onReset }: HeaderProps) {
  const pct = Math.round(globalPct * 100)
  return (
    <header>
      <div className="head-wrap">
        <div className="brand">
          <span className="eyebrow">Sistema Tutor Inteligente · Educação Financeira</span>
          <h1>Trilha do Investidor</h1>
        </div>
        <div className="head-spacer" />
        <button className="ghost-btn" onClick={onReset}>Reiniciar progresso</button>
        <div className="stat">
          <span className="lbl">Domínio global</span>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <span className="pct">{pct}%</span>
        </div>
      </div>
    </header>
  )
}
