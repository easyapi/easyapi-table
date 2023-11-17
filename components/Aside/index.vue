<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'nuxt/app'
const route = useRoute()
const state = reactive({
  activePath: '',
  menuList: [
    {
      title: '掼蛋邀请赛',
      path: '/daoqun/circuit/guandan',
      icon: 'el-icon-s-help',
      serve: 'changke_provider',
    },
  ],
})

onMounted(() => {
  state.activePath = route.path ? `${route.path}` : '/:teamUrl/:projectCode/:sheetCode'
})
</script>

<template>
  <div class="sidebar">
    <div v-for="(menu, index) in state.menuList" :key="index" class="menu" @click="getFields(menu.serve)">
      <nuxt-link :to="menu.path" :class="state.activePath === menu.path ? 'menu-item menu-item_active' : 'menu-item'">
        <i :class="menu.icon" />
        <span>{{ menu.title }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  position: absolute;
  top: 10px;
  left: 0;
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
