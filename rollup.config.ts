import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'

export default defineConfig({
  input: {
    async: './src/async/index.ts',
    immutable: './src/immutable/index.ts',
    index: './src/index.ts',
    object: './src/object/index.ts',
    path: './src/path/index.ts',
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    del({ hook: 'buildStart', targets: 'dist/*' }),
    typescript({
      declaration: true,
      declarationDir: 'dist',
      noEmitOnError: true,
      rootDir: 'src',
      sourceMap: true,
    }),
    terser({
      compress: true,
      format: { comments: false },
      mangle: true,
      module: true,
    }),
  ],
  preserveEntrySignatures: 'strict',
  treeshake: true,
})
