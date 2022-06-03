import Vue from 'vue'
import Prism from 'prismjs'
import codeSyntaxHighlight
  from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js'

import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-clojure.js'
import 'github-markdown-css/github-markdown.css'

import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'


Vue.prototype.codeSyntaxHighlight = [codeSyntaxHighlight, {highlighter: Prism}]
