import { type ReactNode, useEffect, useRef } from 'react'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-6 flex items-end justify-between gap-4">
      <div>
        {subtitle && <p className="text-sm text-muted first-letter:uppercase">{subtitle}</p>}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {action}
    </header>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-border bg-surface p-4 ${className}`}>{children}</section>
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">{children}</h2>
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-4 py-10 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted">{hint}</p>
    </div>
  )
}

export function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'accent' }) {
  const tones = { muted: 'bg-surface-2 text-muted', accent: 'bg-accent-soft text-accent' }
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

/** Pill-style single choice (filters, theme picker). Native radio semantics via aria. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl bg-surface-2 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          onClick={() => onChange(option.value)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors aria-checked:bg-surface aria-checked:text-fg aria-checked:shadow-sm"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/** Native <details>; works without JS and keeps find-in-page. */
export function Accordion({ items }: { items: readonly { title: string; content: ReactNode }[] }) {
  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.title} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-medium [&::-webkit-details-marker]:hidden">
            {item.title}
            <svg viewBox="0 0 24 24" className="size-4 text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="px-4 pb-4 text-sm text-muted">{item.content}</div>
        </details>
      ))}
    </div>
  )
}

/** CSS scroll-snap: swipe on touch, arrow buttons from md. */
export function Carousel({ children, label }: { children: ReactNode[]; label: string }) {
  const track = useRef<HTMLUListElement>(null)
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.85, behavior: 'smooth' })
  return (
    <section aria-roledescription="carrusel" aria-label={label} className="relative">
      <ul
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0"
      >
        {children.map((child, i) => (
          <li key={i} className="w-[85%] shrink-0 snap-start md:w-[calc(50%-0.375rem)]">
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-2 hidden justify-end gap-2 md:flex">
        <ArrowButton aria-label="Anterior" onClick={() => scroll(-1)}>
          ‹
        </ArrowButton>
        <ArrowButton aria-label="Siguiente" onClick={() => scroll(1)}>
          ›
        </ArrowButton>
      </div>
    </section>
  )
}

function ArrowButton(props: { onClick: () => void; children: ReactNode; 'aria-label': string }) {
  return (
    <button type="button" className="grid size-9 place-items-center rounded-full border border-border bg-surface text-lg hover:bg-surface-2" {...props} />
  )
}

const ALERT_TONES = {
  info: { box: 'border-border bg-surface-2', icon: 'text-muted', path: 'M12 16v-4M12 8h.01' },
  warning: { box: 'border-warning/40 bg-warning/10', icon: 'text-warning', path: 'M12 9v4M12 17h.01' },
  error: { box: 'border-negative/40 bg-negative/10', icon: 'text-negative', path: 'M15 9l-6 6M9 9l6 6' },
  success: { box: 'border-positive/40 bg-positive/10', icon: 'text-positive', path: 'm8 12 3 3 5-6' },
} as const

/** Status message: icon + text, never color alone. */
export function Alert({ tone = 'info', title, children }: { tone?: keyof typeof ALERT_TONES; title: string; children?: ReactNode }) {
  const t = ALERT_TONES[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex gap-3 rounded-xl border p-3 text-sm ${t.box}`}>
      <svg viewBox="0 0 24 24" className={`mt-0.5 size-4 shrink-0 ${t.icon}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d={t.path} />
      </svg>
      <div>
        <p className="font-medium">{title}</p>
        {children && <div className="mt-0.5 text-muted">{children}</div>}
      </div>
    </div>
  )
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
  return (
    <span
      aria-hidden
      className={`inline-grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent ${size === 'sm' ? 'size-7 text-xs' : 'size-10 text-sm'}`}
    >
      {initials}
    </span>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />
}

/** Single-value progress (my share of an expense, month spent vs. last month). */
export function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div role="meter" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className="h-2 overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Native <dialog>: focus trap, Esc and backdrop for free. Bottom sheet on phones, centered from md. */
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog?.open) dialog?.showModal()
    if (!open && dialog?.open) dialog.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-0 mt-auto w-full max-w-none rounded-t-3xl border border-border bg-surface p-0 text-fg backdrop:bg-black/40 md:m-auto md:max-w-md md:rounded-3xl"
    >
      <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </dialog>
  )
}
