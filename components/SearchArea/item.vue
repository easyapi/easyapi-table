<script>
export default {
  props: ['item', 'allShow'],
  data() {
    return {
      items: [],
    }
  },
  watch: {
    item: {
      handler(nv) {
        if (nv.items)
          this.items = nv.items

        this.$emit('event')
      },
      deep: true,
    },
  },
  created() {
    if (this.item.items)
      this.items = this.item.items
  },
  methods: {
    timeFormat(item) {
      this.item.value = item
      this.$emit('event')
    },
    open() {
      this.$emit('open')
    },
    reset() {
      this.$emit('reset')
    },
    search() {
      this.$emit('search')
    },
  },
}
</script>

<template>
  <el-col
    v-if="item.type !== 'buttons'"
    :xl="6"
    :lg="item.size !== 'large' ? 6 : 12"
    :md="item.size !== 'large' ? 6 : 12"
    :sm="item.size !== 'large' ? 12 : 24"
    :xs="24"
    class="search-item"
  >
    <el-form label-width="85px">
      <el-form-item :label="item.label">
        <el-input v-if="item.type === 'input'" v-model="item.value" :placeholder="item.placeholder || `请填写${item.label}`" @on-enter="search" />
        <el-select v-if="item.type === 'select'" v-model="item.value" style="width: 100%" :placeholder="item.placeholder || `请选择${item.label}`" clearable>
          <el-option v-for="(item, index) in items" :key="index + item.value" :value="item.value">
            {{ item.label }}
          </el-option>
        </el-select>
        <el-date-picker
          v-if="item.type === 'datePicker'"
          :type="item.pickerType"
          :placeholder="item.placeholder || `请选择${item.label}`"
          :format="item.format"
          :editable="false"
          format="yyyy-MM-dd"
          @on-change="timeFormat"
        />
      </el-form-item>
    </el-form>
  </el-col>
  <el-col v-else :xl="6" :lg="8" :md="8" :sm="12" :xs="24" class="buttons">
    <el-button type="primary" class="ea-info-btn" @click="search">
      查询
    </el-button>
    <el-button type="warning" @click="reset">
      重置
    </el-button>
    <el-button @click="open">
      {{ allShow ? '收起' : '展开' }}
      <i v-if="!allShow" class="el-icon-arrow-down" />
      <i v-else class="el-icon-arrow-up" />
    </el-button>
  </el-col>
</template>

<style scoped>
.search-item .buttons {
  display: flex;
  margin: 10px 0;
}

.buttons button {
  margin-left: 10px;
}

.el-range-editor.el-input__inner {
  width: 100%;
}
</style>
