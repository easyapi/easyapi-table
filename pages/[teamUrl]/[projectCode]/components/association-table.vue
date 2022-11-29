<script>
export default {
  name: 'AssociationTable',
  data() {
    return {
      dialogVisible: false,
      fields: [],
      styleObject: {},
      input2: '',
      active: '',
    }
  },
  methods: {
    choice(item, index) {
      this.active = index
      this.$emit('getItem', item)
      this.dialogVisible = false
    },
    close() {},
  },
}
</script>

<template>
  <el-dialog v-model:visible="dialogVisible" title="关联表" :close-on-click-modal="false" width="50%" @close="close">
    <el-input v-model="input2" class="input" placeholder="搜索你想关联的内容" prefix-icon="el-icon-search" />
    <div v-for="(item, index) in fields" :key="index" class="list" :class="{ active: active === index }" :style="styleObject" @click="choice(item, index)">
      <div class="list-left">
        <h2>{{ item.fields.name }}</h2>
        <ul>
          <li>
            <p>地址</p>
            <p>{{ item.fields.address }}</p>
          </li>
          <li>
            <p>楼层</p>
            <p>{{ item.fields.floor }}</p>
          </li>
          <li>
            <p>价格</p>
            <p>{{ item.fields.price }}</p>
          </li>
          <li>
            <p>电话</p>
            <p>{{ item.fields.phone }}</p>
          </li>
        </ul>
      </div>
      <el-image v-for="img in item.fields.img" :key="img" class="list-right" style="width: 100px; height: 100px" :src="img.url" fit="cover" />
    </div>
  </el-dialog>
</template>

<style scoped>
.input {
  width: 50%;
  margin-bottom: 10px;
}

.active {
  border: 1px solid #a3e6ef;
}

.list {
  background-color: #f3f5f9;
  border: 1px solid #f3f5f9;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  cursor: pointer;
}

.list .list-right {
  width: 20%;
}

.list .list-left {
  width: 80%;
  padding: 10px;
}

.list .list-left ul {
  display: flex;
}

.list .list-left ul li {
  width: 25%;
}
</style>
