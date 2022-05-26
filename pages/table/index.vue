<template>
  <div class='container'>
    <Header></Header>
    <div :class="showHeader ? 'content': 'contents'">
      <Aside @getFieldList="getFieldList" @getProvider="getProvider"></Aside>
      <div class='main'>
        <div class='main-top'>
          <div>
            <b>表格系统</b>
          </div>
          <div class="mg-tp-15">
            <div class="tabs">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部数据" name="first"></el-tab-pane>
                <el-tab-pane label="我的数据" name="second"></el-tab-pane>
                <el-tab-pane label="待处理数据" name="third"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
        <div class='main-content'>
          <div>
            <SearchArea :items='searchItems' @search='search' @event='event' @reset='reset'/>
          </div>
          <el-table
            :data='providerList'
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            element-loading-text='数据正在加载中...'
          >
            <template slot='empty'>
              <p>{{ tableText }}</p>
            </template>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <template>
              <el-table-column show-overflow-tooltip v-for="(item,index) in fieldList" :label='item.name' :key="index">
                <template slot-scope="scope">
                  <span v-if="item.key!='img'" v-html="scope.row[item.key]"></span>
                  <img class="table-img" v-if="item.key=='img'" :src="scope.row[item.key]+'!icon.jpg'"/>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <Pagination @fatherSize='fatherSize' @fatherCurrent='fatherCurrent' :size='pagination.size'
                    :total-elements='pagination.total' class='paging'></Pagination>
        <div style='clear: both'></div>
        <!--<Edit ref='child'></Edit>-->
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../../components/Header/index.vue'
  import Aside from '../../components/Aside/index.vue'
  import Pagination from '../../components/Pagination/index'
  import SearchArea from '../../components/SearchArea'
  // import Edit from './components/edit.vue'
  import { getRecordList } from '../../api/serve'

  export default {
    name: '',
    components: {
      Header,
      Aside,
      SearchArea,
      Pagination
    },
    data() {
      return {
        activeName: 'first',
        fieldList: [],
        provider: '',
        providerList: [],


        tableList: [],
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
        tableText: ''
      }
    },
    watch: {
      provider(val) {
        if (val) {
          let params = {}
          getRecordList(params, this.provider, this).then(res => {
            for (let fields of res.data.content) {
              this.providerList.push(fields.fields)
            }
          })
        }
      }
    },
    head() {
      return {
        title: '金融专辑 - EasyAPI服务市场',
        meta: [
          { hid: 'description', name: 'description', content: '服务市场场景化服务' },
          { hid: 'keyword', name: 'keyword', content: '服务市场场景化服务' }
        ]
      }
    },
    methods: {
      handleClick() {

      },
      getFieldList(data) {
        this.fieldList = data
        console.log(this.fieldList)
      },
      getProvider(data) {
        this.provider = data
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
        let { title } = item
        this.title = title
        this.getArticleList()
      },
      reset(item) {
      },
      event(item) {
        let { title } = item
        this.title = title
      }
    }
    ,
    mounted() {
    }
  }
</script>

<style lang='scss'>
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

  .el-tabs__active-bar {
    background-color: #15cbf3;
  }

  .tabs {
    width: 50%;
  }
</style>
<style scoped>
  /deep/ p img {
    display: none;
  }

  .table-img {
    width: 50px;
  }
</style>
