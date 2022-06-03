<template>
  <el-dialog
    title="高级筛选"
    :visible.sync="dialogVisible"
    width="50%">
    <p>筛选条件<i class='el-icon-question'></i></p>
    <div class="flex-r mg-tp-15 align-center" v-for="(item,index) in conditionList">
      <el-select size="small" v-model="item.fieldValue" placeholder="请选择要筛选的字段名">
        <el-option
          v-for="field in fieldList"
          :key="field.value"
          :label="field.label"
          :value="field.value">
        </el-option>
      </el-select>
      <el-select class="mx-15" v-if="item.fieldValue" size="small" v-model="item.value">
        <el-option
          v-for="child in options"
          :key="child.value"
          :label="child.label"
          :value="child.value">
        </el-option>
      </el-select>
      <el-input style="width: 400px" size="small" placeholder="多个条件请用；隔开"></el-input>
      <i @click="detele(index)" class='el-icon-delete-solid cursor mg-lf-15'></i>
      <el-checkbox class="mg-lf-15" v-model="item.checked">外露</el-checkbox>
    </div>
    <p @click="addMore" class="mg-tp-15 cursor"><i class='el-icon-plus'></i>添加筛选条件</p>
    <el-checkbox class="mg-tp-15" v-model="save">保存为场景</el-checkbox>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'advancedSearch',
  data() {
    return {
      conditionList: [],
      dialogVisible: false,
      save: false,
      fieldList: [],
      options: [{
        value: '等于',
        label: '等于'
      }, {
        value: '不等于',
        label: '不等于'
      }, {
        value: '包含',
        label: '包含'
      }, {
        value: '不包含',
        label: '不包含'
      }, {
        value: '开始于',
        label: '开始于'
      }, {
        value: '结束于',
        label: '结束于'
      }, {
        value: '为空',
        label: '为空'
      }, {
        value: '不为空',
        label: '不为空'
      }]
    }
  },
  watch: {
    fieldList(val) {
      if (val) {
        this.conditionList.push({
          fieldValue: val[0].label,
          value: '等于',
          checked: false
        })
      }
    }
  },
  methods: {
    detele(index) {
      this.$confirm('您确定要删除这一条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$delete(this.conditionList, index)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addMore() {
      let obj = {
        fieldValue: '',
        value: '等于',
        checked: false
      }
      this.conditionList.push(obj)
    }
  }
}
</script>

<style scoped>
.cursor {
  cursor: pointer;
}

.align-center {
  align-items: center;
}

.mx-15 {
  margin: 0 15px;
}
</style>
