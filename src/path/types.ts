/** Resolves the value accepted when writing to a statically known path. */
export type PathInputValue<TSource, TSegments extends PathSegments>
  = TSegments extends readonly [infer Head extends string, ...infer Rest extends PathSegments]
    ? PathInputValue<PathInputSegmentValue<TSource, Head>, Rest>
    : TSegments extends readonly []
      ? TSource
      : unknown

/** String segments used to access nested object properties. */
export type PathSegments = readonly string[]

/** Resolves the result shape after replacing a statically known path. */
export type PathUpdate<
  TSource,
  TSegments extends PathSegments,
  TValue,
> = TSegments extends readonly [infer Head extends string, ...infer Rest extends PathSegments]
  ? UpdatePathSegment<TSource, Head, Rest, TValue>
  : TSegments extends readonly []
    ? TValue
    : TSource

/** Resolves the value reached by a statically known path. */
export type PathValue<TSource, TSegments extends PathSegments>
  = TSegments extends readonly [infer Head extends string, ...infer Rest extends PathSegments]
    ? PathValue<PathSegmentValue<TSource, Head>, Rest>
    : TSegments extends readonly []
      ? TSource
      : unknown

type ArraySegmentValue<TArray extends readonly unknown[], TSegment extends string>
  = TSegment extends 'length'
    ? TArray['length']
    : TSegment extends `${number}`
      ? TSegment extends keyof TArray
        ? TArray[TSegment]
        : TArray[number]
      : unknown

type PathInputSegmentValue<TValue, TSegment extends string>
  = unknown extends TValue
    ? unknown
    : TValue extends null | undefined
      ? unknown
      : TValue extends readonly unknown[]
        ? ArraySegmentValue<TValue, TSegment>
        : TValue extends object
          ? TSegment extends keyof TValue
            ? TValue[TSegment]
            : unknown
          : unknown

type PathSegmentValue<TValue, TSegment extends string>
  = unknown extends TValue
    ? unknown
    : TValue extends null | undefined
      ? undefined
      : TValue extends readonly unknown[]
        ? ArraySegmentValue<TValue, TSegment>
        : TValue extends object
          ? TSegment extends keyof TValue
            ? TValue[TSegment]
            : unknown
          : undefined

type UpdatePathSegment<
  TSource,
  THead extends string,
  TSegments extends PathSegments,
  TValue,
> = TSource extends object
  ? {
      [Key in keyof TSource | THead]: Key extends THead
        ? PathUpdate<PathInputSegmentValue<TSource, THead>, TSegments, TValue>
        : Key extends keyof TSource
          ? TSource[Key]
          : never
    }
  : TSource
