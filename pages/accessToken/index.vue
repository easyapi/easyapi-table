<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import { settingStore } from '@/stores/setting'
const store = settingStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.query.accessToken)
    localStorage.setItem('accessToken', route.query.accessToken as string)

  if (route.query.showHeader) {
    store.$patch({
      showHeader: route.query.showHeader === 'true',
    })
  }

  if (route.query.showSidebar) {
    store.$patch({
      showSidebar: route.query.showSidebar === 'true',
    })
  }

  if (route.query.backgroundColor) {
    store.$patch({
      backgroundColor: `#${route.query.backgroundColor}`,
    })
  }

  const path = `/${route.query.teamUrl}/${route.query.projectCode}/${route.query.sheetCode}`
  router.push(path)
})
</script>

<template>
  <div />
</template>
