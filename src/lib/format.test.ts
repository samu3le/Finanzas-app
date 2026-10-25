import { expect, it } from 'vitest'
import { formatMinor } from './format'

// \u00a0 keeps the symbol glued to the number when text wraps.
it('formats minor units with prefix symbol and thousands grouping', () => {
  expect(formatMinor(120000, 'USD')).toBe('$\u00a01.200,00')
  expect(formatMinor(285000000, 'COP')).toBe('COP\u00a02.850.000,00')
  expect(formatMinor(-1845000, 'VES')).toBe('−Bs\u00a018.450,00')
})
