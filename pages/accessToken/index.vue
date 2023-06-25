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

  if (route.query.url) {
    router.push(route.query.url as string)
  } else {
    const path = `/${route.query.teamUrl}/${route.query.projectCode}/${route.query.sheetCode}`
    router.push(path)
  }
})
</script>

<template>
  <div />
</template>
