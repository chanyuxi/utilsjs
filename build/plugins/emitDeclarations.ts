import type { Plugin } from 'rollup'

import fs from 'node:fs/promises'
import path from 'node:path'

interface IDeclaration {
  name: string
  path: string
}

export default function emitDeclarations(declarations: IDeclaration[]): Plugin {
  return {
    async generateBundle() {
      const importees: string[] = []

      for (const declaration of declarations) {
        const source = await fs.readFile(path.resolve(declaration.path), 'utf8')
        importees.push(declaration.name)

        this.emitFile({
          fileName: `${declaration.name}.d.ts`,
          source,
          type: 'asset',
        })
      }

      this.emitFile({
        fileName: 'index.d.ts',
        source: importees.reduce((content, importee) => (content += `export * from "./${importee}";\n`), ''),
        type: 'asset',
      })
    },
    name: 'rollup-plugin-emit-declarations',
  }
}
