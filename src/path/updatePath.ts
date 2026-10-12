import type { PathSegments, PathUpdate } from './types'

import { isPlainObject } from '../object/isPlainObject'

import { assertPathSegments } from './shared'

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
export function updatePath<
  TSource extends object,
  const TSegments extends PathSegments,
  TValue,
>(
  source: TSource,
  segments: TSegments,
  value: TValue,
): PathUpdate<TSource, TSegments, TValue> {
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

  return update(source, 0) as PathUpdate<TSource, TSegments, TValue>
}
