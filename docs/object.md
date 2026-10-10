# Object

## `isPlainObject`

```ts
isPlainObject(value: unknown): value is Record<string, unknown>
```

Checks whether a value is backed by `Object.prototype` or a null prototype. Arrays, built-in objects, and class instances are not considered plain objects.

## `shallowEqual`

```ts
shallowEqual(left: object, right: object): boolean
```

Compares own enumerable properties using `Object.is`. Nested values are compared by identity rather than recursively.
