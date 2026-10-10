# Path

## `PathSegments`

```ts
type PathSegments = readonly string[]
```

Represents a non-empty sequence of property names used by the path APIs.

## `getPath`

```ts
getPath(source: unknown, segments: PathSegments): unknown
```

Reads a value through own properties only. Returns `undefined` when any path segment is missing.

## `hasPath`

```ts
hasPath(source: unknown, segments: PathSegments): boolean
```

Checks whether every path segment exists as an own property, including paths whose final value is `undefined`.

## `setPath`

```ts
setPath(
  target: Record<string, unknown>,
  segments: PathSegments,
  value: unknown,
): void
```

Mutates a plain object by assigning a value at a nested path. Missing or non-plain intermediate values are replaced with plain objects.

## `updatePath`

```ts
updatePath<TValue>(
  source: TValue,
  segments: PathSegments,
  value: unknown,
): TValue
```

Returns a new value with the nested path replaced. Changed plain-object containers are frozen, unchanged branches retain their original identity, and the replacement value is not cloned.

## Path validation

All path APIs require a non-empty array of non-empty string segments. The segments `__proto__`, `constructor`, and `prototype` are rejected with `TypeError`.
