<template>
  <div v-if="showSidebar" class="sidebar">
    <div class="menu" v-for="(menu, index) in menuList" :key="index" @click="getFields(menu.serve)">
      <nuxt-link :to="menu.path" :class="activePath === menu.path ? 'menu-item menu-item_active' : 'menu-item'">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { getFieldList } from '../../api/table'
import { getSheet } from '../../api/sheet'

export default {
  name: 'Aside',
  data() {
    return {
      activePath: '',
      showSidebar: '',
      menuList: [
        {
          title: '常客服务',
          path: '/changke/changke_provider',
          icon: 'el-icon-s-help',
          serve: 'changke_provider'
        }
      ]
    }
  },
  mounted() {
    this.showSidebar = this.$store.state.settings.showSidebar === 'true'
    this.activePath = this.$route.path ? `${this.$route.path}` : '/:teamUrl/:projectCode/:sheetCode'
    // localStorage.setItem('teamUrl', this.$route.params.teamUrl)
    // localStorage.setItem('projectCode', this.$route.params.projectCode)
    // localStorage.setItem('sheetCode', this.$route.params.sheetCode)
    console.log(this.$route.params.teamUrl, 111)
    this.getFields(this.$route.params.teamUrl, this.$route.params.projectCode, this.$route.params.sheetCode)
  },
  methods: {
    getFields(teamUrl, projectCode, sheetCode) {
      let params = {
        size: 50
      }
      getSheet(params, teamUrl, projectCode, sheetCode, this).then(res => {
        this.$emit('getFieldList', res.data.content.fields)
        this.$emit('getTeamUrl', teamUrl)
        this.$emit('getProjectCode', projectCode)
        this.$emit('getSheetCode', sheetCode)
        this.$emit('getHeadline', res.data.content.name)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  position: absolute;
  top: 10px;
  left: 10px;
  bottom: 10px;
  overflow: auto;
  padding-top: 20px;
  width: 200px;
  background: #fff;
}

.menu :hover {
  color: #18c1d6;
  background: #f4f4f4;
}

.menu-item {
  padding: 0 20px;
  width: 200px;
  height: 56px;
  display: flex;
  align-items: center;

  i {
    font-size: 18px;
    margin-right: 10px;
  }

  span {
    font-size: 14px;
  }
}

.menu-item_active {
  color: #18c1d6;
  background: #f2fbff;
}
</style>
