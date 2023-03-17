<script setup lang="ts">
import { defineExpose, reactive, ref, shallowRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AssociationTable from './association-table.vue'
import { qiniu } from '@/api/qiniu'
import { table } from '@/api/table'
import { sheet } from '@/api/sheet'

const emit = defineEmits(['getList'])
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: any) {
        const {
          content: { upToken },
        } = await qiniu.getQiniuToken()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('token', upToken)
        const { key } = await qiniu.uploadFiles(formData)
        const url = `https://qiniu.easyapi.com/${key}`
        insertFn(url)
      },
    },
  },
}
const tableChild = ref<InstanceType<typeof AssociationTable>>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
defineExpose({
  getParentData,
})

const state = reactive({
  formFields: {},
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
  mode: 'default',
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

async function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
  state.fieldList = data.fieldList
  state.title = data.title
  state.recordId = data.recordId
  state.teamUrl = data.teamUrl
  state.projectCode = data.projectCode
  state.sheetCode = data.sheetCode
  if (state.title === '编辑') {
    const relevanceData = data.fieldList.find((item: any) => {
      return item.type === '关联表'
    })
    if (relevanceData && data.formFields[relevanceData.key] && data.formFields[relevanceData.key].length > 0) {
      const { content: { fields } } = await sheet.getSheetById({}, state.teamUrl, state.projectCode, relevanceData.property.sheet_id)
      if (fields && fields.length > 0) {
        data.formFields[relevanceData.key].forEach((item: any) => {
          item.tag = item.fields[fields[0].key]
        })
      }
    }
  }
  setTimeout(() => {
    state.formFields = data.formFields
  }, 100)

  data.fieldList.forEach((item: any) => {
    if (item.type === '附件')
      state.fileList = data.formFields[item.key]
  })
}
/**
 * 获取七牛token
 */
function getQiniuToken() {
  qiniu.getQiniuToken().then((res) => {
    state.dataObj.token = res.content.upToken
  })
}
function getQiniuKey() {
  qiniu.getQiniuKey().then((res) => {
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
      message: '请上传正确的视频格式',
    })
    return false
  }
  if (!fileSize) {
    ElMessage({
      type: 'error',
      message: '视频大小不能超过50MB',
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
    sheetId: formFields.property.sheet_id,
  })
}

function getItem(data: any) {
  if (!state.formFields[state.key]) {
    state.formFields[state.key] = []
    state.formFields[state.key].push(data)
  } else {
    if (state.formFields[state.key].filter((x: any) => x.recordId === data.recordId).length === 0)
      state.formFields[state.key].push(data)
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
function handleVideoSuccess(key: any, res: any, file: any) {
  state.isShowUploadVideo = true
  state.videoFlag = false
  state.videoUploadPercent = 0
  const video = `https://qiniu.easyapi.com/${res.key}`
  state.formFields[key] = video
}
function handleAvatarSuccess(key: any, res: any, file: any) {
  const img = `https://qiniu.easyapi.com/${res.key}`
  file.url = img
  const obj = {
    url: img,
  }
  if (!state.formFields[key])
    state.formFields[key] = []

  state.formFields[key].push(obj)
}
function handleRemove(key: any, res: any, file: any) {
  state.formFields[key].splice(state.formFields[key].findIndex((item: any) => item.url === res.url))
}
function handlePictureCardPreview(uploadFile: any) {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
function close() {
  state.formFields = {} as any
}
function confirm(formName: any) {
  if (state.title === '新增') {
    const list = []
    const obj = { fields: {} }
    const data = {
      ...state.formFields,
    }
    obj.fields = data
    obj.fields[state.key]
      ? (obj.fields[state.key] = obj.fields[state.key].map((item: any) => {
          return item.recordId
        }))
      : ''
    list.push(obj)
    table.creatRecord(list, state.teamUrl, state.projectCode, state.sheetCode).then((res) => {
      if (res.code === 1) {
        state.dialogVisible = false
        ElMessage({
          type: 'success',
          message: '添加成功',
        })
        emit('getList')
      }
    })
  } else {
    const list = []
    const obj = { fields: {}, recordId: null }
    const data = {
      ...state.formFields,
    }
    obj.fields = data
    if (state.key) {
      obj.fields[state.key] = obj.fields[state.key].map((item: any) => {
        return item.recordId
      })
    }
    obj.recordId = state.recordId
    list.push(obj)
    table.updateRecord(list, state.teamUrl, state.projectCode, state.sheetCode).then((res) => {
      if (res.code === 1) {
        state.dialogVisible = false
        ElMessage({
          type: 'success',
          message: '修改成功',
        })
        emit('getList')
      }
    })
  }
}

watch(
  () => state.dialogVisible,
  (value) => {
    if (value) {
      for (const a of state.fieldList) {
        if (a.type === '关联表')
          state.key = a.key
      }
    }
  },
  { deep: true },
)
</script>

<template>
  <div>
    <el-dialog
      v-model="state.dialogVisible"
      :title="state.title"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="edit-dialog"
      width="900"
      @close="close"
    >
      <div class="edit">
        <el-form ref="form" :model="state.formFields" label-width="100px" :inline="true">
          <el-form-item v-for="item in state.fieldList" :key="item" :prop="item.key" :label="`${item.name}:`">
            <!-- 图片 -->
            <div v-if="item.type === '附件'" class="block">
              <div @click="getKeyAndToken">
                <el-upload
                  :data="state.dataObj"
                  action="https://upload.qiniup.com/"
                  :on-success="(res, file) => { handleAvatarSuccess(item.key, res, file) }"
                  list-type="picture-card"
                  :file-list="state.fileList"
                  :on-remove="(res, file) => { handleRemove(item.key, res, file) }"
                  :on-preview="handlePictureCardPreview"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                  <img w-full :src="dialogImageUrl" alt="Preview Image">
                </el-dialog>
              </div>
            </div>
            <!-- 视频 -->
            <div v-if="item.type === '视频'" class="block">
              <el-upload
                class="avatar-uploader"
                action="https://upload.qiniup.com/"
                :data="state.dataObj"
                :on-progress="uploadVideoProcess"
                :on-success="(res, file) => { handleVideoSuccess(item.key, res, file) }"
                :before-upload="beforeUploadVideo"
                :show-file-list="false"
              >
                <video v-if="state.formFields.video" :src="state.formFields.video" class="video video-avatar" controls="controls">
                  您的浏览器不支持视频播放
                </video>
                <i v-else class="el-icon-plus video-uploader-icon" />
              </el-upload>
            </div>
            <!-- 富文本 -->
            <div v-if="item.type === '富文本'" style="border: 1px solid #ccc">
              <toolbar v-if="state.dialogVisible" style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" :mode="state.mode" />
              <editor v-if="state.dialogVisible" v-model="state.formFields[item.key]" style="height: 300px" :default-config="editorConfig" :mode="state.mode" @onCreated="handleCreated" />
            </div>
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
                closable
                @close="handleClose(cindex, item.key)"
              >
                {{ about.tag }}
              </el-tag>
              <el-tag class="cursor-pointer" @click="showTable(item.key, item)">
                +添加
              </el-tag>
            </div>
            <!-- 单选 -->
            <el-select v-if="item.type === '单选'" v-model="state.formFields[item.key]">
              <el-option v-for="item in item.property.options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!-- 日期 -->
            <el-date-picker v-if="item.type === '日期'" v-model="state.formFields[item.key]" value-format="YYYY-MM-DD hh:mm:ss" type="datetime" placeholder="选择日期时间" />
            <!-- 电话 -->
            <el-input v-if="item.type === '电话'" v-model="state.formFields[item.key]" placeholder="请输入号码" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="state.dialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="confirm()">
          确 定
        </el-button>
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
