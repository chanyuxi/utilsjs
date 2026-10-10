import type { PathSegments } from './shared'

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
