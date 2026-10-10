# Immutable

## `cloneAndFreeze`

```ts
cloneAndFreeze<TValue>(value: TValue, path?: string): TValue
```

Deep-clones and recursively freezes primitive values, arrays, and plain objects. Unsupported object types and unsafe object keys throw `TypeError`.
