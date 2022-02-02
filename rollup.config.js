import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import vue from 'rollup-plugin-vue'

export default {
  input: 'src/main.js',
  external: ['anime'],
  output: [
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.umd.js',
      format: 'umd',
      exports: 'default',
    },
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.esm.js',
      format: 'esm',
      exports: 'default',
    },
    {
      name: 'VueMapboxFeature',
      file: 'dist/VueMapboxFeature.min.js',
      format: 'iife',
      exports: 'default',
    },
  ],
  plugins: [
    commonjs(),
    vue(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
}
