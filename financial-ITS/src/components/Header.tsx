interface HeaderProps {
  alpha: number
  globalPct: number // 0–1
  onAlphaChange: (value: number) => void
  onReset: () => void
}

/** Cabeçalho fixo: marca, controle do ganho α, reiniciar e domínio global. */
export function Header({ alpha, globalPct, onAlphaChange, onReset }: HeaderProps) {
  const pct = Math.round(globalPct * 100)
  return (
    <header>
      <div className="head-wrap">
        <div className="brand">
          <span className="eyebrow">Sistema Tutor Inteligente · Educação Financeira</span>
          <h1>Trilha do Investidor</h1>
        </div>
        <div className="head-spacer" />
        <div className="alpha-box">
          <label>
            ganho por acerto <code>α = {alpha.toFixed(2)}</code>
          </label>
          <input
            type="range" min="0.1" max="0.5" step="0.05" value={alpha}
            onChange={(e) => onAlphaChange(parseFloat(e.target.value))}
          />
        </div>
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
