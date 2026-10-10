/** Checks for an own property without reading from the prototype chain. */
export function hasOwn(source: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(source, key)
}

/** Checks whether a value can be traversed as an object or function. */
export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return (typeof value === 'object' && value !== null) || typeof value === 'function'
}
