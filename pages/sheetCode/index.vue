<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Menu, Plus, Search, Lock, Unlock} from '@element-plus/icons-vue'
import Edit from './components/edit.vue'
import AdvancedSearch from './components/advanced-search.vue'
import Pagination from '@/components/Pagination'
import Export from './components/export.vue'
import SearchArea from '@/components/SearchArea'
import { table } from '@/api/table'
import { sheet } from '@/api/sheet'
import { useRoute, useRouter } from 'vue-router'
import { options } from '@/utils/options'

const route = useRoute()
const router = useRouter()
const searchChild = ref<InstanceType<typeof AdvancedSearch>>()
const child = ref<InstanceType<typeof Edit>>()
const exportDialog = ref<InstanceType<typeof Export>>()

onMounted(() => {
  if (
    route.params.sheetCode
    && route.params.projectCode
    && route.params.teamUrl
  ) {
    state.sheetCode = route.params.sheetCode as any
    state.projectCode = route.params.projectCode as any
    state.teamUrl = route.params.teamUrl as any
    getFields(
      route.params.teamUrl,
      route.params.projectCode,
      route.params.sheetCode,
    )
  } else {
    router.push('/')
  }
})

useHead({
  title: '数据表格 - EasyAPI服务市场',
  meta: [{ name: 'description', content: 'EasyAPI数据表格' }],
})

const state = reactive({
  dialogVisible: false,
  playvideo: '',
  fieldList: [],
  teamUrl: '',
  projectCode: '',
  sheetCode: '',
  recordList: [],
  ifShow: false,
  tableList: [],
  headline: '',
  searchValue: '',
  checkedLength: 0,
  searchItems: [
    { label: '产品类型', type: 'input', key: 'title' },
    { label: '交付方式', type: 'input', key: 'title' },
    { label: '产品状态', type: 'input', key: 'title' },
    { label: '计费方式', type: 'select', key: 'title' },
  ],
  pagination: {
    page: 1,
    size: 10,
    total: 0,
  },
  loadingData: false,
  tableText: '',
  recordIds: [] as any,
  detailList: [],
  exposedList: [],
  exposedData: {
    relation: 'and',
    conditions: []
  },
  options,
  exportDialog: null,
})

function getList() {
  state.pagination.page = 1
  getRecordList()
}

function showVideo(url: any) {
  state.dialogVisible = true
  state.playvideo = url
}

function close() {
  state.playvideo = ''
}

/**
 * 获取字段主题
 * @param teamUrl
 * @param projectCode
 * @param sheetCode
 */
function getTheme() {
  table.getTheme(state.teamUrl, state.projectCode, state.sheetCode).then((res) => {
    if(res.code === 1) {
      state.fieldList.forEach((item) => {
        res.content.forEach((citem) => {
          if(item.key === citem.fieldKey) {
            item.ifHide = citem.ifHide
            item.ifLock = citem.ifLock
            item.width = citem.width
          }
        })
      })
      console.log(state.fieldList)
    }
  })
}

/**
 * 设置锁定列
 */
function lock (item,index){
  state.fieldList[index].ifLock = !state.fieldList[index].ifLock
  const data = {
    fieldKey: item.key,
    ifLock: state.fieldList[index].ifLock,
    width: state.fieldList[index].width,
  }
  table.setTheme(data, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
    if(res.code === 1)
      getTheme()
  })
}

/**
 * 设置列宽度
 */
function setWidth(newWidth, oldWidth, column, event) {
  state.fieldList[column.no - 1].width = newWidth
  const data = {
    fieldKey: state.fieldList[column.no - 1].key,
    ifLock: state.fieldList[column.no - 1].ifLock,
    width: newWidth
  }
  table.setTheme(data, state.teamUrl, state.projectCode, state.sheetCode).then(res => {
    if(res.code === 1)
      getTheme()
  })
}

/**
 * 获取字段数据
 * @param teamUrl
 * @param projectCode
 * @param sheetCode
 */
function getFields(teamUrl: any, projectCode: any, sheetCode: any) {
  const params = {
    size: 50,
  }
  sheet.getSheet(params, teamUrl, projectCode, sheetCode).then((res) => {
    if (res.code === 1) {
      state.fieldList = res.content.fields
      state.headline = res.content.name
      getTheme()
    }
  })
}

/**
 * 列表查询
 */
function getRecordList() {
  state.recordList = []
  state.loadingData = true
  const params = {
    size: state.pagination.size,
    page: state.pagination.page - 1,
  }
  table
    .getRecordList(params, state.teamUrl, state.projectCode, state.sheetCode)
    .then((res) => {
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
 * 筛选
 */
function search() {
  const data = {
    relation: 'and',
    conditions: []
  }
  state.exposedList.forEach(item => {
    if(item.inputValue){
      data.conditions.push({
        field: item.fieldValue,
        operator: item.value,
        value: item.inputValue.split('；'),
      })
    }
  })
  state.pagination.page = 1
  searchRecordList(data)
}

/**
 * 筛选数据清除
 */
function clean() {
  state.exposedList.forEach(item => {
    item.inputValue  = ''
  })
  searchRecordList(null)
}

/**
 * 筛选查询
 * @param data
 */
function searchRecordList(row) {
  let data = {}
  if(state.searchValue) {
    data = {
      q: state.searchValue
    }
  } else  {
    data = {
      relation: 'and',
      conditions: []
    }
  }

  if(row) {
    state.exposedData = row
  }
  const params = {
    size: state.pagination.size,
    page: state.pagination.page - 1,
  }

  if(state.exposedData.conditions.length !== 0){
    data.conditions = state.exposedData.conditions
  }

  table
    .searchRecordList(state.teamUrl, state.projectCode, state.sheetCode, data, params)
    .then((res) => {
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
    formFields: record.fields,
  })
}

function handleSelectionChange(val: any) {
  state.recordIds = []
  state.checkedLength = val.length
  for (const item of val) {
    const obj = {
      recordId: '',
    }
    obj.recordId = item.recordId
    state.recordIds.push(obj)
  }
}

/**
 * 删除
 */
function batchRemove() {
  const data = state.recordIds
  ElMessageBox.confirm('确定要删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    table
      .deleteRecord(data, state.teamUrl, state.projectCode, state.sheetCode)
      .then((res) => {
        if (res.code === 1) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          setTimeout(() => {
            getList()
          }, 2000)
        }
      })
  })
}


/**
 * 高级筛选
 */
function openSearch() {
  searchChild.value?.getParentData({
    dialogVisible: true,
    fieldList: state.fieldList,
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
    formFields: [],
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

/**
 * 外露设置
 */
function exposedSet(arr) {
  state.exposedList = arr
}

/**
 * 打开导出弹窗
 */
function openExport() {
  exportDialog.value?.getParentData({
    dialogVisible: true,
    teamUrl: state.teamUrl,
    projectCode: state.projectCode,
    sheetCode: state.sheetCode,
  })
}

watch(
  () => state.teamUrl,
  (value) => {
    getRecordList()
  },
  { deep: true },
)
</script>

<template>
  <div>
    <!-- 头部内容 -->
    <div class="bg-white p-4">
      <div class="text-2xl font-black">
        {{ state.headline }}
      </div>
      <div class="mt-6 flex algin-center justify-between">
        <div>
          <el-input
            v-model="state.searchValue"
            class="mr-3"
            style="width: 250px"
            placeholder="请输入搜索内容"
            :prefix-icon="Search"
            @keyup.enter="searchRecordList(null)"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="searchRecordList(null)"><Search /></el-icon>
            </template>
          </el-input>
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
    <div v-if="state.exposedList.length !== 0" class="exposed mt-2 bg-white p-4">
      <div class="text-[16px] mb-3">筛选条件</div>
      <div class="flex flex-wrap items-center justify-between">
        <div v-for="(item,index) in state.exposedList" :key="index" class="flex items-center mb-4 w-[49%]">
          <el-input class="field-label" v-model="item.fieldLabel" disabled  />
          <el-select v-model="item.value" class="field-option ml-2">
            <el-option v-for="child in state.options" :key="child.value" :label="child.label" :value="child.value" />
          </el-select>
          <el-input class="field-value ml-2" v-model="item.inputValue" placeholder="多条件请用；隔开" />
        </div>
      </div>
      <el-button type="primary" @click="search">筛选</el-button>
      <el-button @click="clean">清空</el-button>
    </div>
    <div class="main-content p-4 bg-white">
      <!-- 搜索区域 -->
      <div v-if="state.ifShow">
        <SearchArea
          :items="state.searchItems"
          @search="search"
          @event="event"
          @reset="reset"
        />
      </div>
      <!-- 按钮区域 -->
      <div class="flex items-center">
        <el-button type="danger" :disabled="state.checkedLength <= 0" @click="batchRemove">
          批量删除
        </el-button>
        <el-button type="primary" @click="openExport">
          批量导出
        </el-button>
      </div>
      <!-- 表格区域 -->
      <el-table
        v-loading="state.loadingData"
        border
        class="mt-4"
        :data="state.recordList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        element-loading-text="数据正在加载中..."
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        @header-dragend="setWidth"
      >
        <template #empty>
          <p>{{ state.tableText }}</p>
        </template>
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="(item, index) in state.fieldList"
          :fixed="item.ifLock"
          :width="item.width"
          :key="index"
          :show-overflow-tooltip="item.type !== '富文本'"
        >
          <template #header>
            <div class="flex items-center justify-between table-header">
              <div>{{item.name}}</div>
              <el-icon v-if="!item.ifLock" class="cursor-pointer icon-lock" size="15" @click="lock(item,index)"><Lock /></el-icon>
              <el-icon v-else class="cursor-pointer" size="15" @click="lock(item,index)"><Unlock /></el-icon>
            </div>
          </template>
          <template #default="scope">
            <div
              v-if="item.type === '富文本'"
              class="rich-text"
              v-html="scope.row.fields[item.key]"
            />
            <div v-else-if="item.type === '关联表'" class="flex flex-wrap">
              <div
                v-for="(citem, index) in scope.row.fields[item.key]"
                :key="index"
                class="mr-2"
              >
                <el-tag v-html="Object.values(citem.fields)[0]" />
              </div>
            </div>
            <div v-else-if="item.type === '附件'">
              <div
                v-for="(citem, index) in scope.row.fields[item.key]"
                :key="index"
              >
                <img :src="citem.url" class="w-12 h-12">
              </div>
            </div>
            <div v-else-if="item.type === '视频'">
              <div
                v-for="(citem, index) in scope.row.fields[item.key]"
                :key="index"
              >
                <img
                  src="../../assets/svg/video.svg"
                  class="w-12 h-12"
                  @click.stop="showVideo(citem.url)"
                >
              </div>
            </div>
            <div v-else-if="item.type === '多选'">
              <div v-for="(citem,cindex) in JSON.parse(scope.row.fields[item.key])" :key="cindex">
                {{cindex + 1}}、{{citem}}
              </div>
            </div>
            <div v-else-if="item.type === '勾选'">
              <el-tag :type="scope.row.fields[item.key] && JSON.parse(scope.row.fields[item.key]) ? 'success' : 'warning'">
                {{scope.row.fields[item.key] && JSON.parse(scope.row.fields[item.key]) ? '是' : '否'}}
              </el-tag>

            </div>
            <div v-else v-html="scope.row.fields[item.key]" />
            <el-dialog
              v-model="dialogVisible"
              title="视频预览"
              width="50%"
              append-to-body
              top="20px"
              @close="close"
            >
              <video
                id="video"
                ref="vueRef"
                width="100%"
                autoplay="autoplay"
                :src="playvideo"
                :poster="playvideo"
                controls="controls"
                preload
              />
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <Pagination
          :size="state.pagination.size"
          :total-pages="state.pagination.page"
          :total-elements="state.pagination.total"
          @fatherSize="fatherSize"
          @fatherCurrent="fatherCurrent"
        />
      </div>
    </div>
    <Edit ref="child" @getList="getList" />
    <AdvancedSearch ref="searchChild" @search="searchRecordList" @exposed="exposedSet" />
    <Export ref="exportDialog" />
  </div>
</template>

<style lang="scss" scoped>
.table-header {
  .icon-lock {
    display: none !important;
  }
  &:hover {
    .icon-lock {
      display: block !important;
    }
  }
}
#video {
  width: 100%;
  height: 500px;
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

.exposed {
  .field-label {

    width: 20%;
  }
  .field-option {
    width: 19%;
  }
  .field-value {
    width: 60%;
  }
}
</style>

<style>
.tabs .el-tabs__nav-wrap::after {
  height: 0;
}
</style>
