// Source: https://dev.to/rxliuli/developing-and-building-nodejs-applications-with-vite-311n

import { Plugin } from 'vite';
import path from 'path';
import MagicString from 'magic-string';
import { nodeExternals } from 'rollup-plugin-node-externals';

function shims(): Plugin {
  return {
    name: 'node-shims',
    renderChunk(code, chunk) {
      if (!chunk.fileName.endsWith('.js')) {
        return null;
      }
      const s = new MagicString(code);
      s.prepend(`
   import __path from 'path';
   import { fileURLToPath as __fileURLToPath } from 'url';
   import { createRequire as __createRequire } from 'module';

   const __getFilename = () => __fileURLToPath(import.meta.url);
   const __getDirname = () => __path.dirname(__getFilename());
   const __dirname = __getDirname();
   const __filename = __getFilename();
   const self = globalThis;
   const require = __createRequire(import.meta.url);
   `);
      return {
        code: s.toString(),
        map: s.generateMap({ hires: true }),
      };
    },
    apply: 'build',
  };
}

function externals(): Plugin {
  return {
    ...nodeExternals({
      // Options here if needed
    }),
    name: 'node-externals',
    enforce: 'pre', // The key is to run it before Vite's default dependency resolution plugin
    apply: 'build',
  };
}

function config(options?: { entry?: string }): Plugin {
  const entry = options?.entry ?? 'app.ts';
  return {
    name: 'node-config',
    config() {
      return {
        build: {
          lib: {
            entry: path.resolve(entry),
            formats: ['es'],
            fileName: (format) =>
              `${path.basename(entry, path.extname(entry))}.${format}.js`,
          },
          rollupOptions: {
            external: ['dependencies-to-exclude'],
            // Additional Rollup options here
          },
        },
        resolve: {
          // Change default resolution to node rather than browser
          mainFields: ['module', 'jsnext:main', 'jsnext'],
          conditions: ['node'],
        },
      };
    },
    apply: 'build',
  };
}

export function node(): Plugin[] {
  return [shims(), externals(), config()];
}
