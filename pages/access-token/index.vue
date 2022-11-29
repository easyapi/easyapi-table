<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { settingStore } from '@/stores/setting'
const store = settingStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  console.log(4564)
  if (route.query.accessToken) {
    localStorage.setItem('accessToken', route.query.accessToken as string)
  }
  if (route.query.showHeader) {
    store.$patch({
      showHeader: route.query.showHeader as any
    })
  }
  if (route.query.showSidebar) {
    store.$patch({
      showSidebar: route.query.showSidebar as any
    })
  }
  if (route.query.headline) {
    store.$patch({
      headline: route.query.headline as any
    })
  }
  router.push(route.query.url ? (route.query.url as string) : '')
})
</script>
