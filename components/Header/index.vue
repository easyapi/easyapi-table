<script setup lang="ts">
</script>

<template>
  <div class="header">
    <div class="header-title">
      <p>API CMS</p>
      <div>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </span>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-plus">
              黄金糕
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">
              狮子头
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">
              螺蛳粉
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-check">
              双皮奶
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style>
.header {
  width: 100%;
  background: #fff;
  height: 50px;
}

.header-title {
  width: 100%;
  height: 100%;
  padding: 0 30px 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-submenu__title i {
  color: #0000;
}
</style>
