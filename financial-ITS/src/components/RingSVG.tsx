/** Anel de progresso (0–1) exibido no nó de cada módulo. */
export function RingSVG({ p }: { p: number }) {
  const r = 19
  const c = 2 * Math.PI * r
  const off = c * (1 - p)
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#EFE8D8" strokeWidth="3.5" />
      <circle
        cx="22" cy="22" r={r} fill="none" stroke="#D6A23C" strokeWidth="3.5"
        strokeLinecap="round" strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)}
      />
    </svg>
  )
}
