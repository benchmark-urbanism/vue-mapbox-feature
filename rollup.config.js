import buble from '@rollup/plugin-buble'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import vue from 'rollup-plugin-vue'
export default {
  input: 'src/main.js',
  external: ['es6-tween'],
  output: [
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.umd.js',
      format: 'umd',
      exports: 'default',
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.esm.js',
      format: 'esm',
      exports: 'default',
      globals: {
        'es6-tween': 'TWEEN'
      }
    },
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.min.js',
      format: 'iife',
      exports: 'default',
      globals: {
        'es6-tween': 'TWEEN'
      }
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true
    }),
    buble({
      transforms: { forOf: false },
      exclude: ['node_modules/**']
    })
  ]
}
