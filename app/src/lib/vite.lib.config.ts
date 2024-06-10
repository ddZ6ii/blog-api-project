import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    // Prevents 'assets' and 'styles' folders to be added.
    copyPublicDir: false,
    emptyOutDir: true,
    outDir: resolve(__dirname, '..', '..', 'public', 'scripts'),
    minify: false,
    lib: {
      // Multiple entry points will create multiple output files in lib mode.
      entry: [resolve(__dirname, 'index.ts'), resolve(__dirname, 'modify.ts')],
      name: 'MyLib',
      // Export modules in ESM format only (.js, not .cjs or .mjs).
      formats: ['es'],
    },
    rollupOptions: {
      // Customize output file names (no hash).
      output: {
        entryFileNames: `[name].js`,
      },
      // Make sure to externalize deps that shouldn't be bundled into your library.
      // See: https://vitejs.dev/guide/build.html#library-mode
    },
  },
  resolve: {
    alias: {
      '@lib': resolve(__dirname),
    },
  },
  plugins: [
    // Allow for TS types imports.
    dts({
      include: ['debounce.type.ts', 'form.type.ts', 'post.type.ts'],
    }),
  ],
});
