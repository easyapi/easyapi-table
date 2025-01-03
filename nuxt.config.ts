import path from 'node:path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const lifecycle = process.env.npm_lifecycle_event

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@element-plus/nuxt', ['@pinia/nuxt', {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      // automatically imports `defineStore` as `definePiniaStore`
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  }]],
  build: {
    transpile: lifecycle === 'build' ? ['element-plus'] : [],
  },
  css: ['~/assets/css/page.css'],
  hooks: {
    'pages:extend': function (routes) {
      routes.push({
        path: '/:teamUrl/:projectCode/:sheetCode',
        name: 'dataTable',
        file: '~/pages/sheetCode/index.vue',
      }, {
        path: '/access-token',
        name: 'accessToken',
        file: '~/pages/accessToken/index.vue',
      })
    },
  },
  components: true,
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'assets/svg')],
      }),
    ],
    build: {
      chunkSizeWarningLimit: 4096,
      rollupOptions: {
        output: {},
      },
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      accountUrl: process.env.NUXT_PUBLIC_ACCOUNT_URL,
    },
  },
})
