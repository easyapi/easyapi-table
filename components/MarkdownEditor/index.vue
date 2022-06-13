<template>
  <div>
    <editor initialEditType="wysiwyg" :options="editorOptions" @change="change" ref="toastuiEditor"/>
  </div>
</template>
<script>
  import defaultOptions from './default-options'
  import { getQiniuToken } from '../../api/qiniu'

  export default {
    name: 'MarkdownEditor',
    props: {
      value: {
        type: String,
        default: ''
      },
      ifChange: {
        type: Boolean,
        default: true
      },
      id: {
        type: String,
        required: false,
        default() {
          return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
        }
      },
      options: {
        type: Object,
        default() {
          return defaultOptions
        }
      },
      mode: {
        type: String,
        default: 'markdown'
      },
      height: {
        type: String,
        required: false,
        default: '300px'
      },
      language: {
        type: String,
        required: false,
        default: 'en_US' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
      }
    },
    data() {
      return {
        editor: null,
        qnToken: '',
        testData: 'testData',
        editorOptions: {
          previewStyle: 'vertical',
          hideModeSwitch: false,
          language: 'zh-CN',
          plugins: [this.codeSyntaxHighlight]
        }
      }
    },
    computed: {},
    watch: {
      value(newValue, preValue) {
        if (this.value !== '' && this.ifChange) {
          this.$refs.toastuiEditor.invoke('setHTML', this.value)
        }
        if (this.value == '' && this.ifChange) {
          this.$refs.toastuiEditor.invoke('setHTML', this.value)
        }
      },
      ifChange(val) {
        console.log(val)
      }
    },
    mounted() {
      this.initEditor()
      this.getqiniuToken()
    },
    methods: {
      change(e) {
        this.$emit('input', this.$refs.toastuiEditor.invoke('getHTML'))
      },
      initEditor() {
        let editor = this.$refs.toastuiEditor.invoke('getCurrentModeEditor')
        this.$refs.toastuiEditor.invoke('removeHook', 'addImageBlobHook')
        this.$refs.toastuiEditor.invoke('addHook', 'addImageBlobHook', (blob, callback) => {
          this.uploadFile(blob, url => {
            callback(url)
          })
          this.getqiniuToken()
        })
      },
      /*
       * 自定义上传图片处理
       * */
      uploadFile(e, callback) {
        const formData = new FormData()
        formData.append('file', e)
        formData.append('token', this.qnToken)
        this.$axios({
          method: 'post',
          url: 'https://upload.qiniup.com',
          data: formData
        })
          .then(res => {
            let imgUrl = 'https://qiniu.easyapi.com/' + res.data.key
            callback(imgUrl)
            // this.addImgToMd(imgUrl)
          })
          .catch(error => {
          })
        // target.value = ''
      },
      //添加图片到markdown
      addImgToMd(data) {
        // let editor = this.editor.getCodeMirror();
        // let editorHtml = this.editor.getCurrentModeEditor();
        // let isMarkdownMode = this.editor.isMarkdownMode();
        // if (isMarkdownMode) {
        //   editor.replaceSelection(`![img](${data})`);
        // } else {
        //   let range = editorHtml.getRange();
        //   let img = document.createElement("img");
        //   img.src = `${data}`;
        //   img.alt = "img";
        //   range.insertNode(img);
        // }
      },
      getqiniuToken() {
        getQiniuToken(this).then(res => {
          this.qnToken = res.data.content.upToken
        })
          .catch(error => {
          })
      }
    }
  }
</script>

<style lass="scss">
  .te-md-splitter {
    min-width: 100% !important;
  }

  .toastui-editor-defaultUI
  .toastui-editor-defaultUI-toolbar
  .toastui-editor-toolbar-group
  .toastui-editor-toolbar-icons {
    -webkit-transform: scale(0.8);
  }
</style>
