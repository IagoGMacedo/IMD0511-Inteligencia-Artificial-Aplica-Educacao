interface HeaderProps {
  pT: number
  globalPct: number // 0–1
  onPTChange: (value: number) => void
  onReset: () => void
}

/** Cabeçalho fixo: marca, controle do ritmo de aprendizado P(T), reiniciar e domínio global. */
export function Header({ pT, globalPct, onPTChange, onReset }: HeaderProps) {
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
            ritmo de aprendizado <code>P(T) = {pT.toFixed(2)}</code>
          </label>
          <input
            type="range" min="0.05" max="0.4" step="0.05" value={pT}
            onChange={(e) => onPTChange(parseFloat(e.target.value))}
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
