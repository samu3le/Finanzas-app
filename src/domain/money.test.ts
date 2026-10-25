import { describe, expect, it } from 'vitest'
import { isRateSourceAllowed, resolveAmounts } from './money'

describe('resolveAmounts', () => {
  it('derives bolivars from a USD price at the BCV euro rate', () => {
    expect(
      resolveAmounts({ paidCurrency: 'VES', entryMode: 'usd', enteredMinor: 10_00, fxRate: '993.08836371' }),
    ).toEqual({ amountUsdMinor: 10_00, paidAmountMinor: 9_930_88 })
  })

  it('derives USD from a bolivar price', () => {
    expect(
      resolveAmounts({ paidCurrency: 'VES', entryMode: 'native', enteredMinor: 500_00, fxRate: '886.2271' }),
    ).toEqual({ amountUsdMinor: 56, paidAmountMinor: 500_00 })
  })

  it('derives USD from COP at the TRM', () => {
    expect(
      resolveAmounts({ paidCurrency: 'COP', entryMode: 'native', enteredMinor: 50_000_00, fxRate: '3158.43' }),
    ).toEqual({ amountUsdMinor: 15_83, paidAmountMinor: 50_000_00 })
  })

  it('rejects non-positive rates', () => {
    expect(() =>
      resolveAmounts({ paidCurrency: 'VES', entryMode: 'usd', enteredMinor: 100, fxRate: '0' }),
    ).toThrow(RangeError)
  })
})

describe('isRateSourceAllowed', () => {
  it('restricts COP to the TRM', () => {
    expect(isRateSourceAllowed('COP', 'trm')).toBe(true)
    expect(isRateSourceAllowed('COP', 'bcv_usd')).toBe(false)
    expect(isRateSourceAllowed('VES', 'p2p')).toBe(true)
  })
})
