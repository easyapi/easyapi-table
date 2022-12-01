import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('editor', Editor)
  vueApp.component('toolbar', Toolbar)
})