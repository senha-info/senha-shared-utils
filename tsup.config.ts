import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'v1/index': 'src/v1/index.ts',
    'v2/index': 'src/v2/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'lib',
});
