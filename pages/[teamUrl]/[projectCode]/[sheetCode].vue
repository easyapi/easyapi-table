<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Menu, Plus, Search } from '@element-plus/icons-vue'
import Edit from './components/edit.vue'
import AdvancedSearch from './components/advanced-search.vue'
import Pagination from '@/components/Pagination'
import SearchArea from '@/components/SearchArea'
import { table } from '@/api/table'
import { sheet } from '@/api/sheet'

const route = useRoute()
const router = useRouter()
const searchChild = ref<InstanceType<typeof AdvancedSearch>>()
const child = ref<InstanceType<typeof Edit>>()

onMounted(() => {
  if (route.params.sheetCode && route.params.projectCode && route.params.teamUrl) {
    state.sheetCode = route.params.sheetCode as any
    state.projectCode = route.params.projectCode as any
    state.teamUrl = route.params.teamUrl as any
    getFields(route.params.teamUrl, route.params.projectCode, route.params.sheetCode)
  } else {
    router.push('/')
  }
})

useHead({
  title: '数据表格 - EasyAPI服务市场',
  meta: [{ name: 'description', content: 'EasyAPI数据表格' }]
})

const state = reactive({
  activeName: 'first',
  dialogVisible: false,
  playvideo: '',
  fieldList: [],
  teamUrl: '',
  projectCode: '',
  sheetCode: '',
  recordList: [],
  ifShow: false,
  ifDelete: false,
  tableList: [],
  headline: '',
  input2: '',
  checkedLength: '',
  searchItems: [
    { label: '产品类型', type: 'input', key: 'title' },
    { label: '交付方式', type: 'input', key: 'title' },
    { label: '产品状态', type: 'input', key: 'title' },
    { label: '计费方式', type: 'select', key: 'title' }
  ],
  pagination: {
    page: 1,
    size: 10,
    total: 0
  },
  loadingData: false,
  tableText: '',
  recordIds: [] as any,
  detailList: []
})

function showVideo(url: any) {
  state.dialogVisible = true
  state.playvideo = url
}

function close() {
  state.playvideo = ''
}

function handleClick() {}

function getFields(teamUrl: any, projectCode: any, sheetCode: any) {
  const params = {
    size: 50
  }
  sheet.getSheet(params, teamUrl, projectCode, sheetCode).then(res => {
    if (res.code == 1) {
      state.fieldList = res.content.fields
      state.headline = res.content.name
    }
  })
}

function getRecordList() {
  state.recordList = []
  state.loadingData = true
  const params = {
    size: state.pagination.size,
    page: state.pagination.page - 1
  }
  table.getRecordList(params, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
    if (res.code === 1) {
      state.loadingData = false
      state.recordList = res.content
      state.pagination.total = res.totalElements
    } else {
      state.loadingData = false
      state.tableText = '暂无数据'
      state.recordList = []
      state.pagination.total = 0
    }
  })
}

/**
 * 表格行点击
 */
function rowClick(row: any) {
  const record = JSON.parse(JSON.stringify(row))
  child.value?.getParentData({
    dialogVisible: true,
    title: '编辑',
    fieldList: state.fieldList,
    recordId: record.recordId,
    teamUrl: state.teamUrl,
    projectCode: state.projectCode,
    sheetCode: state.sheetCode,
    formFields: record.fields
  })
}

function handleSelectionChange(val: any) {
  state.recordIds = []
  state.ifDelete = val.length > 0
  state.checkedLength = val.length
  const obj = {
    recordId: ''
  }
  for (const item of val) {
    obj.recordId = item.recordId
    state.recordIds.push(obj)
  }
}

/**
 * 删除
 */
function batchRemove() {
  const data = state.recordIds
  ElMessageBox.confirm('是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    table.deleteRecord(data, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
      if (res.code === 1) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        getRecordList()
      }
    })
  })
}

/**
 *展开更多
 */
function addMore() {
  state.ifShow = !state.ifShow
}

/**
 * 高级筛选
 */
function openSearch() {
  searchChild.value?.getParentData({
    dialogVisible: true,
    fieldList: state.fieldList
  })
}
/**
 * 新增服务商
 */
function addProvider(teamUrl: any, projectCode: any, sheetCode: any) {
  child.value?.getParentData({
    dialogVisible: true,
    title: '新增',
    fieldList: state.fieldList,
    recordId: '',
    teamUrl,
    projectCode,
    sheetCode,
    formFields: []
  })
}
/**
 * 分页
 */
function fatherSize(data: any) {
  state.pagination.size = data
  getRecordList()
}

function fatherCurrent(data: any) {
  state.pagination.page = data
  getRecordList()
}

function search() {}

function reset() {}

function event() {}

watch(
  () => state.teamUrl,
  value => {
    getRecordList()
  },
  { deep: true }
)
</script>

<template>
  <div>
    <div class="main-top">
      <div>
        <b>{{ state.headline }}</b>
      </div>
      <div class="mt-6 flex algin-center justify-between">
        <div class="tabs">
          <el-tabs v-model="state.activeName" @tab-click="handleClick">
            <el-tab-pane label="全部数据" name="first" />
            <el-tab-pane label="我的数据" name="second" />
            <el-tab-pane label="待处理数据" name="third" />
          </el-tabs>
        </div>
        <div class="add">
          <el-input v-model="state.input2" class="mr-3" style="width: 150px" placeholder="请输入搜索内容" :prefix-icon="Search" />
          <el-button type="primary" plain @click="addMore">展开更多</el-button>
          <el-button @click="openSearch">
            <el-icon :size="15">
              <Menu />
            </el-icon>
            高级筛选
          </el-button>
          <el-button type="primary" @click="addProvider(state.teamUrl, state.projectCode, state.sheetCode)">
            <el-icon :size="15">
              <Plus />
            </el-icon>
            添加数据
          </el-button>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div v-if="state.ifShow">
        <SearchArea :items="state.searchItems" @search="search" @event="event" @reset="reset" />
      </div>
      <div v-if="state.ifDelete" class="mt-4 flex items-center">
        <span class="mr-4">已选中{{ state.checkedLength }}项</span>
        <el-button type="danger" @click="batchRemove">批量删除</el-button>
      </div>
      <el-table
        v-loading="state.loadingData"
        border
        class="mt-4"
        :data="state.recordList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        element-loading-text="数据正在加载中..."
        @row-click="rowClick"
        @selection-change="handleSelectionChange">
        <template #empty>
          <p>{{ state.tableText }}</p>
        </template>
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="(item, index) in state.fieldList" :key="index" :show-overflow-tooltip="item.type !== '富文本'" :label="item.name">
          <template #default="scope">
            <span v-if="item.type === '单选'" v-html="scope.row.fields[item.key]" />
            <span v-if="item.type === '单行文本'" v-html="scope.row.fields[item.key]" />
            <span v-if="item.type === '多行文本'" v-html="scope.row.fields[item.key]" />
            <span v-if="item.type === '富文本'" class="rich-text" v-html="scope.row.fields[item.key]" />
            <span v-if="item.type === '数字'" v-html="scope.row.fields[item.key]" />
            <div v-for="about in scope.row.fields[item.key]" :key="about">
              <el-tag v-if="item.type === '关联表'" type="info" v-html="Object.values(about.fields)[0]" />
            </div>

            <div v-for="url in scope.row.fields[item.key]" :key="url" :src="`${url.url}!icon.jpg`">
              <img v-if="item.type === '附件' && item.key === 'imgs'" class="table-img" :src="url" />
            </div>

            <div v-for="url in scope.row.fields[item.key]" :key="url">
              <img v-if="item.type === '附件' && item.key === 'video'" class="video-img" src="../../../assets/svg/video.svg" @click.stop="showVideo(url.url)" />
            </div>
            <el-dialog v-model="dialogVisible" title="视频预览" width="50%" append-to-body top="20px" @close="close">
              <video id="video" ref="vueRef" width="100%" autoplay="autoplay" :src="playvideo" :poster="playvideo" controls="controls" preload />
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :size="state.pagination.size"
      :total-elements="state.pagination.total"
      class="paging"
      @father-size="fatherSize"
      @father-current="fatherCurrent" />
    <div style="clear: both" />
    <Edit ref="child" />
    <AdvancedSearch ref="searchChild" />
  </div>
</template>

<style scoped>
#video {
  width: 100%;
  height: 500px;
}

.table-img {
  width: 50px;
  height: 50px;
}

.video-img {
  width: 50px;
  height: 50px;
}

.rich-text {
  /* 设置宽高可以解决显示两个省略号的问题*/
  width: 620px; /*宽高看个人具体情况进行修改*/
  height: 20px;

  /* 1，强制一行显示 */
  white-space: wrap;

  /* 2.隐藏溢出的部分 */
  overflow: hidden;

  /* 3.隐藏的部分省略号显示 */
  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 1; /*行数*/
}
</style>

<style>
.tabs .el-tabs__nav-wrap::after {
  height: 0;
}
</style>

