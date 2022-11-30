<script setup lang="ts">
interface Props {
  totalPages: number
  size: number
  totalElements: number
}
const prop = withDefaults(defineProps<Props>(), {
  totalPages: 0,
  size: 10,
  totalElements: 0,
})

const emit = defineEmits(['fatherSize', 'fatherCurrent'])

function handleSizeChange(val: any) {
  emit('fatherSize', val)
}

function handleCurrentChange(val: any) {
  emit('fatherCurrent', val)
}
</script>

<template>
  <div>
    <el-pagination
      background
      :current-page="prop.totalPages"
      :page-sizes="[12, 24, 36, 48]"
      :page-size="prop.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="prop.totalElements"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
