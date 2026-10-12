import type { PathSegments, PathValue } from './types'

import { assertPathSegments, hasOwn, isObjectLike } from './shared'

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
export function getPath<
  TSource,
  const TSegments extends PathSegments,
>(source: TSource, segments: TSegments): PathValue<TSource, TSegments> | undefined {
  assertPathSegments(segments)

  let current: unknown = source
  for (const segment of segments) {
    if (!isObjectLike(current) || !hasOwn(current, segment)) {
      return undefined
    }
    current = current[segment]
  }
  return current as PathValue<TSource, TSegments>
}
