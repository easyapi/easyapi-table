<script setup lang="ts">
import { defineExpose, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { sheet } from '@/api/sheet'
import { table } from '@/api/table'

const emit = defineEmits(['getItem'])

const state = reactive({
  dialogVisible: false,
  fields: [] as any,
  recordList: [] as any,
  search: '',
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    pageSizes: [5, 10],
  },
  teamUrl: '',
  projectCode: '',
  sheetId: '',
  sheetCode: '',
  selects: [],
  selectedRows: [],
})

function getRecordList() {
  const params = {
    page: state.pagination.page - 1,
    size: state.pagination.size,
  }
  table
    .getRecordList(params, state.teamUrl, state.projectCode, state.sheetCode)
    .then((res) => {
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
  sheet
    .getSheetById({}, state.teamUrl, state.projectCode, state.sheetId)
    .then((res) => {
      if (res.code === 1) {
        res.content.fields.forEach((item: any, index: number) => {
          if (index < 5)
            state.fields.push(item)
        })
        state.sheetCode = res.content.code
        getRecordList()
      }
    })
}

// function choice(item: any, key: any) {
//   console.log(key, 99999)
//   item.tag = item.fields[key]
//   emit('getItem', item)
//   // state.dialogVisible = false
// }

function handleSelectionChange(data: any) {
  state.selects = data
  state.selectedRows = data.map(row => row.fields.locationId)
}

function toggleRowSelections(row: any, selected: any) {
  console.log(row, selected, 3636)
  return state.selectedRows.includes(row.fields.locationId) // 判断该行是否在选中的行中
}

function close() {
  state.selects.forEach((item: any) => {
    item.tag = item.fields.name
  })
  emit('getItem', state.selects)
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

function search() {
  const data = {
    relation: 'and',
    conditions: [
      {
        field: 'name',
        operator: 'like',
        value: [state.search],
      },
    ],
  }
  table
    .searchRecordList(data, state.teamUrl, state.projectCode, state.sheetCode)
    .then((res) => {
      if (res.code === 1) {
        state.recordList = res.content
        state.pagination.total = res.totalElements
      } else {
        state.recordList = []
        state.pagination.total = 0
      }
    })
}

defineExpose({
  getParentData,
})
</script>

<template>
  <el-dialog
    v-model="state.dialogVisible"
    title="关联表"
    append-to-body
    :close-on-click-modal="false"
    width="800"
    @close="close"
  >
    <div class="w-52 mb-6">
      <el-input
        v-model="state.search"
        placeholder="搜索你想关联的内容"
        :prefix-icon="Search"
        @blur="search"
      />
    </div>
    <!-- <div
      v-for="(item, index) in state.recordList"
      :key="index"
      class="
        w-full
        cursor-pointer
        px-4
        pt-6
        bg-gray-100
        rounded
        border border-gray-100
        flex
        items-center
        mb-4
        space-x-8
        hover:border-purple-600
      "
      @click="choice(item, state.fields[0].key)"
    > -->
    <el-table
      class=" mb-6"
      :data="state.recordList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection" width="55"
      />
      <el-table-column label="小区名称">
        <template #default="scope">
          {{ scope.row.fields.name }}
        </template>
      </el-table-column>
      <el-table-column label="小区ID">
        <template #default="scope">
          {{ scope.row.fields.locationId }}
        </template>
      </el-table-column>
    </el-table>
    <!-- <div v-for="(citem, cindex) in state.fields" :key="cindex" class="w-1/5">
        <div class="flex flex-col">
          <div class="h-10 text-gray-500 text-sm">
            {{ citem.name }}
          </div>
          <div class="h-10 overflow-hidden text-black text-sm">
            <div
              v-if="citem.type === '单行文本' || citem.type === '日期'"
              class="truncate w-28"
            >
              {{ item.fields[citem.key] || "--" }}
            </div>
            <div
              v-if="citem.type === '富文本'"
              class="truncate w-28"
              v-html="item.fields[citem.key]"
            />
            <div v-if="citem.type === '附件'">
              <img class="w-6 h-6" :src="item.fields[citem.key][0].url" alt="">
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="flex justify-end">
      <Pagination
        :page-sizes="state.pagination.pageSizes"
        :total-pages="state.pagination.page"
        :size="state.pagination.size"
        :total-elements="state.pagination.total"
        @fatherSize="fatherSize"
        @fatherCurrent="fatherCurrent"
      />
    </div>
  </el-dialog>
</template>

<style scoped>
</style>
