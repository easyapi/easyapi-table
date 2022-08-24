import './index.scss'

import Header from '../../../components/Header'
import Aside from '../../../components/Aside'
import Pagination from '../../../components/Pagination'
import SearchArea from '../../../components/SearchArea'
import Edit from './components/edit.vue'
import { getRecordList, deleteRecord } from '../../../api/table'
import AdvancedSearch from './components/advanced-search'

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
      recordList: [],
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
      this.teamUrl = data
    },
    getProjectCode(data) {
      this.projectCode = data
    },
    getSheetCode(data) {
      this.sheetCode = data
    },
    getHeadline(data) {
      this.headline = data
    },
    getRecordList() {
      this.recordList = []
      this.loadingData = true
      let params = {}
      getRecordList(params, this.teamUrl, this.projectCode, this.sheetCode, this).then(res => {
        if (res.data.code === 1) {
          this.loadingData = false
          for (let record of res.data.content) {
            this.recordList.push(record.fields)
          }
          this.pagination.total = Number(res.data.totalElements)
        } else {
          this.loadingData = false
          this.tableText = '暂无数据'
          this.recordList = []
          this.pagination.total = 0
        }
      })
    },
    /**
     * 表格行点击
     */
    rowClick(row) {
      let record = JSON.parse(JSON.stringify(row))
      this.$refs.child.dialogVisible = true
      this.$refs.child.fieldList = this.fieldList
      this.$refs.child.title = '编辑'
      this.$refs.child.recordId = record.recordId
      this.$refs.child.teamUrl = this.teamUrl
      this.$refs.child.projectCode = this.projectCode
      this.$refs.child.sheetCode = this.sheetCode
      setTimeout(() => {
        this.$refs.child.formFields = record
      }, 100)
    },

    handleSelectionChange(val) {
      this.recordIds = []
      this.ifDelete = val.length > 0
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
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRecord(data, this.teamUrl, this.projectCode, this.sheetCode, this).then(res => {
          if (res.data.code === 1) {
            this.$message.success('删除成功')
            this.getRecordList()
          }
        })
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
      this.$refs.child.dialogVisible = true
      this.$refs.child.fieldList = this.fieldList
      this.$refs.child.title = '新增'
      this.$refs.child.teamUrl = teamUrl
      this.$refs.child.projectCode = projectCode
      this.$refs.child.sheetCode = sheetCode
    },
    /**
     * 分页
     */
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
