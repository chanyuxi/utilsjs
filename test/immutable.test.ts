import { describe, expect, it } from 'vitest'

import { cloneAndFreeze } from '../src/immutable'

describe('cloneAndFreeze', () => {
  it('deep-clones and freezes supported values', () => {
    const source = { tags: ['typescript'], user: { name: 'Ada' } }
    const snapshot = cloneAndFreeze(source)

    expect(snapshot).toEqual(source)
    expect(snapshot).not.toBe(source)
    expect(snapshot.user).not.toBe(source.user)
    expect(Object.isFrozen(snapshot)).toBe(true)
    expect(Object.isFrozen(snapshot.user)).toBe(true)
    expect(Object.isFrozen(snapshot.tags)).toBe(true)
  })

  it('rejects non-plain objects', () => {
    expect(() => cloneAndFreeze(new Date())).toThrowError(TypeError)
  })
})
