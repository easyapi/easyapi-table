<template>
    <div class="container">
        <Header></Header>
        <div :class="showHeader ? 'content' : 'contents'">
            <Aside></Aside>
            <div class="main"></div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        showHeader: ''
      }
    },
    middleware({ store, route, redirect, params, query, req, res }) {
      // 默认跳转页面的路由
      redirect('/')
    }
  }
</script>

<style lang="scss"></style>
