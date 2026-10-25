import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db/db'
import type { Transaction } from '@/db/types'
import { formatDay, formatMinor, KIND_LABEL, KIND_SIGN, RATE_LABEL } from '@/lib/format'

export function TransactionList({ items }: { items: Transaction[] }) {
  const categories = useLiveQuery(() => db.categories.toArray(), [])
  const names = new Map(categories?.map((c) => [c.id, c.name]))
  return (
    <ul className="divide-y divide-border">
      {items.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} title={tx.note || names.get(tx.categoryId ?? '') || KIND_LABEL[tx.kind]} />
      ))}
    </ul>
  )
}

function TransactionRow({ tx, title }: { tx: Transaction; title: string }) {
  const sign = KIND_SIGN[tx.kind]
  const tone = sign > 0 ? 'text-positive' : sign < 0 ? 'text-negative' : 'text-fg'
  const prefix = sign > 0 ? '+' : sign < 0 ? '−' : ''

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        <p className="text-xs text-muted">
          {KIND_LABEL[tx.kind]} · {formatDay(tx.occurredOn)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className={`font-semibold ${tone}`}>
          {prefix}
          {formatMinor(tx.paidAmountMinor, tx.paidCurrency)}
        </p>
        <p className="text-xs text-muted">
          {formatMinor(tx.amountUsdMinor, 'USD')} · {RATE_LABEL[tx.rateSource]}
        </p>
      </div>
    </li>
  )
}
