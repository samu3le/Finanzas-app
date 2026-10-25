import type { EntryMode, PaidCurrency, RateSource } from '@/domain/money'

/** Fields every synced row carries; `serverSeq` is null until the server acknowledges the row. */
export interface SyncedEntity {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  serverSeq: number | null
}

export interface ConvertedAmount {
  entryMode: EntryMode
  amountUsdMinor: number
  paidCurrency: PaidCurrency
  paidAmountMinor: number
  rateSource: RateSource
  fxRate: string
}

export interface Profile extends SyncedEntity {
  baseCurrency: string
}

export interface Account extends SyncedEntity {
  name: string
  type: 'bank' | 'cash' | 'wallet'
  currency: PaidCurrency
  openingBalanceMinor: number
  archivedAt: string | null
}

export interface Category extends SyncedEntity {
  name: string
  kind: 'income' | 'expense'
  parentId: string | null
}

export type TransactionKind = 'income' | 'expense' | 'transfer' | 'activity_payment' | 'settlement'

export interface Transaction extends SyncedEntity, ConvertedAmount {
  accountId: string
  kind: TransactionKind
  categoryId: string | null
  occurredOn: string
  note: string | null
  transferId: string | null
  activityExpenseId: string | null
  settlementId: string | null
}

export interface Person extends SyncedEntity {
  name: string
  isSelf: boolean
}

export interface Activity extends SyncedEntity {
  name: string
  occurredOn: string
  status: 'open' | 'settled'
}

export interface ActivityParticipant extends SyncedEntity {
  activityId: string
  personId: string
}

export interface ActivityExpense extends SyncedEntity, ConvertedAmount {
  activityId: string
  paidBy: string
  accountId: string | null
  description: string
  payerExcluded: boolean
  categoryId: string | null
  occurredOn: string
}

export interface ExpenseSplit extends SyncedEntity {
  expenseId: string
  personId: string
  shareUsdMinor: number
}

export interface Settlement extends SyncedEntity, ConvertedAmount {
  activityId: string
  fromPerson: string
  toPerson: string
  accountId: string | null
  occurredOn: string
}

/** Server-written snapshot; read-only on the client. */
export interface ExchangeRate {
  id: string
  source: Exclude<RateSource, 'p2p'>
  quoteCurrency: PaidCurrency
  rate: string
  effectiveDate: string
  fetchedAt: string
  serverSeq: number
}

export interface OutboxEntry {
  seq?: number
  table: SyncedTableName
  rowId: string
  queuedAt: string
}

export interface MetaEntry {
  key: string
  value: unknown
}

export type SyncedTableName =
  | 'profiles'
  | 'accounts'
  | 'categories'
  | 'transactions'
  | 'people'
  | 'activities'
  | 'activityParticipants'
  | 'activityExpenses'
  | 'expenseSplits'
  | 'settlements'
