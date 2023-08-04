<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineExpose, reactive, watch } from 'vue'
import { CircleCloseFilled }  from '@element-plus/icons-vue'
import { options, dateOptions, checkOptions } from '@/utils/options'
import dayjs from "dayjs";

defineExpose({
  getParentData,
})

const emit = defineEmits(['scarch', 'exposed'])

const state = reactive({
  conditionList: [] as any,
  dialogVisible: false,
  save: false,
  fieldList: [] as any,
  defaultTime: new Date(2000, 1, 1, 12, 0, 0),
  options,
  dateOptions,
  checkOptions
})

/**
 * 获取参数
 * @param data
 */
function getParentData(data: any) {
  console.log(data)
  state.fieldList = []
  state.dialogVisible = data.dialogVisible
    data.fieldList.forEach((item: any) => {
      if(item.type === '单行文本' || item.type === '日期') {
        state.fieldList.push({
          label: item.name,
          value: item.key,
          type: item.type
        })
      }
      if( item.type === '勾选' ) {
        state.fieldList.push({
          label: item.name,
          value: item.key,
          type: item.type,
          icon: item.property.icon
        })
      }
    })
  if(state.conditionList.length === 0){
    state.conditionList.push({
      fieldLabel: '',
      fieldValue: '',
      value: 'eq',
      inputValue: '',
      checked: false,
      type: '',
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
    type: '',
  }
  state.conditionList.push(obj)
}

/**
 * 选择字段
 */
function changeField(row) {
  state.conditionList.forEach((item) => {
    state.fieldList.forEach((citem) => {
      if(item.fieldValue === citem.value && item.fieldValue === row ) {
        console.log(item.fieldValue, citem.value)
        item.fieldLabel = citem.label
        item.value = ''
        item.type = citem.type
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
    if(item.inputValue && item.type !== '日期' &&  item.type !== '勾选'){
      data.conditions.push({
        field: item.fieldValue,
        operator: item.value,
        value: item.inputValue.split('；'),
      })
    }
    if(item.type === '勾选') {
      data.conditions.push({
        field: item.fieldValue,
        operator: item.value,
        value: item.disabled ?  [] : [item.inputValue]
      })
    }
    if(item.type === '日期') {
      if(item.value === 'range') {
        const starTime = item.starTime ? dayjs(item.starTime).format('YYYY-MM-DD HH:mm:ss') : null
        const endTime = item.endTime ? dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss') : null
        data.conditions.push({
          field: item.fieldValue,
          operator: item.value,
          value: [starTime, endTime]
        })
      } else {
        data.conditions.push({
          field: item.fieldValue,
          operator: item.value,
          value: [dayjs(item.inputValue).format('YYYY-MM-DD HH:mm:ss')]
        })
      }
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

/**
 * 选择对应的选项条件
 */
function getOption(type) {
  if (type === '勾选')
    return checkOptions
  if (type === '日期')
    return dateOptions
  return options
}

/**
 * 改变内容
 */
function selectOption (row) {
  state.conditionList.forEach((item,index) => {
    state.fieldList.forEach((citem) => {
      if(item.type === '勾选' && item.fieldValue === citem.value && index === row ) {
        item.fieldLabel = citem.label
        item.inputValue = citem.icon
        item.type = citem.type
        console.log(item)
      }
    })
  })
}
</script>

<template>
  <el-dialog v-model="state.dialogVisible" title="高级筛选" append-to-body width="50%">
    <p>筛选条件</p>
    <div v-for="(item, index) in state.conditionList" :key="index" class="flex-r  mg-tp-15 align-center ">
      <el-select v-model="item.fieldValue" placeholder="请选择要筛选的字段名" class="mr-15" @change="changeField">
        <el-option v-for="field in state.fieldList" :key="field.value" :label="field.label" :value="field.value" />
      </el-select>
      <el-select v-if="item.fieldValue" v-model="item.value" class="mr-15" @change="selectOption(index)">
        <el-option v-for="child in getOption(item.type)" :key="child.value" :label="child.label" :value="child.value" />
      </el-select>
      <!--   单行文本：输入框   -->
      <el-input v-if="item.type === '单行文本'" v-model="item.inputValue" style="width: 400px" placeholder="多条件请用；隔开" />
      <!--   勾选输入框  -->
      <div v-if="item.type === '勾选' && item.value === 'eq'" class="no-disabled"  @click="item.disabled = !item.disabled">
        <div v-if="item.disabled" class="disabled" />
        {{ item.inputValue }}
      </div>
      <!--   日期：时间选择器   -->
      <el-date-picker
        v-if="item.type === '日期' && item.value !== 'range'"
        v-model="item.inputValue"
        type="datetime"
        placeholder="请选择时间"
        :default-time="state.defaultTime"
      />
      <!--   日期：时间范围选择器   -->
      <el-date-picker
        v-if="item.type === '日期' && item.value === 'range'"
        v-model="item.starTime"
        type="datetime"
        placeholder="请选择开始时间"
        :default-time="state.defaultTime"
      />
      <el-date-picker
        class="ml-2"
        v-if="item.type === '日期' && item.value === 'range'"
        v-model="item.endTime"
        type="datetime"
        placeholder="请选择结束时间"
        :default-time="state.defaultTime"
      />
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

.disabled {
  position: absolute;
  cursor: pointer;
  background-color: rgba(194, 188, 188, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.no-disabled {
  position: relative;
  cursor: pointer;
  width: 400px;
  height: 32px;
  line-height: 30px;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  padding: 0 12px;
  text-align: center;
}
</style>
