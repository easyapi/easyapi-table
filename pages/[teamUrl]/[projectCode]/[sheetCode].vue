<template>
  <div class="container">
    <Header></Header>
    <div :class="state.showHeader ? 'content' : 'contents'">
      <Aside
        @getFieldList="getFieldList"
        @getTeamUrl="getTeamUrl"
        @getProjectCode="getProjectCode"
        @getSheetCode="getSheetCode"
        @getHeadline="getHeadline"></Aside>
      <div :class="state.showSidebar ? 'main' : 'main-left main'">
        <div class="main-top">
          <div>
            <b>{{ state.headline }}</b>
          </div>
          <div class="mg-tp-15 flex-r just-between">
            <div class="tabs">
              <el-tabs v-model="state.activeName" @tab-click="handleClick">
                <el-tab-pane label="全部数据" name="first"></el-tab-pane>
                <el-tab-pane label="我的数据" name="second"></el-tab-pane>
                <el-tab-pane label="待处理数据" name="third"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="add">
              <el-input style="width: 150px" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="state.input2"></el-input>
              <el-button type="primary" plain @click="addMore">展开更多</el-button>
              <el-button icon="el-icon-menu" @click="openSearch">高级筛选</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="addProvider(state.teamUrl, state.projectCode, state.sheetCode)">添加数据</el-button>
            </div>
          </div>
        </div>
        <div class="main-content">
          <div v-if="ifShow">
            <SearchArea :items="state.searchItems" @search="search" @event="event" @reset="reset" />
          </div>
          <div class="mg-tp-10" v-if="ifDelete">
            <span>已选中{{ state.checkedLength }}项</span>
            <el-button @click="batchRemove" size="small" type="danger">批量删除</el-button>
          </div>
          <el-table
            border
            class="mg-tp-10"
            :data="state.recordList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            v-loading="state.loadingData"
            element-loading-text="数据正在加载中..."
            @row-click="rowClick"
            @selection-change="handleSelectionChange">
            <template #empty>
              <p>{{ state.tableText }}</p>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column v-for="(item, index) in state.fieldList" :show-overflow-tooltip="item.type !== '富文本'" :label="item.name" :key="index">
              <template #default="scope">
                <span v-if="item.type === '单选'" v-html="scope.row.fields[item.key]"></span>
                <span v-if="item.type === '单行文本'" v-html="scope.row.fields[item.key]"></span>
                <span v-if="item.type === '多行文本'" v-html="scope.row.fields[item.key]"></span>
                <span class="rich-text" v-if="item.type === '富文本'" v-html="scope.row.fields[item.key]"></span>
                <span v-if="item.type === '数字'" v-html="scope.row.fields[item.key]"></span>
                <div v-for="about in scope.row.fields[item.key]" :key="about">
                  <el-tag type="info" v-if="item.type === '关联表'" v-html="Object.values(about.fields)[0]"></el-tag>
                </div>

                <div v-for="url in scope.row.fields[item.key]" :src="url.url + '!icon.jpg'" :key="url">
                  <img class="table-img" v-if="item.type === '附件' && item.key === 'imgs'" :src="url" />
                </div>

                <div v-for="url in scope.row.fields[item.key]" :key="url">
                  <img
                    v-if="item.type === '附件' && item.key === 'video'"
                    @click.stop="showVideo(url.url)"
                    class="video-img"
                    src="../../../assets/images/video.svg" />
                </div>
                <el-dialog title="视频预览" width="50%" append-to-body top="20px" v-model="dialogVisible" @close="close">
                  <video width="100%" autoplay="autoplay" :src="playvideo" :poster="playvideo" controls="controls" id="video" preload ref="vueRef"></video>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination
          @fatherSize="fatherSize"
          @fatherCurrent="fatherCurrent"
          :size="state.pagination.size"
          :total-elements="state.pagination.total"
          class="paging"></Pagination>
        <div style="clear: both"></div>
        <edit ref="child"></edit>
        <advanced-search ref="searchChild"></advanced-search>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header'
import Aside from '@/components/Aside'
import Pagination from '@/components/Pagination'
import SearchArea from '@/components/SearchArea'
import Edit from './components/edit.vue'
import AdvancedSearch from './components/advanced-search.vue'
import { table } from '@/api/table'
import { ref, reactive, onMounted, watch } from 'vue'
import { settingStore } from '@/stores/setting'
import { ElMessage, ElMessageBox } from 'element-plus'
const route = useRoute()
const router = useRouter()
const store = settingStore()
const searchChild = ref<InstanceType<typeof AdvancedSearch>>()
const child = ref<InstanceType<typeof Edit>>()

onMounted(() => {
  state.showHeader = store.showHeader === 'true'
  state.showSidebar = store.showSidebar === 'true'
  if (route.params.sheetCode && route.params.projectCode) {
    state.sheetCode = route.params.sheetCode as any
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
  showHeader: false,
  showSidebar: false,
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
    size: 12,
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

function getFieldList(data: any) {
  state.fieldList = data
}

function getTeamUrl(data: any) {
  state.teamUrl = data
}

function getProjectCode(data: any) {
  state.projectCode = data
}

function getSheetCode(data: any) {
  state.sheetCode = data
}

function getHeadline(data: any) {
  state.headline = data
}

function getRecordList() {
  state.recordList = []
  state.loadingData = true
  let params = {}
  table.getRecordList(params, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
    if (res.code === 1) {
      state.loadingData = false
      state.recordList = res.content
      state.pagination.total = Number(res.totalElements)
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
  let record = JSON.parse(JSON.stringify(row))
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
  let obj = {
    recordId: ''
  }
  for (let item of val) {
    obj.recordId = item.recordId
    state.recordIds.push(obj)
  }
}

/**
 * 删除
 */
function batchRemove() {
  let data = state.recordIds
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
    teamUrl: teamUrl,
    projectCode: projectCode,
    sheetCode: sheetCode,
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

<style scoped>
.el-tabs__content {
  overflow: visible;
}

.el-tabs__item {
  color: #333333;
}

.el-tabs__item.is-active {
  color: #15cbf3;
}

.el-icon-arrow-left {
  color: white;
}

.el-icon-arrow-right {
  color: white;
}

.el-tabs__nav-wrap::after {
  height: 0;
}

.el-button + .el-button {
  margin-left: 0px;
}

.el-tabs__active-bar {
  background-color: #15cbf3;
}

.cell .el-tooltip {
  color: #67c23a;
}

.tabs {
  width: 50%;
}

.just-between {
  justify-content: space-between;
}

#video {
  width: 100%;
  height: 500px;
}

/* /deep/ p img {
  display: none;
} */

.table-img {
  width: 50px;
  height: 50px;
}

.video-img {
  width: 50px;
  height: 50px;
}

/* .el-table {
  /deep/ tbody tr:hover > td {
    cursor: pointer;
  }
} */

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
