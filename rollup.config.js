import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import { terser } from 'rollup-plugin-terser'

// see https://github.com/rollup/rollup-starter-lib/blob/buble/rollup.config.js
export default {
  input: 'src/main.js',
  external: ['es6-tween'],
  output: [
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.umd.js',
      format: 'umd', // browser friendly UMD build
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.common.js',
      format: 'cjs', // CommonJS (for Node)
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.esm.js',
      format: 'es', // ES module (for bundlers)
      globals: {
        'es6-tween': 'TWEEN'
      }
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    vue({
      css: true
    }),
    buble({
      transforms: { forOf: false },
      exclude: ['node_modules/**']
    }),
    terser()
  ]
}
