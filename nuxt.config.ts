import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const lifecycle = process.env.npm_lifecycle_event

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss',
    ['@pinia/nuxt', {
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
  components: true,
  vite: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        dts: true,
        resolvers: [
          ElementPlusResolver({
            importStyle: false,
          }),
        ],
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
