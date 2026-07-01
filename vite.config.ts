import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const shared = {
  cacheDir: '.vite-cache',
};

export default defineConfig(({ mode }) => {
  if (mode === 'docs') {
    return {
      ...shared,
      build: {
        outDir: 'docs',
        emptyOutDir: true,
      },
    };
  }

  return {
    ...shared,
    publicDir: false,
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'DataChart',
        formats: ['es'],
        fileName: 'data-chart',
      },
      outDir: 'lib',
      emptyOutDir: true,
      minify: true,
      target: 'es2020',
      reportCompressedSize: true,
    },
  };
});
