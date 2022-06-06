module.exports = {
  /*
  ** Headers of the page
  */
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          path: '/',
          name: 'index',
          component: resolve(__dirname, 'pages/index')
        },
        {
          path: '/:projectId/:sheetId',
          name: 'table',
          component: resolve(__dirname, 'pages/table')
        },
        {
          path: '/access-token',
          name: 'AccessToken',
          component: resolve(__dirname, 'pages/access-token')
        }
      )
    }
  },

  head: {
    title: '{{ name }} - EasyAPI数据表格',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{escape description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: []
  },
  css: [
    '@/assets/scss/common.scss',
    '@/assets/scss/element-variables.scss',
    'quill/dist/quill.snow.css',
    'quill/dist/quill.bubble.css',
    'quill/dist/quill.core.css'
  ],
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/axios',
    { src: '@/plugins/editor', ssr: false },
    { src: '@/plugins/nuxt-quill-plugin', ssr: false },
    { src: '@/plugins/codeSyntaxHighlight', ssr: false },
    { src: '@/plugins/commom.js', ssr: false }
  ],
  /*
  ** Customize the progress bar color
  */
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {},
  loading: {
    color: '#3B8070'
  },
  styleResources: {
    scss: './assets/scss/variables.scss'
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
    },
    maxChunkSize: 300000, // 单个包最大尺寸
    extractCSS: true // 单独提取CSS
  },
  server: {
    port: 3000
  }
}
