import { useState } from 'react'
import { compact, niceTicks } from '@/lib/scale'

export interface Datum {
  label: string
  value: number
}

/** Fixed categorical order (index.css --series-*). Never cycle: extras fold into "Otros". */
const SERIES = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)'] as const
const OTHER = 'var(--muted)'

/** Single-series column chart (e.g. spending per month). HTML, so text never scales. */
export function BarChart({
  data,
  format,
  tick = compact,
  label,
}: {
  data: Datum[]
  format: (v: number) => string
  /** Axis label; keep it short (no decimals). */
  tick?: (v: number) => string
  label: string
}) {
  const [active, setActive] = useState<number | null>(null)
  const ticks = niceTicks(Math.max(0, ...data.map((d) => d.value)))
  const top = ticks.at(-1) || 1
  const peak = data.reduce((best, d, i) => (d.value > (data[best]?.value ?? -Infinity) ? i : best), 0)

  return (
    <figure aria-label={label}>
      <div className="flex gap-2 pt-3">
        {/* y axis */}
        <div className="relative h-44 w-9 shrink-0 text-right text-[11px] text-muted tabular-nums">
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / top) * 100}%` }}>
              {tick(t)}
            </span>
          ))}
        </div>
        <div className="relative h-44 flex-1">
          {ticks.map((t) => (
            <div key={t} className={`absolute inset-x-0 h-px ${t === 0 ? 'bg-muted/50' : 'bg-border'}`} style={{ bottom: `${(t / top) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end">
            {data.map((d, i) => (
              <button
                key={d.label}
                type="button"
                aria-label={`${d.label}: ${format(d.value)}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="relative flex h-full flex-1 items-end justify-center focus:outline-none"
              >
                <span
                  className={`w-full max-w-6 rounded-t-[4px] bg-series-1 transition-opacity ${active !== null && active !== i ? 'opacity-50' : ''}`}
                  style={{ height: `${(d.value / top) * 100}%` }}
                />
                {i === peak && active === null && (
                  <span className="absolute text-[11px] font-medium whitespace-nowrap" style={{ bottom: `calc(${(d.value / top) * 100}% + 4px)` }}>
                    {format(d.value)}
                  </span>
                )}
                {active === i && (
                  <span
                    role="tooltip"
                    className="absolute z-10 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-left whitespace-nowrap shadow-lg"
                    style={{ bottom: `calc(${(d.value / top) * 100}% + 8px)` }}
                  >
                    <span className="block text-sm font-semibold">{format(d.value)}</span>
                    <span className="block text-xs text-muted">{d.label}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 flex pl-11 text-[11px] text-muted">
        {data.map((d) => (
          <span key={d.label} className="flex-1 truncate text-center">
            {d.label}
          </span>
        ))}
      </div>
      <ChartTable data={data} format={format} />
    </figure>
  )
}

/** Part-to-whole (spending by category). Top 5 keep their slot color; the rest fold into "Otros". */
export function DonutChart({ data, format, label }: { data: Datum[]; format: (v: number) => string; label: string }) {
  const [active, setActive] = useState<number | null>(null)
  const sorted = [...data].sort((a, b) => b.value - a.value)
  const rest = sorted.slice(SERIES.length).reduce((sum, d) => sum + d.value, 0)
  const slices = [...sorted.slice(0, SERIES.length), ...(rest > 0 ? [{ label: 'Otros', value: rest }] : [])]
  const total = slices.reduce((sum, d) => sum + d.value, 0)
  const color = (i: number) => SERIES[i] ?? OTHER

  const r = 52
  const circ = 2 * Math.PI * r
  const gap = slices.length > 1 ? 2 : 0 // 2px surface gap between segments
  let offset = 0
  const focus = active !== null ? slices[active] : undefined

  return (
    <figure aria-label={label} className="flex flex-col items-center gap-5">
      <div className="relative size-40 shrink-0">
        <svg viewBox="0 0 128 128" className="size-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
          {slices.map((d, i) => {
            const len = total ? (d.value / total) * circ : 0
            const dash = Math.max(0, len - gap)
            const el = (
              <circle
                key={d.label}
                cx="64"
                cy="64"
                r={r}
                fill="none"
                stroke={color(i)}
                strokeWidth={active === i ? 18 : 14}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
                className="transition-[stroke-width]"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
              />
            )
            offset += len
            return el
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-semibold">{format(focus?.value ?? total)}</span>
          <span className="text-xs text-muted">{focus?.label ?? 'Total'}</span>
        </div>
      </div>
      <ul className="w-full min-w-0 flex-1 space-y-2 text-sm">
        {slices.map((d, i) => (
          <li key={d.label}>
            <button
              type="button"
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="flex w-full items-center gap-2.5 rounded-lg px-1 py-0.5 text-left hover:bg-surface-2"
            >
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: color(i) }} />
              <span className="flex-1 truncate">{d.label}</span>
              <span className="font-medium tabular-nums">{format(d.value)}</span>
              <span className="w-10 text-right text-xs text-muted tabular-nums">{total ? Math.round((d.value / total) * 100) : 0}%</span>
            </button>
          </li>
        ))}
      </ul>
    </figure>
  )
}

/** Trend glyph for stat tiles; values live in the tile, so no axes or hover. */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  const w = 120
  const h = 36
  const pad = 5 // room for the end dot + ring
  const min = Math.min(...values)
  const span = Math.max(...values) - min || 1
  const pts = values.map((v, i) => [pad + (i / Math.max(1, values.length - 1)) * (w - 2 * pad), h - pad - ((v - min) / span) * (h - 2 * pad)] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('')
  const [ex, ey] = pts.at(-1) ?? [0, 0]
  return (
    <svg role="img" aria-label={label} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={`${line}L${ex},${h}L${pad},${h}Z`} fill="var(--series-1)" opacity="0.1" />
      <path d={line} fill="none" stroke="var(--series-1)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={ex} cy={ey} r="4" fill="var(--series-1)" stroke="var(--surface)" strokeWidth="2" />
    </svg>
  )
}

/** Stat tile: hero number + delta (icon + text, not color alone) + optional trend. */
export function StatTile({ label, value, delta, trend }: { label: string; value: string; delta?: { text: string; good: boolean }; trend?: number[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {delta && (
            <p className={`mt-0.5 text-xs font-medium ${delta.good ? 'text-positive' : 'text-negative'}`}>
              {delta.good ? '▲' : '▼'} {delta.text}
            </p>
          )}
        </div>
        {trend && <Sparkline values={trend} label={`Tendencia de ${label}`} />}
      </div>
    </div>
  )
}

/** Keyboard/screen-reader path to every value a chart shows. */
function ChartTable({ data, format }: { data: Datum[]; format: (v: number) => string }) {
  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer text-xs text-muted">Ver como tabla</summary>
      <table className="mt-2 w-full">
        <tbody className="divide-y divide-border">
          {data.map((d) => (
            <tr key={d.label}>
              <td className="py-1.5">{d.label}</td>
              <td className="py-1.5 text-right tabular-nums">{format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}
