import { isPlainObject } from '../object'

/** String segments used to access nested object properties. */
export type PathSegments = readonly string[]

const forbiddenSegments = new Set(['__proto__', 'constructor', 'prototype'])

/**
 * Reads a value at a nested path.
 *
 * Only own properties are traversed. Missing segments return undefined instead
 * of reading values from Object.prototype.
 *
 * @example
 * const data = { user: { name: 'Ada' } }
 * getPath(data, ['user', 'name']) // 'Ada'
 * getPath(data, ['user', 'email']) // undefined
 */
export function getPath(source: unknown, segments: PathSegments): unknown {
  assertPathSegments(segments)

  let current = source
  for (const segment of segments) {
    if (!isObjectLike(current) || !hasOwn(current, segment)) {
      return undefined
    }
    current = current[segment]
  }
  return current
}

/**
 * Checks whether a complete nested path exists, including an undefined leaf.
 *
 * @example
 * const data = { user: { name: undefined } }
 * hasPath(data, ['user', 'name']) // true
 * hasPath(data, ['user', 'email']) // false
 */
export function hasPath(source: unknown, segments: PathSegments): boolean {
  assertPathSegments(segments)

  let current = source
  for (const segment of segments) {
    if (!isObjectLike(current) || !hasOwn(current, segment)) {
      return false
    }
    current = current[segment]
  }
  return true
}

/**
 * Mutates a plain object by assigning a value at a nested path.
 *
 * Missing or non-plain intermediate nodes are replaced with plain objects.
 * The result is not frozen, so this function is intended for temporary data.
 *
 * @example
 * const target: Record<string, unknown> = {}
 * setPath(target, ['user', 'name'], 'Ada')
 * target // { user: { name: 'Ada' } }
 */
export function setPath(
  target: Record<string, unknown>,
  segments: PathSegments,
  value: unknown,
): void {
  assertPathSegments(segments)
  assertPlainObjectTarget(target)

  let current = target
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]!
    const existing = current[segment]
    if (!isPlainObject(existing)) {
      current[segment] = {}
    }
    current = current[segment] as Record<string, unknown>
  }

  current[segments.at(-1)!] = value
}

/**
 * Replaces a value at a nested path without mutating the source.
 *
 * Only changed plain-object containers are recreated; unchanged branches keep
 * their original identity. The replacement value is not cloned or frozen.
 *
 * @example
 * const state = { user: { name: 'Ada' } }
 * const next = updatePath(state, ['user', 'name'], 'Grace')
 * next // { user: { name: 'Grace' } }
 * state !== next // true
 */
export function updatePath<TValue>(
  source: TValue,
  segments: PathSegments,
  value: unknown,
): TValue {
  assertPathSegments(segments)

  const update = (current: unknown, index: number): unknown => {
    const segment = segments[index]
    if (segment === undefined) {
      return value
    }
    if (!isPlainObject(current)) {
      throw new TypeError(
        `Cannot update path at ${segments.slice(0, index).join('.') || '<root>'}.`,
      )
    }

    const previous = current[segment]
    const next = update(previous, index + 1)
    if (Object.is(previous, next)) {
      return current
    }
    return Object.freeze({ ...current, [segment]: next })
  }

  return update(source, 0) as TValue
}

function assertPathSegments(segments: PathSegments): void {
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new TypeError('Path segments must be a non-empty array.')
  }

  for (const segment of segments) {
    if (typeof segment !== 'string' || segment.length === 0 || forbiddenSegments.has(segment)) {
      throw new TypeError(`Invalid path segment: ${String(segment)}.`)
    }
  }
}

function assertPlainObjectTarget(target: unknown): asserts target is Record<string, unknown> {
  if (!isPlainObject(target)) {
    throw new TypeError('Path target must be a plain object.')
  }
}

function hasOwn(source: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(source, key)
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return (typeof value === 'object' && value !== null) || typeof value === 'function'
}
