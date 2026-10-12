# Path

## `PathSegments`

```ts
type PathSegments = readonly string[]
```

Represents a non-empty sequence of property names used by the path APIs.

`PathValue`, `PathInputValue`, and `PathUpdate` are also exported for reusable
type-level path inference.

## `getPath`

```ts
getPath<TSource, TSegments extends PathSegments>(
  source: TSource,
  segments: TSegments,
): PathValue<TSource, TSegments> | undefined
```

Reads a value through own properties only. Literal paths infer the returned value; dynamic paths use `unknown`. Returns `undefined` when any path segment is missing.

## `hasPath`

```ts
hasPath<TSource, TSegments extends PathSegments>(
  source: TSource,
  segments: TSegments,
): boolean
```

Checks whether every path segment exists as an own property, including paths whose final value is `undefined`.

## `setPath`

```ts
setPath<TTarget extends object, TSegments extends PathSegments>(
  target: TTarget,
  segments: TSegments,
  value: PathInputValue<TTarget, TSegments>,
): void
```

Mutates a plain object by assigning a value at a nested path. Missing or non-plain intermediate values are replaced with plain objects.

## `updatePath`

```ts
updatePath<TSource extends object, TSegments extends PathSegments, TValue>(
  source: TSource,
  segments: TSegments,
  value: TValue,
): PathUpdate<TSource, TSegments, TValue>
```

Returns a new value with the nested path replaced. The result shape is inferred for literal paths. Changed plain-object containers are frozen, unchanged branches retain their original identity, and the replacement value is not cloned.

## Path validation

All path APIs require a non-empty array of non-empty string segments. The segments `__proto__`, `constructor`, and `prototype` are rejected with `TypeError`.
