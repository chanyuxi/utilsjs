import { describe, expect, it } from 'vitest'

import { isPlainObject, shallowEqual } from '../src/object'

describe('object utilities', () => {
  it('identifies plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
  })

  it('performs shallow equality with Object.is semantics', () => {
    const user = { id: 1 }

    expect(shallowEqual({ user }, { user })).toBe(true)
    expect(shallowEqual({ user: { id: 1 } }, { user: { id: 1 } })).toBe(false)
    expect(shallowEqual({ value: Number.NaN }, { value: Number.NaN })).toBe(true)
  })
})
