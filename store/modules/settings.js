const state = {
  title: '数据表格', //项目标题
  headline: '表格系统', //头部标题
  showHeader: 'true', //头部显示隐藏
  showSidebar: 'true', //左侧菜单显示隐藏
  menuType: 1// 0只有一级菜单 1有两层第一层不能点击
}

const mutations = {
  CHANGE_TITLE: (state, val) => {
    state.title = val
  },
  CHANGE_SHOWHEADER: (state, val) => {
    state.showHeader = val
  },
  CHANGE_MENUTYPE: (state, val) => {
    state.menuType = val
  }
}

export default {
  state,
  mutations
}
