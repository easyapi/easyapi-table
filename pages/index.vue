<script>
export default {
  name: 'Index',
  middleware({ store, route, redirect, params, query, req, res }) {
    // 默认跳转页面的路由
    redirect('/')
  },
  data() {
    return {
      showHeader: '',
    }
  },
}
</script>

<template>
  <div class="container">
    <Header />
    <div :class="showHeader ? 'content' : 'contents'">
      <Aside />
      <div class="main" />
    </div>
  </div>
</template>

<style></style>
