import { terser } from 'rollup-plugin-terser';

export default {
  input: "src/index.js",
  output: {
    file: "index.js",
    format: "cjs",
  },
  plugins: [
    terser(),
  ],
  external: ['path', 'fs', 'util',],
}
