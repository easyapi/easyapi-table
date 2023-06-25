<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineExpose, reactive, watch } from 'vue'

defineExpose({
  getParentData,
})

const state = reactive({
  conditionList: [] as any,
  dialogVisible: false,
  save: false,
  fieldList: [] as any,
  options: [
    {
      value: '等于',
      label: '等于',
    },
    {
      value: '不等于',
      label: '不等于',
    },
    {
      value: '包含',
      label: '包含',
    },
    {
      value: '不包含',
      label: '不包含',
    },
    {
      value: '开始于',
      label: '开始于',
    },
    {
      value: '结束于',
      label: '结束于',
    },
    {
      value: '为空',
      label: '为空',
    },
    {
      value: '不为空',
      label: '不为空',
    },
  ],
})

watch(
  () => state.fieldList,
  (value) => {
    state.conditionList.push({
      fieldValue: value[0].label,
      value: '等于',
      checked: false,
    })
  },
  { deep: true },
)

function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
  data.fieldList.forEach((item: any) => {
    state.fieldList.push({
      label: item.name,
      value: item.key,
    })
  })
}

function deleteRecord(index: any) {
  ElMessageBox.confirm('您确定要删除这一条数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      state.conditionList.splice(index, 1)
      ElMessage({
        type: 'success',
        message: '删除成功!',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

function addMore() {
  const obj = {
    fieldValue: '',
    value: '等于',
    checked: false,
  }
  state.conditionList.push(obj)
}
</script>

<template>
  <el-dialog v-model="state.dialogVisible" title="高级筛选" append-to-body width="50%">
    <p>筛选条件</p>
    <div v-for="(item, index) in state.conditionList" :key="index" class="flex-r  mg-tp-15 align-center ">
      <el-select v-model="item.fieldValue" placeholder="请选择要筛选的字段名" class="mr-15">
        <el-option v-for="field in state.fieldList" :key="field.value" :label="field.label" :value="field.value" />
      </el-select>
      <el-select v-if="item.fieldValue" v-model="item.value" class="mr-15">
        <el-option v-for="child in state.options" :key="child.value" :label="child.label" :value="child.value" />
      </el-select>
      <el-input style="width: 400px" placeholder="多个条件请用；隔开" />
      <i class="el-icon-delete-solid cursor mg-lf-15" @click="deleteRecord(index)" />
      <el-checkbox v-model="item.checked" class="mg-lf-15">
        外露
      </el-checkbox>
    </div>
    <p class="mg-tp-15 cursor" @click="addMore">
      <el-icon :size="15">
        <Plus />
      </el-icon>
      添加筛选条件
    </p>
    <el-checkbox v-model="state.save" class="mg-tp-15">
      保存为场景
    </el-checkbox>
    <template #footer class="dialog-footer">
      <el-button @click="state.dialogVisible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="state.dialogVisible = false">
        确 定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.cursor {
  cursor: pointer;
}

.align-center {
  align-items: center;
}

.mr-15 {
  margin-right: 15px;
}
</style>
