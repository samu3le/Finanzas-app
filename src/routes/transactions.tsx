import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { TransactionList } from '@/components/TransactionRow'
import { Card, EmptyState, PageHeader, Segmented } from '@/components/ui'
import { db } from '@/db/db'
import type { Transaction } from '@/db/types'
import { formatDay } from '@/lib/format'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
})

const FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'expense', label: 'Gastos' },
  { value: 'income', label: 'Ingresos' },
] as const

type Filter = (typeof FILTERS)[number]['value']

function TransactionsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const items = useLiveQuery(
    () =>
      db.transactions
        .orderBy('occurredOn')
        .reverse()
        .filter((tx) => !tx.deletedAt && (filter === 'all' || tx.kind === filter))
        .toArray(),
    [filter],
  )

  // Rows arrive sorted by date, so consecutive grouping is enough.
  const days: [string, Transaction[]][] = []
  for (const tx of items ?? []) {
    const last = days.at(-1)
    if (last?.[0] === tx.occurredOn) last[1].push(tx)
    else days.push([tx.occurredOn, [tx]])
  }

  return (
    <>
      <PageHeader title="Movimientos" />
      <div className="mb-5">
        <Segmented label="Filtrar movimientos" options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {items && days.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'Sin movimientos' : 'Nada con este filtro'}
          hint="Cada movimiento guarda el monto pagado en COP o VES, la tasa usada y su valor en USD."
        />
      ) : (
        <div className="space-y-5">
          {days.map(([day, txs]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">{formatDay(day)}</h2>
              <Card className="py-1">
                <TransactionList items={txs} />
              </Card>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
