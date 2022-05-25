<template>
  <div class='container'>
    <Header></Header>
    <div :class="showHeader ? 'content': 'contents'">
      <Aside></Aside>
      <div class='main'>
        <div class='main-title'>
          <div>
            <b>客户管理</b>
          </div>
          <el-button size="small" icon="el-icon-plus" type='primary' class='ea-info-btn' @click='createArticle'>
            新增客户
          </el-button>
        </div>
        <el-divider></el-divider>
        <div class='main-content'>
          <div>
            <SearchArea :items='searchItems' @search='search' @event='event' @reset='reset'/>
          </div>
          <el-table
            :data='tableList'
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            v-loading='loadingData'
            element-loading-text='数据正在加载中...'
          >
            <template slot='empty'>
              <p>{{ tableText }}</p>
            </template>
            <el-table-column prop='name' label='分类'></el-table-column>
            <el-table-column prop='addTime' label='添加时间'></el-table-column>
            <el-table-column prop='description' label='描述'>
            </el-table-column>
            <el-table-column prop='img' label='图片'>
              <template #default='scope'>
                <img style='width: 60px' :src='scope.row.img'/>
              </template>
            </el-table-column>
            <el-table-column
              fixed='right'
              label='操作'>
              <template #default='scope'>
                <el-button @click='updateArticleCategory(scope.row)' type='primary' size='mini'
                >编辑
                </el-button
                >
                <el-button type='danger' size='mini' @click='deleteArticleCategory(scope.row)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination @fatherSize='fatherSize' @fatherCurrent='fatherCurrent' :size='pagination.size'
                    :total-elements='pagination.total' class='paging'></Pagination>
        <div style='clear: both'></div>
        <Edit ref='child'></Edit>
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
import {getArticleCategoryList, deleteArticleCategory} from '../../api/article-category'

export default {
  name: '',
  components: {
    Header,
    Aside,
    Edit,
    SearchArea,
    Pagination
  },
  data() {
    return {
      tableList: [],
      searchItems: [
        {label: '公司名称', type: 'input', key: 'title'},
        {label: '联系人名称', type: 'input', key: 'title'},
        {label: '联系电话', type: 'input', key: 'title'},
        {label: '状态', type: 'select', key: 'title'}
      ],
      pagination: {
        page: 1,
        size: 12,
        total: 0
      },
      loadingData: false,
      tableText: ''
    }
  },
  head() {
    return {
      title: '金融专辑 - EasyAPI服务市场',
      meta: [
        {hid: 'description', name: 'description', content: '服务市场场景化服务'},
        {hid: 'keyword', name: 'keyword', content: '服务市场场景化服务'}
      ]
    }
  },
  methods: {
    /**
     * 获取文章分类列表
     */
    getArticleCategories() {
      this.loadingData = true
      let page = this.pagination.page - 1
      let params = {
        appKey: sessionStorage.getItem('appKey'),
        appSecret: sessionStorage.getItem('appSecret'),
        page: page,
        size: this.pagination.size
      }
      getArticleCategoryList(params, this).then(res => {
        if (res.data.code === 0) {
          this.loadingData = false
          this.tableText = '暂无数据'
          this.tableList = []
          this.pagination.total = 0
        } else {
          this.loadingData = false
          this.tableList = res.data.content
          this.pagination.total = Number(res.data.totalElements)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    //添加分类
    openCategory() {
      this.$refs.child.dialogVisible = true
      this.$refs.child.title = '添加分类'
      this.$refs.child.formValidate = this.$options.data()
    },
    //编辑分类
    updateArticleCategory(row) {
      this.$refs.child.dialogVisible = true
      this.$refs.child.title = '编辑分类'
      this.$refs.child.articleCategoryId = row.articleCategoryId
      this.$nextTick(() => {
        this.$refs.child.formValidate = row
      })
    },
    //删除文章分类
    deleteArticleCategory(row) {
      this.$confirm('您确定要删除该分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        deleteArticleCategory(row.articleCategoryId, data, this).then(res => {
          if (res.data.code === 1) {
            this.getArticleCategories()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      })
    },
    //分页
    fatherSize(data) {
      this.pagination.size = data
      this.getArticleCategories()
    },
    fatherCurrent(data) {
      this.pagination.page = data
      this.getArticleCategories()
    },
    search(item) {
      let {title} = item
      this.title = title
      this.getArticleList()
    },
    reset(item) {
    },
    event(item) {
      let {title} = item
      this.title = title
    }
  }
  ,
  mounted() {
    this.getArticleCategories()
  }
}
</script>

<style lang='scss'>
</style>
