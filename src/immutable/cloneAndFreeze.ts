import { isPlainObject } from '../object/isPlainObject'

const forbiddenKeys = new Set(['__proto__', 'constructor', 'prototype'])

/**
 * Deep-clones and freezes data made of primitives, arrays, and plain objects.
 *
 * Date, Map, Set, functions, and custom class instances are rejected because
 * their mutable behavior cannot be represented by a plain immutable snapshot.
 *
 * @example
 * const snapshot = cloneAndFreeze({ user: { name: 'Ada' } })
 * snapshot.user.name // 'Ada'
 * Object.isFrozen(snapshot) // true
 */
export function cloneAndFreeze<TValue>(value: TValue, path = 'value'): TValue {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return value
  }

  if (Array.isArray(value)) {
    return Object.freeze(
      value.map((item, index) => cloneAndFreeze(item, `${path}[${index}]`)),
    ) as TValue
  }

  if (!isPlainObject(value)) {
    throw new TypeError(`Unsupported value at ${path}.`)
  }

  const clone: Record<string, unknown> = Object.getPrototypeOf(value) === null
    ? Object.create(null) as Record<string, unknown>
    : {}

  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) {
      throw new TypeError(`Unsafe object key at ${path}.${key}.`)
    }
    Object.defineProperty(clone, key, {
      configurable: true,
      enumerable: true,
      value: cloneAndFreeze(child, `${path}.${key}`),
      writable: true,
    })
  }

  return Object.freeze(clone) as TValue
}
