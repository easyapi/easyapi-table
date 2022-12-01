<script setup lang="ts">
import { defineExpose, reactive, watch, shallowRef, ref } from 'vue'
import { ElMessage } from 'element-plus'
import AssociationTable from './association-table.vue'
import { qiniu } from '@/api/qiniu'
import { table } from '@/api/table'

const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }
const tableChild = ref<InstanceType<typeof AssociationTable>>()

defineExpose({
  getParentData
})

const state = reactive({
  formFields: {
    img: [] as any,
    content: '',
    video: [] as any,
    building: '',
    imgs: [] as any
  },
  fileList: [] as any, // 图片回显
  disabled: false,
  content: '',
  title: '',
  dialogVisible: false,
  fieldList: '',
  teamUrl: '',
  projectCode: '',
  sheetCode: '', // 服务商
  recordId: '',
  dataObj: { token: '', key: '' },
  videoFlag: false, // 是否显示进度条
  videoUploadPercent: 0, // 进度条的进度，
  isShowUploadVideo: false, // 显示上传按钮
  name: '', // 关联表选中的名字,
  key: '', // 记录关联表数据
  list: [] as any,
  mode: 'default'
})

function handleClose(idx: any, key: any) {
  state.formFields[key].splice(idx, 1)
}

function handleCreated(editor: any) {
  editorRef.value = editor
}

function getKeyAndToken() {
  getQiniuToken()
  getQiniuKey()
}

function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
  state.fieldList = data.fieldList
  state.title = data.title
  state.recordId = data.recordId
  state.teamUrl = data.teamUrl
  state.projectCode = data.projectCode
  state.sheetCode = data.sheetCode
  setTimeout(() => {
    state.formFields = data.formFields
  }, 100)
}
/**
 * 获取七牛token
 */
function getQiniuToken() {
  qiniu.getQiniuToken().then(res => {
    state.dataObj.token = res.content.upToken
  })
}
function getQiniuKey() {
  qiniu.getQiniuKey().then(res => {
    state.dataObj.key = res.content.key
  })
}
function beforeUploadVideo(file: any) {
  getQiniuToken()
  getQiniuKey()
  const fileSize = file.size / 1024 / 1024 < 50 // 控制大小  修改50的值即可
  if (
    !['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov'].includes(file.type) // 控制格式
  ) {
    ElMessage({
      type: 'error',
      message: '请上传正确的视频格式'
    })
    return false
  }
  if (!fileSize) {
    ElMessage({
      type: 'error',
      message: '视频大小不能超过50MB'
    })
    return false
  }
  state.isShowUploadVideo = false
}
/**
 * 展示关联表
 */
function showTable(val: any, formFields: any) {
  state.key = val
  tableChild.value?.getParentData({
    dialogVisible: true,
    teamUrl: state.teamUrl,
    projectCode: state.projectCode,
    sheetId: formFields.property.sheet_id
  })
}

function getItem(data: any) {
  if (!state.formFields[state.key]) {
    state.formFields[state.key] = []
    state.formFields[state.key].push(data)
  } else {
    if (state.formFields[state.key].filter((x: any) => x.recordId == data.recordId).length == 0) {
      state.formFields[state.key].push(data)
    }
  }
}
/**
 * 进度条
 */
function uploadVideoProcess(event: any, file: any, fileList: any) {
  // 注意在data中添加对应的变量名
  state.videoFlag = true
  state.videoUploadPercent = file.percentage.toFixed(0) * 1
}
/**
 * 上传成功回调
 */
function handleVideoSuccess(res: any, file: any) {
  state.isShowUploadVideo = true
  state.videoFlag = false
  state.videoUploadPercent = 0
  const video = `https://qiniu.easyapi.com/${res.key}`
  state.formFields.video = video
}
function handleAvatarSuccess(res: any, file: any) {
  const img = `https://qiniu.easyapi.com/${res.key}`
  file.url = img
  const obj = {
    url: img
  }
  state.formFields.imgs.push(obj)
}
function handleRemove(res: any, file: any) {
  state.formFields.imgs.splice(state.formFields.imgs.findIndex((item: any) => item.url === res.url))
}
function close() {
  state.formFields = {} as any
}
function confirm(formName: any) {
  if (state.title === '新增') {
    const list = []
    const obj = {}
    const data = {
      ...state.formFields
    }
    obj.fields = data
    obj.fields[state.key]
      ? (obj.fields[state.key] = obj.fields[state.key].map((item: any) => {
          return item.recordId
        }))
      : ''
    list.push(obj)
    table.creatRecord(list, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
      if (res.code === 1) {
        state.dialogVisible = false
        ElMessage({
          type: 'success',
          message: '添加成功'
        })
      }
    })
  } else {
    const list = []
    const obj = {}
    const data = {
      ...state.formFields
    }
    obj.fields = data
    if (state.key) {
      obj.fields[state.key] = obj.fields[state.key].map((item: any) => {
        return item.recordId
      })
    }
    obj.recordId = state.recordId
    list.push(obj)
    table.updateRecord(list, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
      if (res.code === 1) {
        state.dialogVisible = false
        ElMessage({
          type: 'success',
          message: '修改成功'
        })
      }
    })
  }
}

watch(
  () => state.dialogVisible,
  value => {
    if (value) {
      for (const a of state.fieldList) {
        if (a.type === '关联表') state.key = a.key
      }
    }
  },
  { deep: true }
)

watch(
  () => state.formFields.img,
  value => {
    if (value == null) state.formFields.imgs = []
  },
  { deep: true }
)

watch(
  () => state.formFields.video,
  value => {
    if (value == null) state.formFields.video = []
  },
  { deep: true }
)

watch(
  () => state.formFields.video,
  value => {
    if (value) state.fileList = value.img
  },
  { deep: true }
)
</script>

<template>
  <div>
    <el-dialog
      v-model="state.dialogVisible"
      :title="state.title"
      :close-on-click-modal="false"
      :append-to-body="true"
      custom-class="edit-dialog"
      width="80%"
      @close="close">
      <div class="edit">
        <el-form ref="form" :model="state.formFields" label-width="100px" :inline="true">
          <el-form-item v-for="item in state.fieldList" :key="item" :prop="item.key" :label="`${item.name}:`">
            <!-- 图片 -->
            <div v-if="item.type === '附件'" class="block">
              <div @click="getKeyAndToken">
                <el-upload
                  :data="state.dataObj"
                  action="https://upload.qiniup.com/"
                  :on-success="handleAvatarSuccess"
                  list-type="picture-card"
                  :file-list="fileList"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus" />
                </el-upload>
              </div>
            </div>
            <!-- 视频 -->
            <div v-if="item.type === '视频'" class="block">
              <el-upload
                class="avatar-uploader"
                action="https://upload.qiniup.com/"
                :data="state.dataObj"
                :on-progress="uploadVideoProcess"
                :on-success="handleVideoSuccess"
                :before-upload="beforeUploadVideo"
                :show-file-list="false">
                <video v-if="state.formFields.video" :src="state.formFields.video" class="video video-avatar" controls="controls">
                  您的浏览器不支持视频播放
                </video>
                <i v-else class="el-icon-plus video-uploader-icon" />
              </el-upload>
            </div>
            <!-- 富文本 -->
            <div v-if="item.type === '富文本'" style="border: 1px solid #ccc">
              <toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="state.mode" />
              <editor style="height: 300px" v-model="state.formFields[item.key]" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
            </div>
            <!-- <MarkdownEditor v-if="item.type === '富文本'" v-model="state.formFields[item.key]"></MarkdownEditor> -->
            <!-- 单行文本 -->
            <el-input v-if="item.type === '单行文本'" v-model="state.formFields[item.key]" placeholder="请输入内容" />
            <!-- 多行文本 -->
            <el-input v-if="item.type === '多行文本'" v-model="state.formFields[item.key]" type="textarea" :rows="4" placeholder="请输入内容" />
            <!-- 数字 -->
            <el-input v-if="item.type === '数字'" v-model="state.formFields[item.key]" placeholder="请输入内容" />
            <!-- 关联表 -->
            <div v-if="item.type === '关联表'">
              <el-tag
                v-for="(about, cindex) in state.formFields[item.key]"
                :key="cindex"
                class="mr-2"
                type="info"
                closable
                @close="handleClose(cindex, item.key)">
                {{ about.tag }}
              </el-tag>
              <el-tag class="cursor-pointer" type="info" @click="showTable(item.key, item)">+添加</el-tag>
            </div>
            <!-- 单选 -->
            <el-select v-if="item.type === '单选'" v-model="state.formFields[item.key]">
              <el-option v-for="item in item.property.options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- 日期 -->
            <el-date-picker v-if="item.type === '日期'" v-model="state.formFields[item.key]" type="datetime" placeholder="选择日期时间" />
            <!-- 电话 -->
            <el-input v-if="item.type === '电话'" v-model="state.formFields[item.key]" type="number" placeholder="请输入号码" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="state.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </template>
    </el-dialog>
    <AssociationTable ref="tableChild" @getItem="getItem" />
  </div>
</template>

<style>
.edit-dialog .border {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.edit-dialog .el-upload--picture-card {
  width: 60px;
  height: 60px;
}

.edit-dialog .el-upload--picture-card i {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 20px;
  position: relative;
  top: -38px;
}

.edit-dialog .el-upload-list--picture-card .el-upload-list__item {
  width: 60px;
  height: 60px;
}

.edit-dialog .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.edit-dialog .avatar-uploader .el-upload {
  display: flex;
}

.edit-dialog .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.edit-dialog .avatar {
  width: 60px;
  height: 60px;
  display: block;
}

.edit-dialog .edit .el-form--inline .el-form-item {
  display: flex;
}

.edit-dialog .el-dialog {
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

.edit-dialog .video-uploader-icon {
  border: 1px dashed #d9d9d9 !important;
}

.edit-dialog .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.edit-dialog .video-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.edit-dialog .video {
  width: 300px;
  height: 178px;
  display: block;
}
.edit-dialog .el-input,
.edit-dialog .el-textarea__inner {
  width: 300px !important;
}
</style>

<style scoped>
p img {
  display: block !important;
}

.tag {
  cursor: pointer;
}
</style>
