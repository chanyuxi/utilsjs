import type { PathSegments } from './types'

import { assertPathSegments, hasOwn, isObjectLike } from './shared'

/**
 * Checks whether a complete nested path exists, including an undefined leaf.
 *
 * @example
 * const data = { user: { name: undefined } }
 * hasPath(data, ['user', 'name']) // true
 * hasPath(data, ['user', 'email']) // false
 */
export function hasPath<TSource, const TSegments extends PathSegments>(
  source: TSource,
  segments: TSegments,
): boolean {
  assertPathSegments(segments)

  let current: unknown = source
  for (const segment of segments) {
    if (!isObjectLike(current) || !hasOwn(current, segment)) {
      return false
    }
    current = current[segment]
  }
  return true
}
