import type { PathInputValue, PathSegments } from './types'

import { isPlainObject } from '../object/isPlainObject'

import { assertPathSegments, assertPlainObjectTarget } from './shared'

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
export function setPath<
  TTarget extends object,
  const TSegments extends PathSegments,
>(
  target: TTarget,
  segments: TSegments,
  value: PathInputValue<TTarget, TSegments>,
): void {
  assertPathSegments(segments)
  assertPlainObjectTarget(target)

  let current = target as Record<string, unknown>
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
