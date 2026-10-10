/**
 * Checks whether a value is a plain object.
 *
 * Only objects backed by Object.prototype or a null prototype are accepted.
 * Arrays, Date, Map, and custom class instances are intentionally excluded.
 *
 * @example
 * isPlainObject({}) // true
 * isPlainObject([]) // false
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

/**
 * Compares two objects by their own enumerable properties using Object.is.
 *
 * This is a shallow comparison: nested values are compared by identity rather
 * than recursively. Prototypes and non-enumerable properties are ignored.
 *
 * @example
 * const user = { id: 1 }
 * shallowEqual({ user }, { user }) // true
 * shallowEqual({ user: { id: 1 } }, { user: { id: 1 } }) // false
 */
export function shallowEqual(left: object, right: object): boolean {
  if (Object.is(left, right)) {
    return true
  }

  const leftRecord = left as Record<string, unknown>
  const rightRecord = right as Record<string, unknown>
  const leftKeys = Object.keys(leftRecord)
  const rightKeys = Object.keys(rightRecord)

  return leftKeys.length === rightKeys.length
    && leftKeys.every(key => Object.is(leftRecord[key], rightRecord[key]))
}
