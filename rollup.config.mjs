import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import vue from 'rollup-plugin-vue'

const rep = replace({
  values: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  preventAssignment: true,
})
const ts = typescript({
  tsconfigOverride: {
    compilerOptions: {
      declaration: true,
    },
    include: null,
  },
})
export default [
  {
    input: 'src/main.ts',
    external: ['vue', 'animejs'],
    output: {
      format: 'esm',
      file: 'dist/VueMapboxFeature.esm.js',
    },
    plugins: [rep, ts, commonjs(), nodeResolve(), vue()],
  },
  // SSR build.
  {
    input: 'src/main.ts',
    external: ['vue', 'animejs'],
    output: {
      format: 'cjs',
      file: 'dist/VueMapboxFeature.ssr.js',
      exports: 'default',
    },
    plugins: [rep, ts, commonjs(), nodeResolve(), vue({ template: { optimizeSSR: true } })],
  },
  // Browser build.
  {
    input: 'src/main.ts',
    output: {
      format: 'iife',
      file: 'dist/VueMapboxFeature.min.js',
      exports: 'default',
      name: 'VueMapboxFeature',
    },
    plugins: [rep, ts, commonjs(), nodeResolve(), vue()],
  },
]
