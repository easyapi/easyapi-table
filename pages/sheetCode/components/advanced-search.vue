<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineExpose, reactive, watch } from 'vue'
import { CircleCloseFilled }  from '@element-plus/icons-vue'
import { options } from '@/utils/options'

defineExpose({
  getParentData,
})

const emit = defineEmits(['scarch', 'exposed'])

const state = reactive({
  conditionList: [] as any,
  dialogVisible: false,
  save: false,
  fieldList: [] as any,
  options
})

/**
 * 获取参数
 * @param data
 */
function getParentData(data: any) {
  state.dialogVisible = data.dialogVisible
    data.fieldList.forEach((item: any) => {
      state.fieldList.push({
        label: item.name,
        value: item.key,
      })
    })
  if(state.conditionList.length === 0){
    state.conditionList.push({
      fieldLabel: '',
      fieldValue: '',
      value: 'eq',
      inputValue: '',
      checked: false,
    })
  }
}

/**
 * 删除条件
 * @param index
 */
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

/**
 * 添加条件
 */
function addMore() {
  const obj = {
    fieldLabel: '',
    fieldValue: '',
    value: 'eq',
    inputValue: '',
    checked: false,
  }
  state.conditionList.push(obj)
}

/**
 * 选择字段
 */
function changeField() {
  state.conditionList.forEach((item) => {
    state.fieldList.forEach((citem) => {
      if(item.fieldValue === citem.value ){
        item.fieldLabel = citem.label
      }
    })
  })
}

/**
 * 删除查询寻参数
 */
function deleteData(index) {
  state.conditionList.splice(index, 1)
}

/**
 * 确认
 * @param arr 外露参数
 * @param data 查询参数
 */
function onsubmit() {
  const arr = []
  const data = {
    relation: 'and',
    conditions: []
  }
  state.conditionList.forEach(item => {
    if(item.checked) {
      arr.push(item)
    }
    if(item.inputValue){
      data.conditions.push({
        field: item.fieldValue,
        operator: item.value,
        value: item.inputValue.split('；'),
      })
    }
  })
  state.dialogVisible = false
  if(data.conditions.length !== 0){
    emit('search',data)
  }
  if(arr.length !== 0){
    emit('exposed', arr)
  }

}
</script>

<template>
  <el-dialog v-model="state.dialogVisible" title="高级筛选" append-to-body width="50%">
    <p>筛选条件</p>
    <div v-for="(item, index) in state.conditionList" :key="index" class="flex-r  mg-tp-15 align-center ">
      <el-select v-model="item.fieldValue" placeholder="请选择要筛选的字段名" class="mr-15" @change="changeField">
        <el-option v-for="field in state.fieldList" :key="field.value" :label="field.label" :value="field.value" />
      </el-select>
      <el-select v-if="item.fieldValue" v-model="item.value" class="mr-15">
        <el-option v-for="child in state.options" :key="child.value" :label="child.label" :value="child.value" />
      </el-select>
      <el-input v-model="item.inputValue" style="width: 400px" placeholder="多条件请用；隔开" />
      <i class="el-icon-delete-solid cursor mg-lf-15" @click="deleteRecord(index)" />
      <el-checkbox v-model="item.checked" class="mg-lf-15">
        外露
      </el-checkbox>
      <el-icon class="ml-2 cursor" color="#bbbbbb" @click="deleteData(index)"><CircleCloseFilled /></el-icon>
    </div>
    <p class="mg-tp-15 cursor" @click="addMore">
      <el-icon :size="15">
        <Plus />
      </el-icon>
      添加筛选条件
    </p>
    <template #footer class="dialog-footer">
      <el-button @click="state.dialogVisible = false">
        取 消
      </el-button>
      <el-button type="primary" @click="onsubmit">
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
