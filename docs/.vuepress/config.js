const { path } = require('@vuepress/utils')

module.exports = {
  base: '/vue-mapbox-feature/', // must match github pages publish URL
  title: 'vue-mapbox-feature',
  description: 'A Vue component for dynamic geojson on Mapbox GL JS maps!',
  // need to load these for mapbox maps
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css',
      },
    ],
    [
      'script',
      {
        src: 'https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js',
      },
    ],
  ],
  bundler: '@vuepress/bundler-vite',
  markdown: {
    anchor: true,
  },
  theme: '@vuepress/default',
  themeConfig: {
    home: '/',
    navbar: [],
    darkMode: true,
    repo: 'https://github.com/benchmark-urbanism/vue-mapbox-feature',
    repoLabel: 'github',
    sidebar: 'auto',
    sidebarDepth: 1,
    docsDir: 'docs',
    docsBranch: 'gh-pages',
    themePlugins: {
      activeHeaderLinks: true,
      backToTop: true,
    },
  },
  plugins: [
    [
      '@vuepress/register-components',
      {
        components: {
          Demo: path.resolve(__dirname, './components/Demo.vue'),
        },
      },
    ],
  ],
}
