<template>
  <div v-if="state.showSidebar" class="sidebar">
    <div class="menu" v-for="(menu, index) in state.menuList" :key="index" @click="getFields(menu.serve)">
      <nuxt-link :to="menu.path" :class="state.activePath === menu.path ? 'menu-item menu-item_active' : 'menu-item'">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { sheet } from '../../api/sheet'
import { settingStore } from '@/stores/setting'
const route = useRoute()
const store = settingStore()

const state = reactive({
  activePath: '',
  showSidebar: false,
  menuList: [
    {
      title: '常客服务',
      path: '/changke/changke_provider',
      icon: 'el-icon-s-help',
      serve: 'changke_provider'
    }
  ]
})

const emit = defineEmits(['getFieldList', 'getTeamUrl', 'getProjectCode', 'getSheetCode', 'getHeadline'])

function getFields(teamUrl: any, projectCode: any, sheetCode: any) {
  let params = {
    size: 50
  }
  sheet.getSheet(params, teamUrl, projectCode, sheetCode).then(res => {
    emit('getFieldList', res.content.fields)
    emit('getTeamUrl', teamUrl)
    emit('getProjectCode', projectCode)
    emit('getSheetCode', sheetCode)
    emit('getHeadline', res.content.name)
  })
}

onMounted(() => {
  state.showSidebar = store.showSidebar === 'true'
  state.activePath = route.path ? `${route.path}` : '/:teamUrl/:projectCode/:sheetCode'
  getFields(route.params.teamUrl, route.params.projectCode, route.params.sheetCode)
})
</script>

<style scoped>
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
}

.menu-item i {
  font-size: 18px;
  margin-right: 10px;
}

.menu-item span {
  font-size: 14px;
}

.menu-item_active {
  color: #18c1d6;
  background: #f2fbff;
}
</style>
