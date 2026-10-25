import Dexie, { type EntityTable } from 'dexie'
import type {
  Account,
  Activity,
  ActivityExpense,
  ActivityParticipant,
  Category,
  ExchangeRate,
  ExpenseSplit,
  MetaEntry,
  OutboxEntry,
  Person,
  Profile,
  Settlement,
  Transaction,
} from './types'

export class FinanzasDb extends Dexie {
  profiles!: EntityTable<Profile, 'id'>
  accounts!: EntityTable<Account, 'id'>
  categories!: EntityTable<Category, 'id'>
  transactions!: EntityTable<Transaction, 'id'>
  people!: EntityTable<Person, 'id'>
  activities!: EntityTable<Activity, 'id'>
  activityParticipants!: EntityTable<ActivityParticipant, 'id'>
  activityExpenses!: EntityTable<ActivityExpense, 'id'>
  expenseSplits!: EntityTable<ExpenseSplit, 'id'>
  settlements!: EntityTable<Settlement, 'id'>
  exchangeRates!: EntityTable<ExchangeRate, 'id'>
  outbox!: EntityTable<OutboxEntry, 'seq'>
  meta!: EntityTable<MetaEntry, 'key'>

  constructor(name = 'finanzas') {
    super(name)
    this.version(1).stores({
      profiles: 'id',
      accounts: 'id, currency',
      categories: 'id, kind, parentId',
      transactions: 'id, accountId, occurredOn, kind, transferId, activityExpenseId, settlementId',
      people: 'id, isSelf',
      activities: 'id, occurredOn, status',
      activityParticipants: 'id, activityId, personId, [activityId+personId]',
      activityExpenses: 'id, activityId, paidBy, occurredOn',
      expenseSplits: 'id, expenseId, personId',
      settlements: 'id, activityId',
      exchangeRates: 'id, [source+effectiveDate], fetchedAt',
      outbox: '++seq, table',
      meta: 'key',
    })
  }
}

export const db = new FinanzasDb()
