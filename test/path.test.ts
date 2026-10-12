import type { PathInputValue, PathUpdate, PathValue } from '../src/path'

import { describe, expect, expectTypeOf, it } from 'vitest'

import {
  getPath,
  hasPath,
  setPath,
  updatePath,
} from '../src/path'

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

  it('infers values and updated shapes from literal paths', () => {
    const source = {
      items: [{ id: 1 }],
      user: { name: 'Ada' },
    }

    const name = getPath(source, ['user', 'name'])
    const itemId = getPath(source, ['items', '0', 'id'])
    const next = updatePath(source, ['user', 'name'], 'Grace')

    expectTypeOf(name).toEqualTypeOf<string | undefined>()
    expectTypeOf(itemId).toEqualTypeOf<number | undefined>()
    expectTypeOf(next.user.name).toEqualTypeOf<string>()
    expectTypeOf(next.items).toEqualTypeOf<{ id: number }[]>()
    expectTypeOf<PathUpdate<typeof source, ['user', 'name'], string>>()
      .toMatchTypeOf<{ user: { name: string } }>()
    expectTypeOf<PathValue<typeof source, ['user', 'name']>>().toEqualTypeOf<string>()
    expectTypeOf<PathInputValue<typeof source, ['user', 'name']>>().toEqualTypeOf<string>()

    setPath(source, ['user', 'name'], 'Grace')
    expect(hasPath(source, ['user', 'name'])).toBe(true)
  })

  it('rejects unsafe path segments', () => {
    expect(() => getPath({}, ['__proto__'])).toThrowError(TypeError)
  })
})
