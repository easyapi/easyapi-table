<template>
  <div class="container">
    <Header></Header>
    <div :class="showHeader ? 'content' : 'contents'">
      <Aside
        @getFieldList="getFieldList"
        @getTeamUrl="getTeamUrl"
        @getProjectCode="getProjectCode"
        @getSheetCode="getSheetCode"
        @getHeadline="getHeadline"></Aside>
      <div :class="showSidebar ? 'main' : 'main-left main'">
        <div class="main-top">
          <div>
            <b>{{ headline }}</b>
          </div>
          <div class="mg-tp-15 flex-r just-between">
            <div class="tabs">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部数据" name="first"></el-tab-pane>
                <el-tab-pane label="我的数据" name="second"></el-tab-pane>
                <el-tab-pane label="待处理数据" name="third"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="add">
              <el-input size="small" style="width: 150px" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="input2"></el-input>
              <el-button type="primary" size="small" plain @click="addMore">展开更多</el-button>
              <el-button icon="el-icon-menu" size="small" @click="openSearch">高级筛选</el-button>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addProvider(teamUrl, projectCode, sheetCode)">添加数据</el-button>
            </div>
          </div>
        </div>
        <div class="main-content">
          <div v-if="ifShow">
            <SearchArea :items="searchItems" @search="search" @event="event" @reset="reset" />
          </div>
          <div class="mg-tp-10" v-if="ifDelete">
            <span>已选中{{ checkedLength }}项</span>
            <el-button @click="batchRemove" size="small" type="danger">批量删除</el-button>
          </div>
          <el-table
            border
            class="mg-tp-10"
            :data="providerList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            v-loading="loadingData"
            element-loading-text="数据正在加载中..."
            @row-click="rowClick"
            @selection-change="handleSelectionChange">
            <template slot="empty">
              <p>{{ tableText }}</p>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <template>
              <el-table-column v-for="(item, index) in fieldList" :show-overflow-tooltip="item.type != '富文本'" :label="item.name" :key="index">
                <template slot-scope="scope">
                  <span v-if="item.type == '单行文本' && item.key != 'img'" v-html="scope.row[item.key]"></span>
                  <span v-if="item.type == '多行文本' && item.key != 'img'" v-html="scope.row[item.key]"></span>
                  <span class="rich-text" v-if="item.type == '富文本'" v-html="scope.row[item.key]"></span>
                  <span v-if="item.type == '数字'" v-html="scope.row[item.key]"></span>
                  <el-tag type="info" v-if="item.type == '关联表'" v-for="about in scope.row[item.key]" v-html="Object.values(about.fields)[0]"></el-tag>
                  <img class="table-img" v-if="item.type == '附件' && item.key == 'img'" v-for="url in scope.row[item.key]" :src="url.url + '!icon.jpg'" />
                  <img
                    v-if="item.type == '附件' && item.key == 'video'"
                    v-for="url in scope.row[item.key]"
                    @click.stop="showVideo(url.url)"
                    class="video-img"
                    src="../../assets/images/video.svg" />
                  <el-dialog title="视频预览" width="50%" append-to-body top="20px" :visible.sync="dialogVisible" @close="close">
                    <video width="100%" autoplay="autoplay" :src="playvideo" :poster="playvideo" controls="controls" id="video" preload ref="vueRef"></video>
                  </el-dialog>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <Pagination
          @fatherSize="fatherSize"
          @fatherCurrent="fatherCurrent"
          :size="pagination.size"
          :total-elements="pagination.total"
          class="paging"></Pagination>
        <div style="clear: both"></div>
        <Edit ref="child"></Edit>
        <AdvancedSearch ref="searchChild"></AdvancedSearch>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header/index.vue'
import Aside from '../../components/Aside/index.vue'
import Pagination from '../../components/Pagination/index'
import SearchArea from '../../components/SearchArea'
import Edit from './components/edit.vue'
import { getRecordList, deleteRecord } from '../../api/table'
import AdvancedSearch from './components/advancedSearch'

export default {
  name: '',
  components: {
    AdvancedSearch,
    Header,
    Aside,
    SearchArea,
    Pagination,
    Edit
  },
  data() {
    return {
      activeName: 'first',
      dialogVisible: false,
      playvideo: '',
      fieldList: [],
      teamUrl: '',
      projectCode: '',
      sheetCode: '',
      providerList: [],
      ifShow: false,
      ifDelete: false,
      tableList: [],
      showHeader: '',
      showSidebar: '',
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
      recordIds: []
    }
  },
  watch: {
    teamUrl(val) {
      if (val) {
        this.getRecordList()
      }
    },
    providerList(val) {
      console.log(val)
    }
  },
  head() {
    return {
      title: '数据表格 - EasyAPI服务市场',
      meta: [
        { hid: 'description', name: 'description', content: '服务市场场景化服务' },
        { hid: 'keyword', name: 'keyword', content: '服务市场场景化服务' }
      ]
    }
  },
  methods: {
    showVideo(url) {
      this.dialogVisible = true
      this.playvideo = url
    },
    close() {
      this.playvideo = ''
    },
    handleClick() {},
    getFieldList(data) {
      this.fieldList = data
    },
    getTeamUrl(data) {
      console.log(data)
      this.teamUrl = data
    },
    getProjectCode(data) {
      console.log(data)
      this.projectCode = data
    },
    getSheetCode(data) {
      this.sheetCode = data
    },
    getHeadline(data) {
      this.headline = data
    },
    getRecordList() {
      console.log(this.projectCode)
      this.providerList = []
      this.loadingData = true
      let params = {}
      getRecordList(params, this.teamUrl, this.projectCode, this.sheetCode, this).then(res => {
        if (res.data.code === 1) {
          this.loadingData = false
          for (let fields of res.data.content) {
            fields.fields.recordId = fields.id
            this.providerList.push(fields.fields)
          }
          this.pagination.total = Number(res.data.totalElements)
        } else {
          this.loadingData = false
          this.tableText = '暂无数据'
          this.providerList = []
          this.pagination.total = 0
        }
      })
    },
    /**
     * 表格行点击
     */
    rowClick(row) {
      let obj = JSON.parse(JSON.stringify(row))
      this.$refs.child.dialogVisible = true
      this.$refs.child.fieldList = this.fieldList
      this.$refs.child.title = '编辑'
      this.$refs.child.recordId = obj.recordId
      this.$refs.child.teamUrl = this.teamUrl
      this.$refs.child.projectCode = this.projectCode
      this.$refs.child.sheetCode = this.sheetCode
      setTimeout(() => {
        this.$refs.child.formFields = obj
      }, 100)
    },

    handleSelectionChange(val) {
      console.log(val)
      this.recordIds = []
      let ids = []
      if (val.length > 0) {
        this.ifDelete = true
      } else {
        this.ifDelete = false
      }
      this.checkedLength = val.length
      let obj = {}
      for (let item of val) {
        obj.recordId = item.recordId
        this.recordIds.push(obj)
      }
    },

    /**
     * 删除
     */
    batchRemove() {
      let data = this.recordIds
      console.log(data)
      deleteRecord(data, this.teamUrl, this.projectCode, this.sheetCode, this).then(res => {
        if (res.data.code === 1) {
          this.$message.success('删除成功')
          this.getRecordList()
        }
      })
    },

    /**
     *展开更多
     */
    addMore() {
      this.ifShow = !this.ifShow
    },

    /**
     * 高级筛选
     */
    openSearch() {
      this.$refs.searchChild.dialogVisible = true
      this.fieldList.forEach(item => {
        this.$refs.searchChild.fieldList.push({
          label: item.name,
          value: item.key
        })
      })
    },

    /**
     * 新增服务商
     */
    addProvider(teamUrl, projectCode, sheetCode) {
      console.log(this.fieldList)
      this.$refs.child.dialogVisible = true
      this.$refs.child.fieldList = this.fieldList
      this.$refs.child.title = '新增'
      this.$refs.child.teamUrl = teamUrl
      this.$refs.child.projectCode = projectCode
      this.$refs.child.sheetCode = sheetCode
      // this.$refs.child.ifChange = true
    },
    //分页
    fatherSize(data) {
      this.pagination.size = data
      this.getRecordList()
    },
    fatherCurrent(data) {
      this.pagination.page = data
      this.getRecordList()
    },

    search(item) {
      let { title } = item
      this.title = title
      this.getArticleList()
    },
    reset(item) {},
    event(item) {
      let { title } = item
      this.title = title
    }
  },
  mounted() {
    this.showHeader = this.$store.state.settings.showHeader === 'true'
    this.showSidebar = this.$store.state.settings.showSidebar === 'true'
    if (this.$route.params.sheetCode && this.$route.params.projectCode) {
      this.sheetCode = this.$route.params.sheetCode
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
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
</style>
<style scoped lang="scss">
#video {
  width: 100%;
  height: 500px;
}

/deep/ p img {
  display: none;
}

.table-img {
  width: 50px;
  height: 50px;
}

.video-img {
  width: 50px;
  height: 50px;
}

.el-table {
  /deep/ tbody tr:hover > td {
    cursor: pointer;
  }
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
