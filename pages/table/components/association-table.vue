<template>
  <el-dialog
    title="关联表"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-input
      class="input"
      placeholder="搜索你想关联的内容"
      prefix-icon="el-icon-search"
      v-model="input2">
    </el-input>
    <div class="list" :class="{active : active == index}" :style="styleObject" v-for="(item,index) in fields"
         @click="choice(item,index)">
      <div class="list-left">
        <h2>{{item.fields.name}}</h2>
        <ul>
          <li>
            <p>地址</p>
            <p>{{item.fields.address}}</p>
          </li>
          <li>
            <p>楼层</p>
            <p>{{item.fields.floor}}</p>
          </li>
          <li>
            <p>价格</p>
            <p>{{item.fields.price}}</p>
          </li>
          <li>
            <p>电话</p>
            <p>{{item.fields.phone}}</p>
          </li>
        </ul>
      </div>
      <el-image
        v-for="img in item.fields.img"
        class="list-right"
        style="width: 100px; height: 100px"
        :src="img.url"
        fit="cover"></el-image>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'association-table',
    data() {
      return {
        dialogVisible: false,
        fields: [],
        styleObject: {},
        input2: '',
        active: ''
      }
    },
    methods: {
      choice(item, index) {
        console.log(item, index)
        this.active = index
        this.$emit('getName', item.fields.name)
        this.dialogVisible = false
      },
      close() {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .input {
    width: 50%;
    margin-bottom: 10px;
  }

  .active {
    border: 1px solid #a3e6ef
  }

  .list {
    background-color: #F3F5F9;
    border: 1px solid #F3F5F9;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    cursor: pointer;

    .list-left {
      width: 80%;
      padding: 10px;

      ul {
        display: flex;

        li {
          width: 25%;
        }
      }
    }

    .list-right {
      width: 20%;
    }
  }
</style>
