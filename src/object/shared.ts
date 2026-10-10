export type CloneableTypedArray
  = | BigInt64Array
    | BigUint64Array
    | Float32Array
    | Float64Array
    | Int16Array
    | Int32Array
    | Int8Array
    | Uint16Array
    | Uint32Array
    | Uint8Array
    | Uint8ClampedArray

export type CloneValue = <TValue>(value: TValue, seen: WeakMap<object, object>) => TValue

type CloneableTypedArrayConstructor = new (
  buffer: ArrayBufferLike,
  byteOffset: number,
  length: number,
) => CloneableTypedArray

export const objectToString = Object.prototype.toString

const typedArrayConstructors: Record<string, CloneableTypedArrayConstructor> = {
  '[object BigInt64Array]': BigInt64Array,
  '[object BigUint64Array]': BigUint64Array,
  '[object Float32Array]': Float32Array,
  '[object Float64Array]': Float64Array,
  '[object Int16Array]': Int16Array,
  '[object Int32Array]': Int32Array,
  '[object Int8Array]': Int8Array,
  '[object Uint16Array]': Uint16Array,
  '[object Uint32Array]': Uint32Array,
  '[object Uint8Array]': Uint8Array,
  '[object Uint8ClampedArray]': Uint8ClampedArray,
}

const unsupportedCloneTags = new Set([
  '[object FinalizationRegistry]',
  '[object Promise]',
  '[object WeakMap]',
  '[object WeakRef]',
  '[object WeakSet]',
])

export function cloneBoxedPrimitive(value: object, tag: string): object {
  switch (tag) {
    case '[object BigInt]':
      return Object(BigInt.prototype.valueOf.call(value))
    case '[object Boolean]':
      return Object(Boolean.prototype.valueOf.call(value))
    case '[object Number]':
      return Object(Number.prototype.valueOf.call(value))
    case '[object String]':
      return Object(String.prototype.valueOf.call(value))
    case '[object Symbol]':
      return Object(Symbol.prototype.valueOf.call(value))
    default:
      throw new TypeError(`${tag.slice(8, -1)} values cannot be cloned.`)
  }
}

export function copyProperties(
  source: object,
  target: object,
  seen: WeakMap<object, object>,
  cloneValue: CloneValue,
  skipTypedArrayIndexes = false,
): void {
  const deferredKeys: PropertyKey[] = []

  for (const key of Reflect.ownKeys(source)) {
    if (skipTypedArrayIndexes && isTypedArrayIndex(key)) {
      continue
    }
    if (Array.isArray(source) && key === 'length') {
      deferredKeys.push(key)
      continue
    }

    defineClonedProperty(source, target, key, seen, cloneValue)
  }

  for (const key of deferredKeys) {
    defineClonedProperty(source, target, key, seen, cloneValue)
  }

  preserveIntegrityLevel(source, target)
}

export function createTypedArray(
  tag: string,
  buffer: ArrayBufferLike,
  byteOffset: number,
  length: number,
): CloneableTypedArray {
  const constructor = typedArrayConstructors[tag]
  if (constructor === undefined) {
    throw new TypeError(`${tag.slice(8, -1)} values cannot be cloned.`)
  }
  return new constructor(buffer, byteOffset, length)
}

export function isBoxedPrimitiveTag(tag: string): boolean {
  return tag === '[object BigInt]'
    || tag === '[object Boolean]'
    || tag === '[object Number]'
    || tag === '[object String]'
    || tag === '[object Symbol]'
}

export function isSharedArrayBuffer(value: object): value is SharedArrayBuffer {
  return typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer
}

export function isUnsupportedCloneTag(tag: string): boolean {
  return unsupportedCloneTags.has(tag)
}

function defineClonedProperty(
  source: object,
  target: object,
  key: PropertyKey,
  seen: WeakMap<object, object>,
  cloneValue: CloneValue,
): void {
  const descriptor = Object.getOwnPropertyDescriptor(source, key)
  if (descriptor === undefined) {
    return
  }

  if ('value' in descriptor) {
    descriptor.value = cloneValue(descriptor.value, seen)
  }
  Object.defineProperty(target, key, descriptor)
}

function isTypedArrayIndex(key: PropertyKey): boolean {
  if (typeof key !== 'string' || key === '') {
    return false
  }

  const index = Number(key)
  return Number.isInteger(index) && index >= 0 && String(index) === key
}

function preserveIntegrityLevel(source: object, target: object): void {
  if (Object.isFrozen(source)) {
    Object.freeze(target)
  }
  else if (Object.isSealed(source)) {
    Object.seal(target)
  }
  else if (!Object.isExtensible(source)) {
    Object.preventExtensions(target)
  }
}
