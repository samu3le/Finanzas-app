import { describe, expect, it } from 'vitest'
import { niceTicks } from './scale'

describe('niceTicks', () => {
  it('uses 1/2/5 steps and covers the max', () => {
    expect(niceTicks(87)).toEqual([0, 50, 100])
    expect(niceTicks(340)).toEqual([0, 100, 200, 300, 400])
    expect(niceTicks(4)).toEqual([0, 1, 2, 3, 4])
  })

  it('handles empty data', () => {
    expect(niceTicks(0)).toEqual([0])
  })
})
