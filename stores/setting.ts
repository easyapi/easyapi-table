import { defineStore } from 'pinia'

export const settingStore = defineStore('setting', {
  state() {
    return {
      title: '数据表格', // 项目标题
      headline: '表格系统', // 头部标题
      showHeader: true, // 头部显示隐藏
      showSidebar: true, // 左侧菜单显示隐藏
      menuType: 1, // 0只有一级菜单 1有两层第一层不能点击
    }
  },
})
