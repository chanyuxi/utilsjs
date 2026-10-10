import type { PathSegments } from './shared'

import { assertPathSegments, hasOwn, isObjectLike } from './shared'

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
