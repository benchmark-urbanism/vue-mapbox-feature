import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import pkg from './package.json' // import names from package to reduce errors

// see https://github.com/rollup/rollup-starter-lib/blob/buble/rollup.config.js
export default {
  input: 'src/index.js',
  external: [ 'es6-tween' ],
  output: [
    {
      name: 'VueMapboxMap',
      file: pkg.browser,
      format: 'umd', // browser friendly UMD build
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    {
      name: 'VueMapboxFeature',
      file: pkg.main,
      format: 'cjs', // CommonJS (for Node)
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    {
      name: 'VueMapboxFeature',
      file: pkg.module,
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
    })
  ]
}
