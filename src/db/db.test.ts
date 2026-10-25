import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { FinanzasDb } from './db'

describe('FinanzasDb', () => {
  const db = new FinanzasDb('finanzas-test')

  afterEach(async () => {
    await db.delete()
  })

  it('opens every table defined in the schema', async () => {
    await db.open()
    expect(db.tables.map((table) => table.name).sort()).toEqual([
      'accounts',
      'activities',
      'activityExpenses',
      'activityParticipants',
      'categories',
      'exchangeRates',
      'expenseSplits',
      'meta',
      'outbox',
      'people',
      'profiles',
      'settlements',
      'transactions',
    ])
  })
})
