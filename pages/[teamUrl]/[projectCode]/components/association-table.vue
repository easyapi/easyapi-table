<script setup lang="ts">
import { reactive, defineExpose } from 'vue'
import { sheet } from '@/api/sheet'
import { table } from '@/api/table'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['getItem'])

const state = reactive({
  dialogVisible: false,
  fields: [] as any,
  recordList: [] as any,
  search: '',
  pagination: {
    page: 1,
    size: 5,
    total: 0
  },
  teamUrl: '',
  projectCode: '',
  sheetId: '',
  sheetCode: ''
})

function getRecordList() {
  let params = {
    page: state.pagination.page - 1,
    size: state.pagination.size
  }
  table.getRecordList(params, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
    if (res.code === 1) {
      state.recordList = res.content
      state.pagination.total = res.totalElements
    } else {
      state.recordList = []
      state.pagination.total = 0
    }
  })
}

function getSheetById() {
  state.fields = []
  sheet.getSheetById({}, state.teamUrl, state.projectCode, state.sheetId).then(res => {
    if (res.code == 1) {
      res.content.fields.map((item: any, index: Number) => {
        if (index < 5) {
          state.fields.push(item)
        }
      })
      state.sheetCode = res.content.code
      getRecordList()
    }
  })
}

function choice(item: any, key: any) {
  item.tag = item.fields[key]
  emit('getItem', item)
  state.dialogVisible = false
}

function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
  state.teamUrl = data.teamUrl
  state.projectCode = data.projectCode
  state.sheetId = data.sheetId
  getSheetById()
}

function fatherSize(data: any) {
  state.pagination.size = data
  getRecordList()
}

function fatherCurrent(data: any) {
  state.pagination.page = data
  getRecordList()
}

defineExpose({
  getParentData
})
</script>

<template>
  <el-dialog v-model="state.dialogVisible" title="关联表" append-to-body :close-on-click-modal="false" width="50%">
    <div class="w-52 mb-6">
      <el-input v-model="state.search" placeholder="搜索你想关联的内容" :prefix-icon="Search" />
    </div>
    <div
      class="w-full cursor-pointer px-4 pt-6 bg-gray-100 border-2 rounded border border-gray-100 flex items-center mb-4 space-x-8 hover:border-purple-600"
      v-for="(item, index) in state.recordList"
      :key="index"
      @click="choice(item, state.fields[0].key)">
      <div class="w-1/5" v-for="(citem, cindex) in state.fields" :key="cindex">
        <div class="flex flex-col">
          <div class="h-10 text-gray-400 text-sm">{{ citem.name }}</div>
          <div class="h-10 overflow-hidden text-black text-sm">
            <div class="truncate" v-if="citem.type == '单行文本' || citem.type == '日期'">{{ item.fields[citem.key] || '--' }}</div>
            <div v-if="citem.type == '富文本'" v-html="item.fields[citem.key]"></div>
            <div v-if="citem.type == '附件'">
              <img class="w-6 h-6" :src="item.fields[citem.key][0].url" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <Pagination :size="state.pagination.size" :total-elements="state.pagination.total" @fatherSize="fatherSize" @fatherCurrent="fatherCurrent" />
    </div>
    <div style="clear: both" />
  </el-dialog>
</template>

<style scoped>
</style>
