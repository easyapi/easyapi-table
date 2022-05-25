import Vue from 'vue'

let comsys = {
  install(Vue) {
    Vue.prototype.comsys = {
      //头部显示隐藏
      showHeader: true
    }
  }
}

Vue.use(comsys)
