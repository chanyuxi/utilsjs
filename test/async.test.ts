import { describe, expect, it } from 'vitest'

import { isPromiseLike } from '../src/async'

describe('isPromiseLike', () => {
  it('accepts native promises and thenables', () => {
    expect(isPromiseLike(Promise.resolve())).toBe(true)
    expect(isPromiseLike({ then: () => undefined })).toBe(true)
  })

  it('rejects values without a then method', () => {
    expect(isPromiseLike(null)).toBe(false)
    expect(isPromiseLike(1)).toBe(false)
  })
})
