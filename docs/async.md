# Async

## `isPromiseLike`

```ts
isPromiseLike(value: unknown): value is PromiseLike<unknown>
```

Checks whether a value exposes a callable `then` method. Native promises and third-party thenables are supported.
