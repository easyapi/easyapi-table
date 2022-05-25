<template>
  <div class="sidebar">
    <div class="menu" v-for="(menu, index) in menuList" :key="index">
      <nuxt-link :to="menu.path" :class="activePath === menu.path ? 'menu-item menu-item_active' : 'menu-item'">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Aside',
    data() {
      return {
        activePath: '',
        menuList: [
          {
            title: '推广计划管理',
            path: '/plan',
            icon: 'el-icon-s-help'
          },
          {
            title: '广告创意管理',
            path: '/idea',
            icon: 'el-icon-s-help'
          },
          {
            title: '广告位管理',
            path: '/slot',
            icon: 'el-icon-s-help'
          },
          {
            title: '客户管理',
            path: '/customer',
            icon: 'el-icon-s-help'
          }
        ]
      }
    },
    mounted() {
      this.activePath = this.$route.path ? `${this.$route.path}` : '/article'
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
