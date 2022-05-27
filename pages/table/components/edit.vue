<template>
  <el-dialog
    title=""
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="80%">
    <div class="edit">
      <el-form size="mini" :model="formFields" label-width="120px" label-position="top" :inline="true">
        <el-form-item v-for="item in fieldList" :prop="item.key">
          <span class="formLabel">{{item.name}}</span>
          <div v-if="item.key=='img'" class="block">
            <el-upload
              :data="dataObj"
              class="avatar-uploader"
              action="https://upload.qiniup.com/"
              :multiple="false"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="formFields[item.key]" :src="formFields[item.key]+'!icon.jpg'" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <MarkdownEditor v-if="item.key=='content'" v-model="content"></MarkdownEditor>
          <el-input v-if="item.key!='img'&&item.key!='content'" v-model="formFields[item.key]" placeholder="请输入名称"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm('formValidate')">确 定</el-button>
  </span>
    </div>
  </el-dialog>
</template>

<script>
  import { getQiniuKey, getQiniuToken } from '../../../api/qiniu'
  import MarkdownEditor from '../../../components/MarkdownEditor/index.vue'

  export default {
    name: 'addCategory',
    components: { MarkdownEditor },
    data() {
      return {
        formFields: {},
        content: '',
        dialogVisible: false,
        fieldList: '',
        formValidate: {
          name: '',
          description: '',
          img: ''
        },
        ruleValidate: {},
        dataObj: { token: '', key: '' },
        articleCategoryId: ''
      }
    },
    mounted() {
      this.getQiniuToken()
      this.getQiniuKey()
    },
    watch: {
      content(val) {

      }
    },

    methods: {
      //获取七牛token
      getQiniuToken() {
        getQiniuToken(this).then(res => {
          this.dataObj.token = res.data.content.upToken
        }).catch(error => {
          console.error(error.response)
        })
      },
      getQiniuKey() {
        getQiniuKey(this).then(res => {
          this.dataObj.key = res.data.content.key
        }).catch(error => {
          console.log(error.response)
        })
      },
      handleAvatarSuccess(res, file) {
        let img = 'https://qiniu.easyapi.com/' + res.key
        file.url = img
        this.formValidate.img = img
      },
      confirm(formName) {

      }
    }
  }
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }

  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }

  .edit {
    .el-form--inline .el-form-item {
      display: block;
    }
  }

  .el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    overflow-y: auto;
  }
</style>
<style scoped>
  /deep/ p img {
    display: block !important;
  }
</style>
