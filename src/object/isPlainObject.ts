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
