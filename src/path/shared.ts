import type { PathSegments } from './types'

import { isPlainObject } from '../object/isPlainObject'
import { hasOwn, isObjectLike } from '../shared'

const forbiddenSegments = new Set(['__proto__', 'constructor', 'prototype'])

export { hasOwn, isObjectLike }

export function assertPathSegments(segments: PathSegments): void {
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new TypeError('Path segments must be a non-empty array.')
  }

  for (const segment of segments) {
    if (typeof segment !== 'string' || segment.length === 0 || forbiddenSegments.has(segment)) {
      throw new TypeError(`Invalid path segment: ${String(segment)}.`)
    }
  }
}

export function assertPlainObjectTarget(target: unknown): asserts target is Record<string, unknown> {
  if (!isPlainObject(target)) {
    throw new TypeError('Path target must be a plain object.')
  }
}
