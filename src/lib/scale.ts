/** Clean axis ticks from 0: step is 1, 2 or 5 × 10ⁿ, top tick ≥ max. */
export function niceTicks(max: number, target = 4): number[] {
  if (max <= 0) return [0]
  const rough = max / target
  const pow = 10 ** Math.floor(Math.log10(rough))
  const step = ([1, 2, 5, 10].find((m) => m * pow >= rough) ?? 10) * pow
  const ticks = [0]
  while (ticks.at(-1)! < max) ticks.push(ticks.length * step)
  return ticks
}

/** Compact tick label: 1.200 → 1,2 mil (es locale). */
export function compact(value: number): string {
  return new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
