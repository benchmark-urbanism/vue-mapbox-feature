import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import pkg from './package.json' // import names from package to reduce errors

// see https://github.com/rollup/rollup-starter-lib/blob/buble/rollup.config.js
export default [
  // browser friendly UMD build
  {
    input: 'src/index.js',
    external: [ 'es6-tween' ],
    output: {
      name: 'VueMapboxFeature',
      file: pkg.browser,
      format: 'umd',
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    plugins: [
      vue({
        compileTemplate: true, // true by default
        css: true
      }),
      buble({
        exclude: ['node_modules/**'],
        transforms: {
          dangerousForOf: true
        }
      })
    ]
  },
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.js',
    external: [ 'es6-tween' ], // suppresses warnings about external modules
    output: [
      {
        name: 'VueMapboxFeature',
        file: pkg.main,
        format: 'cjs',
        globals: {
          'es6-tween': 'TWEEN'
        }
      },
      {
        name: 'VueMapboxFeature',
        file: pkg.module,
        format: 'es',
        globals: {
          'es6-tween': 'TWEEN'
        }
      }
    ],
    plugins: [
      vue({
        compileTemplate: true, // true by default
        css: true
      }),
      buble({
        exclude: ['node_modules/**'],
        transforms: {
          dangerousForOf: true
        }
      })
    ]
  }
]
