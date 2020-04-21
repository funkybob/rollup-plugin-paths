import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: "src/index.ts",
  output: {
    dir: '.',
    // file: "index.js",
    format: "cjs",
  },
  plugins: [
    typescript(),
    terser({
      ecma: 2016,
      module: true,
    }),
  ],
  external: ['path', 'fs', 'util',],
}
