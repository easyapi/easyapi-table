<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { settingStore } from "@/stores/setting";
const store = settingStore();
const state = reactive({
  showHeader: false,
  showSidebar: false,
  backgroundColor: "",
});

onMounted(() => {
  state.showHeader = store.showHeader;
  state.showSidebar = store.showSidebar;
  state.backgroundColor = store.backgroundColor;
});
</script>

<template>
  <div class="container">
    <Header v-show="state.showHeader" />
    <div
      :class="state.showHeader ? 'content' : 'contents'"
      :style="{ backgroundColor: state.backgroundColor }"
    >
      <Aside v-if="state.showSidebar" />
      <div
        :class="state.showSidebar ? 'main' : 'main-left main'"
        :style="state.showSidebar ? '' : 'padding:0;bottom:0'"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
html {
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
