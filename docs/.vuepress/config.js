const { path } = require('@vuepress/utils')

module.exports = {
  base: '/vue-mapbox-feature/', // must match github pages publish URL
  title: 'vue-mapbox-feature',
  description: 'A Vue component for dynamic geojson on Mapbox GL JS maps!',
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
        componentsDir: path.resolve(__dirname, './components/'),
      },
    ],
  ],
}
