import Big from 'big.js'

export const REPORT_CURRENCY = 'USD'

export const PAID_CURRENCIES = ['COP', 'VES'] as const
export type PaidCurrency = (typeof PAID_CURRENCIES)[number]

export const RATE_SOURCES = ['trm', 'bcv_usd', 'bcv_eur', 'binance_usdt', 'p2p'] as const
export type RateSource = (typeof RATE_SOURCES)[number]

export const RATE_SOURCES_BY_CURRENCY = {
  COP: ['trm'],
  VES: ['bcv_usd', 'bcv_eur', 'binance_usdt', 'p2p'],
} as const satisfies Record<PaidCurrency, readonly RateSource[]>

/** Which of the two amounts the user typed; that one is exact, the other is derived. */
export type EntryMode = 'usd' | 'native'

const MINOR_UNIT_EXPONENT: Record<PaidCurrency | typeof REPORT_CURRENCY, number> = {
  USD: 2,
  COP: 2,
  VES: 2,
}

export function isRateSourceAllowed(currency: PaidCurrency, source: RateSource): boolean {
  return (RATE_SOURCES_BY_CURRENCY[currency] as readonly RateSource[]).includes(source)
}

export interface AmountInput {
  paidCurrency: PaidCurrency
  entryMode: EntryMode
  enteredMinor: number
  /** Units of `paidCurrency` per 1 registered USD. */
  fxRate: string
}

export interface ResolvedAmounts {
  amountUsdMinor: number
  paidAmountMinor: number
}

export function resolveAmounts({ paidCurrency, entryMode, enteredMinor, fxRate }: AmountInput): ResolvedAmounts {
  assertSafeMinor(enteredMinor)
  const rate = new Big(fxRate)
  if (rate.lte(0)) throw new RangeError(`fxRate must be positive, got ${fxRate}`)

  // Minor units can differ in exponent between currencies, so scale explicitly.
  const scale = new Big(10).pow(MINOR_UNIT_EXPONENT[paidCurrency] - MINOR_UNIT_EXPONENT[REPORT_CURRENCY])

  if (entryMode === 'usd') {
    const paid = new Big(enteredMinor).times(rate).times(scale)
    return { amountUsdMinor: enteredMinor, paidAmountMinor: toSafeMinor(paid) }
  }

  const usd = new Big(enteredMinor).div(rate).div(scale)
  return { amountUsdMinor: toSafeMinor(usd), paidAmountMinor: enteredMinor }
}

function toSafeMinor(value: Big): number {
  const minor = Number(value.round(0, Big.roundHalfUp).toFixed(0))
  assertSafeMinor(minor)
  return minor
}

function assertSafeMinor(value: number): void {
  if (!Number.isSafeInteger(value)) throw new RangeError(`Amount out of safe integer range: ${value}`)
}
