import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { TransactionList } from '@/components/TransactionRow'
import { Badge, Card, EmptyState, PageHeader, SectionTitle } from '@/components/ui'
import { db } from '@/db/db'
import type { ExchangeRate } from '@/db/types'
import { formatMinor, RATE_LABEL } from '@/lib/format'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const STALE_MS = 24 * 60 * 60 * 1000

function HomePage() {
  // Read the clock once per mount (render must stay pure).
  const [now] = useState(() => new Date())
  // 'sv' formats as YYYY-MM-DD in local time.
  const monthStart = now.toLocaleDateString('sv').slice(0, 8) + '01'
  const month = useLiveQuery(() => db.transactions.where('occurredOn').aboveOrEqual(monthStart).toArray(), [monthStart])
  const recent = useLiveQuery(
    () => db.transactions.orderBy('occurredOn').reverse().filter((tx) => !tx.deletedAt).limit(5).toArray(),
    [],
  )
  const accounts = useLiveQuery(() => db.accounts.filter((a) => !a.deletedAt && !a.archivedAt).toArray(), [])
  const rates = useLiveQuery(() => db.exchangeRates.orderBy('fetchedAt').toArray(), [])

  const live = month?.filter((tx) => !tx.deletedAt) ?? []
  // ponytail: plain income/expense only; activity shares join the report with computePairwiseBalances (fase 3)
  const income = live.filter((tx) => tx.kind === 'income').reduce((sum, tx) => sum + tx.amountUsdMinor, 0)
  const expense = live.filter((tx) => tx.kind === 'expense').reduce((sum, tx) => sum + tx.amountUsdMinor, 0)

  // Ordered by fetchedAt, so the last write per source wins.
  const latest = new Map<ExchangeRate['source'], ExchangeRate>(rates?.map((r) => [r.source, r]))

  return (
    <>
      <PageHeader title="Resumen" subtitle={now.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <p className="text-sm text-muted">Este mes, en USD</p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted">Ingresos</p>
              <p className="text-2xl font-semibold tracking-tight text-positive">{formatMinor(income, 'USD')}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Gastos</p>
              <p className="text-2xl font-semibold tracking-tight text-negative">{formatMinor(expense, 'USD')}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3 text-sm">
            <span className="text-muted">Balance </span>
            <span className="font-semibold">{formatMinor(income - expense, 'USD')}</span>
          </div>
        </Card>

        <Card>
          <SectionTitle>Tasas del día</SectionTitle>
          {latest.size === 0 ? (
            <p className="text-sm text-muted">Las tasas llegan con la sincronización (07:00 y 19:00).</p>
          ) : (
            <ul className="space-y-2.5">
              {[...latest.values()].map((rate) => (
                <li key={rate.source} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    {RATE_LABEL[rate.source]}
                    {now.getTime() - Date.parse(rate.fetchedAt) > STALE_MS && <Badge>Desactualizada</Badge>}
                  </span>
                  <span className="font-medium">
                    {Number(rate.rate).toLocaleString('es', { maximumFractionDigits: 2 })} {rate.quoteCurrency === 'VES' ? 'Bs' : 'COP'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <SectionTitle>Cuentas</SectionTitle>
          {accounts?.length ? (
            <ul className="space-y-2.5 text-sm">
              {accounts.map((account) => (
                <li key={account.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{account.name}</span>
                  <Badge tone="accent">{account.currency}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Sin cuentas todavía. Crea una en COP o VES para empezar a registrar.</p>
          )}
        </Card>
      </div>

      <div className="mt-8">
        <SectionTitle>Últimos movimientos</SectionTitle>
        {recent?.length ? (
          <Card className="py-1">
            <TransactionList items={recent} />
          </Card>
        ) : (
          <EmptyState title="Todavía no hay movimientos" hint="Cuando registres gastos e ingresos en COP o VES, los verás aquí con su valor en USD." />
        )}
      </div>
    </>
  )
}
