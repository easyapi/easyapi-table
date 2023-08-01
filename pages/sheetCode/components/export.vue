<script setup lang="ts">
import { defineExpose, reactive, ref, shallowRef, watch } from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {Discount, UploadFilled} from '@element-plus/icons-vue'
import { qiniu } from '@/api/qiniu'
import { exportTemplate } from '@/api/export-template'

const emit = defineEmits(['getList'])

defineExpose({
  getParentData,
})

const state = reactive({
  dialogVisible: false,
  createDialog: false,
  dataObj: {},
  exportList: [],
  name: '',
  file: '',
  fileList: [],
  teamUrl: '',
  projectCode: '',
  sheetCode: '',
})

/**
 * 获取列表
 */
function getList() {
  const data = {
    page: 0,
    size: 100
  }
  exportTemplate.getList(data, state.teamUrl, state.projectCode, state.sheetCode).then((res) =>{
    if(res.code === 1)
      state.exportList = res.content
    else
      state.exportList = []
  })
}

/**
 * 抛出打开
 * @param data
 */
async function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
  state.teamUrl = data.teamUrl
  state.projectCode = data.projectCode
  state.sheetCode = data.sheetCode
  getList()
}

/**
 * 调用七牛
 */
function getKeyAndToken() {
  getQiniuToken()
  getQiniuKey()
}

/**
 * 上传成功后后重新获取七牛参数
 */
function handleSuccess(row) {
  state.file = `https://qiniu.easyapi.com/${row.key}`
  getKeyAndToken()
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

/**
 * 打开导入并获取七牛参数
 */
function addExport() {
  state.createDialog = true
  getKeyAndToken()
}

/**
 * 取消上传
 */
function close() {
  state.fileList = []
  state.file = ''
  state.name = ''
  state.createDialog = false
}
/**
 * 确认提交
 */
function submit() {
  if(state.name) {
    ElMessage.error('模板名称不能为空')
    return
  }
  if(state.file) {
    ElMessage.error('模板不能为空')
    return
  }
  const data = {
    name: state.name,
    file: state.file
  }
  exportTemplate.create(data, state.teamUrl, state.projectCode, state.sheetCode).then((res) => {
      if(res.code === 1) {
        ElMessage.success('上传成功')
        state.name = ''
        state.file = ''
        state.fileList = []
        state.createDialog = false
      } else {
        ElMessage.error(res.message)
      }
  })
}

/**
 * 删除模板
 */
function deleteTemplate(row) {
  ElMessageBox.confirm('您确定要删除这个模板?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      exportTemplate.delete(row, state.teamUrl, state.projectCode, state.sheetCode).then((res) => {
        if (res.code === 1)
          ElMessage.success(res.message)
        else
          ElMessage.error(res.message)
    })
  })
}
</script>

<template>
  <div>
    <!--  模板选择  -->
    <el-dialog
      v-model="state.dialogVisible"
      title="批量导出"
      :close-on-click-modal="false"
      append-to-body
      class="edit-dialog"
      width="800"
      @close="close"
    >
      <div class="dialog-content ">
        <div class="card-list">
          <div class="export-card">
            <div class="hover-card" >
              <svg-icon class="export-icon" icon-class="export-template" />
              <div class="export-text">导出</div>
            </div>
            <div class="card-header bg-gray-200">
              <svg-icon class="card-icon" icon-class="word" />
            </div>
            <div class="card-bottom bg-gray-300 text-center">
              默认模板
            </div>
          </div>
          <div class="export-card" v-for="item in state.exportList">
            <div class="hover-card" >
              <div class="list-icon">
                <div class="select">
                  <svg-icon class="export-icon" icon-class="export-template" />
                  <div class="export-text">导出</div>
                </div>
                <div class="select" @click="deleteTemplate(item)">
                  <svg-icon class="export-icon" icon-class="export-template" />
                  <div class="export-text">删除</div>
                </div>
              </div>

            </div>
            <div class="card-header bg-gray-200">
              <svg-icon class="card-icon" icon-class="word" />
            </div>
            <div class="card-bottom bg-gray-300 text-center">
              {{ item.name }}
            </div>
          </div>
          <div class="export-card" @click="addExport">
            <div class="card-header bg-gray-200">
              <svg-icon class="card-icon-add" icon-class="export-add" />
            </div>
            <div class="card-bottom bg-gray-300 text-center">
              添加自定义模板
            </div>
          </div>
        </div>
        <a>下载默认模板</a>
      </div>
    </el-dialog>
    <!--  模板导入  -->
    <el-dialog
      v-model="state.createDialog"
      title="模板导入"
      :close-on-click-modal="false"
      append-to-body
      class="edit-dialog"
      width="600"
      @close="close"
    >
      <div>
        <span>模板名称：</span>
        <el-input v-model="state.name" placeholder="请输入模板名称" />
      </div>
      <div class="export-update">
        <el-upload
          class="upload-demo"
          drag
          action="https://upload.qiniup.com/"
          :data="{ key: state.dataObj.key, token: state.dataObj.token }"
          :file-list="state.fileList"
          :on-success="handleSuccess"
          @click="getKeyAndToken"
          multiple
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
        </el-upload>
      </div>

      <template #footer>
        <el-button @click="close">
          取 消
        </el-button>
        <el-button type="primary" @click="submit">
          确 定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.dialog-content {
  .card-list{
    display: flex;
    .export-card {
      width: 150px;
      height: 150px;
      position: relative;
      margin-right: 10px;
      &:hover {
        .hover-card{
          display: block;
        }
      }
      .hover-card {
        cursor: pointer;
        position: absolute;
        z-index: 20;
        border-radius: 8px;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        display: none;
        .export-icon {
          width: 30px;
          height: 30px;
          margin: 50px 60px 5px 60px;
        }
        .export-text {
          color: #ffffff;
          font-size: 14px;
          text-align: center;
        }
        .list-icon {
          display: flex;
          align-items: center;
          justify-content: space-around;
          .select {
            margin-top: 40px;
            padding: 6px;
            border-radius: 5px;
            &:hover {
              background-color: rgba(0,0,0,0.6);
            }
          }

          .export-icon {
            width: 30px;
            height: 30px;
            margin: 0 0 5px 0;
          }

          .export-text {
            color: #ffffff;
            font-size: 14px;
            text-align: center;
          }
        }

      }
      .card-header {
        height: 120px;
        border-radius: 8px 8px 0 0;
        .card-icon {
          width: 100px;
          height: 100px;
          margin: 10px 25px;
        }
        .card-icon-add {
          width: 30px;
          height: 30px;
          margin: 50px 60px;
        }
      }
      .card-bottom {
        height: 30px;
        border-radius: 0 0 8px 8px;
        line-height: 30px;
      }
    }
    .export-card:last-child{
      cursor: pointer;
      margin-right: 0;
    }
  }
  a {
    color: #409eff;
    margin-top: 10px;
  }
}
.export-update {
  margin-top: 20px;
}
</style>

