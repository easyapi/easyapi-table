<template>
  <div v-if="showSidebar" class="sidebar">
    <div class="menu" v-for="(menu, index) in menuList" :key="index" @click="getFields(menu.serve)">
      <nuxt-link :to="menu.path"
                 :class="activePath === menu.path ? 'menu-item menu-item_active' : 'menu-item'">
        <i :class="menu.icon"></i>
        <span>{{ menu.title }}</span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
  import { getFieldList } from '../../api/serve'

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
      if (this.$store.state.settings.showSidebar == 'true') {
        this.showSidebar = true
      } else {
        this.showSidebar = false
      }
      this.activePath = this.$route.path ? `${this.$route.path}` : '/:sheetId/:providerId'
      this.getFields('changke_provider')
    },
    methods: {
      getFields(data) {
        let params = {
          size: 50
        }
        getFieldList(params, data, this).then(res => {
          this.$emit('getFieldList', res.data.content)
          this.$emit('getProvider', data)
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
