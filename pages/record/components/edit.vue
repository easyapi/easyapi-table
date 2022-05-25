<template>
  <el-dialog
    :close-on-click-modal = "false"
    :title="title"
    :visible.sync="dialogVisible"
    width="30%">
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formValidate.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类描述" prop="description">
        <el-input v-model="formValidate.description" type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入分类描述..."></el-input>
      </el-form-item>
      <el-form-item label="分类图片" prop="img">
        <div class="block">
          <el-upload
            :data="dataObj"
            class="avatar-uploader"
            action="https://upload.qiniup.com/"
            :multiple="false"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="formValidate.img" :src="formValidate.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm('formValidate')">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import { getQiniuKey, getQiniuToken } from '../../../api/qiniu'
  import { createArticleCategory, updateArticleCategory } from '../../../api/article-category'

  export default {
    name: 'addCategory',
    data() {
      return {
        title: '',
        dialogVisible: false,
        formValidate: {
          name: '',
          description: '',
          img: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
          img: [
            { required: true, message: '请上传分类图片', trigger: 'change' }
          ]
        },
        dataObj: { token: '', key: '' },
        articleCategoryId: ''
      }
    },
    mounted() {
      this.getQiniuToken();
      this.getQiniuKey()
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
        let img = 'https://qiniu.easyapi.com/' + res.key;
        file.url = img;
        this.formValidate.img = img
      },
      confirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let data = {
              name: this.formValidate.name,
              description: this.formValidate.description,
              img: this.formValidate.img,
              appKey: sessionStorage.getItem('appKey'),
              appSecret: sessionStorage.getItem('appSecret')
            };
            if (this.title === '添加分类') {
              createArticleCategory(data, this).then(res => {
                if (res.data.code === 1) {
                  this.$message.success('添加成功!');
                  this.$parent.getArticleCategories();
                  this.dialogVisible = false
                  this.$refs[formName].resetFields()
                }
              }).catch(error => {
                console.log(error.response)
              })
            } else if (this.title === '编辑分类') {
              updateArticleCategory(this.articleCategoryId, data, this).then(res => {
                if (res.data.code === 1) {
                  this.$message.success('编辑成功!');
                  this.$parent.getArticleCategories();
                  this.dialogVisible = false;
                  this.$refs[formName].resetFields()
                }

              }).catch(error => {
                console.log(error.response)
              })
            }
          }
        })
      }
    }
  }
</script>

<style>
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
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>
