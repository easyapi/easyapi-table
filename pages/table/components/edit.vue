<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    @close="close"
    width="80%">
    <div class="edit">
      <el-form ref="form" size="mini" :model="formFields" label-width="120px" label-position="top" :inline="true">
        <el-form-item v-for="item in fieldList" :prop="item.key">
          <span class="formLabel">{{ item.name }}</span>
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
          <div v-if="item.type=='附件'&&item.key=='video'" class="block">
            <el-upload
              class="avatar-uploader"
              action="https://upload.qiniup.com/"
              :data="dataObj"
              :on-progress="uploadVideoProcess"
              :on-success="handleVideoSuccess"
              :before-upload="beforeUploadVideo"
              :show-file-list="false"
              :headers="headers"
            >
              <video
                v-if="formFields[item.key] != '' && !videoFlag"
                :src="formFields[item.key]"
                class="video video-avatar"
                controls="controls">
                您的浏览器不支持视频播放
              </video>
              <i v-else-if="formFields[item.key] == '' && !videoFlag"
                 class="el-icon-plus video-uploader-icon"
              ></i>
              <el-progress v-if="videoFlag == true" type="circle"
                           v-bind:percentage="videoUploadPercent"
                           style="margin-top: 7px"></el-progress>
            </el-upload>
          </div>
          <MarkdownEditor :ifChange="ifChange" v-if="item.key=='content'"
                          v-model="formFields[item.key]"></MarkdownEditor>
          <el-input v-if="item.type=='单行文本'" v-model="formFields[item.key]" placeholder="请输入名称"/>
          <el-input v-if="item.type=='数字'" v-model="formFields[item.key]" placeholder="请输入名称"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirm()">确 定</el-button>
  </span>
    </div>
  </el-dialog>
</template>

<script>
  import { getQiniuKey, getQiniuToken } from '../../../api/qiniu'
  import { creatRecord, updateRecord } from '../../../api/table'
  import MarkdownEditor from '../../../components/MarkdownEditor/index.vue'

  export default {
    name: 'addCategory',
    components: { MarkdownEditor },
    data() {
      return {
        formFields: {
          img: '',
          content: ''
        },
        title: '',
        dialogVisible: false,
        fieldList: '',
        sheetId: '',//服务商
        ifChange: '',
        recordId: '',
        dataObj: { token: '', key: '' },
        videoFlag: false, //是否显示进度条
        videoUploadPercent: '', //进度条的进度，
        isShowUploadVideo: false //显示上传按钮
      }
    },
    mounted() {
      this.getQiniuToken()
      this.getQiniuKey()
    },
    watch: {
      'formFields.content'(val) {
        console.log(val)
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
      beforeUploadVideo(file) {
        var fileSize = file.size / 1024 / 1024 < 50   //控制大小  修改50的值即可
        if (
          [
            'video/mp4',
            'video/ogg',
            'video/flv',
            'video/avi',
            'video/wmv',
            'video/rmvb',
            'video/mov'
          ].indexOf(file.type) == -1     //控制格式
        ) {
          layer.msg('请上传正确的视频格式')
          return false
        }
        if (!fileSize) {
          layer.msg('视频大小不能超过50MB')
          return false
        }
        this.isShowUploadVideo = false
      },
      //进度条
      uploadVideoProcess(event, file, fileList) {    //注意在data中添加对应的变量名
        this.videoFlag = true
        this.videoUploadPercent = file.percentage.toFixed(0) * 1
      },
      //上传成功回调
      handleVideoSuccess(res, file) {
        this.isShowUploadVideo = true
        this.videoFlag = false
        this.videoUploadPercent = 0

        console.log(res)
        //后台上传数据
        if (res.success == true) {
          this.videoForm.showVideoPath = res.data.url    //上传成功后端返回视频地址 回显
        } else {
          this.$message.error('上传失败！')
        }
      },
      handleAvatarSuccess(res, file) {
        let img = 'https://qiniu.easyapi.com/' + res.key
        file.url = img
        this.formFields.img = img
      }
      ,
      close() {
        this.formFields = {}
      }
      ,
      confirm(formName) {
        if (this.title === '新增') {
          let list = []
          let obj = {}
          let data = {
            ...this.formFields
          }
          obj.fields = data
          list.push(obj)
          creatRecord(list, this.sheetId, this).then(res => {
            if (res.data.code === 1) {
              this.$parent.getRecordList()
              this.dialogVisible = false
            }
          })
        } else {
          let list = []
          let obj = {}
          let data = {
            ...this.formFields
          }
          obj.fields = data
          obj.recordId = this.recordId
          list.push(obj)
          updateRecord(list, this.sheetId, this).then(res => {
            if (res.data.code === 1) {
              this.$parent.getRecordList()
              this.dialogVisible = false
              this.$message.success('修改成功')
            }
          })
        }
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

  .video-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .avatar-uploader .el-upload:hover {
    border: 1px dashed #d9d9d9 !important;
    border-color: #409eff;
  }

  .video-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .video {
    width: 300px;
    height: 178px;
    display: block;
  }
</style>
<style scoped>
  /deep/ p img {
    display: block !important;
  }
</style>
