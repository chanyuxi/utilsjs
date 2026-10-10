import { describe, expect, it } from 'vitest'

import { clone, isPlainObject, shallowEqual } from '../src/object'

describe('object utilities', () => {
  it('deep-clones circular and shared references', () => {
    const shared = { value: 1 }
    const source: Record<string, unknown> = {
      left: shared,
      right: shared,
    }
    source.self = source

    const copy = clone(source)

    expect(copy).not.toBe(source)
    expect(copy.left).toBe(copy.right)
    expect(copy.left).not.toBe(shared)
    expect(copy.self).toBe(copy)
  })

  it('copies descriptors, symbols, prototypes, and accessors without invoking getters', () => {
    const symbol = Symbol('metadata')
    const prototype = { kind: 'custom' }
    let getterCalls = 0
    const getter = () => {
      getterCalls += 1
      return 'value'
    }
    const source = Object.create(prototype) as Record<PropertyKey, unknown>

    Object.defineProperty(source, 'hidden', {
      configurable: false,
      enumerable: false,
      value: { nested: true },
      writable: false,
    })
    Object.defineProperty(source, 'lazy', {
      configurable: true,
      enumerable: true,
      get: getter,
    })
    source[symbol] = { nested: true }

    const copy = clone(source)
    const hidden = Object.getOwnPropertyDescriptor(copy, 'hidden')
    const lazy = Object.getOwnPropertyDescriptor(copy, 'lazy')

    expect(getterCalls).toBe(0)
    expect(Object.getPrototypeOf(copy)).toBe(prototype)
    expect(hidden?.enumerable).toBe(false)
    expect(hidden?.writable).toBe(false)
    expect(copy.hidden).not.toBe(source.hidden)
    expect(copy[symbol]).not.toBe(source[symbol])
    expect(lazy?.get).toBe(getter)
  })

  it('clones built-in collections, binary data, and regular expressions', () => {
    const key = { id: 1 }
    const map = new Map<object, unknown>([[key, { value: 1 }]])
    map.set(map, map)
    const set = new Set<unknown>([key])
    set.add(set)
    const buffer = new ArrayBuffer(4)
    new Uint8Array(buffer)[0] = 42
    const view = new Uint16Array(buffer)
    const regexp = /utils/gi
    regexp.lastIndex = 2
    const source = { buffer, date: new Date(2020, 0, 1), map, regexp, set, view }

    const copy = clone(source)
    const copiedMapKey = [...copy.map.keys()].find(item => item !== copy.map)

    expect(copy.date).not.toBe(source.date)
    expect(copy.date.getTime()).toBe(source.date.getTime())
    expect(copy.regexp).not.toBe(source.regexp)
    expect(copy.regexp.source).toBe(source.regexp.source)
    expect(copy.regexp.flags).toBe(source.regexp.flags)
    expect(copy.regexp.lastIndex).toBe(source.regexp.lastIndex)
    expect(copy.map.get(copy.map)).toBe(copy.map)
    expect(copiedMapKey).not.toBe(key)
    expect(copy.set.has(copy.set)).toBe(true)
    expect(copy.set.has(copiedMapKey)).toBe(true)
    expect(copy.buffer).not.toBe(buffer)
    expect(new Uint8Array(copy.buffer)[0]).toBe(42)
    expect(copy.view.buffer).toBe(copy.buffer)
  })

  it('rejects values whose internal state cannot be cloned', () => {
    expect(() => clone(Promise.resolve())).toThrowError(TypeError)
    expect(() => clone(new WeakMap())).toThrowError(TypeError)
  })

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
