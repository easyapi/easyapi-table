<script setup lang="ts">
import { defineExpose, reactive, ref, shallowRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import AssociationTable from './association-table.vue'
import { qiniu } from '@/api/qiniu'
import { table } from '@/api/table'
import { sheet } from '@/api/sheet'

const emit = defineEmits(['getList'])

defineExpose({
  getParentData,
})

const state = reactive({
  dialogVisible: false,
  createDialog: false,
  dataObj: {},
  exportList: [],
  title: '',
  fileList: [],
})

/**
 * 抛出打开
 * @param data
 */
async function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
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
function handleSuccess() {
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
        <el-input v-model="state.title" placeholder="请输入模板名称" />
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
        <el-button @click="state.dialogVisible = false">
          取 消
        </el-button>
        <el-button type="primary">
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

