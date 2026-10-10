<p align="center">
  <img src="./assets/images/github_banner_image.png" alt="@chanyuxi/utilsjs" width="100%" />
</p>

# @chanyuxi/utils

A small, TypeScript-first collection of dependency-free JavaScript utilities for everyday application development.

## Source structure

```text
src/
  async/
    index.ts       Promise-like value helpers
  immutable/
    index.ts       Clone-and-freeze helpers for plain data
  object/
    index.ts       Plain-object checks and shallow comparisons
  path/
    index.ts       Safe nested object path operations
  index.ts         Public package entry point
```

Each directory owns one narrowly defined utility boundary. The root entry point
re-exports the public API, while subpath exports are available for consumers
that want to import a single module.

## Public modules

```ts
import { cloneAndFreeze, getPath, shallowEqual } from '@chanyuxi/utils'
import { updatePath } from '@chanyuxi/utils/path'
```

- `@chanyuxi/utils/async` — Promise-like detection.
- `@chanyuxi/utils/immutable` — Deep cloning and freezing of plain data.
- `@chanyuxi/utils/object` — Plain-object checks and shallow equality.
- `@chanyuxi/utils/path` — Safe nested path reads and updates.

## Development

```bash
pnpm lint
pnpm typecheck
pnpm build
```

The Rollup build emits one entry per public module, declaration files, source
maps, and minified ES modules.
