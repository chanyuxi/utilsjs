import { describe, expect, it } from 'vitest'

import { getPath, hasPath, setPath, updatePath } from '../src/path'

describe('path utilities', () => {
  it('reads values and distinguishes missing paths from undefined leaves', () => {
    const source = { user: { name: 'Ada', nickname: undefined } }

    expect(getPath(source, ['user', 'name'])).toBe('Ada')
    expect(getPath(source, ['user', 'email'])).toBeUndefined()
    expect(hasPath(source, ['user', 'nickname'])).toBe(true)
    expect(hasPath(source, ['user', 'email'])).toBe(false)
    expect(getPath({}, ['toString'])).toBeUndefined()
  })

  it('sets nested values and replaces invalid intermediate nodes', () => {
    const target: Record<string, unknown> = { user: 'invalid' }

    setPath(target, ['user', 'name'], 'Ada')

    expect(target).toEqual({ user: { name: 'Ada' } })
  })

  it('updates only changed branches without mutating the source', () => {
    const source = { settings: { theme: 'light' }, user: { name: 'Ada' } }
    const next = updatePath(source, ['user', 'name'], 'Grace')

    expect(next).toEqual({ settings: { theme: 'light' }, user: { name: 'Grace' } })
    expect(next).not.toBe(source)
    expect(next.user).not.toBe(source.user)
    expect(next.settings).toBe(source.settings)
    expect(Object.isFrozen(next)).toBe(true)
    expect(Object.isFrozen(next.user)).toBe(true)
    expect(source.user.name).toBe('Ada')
  })

  it('rejects unsafe path segments', () => {
    expect(() => getPath({}, ['__proto__'])).toThrowError(TypeError)
  })
})
