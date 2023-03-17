import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('Editor', Editor)
  vueApp.component('Toolbar', Toolbar)
})
