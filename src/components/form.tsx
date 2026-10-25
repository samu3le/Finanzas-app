import { type ComponentProps, type ReactNode, useId } from 'react'

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-on-accent hover:opacity-90',
  secondary: 'border border-border bg-surface text-fg hover:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2',
  danger: 'bg-negative text-on-accent hover:opacity-90',
} as const

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: keyof typeof BUTTON_VARIANTS; size?: 'sm' | 'md' }) {
  const sizes = { sm: 'h-8 px-3 text-sm', md: 'h-11 px-4' }
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

const CONTROL =
  'w-full rounded-xl border border-border bg-surface px-3 text-fg placeholder:text-muted transition-colors focus:border-accent focus:outline-none aria-invalid:border-negative disabled:opacity-50'

/** Label + hint/error wrapper; wires ids so the control is described by its message. */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode
}) {
  const id = useId()
  const messageId = hint || error ? `${id}-msg` : undefined
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children({ id, 'aria-describedby': messageId, 'aria-invalid': error ? true : undefined })}
      {messageId && (
        <p id={messageId} className={`text-xs ${error ? 'text-negative' : 'text-muted'}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

export function TextInput({ className = '', ...props }: ComponentProps<'input'>) {
  return <input className={`h-11 ${CONTROL} ${className}`} {...props} />
}

export function Textarea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return <textarea rows={3} className={`py-2.5 ${CONTROL} ${className}`} {...props} />
}

export function Select({ className = '', ...props }: ComponentProps<'select'>) {
  return <select className={`h-11 ${CONTROL} ${className}`} {...props} />
}

/** Amount entry: currency tag on the left, decimal keypad on phones. */
export function MoneyInput({ currency, className = '', ...props }: ComponentProps<'input'> & { currency: string }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-muted">{currency}</span>
      <input
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        className={`h-14 pl-14 text-right text-xl font-semibold tabular-nums ${CONTROL} ${className}`}
        {...props}
      />
    </div>
  )
}

export function Checkbox({ label, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1">
      <input type="checkbox" className="size-5 rounded accent-(--accent)" {...props} />
      <span>{label}</span>
    </label>
  )
}

/** Native checkbox with switch semantics; the track is pure CSS. */
export function Switch({ label, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        className="relative h-6 w-10 shrink-0 cursor-pointer appearance-none rounded-full bg-border transition-colors before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:bg-surface before:shadow before:transition-transform checked:bg-accent checked:before:translate-x-4"
        {...props}
      />
    </label>
  )
}
