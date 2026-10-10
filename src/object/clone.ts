import {
  type CloneableTypedArray,
  cloneBoxedPrimitive,
  copyProperties,
  createTypedArray,
  isBoxedPrimitiveTag,
  isSharedArrayBuffer,
  isUnsupportedCloneTag,
  objectToString,
} from './shared'

/**
 * Deep-clones a value while preserving circular references and prototypes.
 *
 * Own property descriptors, including non-enumerable and symbol properties,
 * are copied without invoking getters. Functions are intentionally returned
 * as-is because their executable behavior and closure cannot be cloned.
 *
 * @example
 * const source = { user: { name: 'Ada' } }
 * const copy = clone(source)
 * copy.user !== source.user // true
 */
export function clone<TValue>(value: TValue): TValue {
  return cloneValue(value, new WeakMap<object, object>())
}

function cloneValue<TValue>(value: TValue, seen: WeakMap<object, object>): TValue {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) {
    return value
  }

  if (typeof value === 'function') {
    return value
  }

  const existing = seen.get(value)
  if (existing !== undefined) {
    return existing as TValue
  }

  const tag = objectToString.call(value)
  if (isUnsupportedCloneTag(tag)) {
    throw new TypeError(`${tag.slice(8, -1)} values cannot be cloned.`)
  }

  if (Array.isArray(value)) {
    const copy = new Array(value.length)
    seen.set(value, copy)
    copyProperties(value, copy, seen, cloneValue, true)
    return copy as TValue
  }

  if (tag === '[object Date]') {
    const copy = new Date(Date.prototype.getTime.call(value))
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  if (tag === '[object RegExp]') {
    const copy = new RegExp(value as unknown as RegExp)
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  if (tag === '[object Map]') {
    const copy = new Map<unknown, unknown>()
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    const entries = Map.prototype.entries.call(value as unknown as Map<unknown, unknown>)
    for (const [key, item] of entries) {
      copy.set(cloneValue(key, seen), cloneValue(item, seen))
    }
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  if (tag === '[object Set]') {
    const copy = new Set<unknown>()
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    const items = Set.prototype.values.call(value as unknown as Set<unknown>)
    for (const item of items) {
      copy.add(cloneValue(item, seen))
    }
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  if (tag === '[object ArrayBuffer]') {
    const copy = ArrayBuffer.prototype.slice.call(value, 0) as ArrayBufferLike
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  if (tag === '[object SharedArrayBuffer]' && isSharedArrayBuffer(value)) {
    const copy = SharedArrayBuffer.prototype.slice.call(value, 0) as ArrayBufferLike
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  if (ArrayBuffer.isView(value)) {
    const buffer = cloneValue(value.buffer, seen) as ArrayBufferLike
    const typedArray = value as unknown as CloneableTypedArray
    const copy = tag === '[object DataView]'
      ? new DataView(buffer, value.byteOffset, value.byteLength)
      : createTypedArray(tag, buffer, value.byteOffset, typedArray.length)
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    copyProperties(value, copy, seen, cloneValue, tag !== '[object DataView]')
    return copy as TValue
  }

  if (isBoxedPrimitiveTag(tag)) {
    const copy = cloneBoxedPrimitive(value, tag)
    seen.set(value, copy)
    Object.setPrototypeOf(copy, Object.getPrototypeOf(value))
    copyProperties(value, copy, seen, cloneValue)
    return copy as TValue
  }

  const copy = Object.create(Object.getPrototypeOf(value)) as object
  seen.set(value, copy)
  copyProperties(value, copy, seen, cloneValue)
  return copy as TValue
}
