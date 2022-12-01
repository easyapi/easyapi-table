<script setup lang="ts">
import { reactive, defineExpose } from 'vue'
import { sheet } from '@/api/sheet'
import { table } from '@/api/table'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['getItem'])

const state = reactive({
  dialogVisible: false,
  fields: [] as any,
  search: '',
  pagination: {
    page: 1,
    size: 10,
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
      state.fields = res.content
      state.pagination.total = res.totalElements
    } else {
      state.fields = []
      state.pagination.total = 0
    }
  })
}

function getSheetById() {
  sheet.getSheetById({}, state.teamUrl, state.projectCode, state.sheetId).then(res => {
    if (res.code == 1) {
      state.sheetCode = res.content.code
      getRecordList()
    }
  })
}

function choice(item: any, index: any) {
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

defineExpose({
  getParentData
})
</script>

<template>
  <el-dialog v-model="state.dialogVisible" title="关联表" append-to-body :close-on-click-modal="false" width="50%">
    <div class="w-44 mb-4">
      <el-input v-model="state.search" placeholder="搜索你想关联的内容" :prefix-icon="Search" />
    </div>
    <div v-for="(item, index) in state.fields" :key="index" class="list" @click="choice(item, index)">
      <div class="list-left">
        <h2>{{ item.fields.name }}</h2>
        <ul>
          <li>
            <p>地址</p>
            <p>{{ item.fields.address }}</p>
          </li>
          <li>
            <p>楼层</p>
            <p>{{ item.fields.floor }}</p>
          </li>
          <li>
            <p>价格</p>
            <p>{{ item.fields.price }}</p>
          </li>
          <li>
            <p>电话</p>
            <p>{{ item.fields.phone }}</p>
          </li>
        </ul>
      </div>
      <el-image v-for="img in item.fields.img" :key="img" class="list-right" style="width: 100px; height: 100px" :src="img.url" fit="cover" />
    </div>
  </el-dialog>
</template>

<style scoped>
.list {
  background-color: #f3f5f9;
  border: 1px solid #f3f5f9;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  cursor: pointer;
}

.list .list-right {
  width: 20%;
}

.list .list-left {
  width: 80%;
  padding: 10px;
}

.list .list-left ul {
  display: flex;
}

.list .list-left ul li {
  width: 25%;
}
</style>
