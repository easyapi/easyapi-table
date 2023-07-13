<script setup lang="ts">
import { defineExpose, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElTable } from 'element-plus'
import { sheet } from '@/api/sheet'
import { table } from '@/api/table'

const emit = defineEmits(['getItem'])
const recordListRef = ref<InstanceType<typeof ElTable>>()

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
  isCheckAll: false,
  checkData: [], // 已选数据 1
  recordListAll: [], // 全部数据 1
  openList: [], // 打开时的数组
})
/**
 * 获取数据
 */
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
        changePageCheck()
      } else {
        state.recordList = []
        state.pagination.total = 0
      }
    })
}

/**
 * 获取所有的数据
 */
function getRecordListAll() {
  const params = {
    page: 0,
    size: 100,
  }
  table
    .getRecordList(params, state.teamUrl, state.projectCode, state.sheetCode)
    .then((res) => {
      if (res.code === 1)
        state.recordListAll = res.content
      else
        state.recordListAll = []
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
        getRecordListAll()
      }
    })
}

function confirm() {
  state.checkData.forEach((item: any) => {
    item.tag = item.fields.name
  })
  emit('getItem', state.checkData)
  state.dialogVisible = false
}

function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
  state.teamUrl = data.teamUrl
  state.projectCode = data.projectCode
  state.sheetId = data.sheetId
  state.checkData = data.list
  getSheetById()
  changePageCheck()
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

/**
 * 跨页全选/取消全选
 */
function handleSelectAllPage(value: boolean) {
  if (value) {
    state.checkData = JSON.parse(JSON.stringify(state.recordListAll))
    state.recordList.forEach((row) => {
      recordListRef.value.toggleRowSelection(row, true)
    })
  } else {
    state.checkData = []
    recordListRef.value.clearSelection()
  }
  state.isCheckAll = value
}
/**
 * 切换分页之后选中
 */
function changePageCheck() {
  state.checkData.forEach((item) => {
    state.recordList.forEach((row) => {
      if (item.fields.locationId === row.fields.locationId) {
        nextTick(() => {
          recordListRef.value.toggleRowSelection(row, true)
        })
      }
    })
  })
}

/**
 * 手动勾选数据行的Checkbox时触发的事件
 */
function select(selection, row) {
  if (
    state.checkData.filter(x => x.fields.locationId === row.fields.locationId).length === 0
  ) {
    state.checkData.push(row)
    return
  }
  state.checkData.forEach((item, index) => {
    if (item.fields.locationId === row.fields.locationId)
      state.checkData.splice(index, 1)
  })
}

/**
 * 手动勾选全选Checkbox时触发的事件
 */
function selectAll(selection) {
  if (selection.length === 0) {
    const list = []
    state.checkData.forEach((row) => {
      if (state.recordList.filter(x => x.fields.locationId === row.fields.locationId).length === 0)
        list.push(row)
    })
    state.checkData = JSON.parse(JSON.stringify(list))
  } else {
    selection.forEach((row) => {
      if (state.checkData.filter(x => x.fields.locationId === row.fields.locationId).length === 0)
        state.checkData.push(row)
    })
  }
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
    <div class="w-52 mb-4">
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
    <div class="mb-4 flex justify-between">
      <div>
        <el-button type="primary" @click="handleSelectAllPage(true)">
          跨页全选
        </el-button>
        <el-button @click="handleSelectAllPage(false)">
          取消全选
        </el-button>
      </div>
      <div>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </div>
    <ElTable
      ref="recordListRef"
      class=" mb-6"
      :data="state.recordList"
      style="width: 100%"
      @select="select"
      @select-all="selectAll"
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
    </ElTable>
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
