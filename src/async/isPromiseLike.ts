/**
 * Checks whether a value implements the Promise-like `then` method.
 *
 * This intentionally accepts thenables returned by third-party libraries,
 * not only native Promise instances.
 *
 * @example
 * isPromiseLike(Promise.resolve(1)) // true
 * isPromiseLike({ then: () => {} }) // true
 * isPromiseLike(1) // false
 */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === 'object' && value !== null) || typeof value === 'function'
  ) && typeof (value as { then?: unknown }).then === 'function'
}
