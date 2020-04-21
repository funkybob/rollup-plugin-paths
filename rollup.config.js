import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'cjs',
    }
  ],
  plugins: [
    terser({
      ecma: 2016,
      module: true,
    }),
  ],
  external: ['fs', 'path', 'util'],
}
